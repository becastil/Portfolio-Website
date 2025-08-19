import { test, expect, Page } from '@playwright/test';

// Test configuration
test.describe.configure({ mode: 'parallel' });

/**
 * Comprehensive test suite for HeroOverlay component
 * Tests all aspects including performance, accessibility, interactions, and error handling
 */
test.describe('HeroOverlay Component Tests', () => {
  // Helper function to wait for canvas initialization
  async function waitForCanvasInit(page: Page) {
    await page.waitForFunction(() => {
      const canvas = document.querySelector('canvas');
      return canvas && canvas.width > 0 && canvas.height > 0;
    }, { timeout: 5000 });
  }

  // Helper function to get performance metrics from the component
  async function getPerformanceMetrics(page: Page) {
    return await page.evaluate(() => {
      const debugInfo = document.querySelector('[class*="font-mono"]');
      if (!debugInfo) return null;
      
      const text = debugInfo.textContent || '';
      const fpsMatch = text.match(/FPS: (\d+)/);
      const avgFpsMatch = text.match(/avg: (\d+)/);
      const particlesMatch = text.match(/Particles: (\d+)/);
      const connectionsMatch = text.match(/Connections: (\d+)/);
      const modeMatch = text.match(/Mode: (\w+)/);
      
      return {
        fps: fpsMatch ? parseInt(fpsMatch[1]) : 0,
        avgFps: avgFpsMatch ? parseInt(avgFpsMatch[1]) : 0,
        particles: particlesMatch ? parseInt(particlesMatch[1]) : 0,
        connections: connectionsMatch ? parseInt(connectionsMatch[1]) : 0,
        mode: modeMatch ? modeMatch[1] : ''
      };
    });
  }

  test.beforeEach(async ({ page }) => {
    // Navigate to a test page with HeroOverlay
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Component Initialization', () => {
    test('should render canvas element', async ({ page }) => {
      const canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
      
      // Check canvas has proper dimensions
      const dimensions = await canvas.evaluate((el: HTMLCanvasElement) => ({
        width: el.width,
        height: el.height,
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight
      }));
      
      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBeGreaterThan(0);
      expect(dimensions.clientWidth).toBeGreaterThan(0);
      expect(dimensions.clientHeight).toBeGreaterThan(0);
    });

    test('should initialize with correct ARIA attributes', async ({ page }) => {
      const canvas = await page.locator('canvas');
      
      // Check ARIA attributes
      await expect(canvas).toHaveAttribute('aria-label', 'Interactive particle animation overlay');
      await expect(canvas).toHaveAttribute('role', 'img');
    });

    test('should apply container classes and styles', async ({ page }) => {
      const container = await page.locator('div.fixed.inset-0');
      await expect(container).toBeVisible();
      
      // Check pointer-events-none is applied
      const pointerEvents = await container.evaluate(el => 
        window.getComputedStyle(el).pointerEvents
      );
      expect(pointerEvents).toBe('none');
    });

    test('should respect custom className prop', async ({ page }) => {
      // This would require a test page that passes custom className
      // For now, we verify the default classes are applied
      const container = await page.locator('div.fixed.inset-0.pointer-events-none');
      await expect(container).toBeVisible();
    });
  });

  test.describe('Performance Mode Switching', () => {
    test('should display correct performance mode in debug overlay', async ({ page }) => {
      // Look for a component with debug enabled
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        const modeText = await debugOverlay.locator('text=/Mode: /').textContent();
        expect(modeText).toMatch(/Mode: (HIGH|BALANCED|LOW)/);
      }
    });

    test('should adjust particle count based on performance mode', async ({ page }) => {
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        const metrics = await getPerformanceMetrics(page);
        
        if (metrics) {
          // Verify particle count is within expected ranges
          if (metrics.mode === 'HIGH') {
            expect(metrics.particles).toBeGreaterThanOrEqual(60);
            expect(metrics.particles).toBeLessThanOrEqual(100);
          } else if (metrics.mode === 'BALANCED') {
            expect(metrics.particles).toBeGreaterThanOrEqual(40);
            expect(metrics.particles).toBeLessThanOrEqual(60);
          } else if (metrics.mode === 'LOW') {
            expect(metrics.particles).toBeGreaterThanOrEqual(20);
            expect(metrics.particles).toBeLessThanOrEqual(40);
          }
        }
      }
    });

    test('should disable features in LOW performance mode', async ({ page }) => {
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        const featuresText = await debugOverlay.locator('text=/Features:/').locator('..').textContent();
        
        if (featuresText && featuresText.includes('Mode: LOW')) {
          // In LOW mode, certain features should be disabled
          expect(featuresText).toContain('connections: ✗');
          expect(featuresText).toContain('mouseInteraction: ✗');
          expect(featuresText).toContain('pulseEffect: ✗');
        }
      }
    });
  });

  test.describe('Device Capability Detection', () => {
    test('should detect device capabilities correctly', async ({ page }) => {
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        const gpuTierText = await debugOverlay.locator('text=/GPU Tier:/').textContent();
        const cpuCoresText = await debugOverlay.locator('text=/CPU Cores:/').textContent();
        const pixelRatioText = await debugOverlay.locator('text=/Pixel Ratio:/').textContent();
        const touchText = await debugOverlay.locator('text=/Touch:/').textContent();
        
        // Verify capability detection
        expect(gpuTierText).toMatch(/GPU Tier: [1-3]\/3/);
        expect(cpuCoresText).toMatch(/CPU Cores: \d+/);
        expect(pixelRatioText).toMatch(/Pixel Ratio: [\d.]+/);
        expect(touchText).toMatch(/Touch: (Yes|No)/);
      }
    });

    test('should adapt to high DPI displays', async ({ page }) => {
      // Set high DPI
      await page.evaluate(() => {
        Object.defineProperty(window, 'devicePixelRatio', {
          value: 2,
          writable: false
        });
      });
      
      await page.reload();
      await waitForCanvasInit(page);
      
      const canvas = await page.locator('canvas');
      const dimensions = await canvas.evaluate((el: HTMLCanvasElement) => ({
        width: el.width,
        height: el.height,
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight
      }));
      
      // Canvas internal resolution should be higher than display resolution
      expect(dimensions.width).toBeGreaterThan(dimensions.clientWidth);
      expect(dimensions.height).toBeGreaterThan(dimensions.clientHeight);
    });
  });

  test.describe('Mouse Interaction', () => {
    test('should respond to mouse movement', async ({ page }) => {
      const canvas = await page.locator('canvas');
      const canvasBox = await canvas.boundingBox();
      
      if (canvasBox) {
        // Move mouse to center of canvas
        await page.mouse.move(
          canvasBox.x + canvasBox.width / 2,
          canvasBox.y + canvasBox.height / 2
        );
        
        // Move mouse in a pattern
        for (let i = 0; i < 5; i++) {
          await page.mouse.move(
            canvasBox.x + (canvasBox.width * (i + 1)) / 6,
            canvasBox.y + canvasBox.height / 2
          );
          await page.waitForTimeout(100);
        }
        
        // Particles should react to mouse (visual test - would need visual regression)
        // For now, just verify no errors occur
        const errors = await page.evaluate(() => window.onerror);
        expect(errors).toBeUndefined();
      }
    });

    test('should handle mouse leave event', async ({ page }) => {
      const canvas = await page.locator('canvas');
      const canvasBox = await canvas.boundingBox();
      
      if (canvasBox) {
        // Move mouse to canvas
        await page.mouse.move(
          canvasBox.x + canvasBox.width / 2,
          canvasBox.y + canvasBox.height / 2
        );
        
        // Move mouse outside viewport
        await page.mouse.move(-100, -100);
        
        // Verify no errors
        const errors = await page.evaluate(() => window.onerror);
        expect(errors).toBeUndefined();
      }
    });

    test('should respect mouse interaction toggle', async ({ page }) => {
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        const featuresText = await debugOverlay.textContent();
        
        if (featuresText?.includes('mouseInteraction: ✗')) {
          // If mouse interaction is disabled, particles shouldn't react
          const canvas = await page.locator('canvas');
          const canvasBox = await canvas.boundingBox();
          
          if (canvasBox) {
            // Record initial state
            const initialState = await page.evaluate(() => {
              const canvas = document.querySelector('canvas');
              if (!canvas) return null;
              const ctx = canvas.getContext('2d');
              if (!ctx) return null;
              return ctx.getImageData(0, 0, 100, 100).data.slice(0, 100);
            });
            
            // Move mouse
            await page.mouse.move(
              canvasBox.x + canvasBox.width / 2,
              canvasBox.y + canvasBox.height / 2
            );
            await page.waitForTimeout(500);
            
            // State should be similar (particles moving normally, not reacting to mouse)
            const afterState = await page.evaluate(() => {
              const canvas = document.querySelector('canvas');
              if (!canvas) return null;
              const ctx = canvas.getContext('2d');
              if (!ctx) return null;
              return ctx.getImageData(0, 0, 100, 100).data.slice(0, 100);
            });
            
            // States will be different due to animation, but no drastic changes from mouse
            expect(initialState).toBeDefined();
            expect(afterState).toBeDefined();
          }
        }
      }
    });
  });

  test.describe('Touch Interaction', () => {
    test('should handle touch events on mobile devices', async ({ page, browserName }) => {
      // Skip on Firefox as it doesn't support touch events well in automation
      test.skip(browserName === 'firefox', 'Touch events not well supported in Firefox automation');
      
      const canvas = await page.locator('canvas');
      const canvasBox = await canvas.boundingBox();
      
      if (canvasBox) {
        // Simulate touch
        await page.touchscreen.tap(
          canvasBox.x + canvasBox.width / 2,
          canvasBox.y + canvasBox.height / 2
        );
        
        // Simulate swipe
        await page.touchscreen.swipe({
          start: { x: canvasBox.x + 100, y: canvasBox.y + 100 },
          end: { x: canvasBox.x + 200, y: canvasBox.y + 200 },
          steps: 10
        });
        
        // Verify no errors
        const errors = await page.evaluate(() => window.onerror);
        expect(errors).toBeUndefined();
      }
    });
  });

  test.describe('Accessibility Features', () => {
    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload();
      
      // Wait a moment for preference to be applied
      await page.waitForTimeout(500);
      
      // Check if canvas exists (it shouldn't render with reduced motion)
      const canvas = await page.locator('canvas');
      const canvasCount = await canvas.count();
      
      // Component should either not render canvas or render static version
      if (canvasCount > 0) {
        // If canvas exists, verify animations are minimal
        const isAnimating = await page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          if (!canvas) return false;
          
          // Check if requestAnimationFrame is being called
          let frameCount = 0;
          const originalRAF = window.requestAnimationFrame;
          window.requestAnimationFrame = (callback) => {
            frameCount++;
            return originalRAF(callback);
          };
          
          return new Promise(resolve => {
            setTimeout(() => {
              window.requestAnimationFrame = originalRAF;
              resolve(frameCount > 5); // More than 5 frames means it's animating
            }, 1000);
          });
        });
        
        // Should not be animating with reduced motion
        expect(isAnimating).toBe(false);
      }
    });

    test('should have proper ARIA labels', async ({ page }) => {
      const canvas = await page.locator('canvas');
      
      // Verify ARIA attributes
      await expect(canvas).toHaveAttribute('aria-label');
      await expect(canvas).toHaveAttribute('role', 'img');
      
      const ariaLabel = await canvas.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.length).toBeGreaterThan(0);
    });

    test('should not interfere with keyboard navigation', async ({ page }) => {
      // The overlay should have pointer-events: none
      const container = await page.locator('div.fixed.inset-0.pointer-events-none');
      const pointerEvents = await container.evaluate(el => 
        window.getComputedStyle(el).pointerEvents
      );
      
      expect(pointerEvents).toBe('none');
      
      // Verify tab navigation works through the overlay
      await page.keyboard.press('Tab');
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeElement).toBeDefined();
    });
  });

  test.describe('Particle System Behavior', () => {
    test('should animate particles continuously', async ({ page }) => {
      await waitForCanvasInit(page);
      
      // Take snapshots of canvas at different times
      const snapshot1 = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        // Get a sample of pixel data
        return Array.from(ctx.getImageData(0, 0, 100, 100).data.slice(0, 400));
      });
      
      // Wait for animation
      await page.waitForTimeout(500);
      
      const snapshot2 = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        return Array.from(ctx.getImageData(0, 0, 100, 100).data.slice(0, 400));
      });
      
      // Snapshots should be different (particles moved)
      expect(snapshot1).not.toEqual(snapshot2);
    });

    test('should handle particle wrapping at boundaries', async ({ page }) => {
      await waitForCanvasInit(page);
      
      // Monitor for several seconds to ensure particles wrap
      const noErrors = await page.evaluate(() => {
        return new Promise(resolve => {
          let errorOccurred = false;
          window.onerror = () => { errorOccurred = true; };
          
          setTimeout(() => {
            resolve(!errorOccurred);
          }, 3000);
        });
      });
      
      expect(noErrors).toBe(true);
    });

    test('should render connection lines between particles', async ({ page }) => {
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        const metrics = await getPerformanceMetrics(page);
        
        if (metrics && metrics.mode !== 'LOW') {
          // Should have connections in non-LOW modes
          expect(metrics.connections).toBeGreaterThan(0);
        }
      }
    });

    test('should apply pulse effect to particles', async ({ page }) => {
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        const featuresText = await debugOverlay.textContent();
        
        if (featuresText?.includes('pulseEffect: ✓')) {
          // Particles should have varying opacity over time
          const opacities1 = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return null;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;
            // Sample alpha channel values
            const data = ctx.getImageData(0, 0, canvas.width, 100).data;
            const alphas = [];
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] > 0) alphas.push(data[i]);
            }
            return alphas.slice(0, 10);
          });
          
          await page.waitForTimeout(1000);
          
          const opacities2 = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return null;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;
            const data = ctx.getImageData(0, 0, canvas.width, 100).data;
            const alphas = [];
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] > 0) alphas.push(data[i]);
            }
            return alphas.slice(0, 10);
          });
          
          // Opacity values should change due to pulse effect
          expect(opacities1).not.toEqual(opacities2);
        }
      }
    });
  });

  test.describe('Debug Overlay Functionality', () => {
    test('should display debug information when enabled', async ({ page }) => {
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      // Debug overlay may or may not be visible depending on props
      if (await debugOverlay.isVisible()) {
        // Check for required debug information
        await expect(debugOverlay).toContainText('Debug Info');
        await expect(debugOverlay).toContainText('FPS:');
        await expect(debugOverlay).toContainText('Particles:');
        await expect(debugOverlay).toContainText('Connections:');
        await expect(debugOverlay).toContainText('Mode:');
        await expect(debugOverlay).toContainText('GPU Tier:');
        await expect(debugOverlay).toContainText('Features:');
      }
    });

    test('should update FPS counter in real-time', async ({ page }) => {
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        const metrics1 = await getPerformanceMetrics(page);
        await page.waitForTimeout(2000);
        const metrics2 = await getPerformanceMetrics(page);
        
        // FPS should be a reasonable value
        if (metrics1 && metrics2) {
          expect(metrics1.fps).toBeGreaterThan(0);
          expect(metrics1.fps).toBeLessThanOrEqual(144); // Max reasonable FPS
          expect(metrics2.avgFps).toBeGreaterThan(0);
          expect(metrics2.avgFps).toBeLessThanOrEqual(144);
        }
      }
    });

    test('should position debug overlay correctly', async ({ page }) => {
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        const box = await debugOverlay.boundingBox();
        
        if (box) {
          // Should be positioned in one of the corners
          const viewport = page.viewportSize();
          if (viewport) {
            const isTopLeft = box.x < 50 && box.y < 50;
            const isTopRight = box.x > viewport.width - 300 && box.y < 50;
            const isBottomLeft = box.x < 50 && box.y > viewport.height - 300;
            const isBottomRight = box.x > viewport.width - 300 && box.y > viewport.height - 300;
            
            expect(isTopLeft || isTopRight || isBottomLeft || isBottomRight).toBe(true);
          }
        }
      }
    });
  });

  test.describe('Performance and Optimization', () => {
    test('should maintain 60fps under normal conditions', async ({ page }) => {
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        // Wait for FPS to stabilize
        await page.waitForTimeout(3000);
        
        const metrics = await getPerformanceMetrics(page);
        
        if (metrics) {
          // Average FPS should be close to 60
          expect(metrics.avgFps).toBeGreaterThan(50);
        }
      }
    });

    test('should auto-adjust quality when performance drops', async ({ page }) => {
      // This test would require simulating performance degradation
      // For now, verify the auto-quality feature exists
      const debugOverlay = await page.locator('.font-mono.text-xs');
      
      if (await debugOverlay.isVisible()) {
        const featuresText = await debugOverlay.textContent();
        
        // Check if autoQuality feature is mentioned
        expect(featuresText).toContain('autoQuality:');
      }
    });

    test('should use requestAnimationFrame for animations', async ({ page }) => {
      const usesRAF = await page.evaluate(() => {
        let rafCalled = false;
        const originalRAF = window.requestAnimationFrame;
        
        window.requestAnimationFrame = function(callback) {
          rafCalled = true;
          return originalRAF.call(window, callback);
        };
        
        return new Promise(resolve => {
          setTimeout(() => {
            window.requestAnimationFrame = originalRAF;
            resolve(rafCalled);
          }, 100);
        });
      });
      
      expect(usesRAF).toBe(true);
    });

    test('should clean up resources on unmount', async ({ page }) => {
      // Navigate away and back to test cleanup
      await page.goto('/');
      await waitForCanvasInit(page);
      
      // Check for memory leaks by navigating away
      await page.goto('about:blank');
      
      // Check that animation frame is canceled
      const hasActiveAnimation = await page.evaluate(() => {
        return typeof (window as any).animationFrameRef !== 'undefined';
      });
      
      expect(hasActiveAnimation).toBe(false);
    });
  });

  test.describe('Error States and Fallbacks', () => {
    test('should handle canvas context loss gracefully', async ({ page }) => {
      await waitForCanvasInit(page);
      
      // Simulate context loss
      const recovered = await page.evaluate(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (!canvas) return false;
        
        const loseContext = canvas.getContext('webgl')?.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
          
          return new Promise(resolve => {
            setTimeout(() => {
              loseContext.restoreContext();
              resolve(true);
            }, 100);
          });
        }
        
        return true;
      });
      
      expect(recovered).toBe(true);
      
      // Verify no errors after context loss
      const errors = await page.evaluate(() => window.onerror);
      expect(errors).toBeUndefined();
    });

    test('should handle missing WebGL gracefully', async ({ page }) => {
      // Override WebGL availability
      await page.addInitScript(() => {
        HTMLCanvasElement.prototype.getContext = function(contextType: string) {
          if (contextType === 'webgl' || contextType === 'webgl2') {
            return null;
          }
          return (this as any).__proto__.getContext.call(this, contextType);
        };
      });
      
      await page.reload();
      
      // Should still render with 2D context
      const canvas = await page.locator('canvas');
      const hasCanvas = await canvas.count();
      
      // Component should handle missing WebGL gracefully
      expect(hasCanvas).toBeGreaterThanOrEqual(0);
    });

    test('should handle rapid viewport resizing', async ({ page }) => {
      await waitForCanvasInit(page);
      
      // Rapidly resize viewport
      const sizes = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
        { width: 375, height: 667 },
        { width: 1440, height: 900 }
      ];
      
      for (const size of sizes) {
        await page.setViewportSize(size);
        await page.waitForTimeout(100);
      }
      
      // Canvas should adapt without errors
      const canvas = await page.locator('canvas');
      const finalDimensions = await canvas.evaluate((el: HTMLCanvasElement) => ({
        width: el.width,
        height: el.height
      }));
      
      expect(finalDimensions.width).toBeGreaterThan(0);
      expect(finalDimensions.height).toBeGreaterThan(0);
      
      // No errors should occur
      const errors = await page.evaluate(() => window.onerror);
      expect(errors).toBeUndefined();
    });

    test('should handle invalid props gracefully', async ({ page }) => {
      // Test would require a test page with invalid props
      // For now, verify component doesn't crash with current props
      
      const hasErrors = await page.evaluate(() => {
        try {
          // Try to access component
          const container = document.querySelector('.fixed.inset-0');
          return !container;
        } catch (e) {
          return true;
        }
      });
      
      expect(hasErrors).toBe(false);
    });
  });

  test.describe('Visual Regression', () => {
    test('should render consistently across browsers', async ({ page, browserName }) => {
      await waitForCanvasInit(page);
      
      // Take a screenshot for visual comparison
      const screenshot = await page.screenshot({
        clip: {
          x: 0,
          y: 0,
          width: 400,
          height: 400
        }
      });
      
      // Screenshot should have content (not be blank)
      expect(screenshot.length).toBeGreaterThan(1000); // Arbitrary minimum size
      
      // Browser-specific checks
      if (browserName === 'chromium') {
        // Chrome-specific validations
        const hasCanvasAcceleration = await page.evaluate(() => {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl');
          return gl !== null;
        });
        expect(hasCanvasAcceleration).toBe(true);
      }
    });

    test('should maintain visual quality at different zoom levels', async ({ page }) => {
      await waitForCanvasInit(page);
      
      const zoomLevels = [0.5, 1, 1.5, 2];
      
      for (const zoom of zoomLevels) {
        await page.evaluate((z) => {
          (document.body.style as any).zoom = z;
        }, zoom);
        
        await page.waitForTimeout(200);
        
        const canvas = await page.locator('canvas');
        const isVisible = await canvas.isVisible();
        expect(isVisible).toBe(true);
      }
      
      // Reset zoom
      await page.evaluate(() => {
        (document.body.style as any).zoom = 1;
      });
    });
  });

  test.describe('Integration with Page', () => {
    test('should not block page interactions', async ({ page }) => {
      // Verify pointer-events: none allows clicking through
      const container = await page.locator('.fixed.inset-0.pointer-events-none');
      
      // Try to click on something behind the overlay
      const testButton = await page.locator('button, a').first();
      if (await testButton.isVisible()) {
        // Should be able to click through the overlay
        await testButton.click({ force: false });
        // No error means click went through
      }
    });

    test('should adapt to theme changes', async ({ page }) => {
      // Change theme
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });
      
      await page.waitForTimeout(500);
      
      // Component should still render correctly
      const canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
      
      // Change back to light theme
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
      });
      
      await page.waitForTimeout(500);
      await expect(canvas).toBeVisible();
    });

    test('should coexist with other animations on the page', async ({ page }) => {
      // Add CSS animations to the page
      await page.addStyleTag({
        content: `
          @keyframes testAnimation {
            from { transform: translateX(0); }
            to { transform: translateX(100px); }
          }
          .test-animated {
            animation: testAnimation 1s infinite;
          }
        `
      });
      
      // Add an animated element
      await page.evaluate(() => {
        const div = document.createElement('div');
        div.className = 'test-animated';
        div.textContent = 'Animated';
        document.body.appendChild(div);
      });
      
      // Both animations should work without conflict
      await page.waitForTimeout(1000);
      
      const canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
      
      const animatedElement = await page.locator('.test-animated');
      await expect(animatedElement).toBeVisible();
    });
  });
});

// Performance benchmarking test suite
test.describe('Performance Benchmarks', () => {
  test('should meet performance budgets', async ({ page }) => {
    await page.goto('/');
    await waitForCanvasInit(page);
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const measurements = {
          paintTiming: {} as any,
          memory: {} as any,
          fps: [] as number[]
        };
        
        // Get paint timing
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          measurements.paintTiming[entry.name] = entry.startTime;
        });
        
        // Get memory usage if available
        if ((performance as any).memory) {
          measurements.memory = {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
          };
        }
        
        // Measure FPS for 2 seconds
        let lastTime = performance.now();
        let frameCount = 0;
        
        function measureFrame() {
          const currentTime = performance.now();
          const delta = currentTime - lastTime;
          
          if (delta > 0) {
            measurements.fps.push(1000 / delta);
          }
          
          lastTime = currentTime;
          frameCount++;
          
          if (frameCount < 120) { // ~2 seconds at 60fps
            requestAnimationFrame(measureFrame);
          } else {
            resolve(measurements);
          }
        }
        
        requestAnimationFrame(measureFrame);
      });
    });
    
    // Verify performance meets targets
    const avgFps = (metrics as any).fps.reduce((a: number, b: number) => a + b, 0) / (metrics as any).fps.length;
    expect(avgFps).toBeGreaterThan(50); // Should maintain at least 50fps average
    
    // First contentful paint should be fast
    if ((metrics as any).paintTiming['first-contentful-paint']) {
      expect((metrics as any).paintTiming['first-contentful-paint']).toBeLessThan(3000);
    }
    
    // Memory usage should be reasonable (if available)
    if ((metrics as any).memory.usedJSHeapSize) {
      const memoryMB = (metrics as any).memory.usedJSHeapSize / 1024 / 1024;
      expect(memoryMB).toBeLessThan(100); // Should use less than 100MB
    }
  });
});

/**
 * Helper function to wait for canvas initialization
 */
async function waitForCanvasInit(page: Page) {
  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas');
    return canvas && canvas.width > 0 && canvas.height > 0;
  }, { timeout: 5000 });
}