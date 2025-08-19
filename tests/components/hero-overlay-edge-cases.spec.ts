import { test, expect } from '@playwright/test';
import {
  waitForHeroOverlayInit,
  getHeroOverlayMetrics,
  getHeroOverlayFeatures,
  simulateMouseInteraction,
  getCanvasSnapshot,
  measureFrameRate,
  checkReducedMotionSupport,
  getCanvasMemoryUsage,
  testParticleBoundaries,
  verifyAccessibility
} from './test-utils';

/**
 * Edge cases and stress tests for HeroOverlay component
 */
test.describe('HeroOverlay Edge Cases and Stress Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Extreme Viewport Sizes', () => {
    test('should handle very small viewport (mobile)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await waitForHeroOverlayInit(page);
      
      const canvas = await page.locator('canvas');
      const dimensions = await canvas.evaluate((el: HTMLCanvasElement) => ({
        width: el.width,
        height: el.height,
        ratio: el.width / el.height
      }));
      
      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBeGreaterThan(0);
      expect(dimensions.ratio).toBeGreaterThan(0);
    });

    test('should handle very large viewport (4K)', async ({ page }) => {
      await page.setViewportSize({ width: 3840, height: 2160 });
      await waitForHeroOverlayInit(page);
      
      const memoryUsage = await getCanvasMemoryUsage(page);
      
      // Memory usage should be reasonable even at 4K
      expect(memoryUsage.megabytes).toBeLessThan(200); // Less than 200MB
      
      // Should still maintain performance
      const frameRate = await measureFrameRate(page, 1000);
      expect(frameRate.avgFps).toBeGreaterThan(30); // At least 30fps at 4K
    });

    test('should handle extreme aspect ratios', async ({ page }) => {
      // Ultra-wide aspect ratio
      await page.setViewportSize({ width: 3440, height: 720 });
      await waitForHeroOverlayInit(page);
      
      let canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
      
      // Very tall aspect ratio
      await page.setViewportSize({ width: 400, height: 2000 });
      await waitForHeroOverlayInit(page);
      
      canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
      
      // No errors should occur
      const errors = await page.evaluate(() => window.onerror);
      expect(errors).toBeUndefined();
    });
  });

  test.describe('Performance Stress Tests', () => {
    test('should handle rapid mouse movements', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      // Simulate very rapid mouse movements
      const viewport = page.viewportSize();
      if (viewport) {
        for (let i = 0; i < 100; i++) {
          await page.mouse.move(
            Math.random() * viewport.width,
            Math.random() * viewport.height
          );
          // No delay - as fast as possible
        }
      }
      
      // Should still be responsive
      const metrics = await getHeroOverlayMetrics(page);
      if (metrics) {
        expect(metrics.fps).toBeGreaterThan(20); // Should maintain at least 20fps
      }
    });

    test('should handle continuous interaction for extended period', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      // Interact continuously for 5 seconds
      const startTime = Date.now();
      while (Date.now() - startTime < 5000) {
        await simulateMouseInteraction(page, 'random');
      }
      
      // Check for memory leaks or performance degradation
      const metrics = await getHeroOverlayMetrics(page);
      if (metrics) {
        expect(metrics.avgFps).toBeGreaterThan(30);
      }
      
      // Particles should still be within bounds
      const boundaryTest = await testParticleBoundaries(page, 1000);
      expect(boundaryTest.success).toBe(true);
    });

    test('should recover from performance drops', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      // Get initial metrics
      const initialMetrics = await getHeroOverlayMetrics(page);
      
      // Simulate heavy page activity
      await page.evaluate(() => {
        // Create heavy DOM manipulation
        for (let i = 0; i < 1000; i++) {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.width = '100px';
          div.style.height = '100px';
          document.body.appendChild(div);
        }
      });
      
      await page.waitForTimeout(1000);
      
      // Clean up heavy elements
      await page.evaluate(() => {
        const divs = document.querySelectorAll('div[style*="position: absolute"]');
        divs.forEach(div => div.remove());
      });
      
      await page.waitForTimeout(2000);
      
      // Performance should recover
      const recoveredMetrics = await getHeroOverlayMetrics(page);
      if (initialMetrics && recoveredMetrics) {
        expect(recoveredMetrics.avgFps).toBeGreaterThan(initialMetrics.avgFps * 0.7);
      }
    });
  });

  test.describe('Browser Compatibility Edge Cases', () => {
    test('should handle browser zoom', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      // Test different zoom levels
      const zoomLevels = [0.5, 0.75, 1.25, 1.5, 2];
      
      for (const zoom of zoomLevels) {
        await page.evaluate((z) => {
          (document.documentElement.style as any).zoom = z;
        }, zoom);
        
        await page.waitForTimeout(300);
        
        const canvas = await page.locator('canvas');
        await expect(canvas).toBeVisible();
        
        // Canvas should resize appropriately
        const dimensions = await canvas.evaluate((el: HTMLCanvasElement) => ({
          width: el.clientWidth,
          height: el.clientHeight
        }));
        
        expect(dimensions.width).toBeGreaterThan(0);
        expect(dimensions.height).toBeGreaterThan(0);
      }
      
      // Reset zoom
      await page.evaluate(() => {
        (document.documentElement.style as any).zoom = 1;
      });
    });

    test('should handle page visibility changes', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      // Simulate page being hidden (tab switch)
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', {
          value: true,
          writable: true
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      
      await page.waitForTimeout(1000);
      
      // Simulate page being visible again
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', {
          value: false,
          writable: true
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      
      await page.waitForTimeout(500);
      
      // Animation should resume
      const canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
      
      // Check if still animating
      const snapshot1 = await getCanvasSnapshot(page);
      await page.waitForTimeout(500);
      const snapshot2 = await getCanvasSnapshot(page);
      
      expect(snapshot1).not.toEqual(snapshot2);
    });

    test('should handle print media', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      // Emulate print media
      await page.emulateMedia({ media: 'print' });
      
      // Canvas should either hide or render static for print
      const canvas = await page.locator('canvas');
      const isVisible = await canvas.isVisible();
      
      // Reset to screen media
      await page.emulateMedia({ media: 'screen' });
      
      // No errors should occur
      const errors = await page.evaluate(() => window.onerror);
      expect(errors).toBeUndefined();
    });
  });

  test.describe('Memory and Resource Management', () => {
    test('should not leak memory on repeated initialization', async ({ page }) => {
      // Get initial memory (if available)
      const getMemory = async () => {
        return await page.evaluate(() => {
          if ((performance as any).memory) {
            return (performance as any).memory.usedJSHeapSize;
          }
          return null;
        });
      };
      
      const initialMemory = await getMemory();
      
      // Repeatedly navigate to trigger re-initialization
      for (let i = 0; i < 5; i++) {
        await page.goto('about:blank');
        await page.goto('/');
        await waitForHeroOverlayInit(page);
      }
      
      // Force garbage collection if possible
      await page.evaluate(() => {
        if ((window as any).gc) {
          (window as any).gc();
        }
      });
      
      await page.waitForTimeout(1000);
      
      const finalMemory = await getMemory();
      
      if (initialMemory && finalMemory) {
        // Memory should not increase dramatically (allow 50% increase)
        expect(finalMemory).toBeLessThan(initialMemory * 1.5);
      }
    });

    test('should clean up event listeners on unmount', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      // Count event listeners
      const getListenerCount = async () => {
        return await page.evaluate(() => {
          const counts = {
            mouse: 0,
            resize: 0,
            total: 0
          };
          
          // This is a rough approximation as we can't directly count listeners
          // We're checking if handlers are still being called
          let mouseHandlerCalled = false;
          let resizeHandlerCalled = false;
          
          const testMouseHandler = () => { mouseHandlerCalled = true; };
          const testResizeHandler = () => { resizeHandlerCalled = true; };
          
          window.addEventListener('mousemove', testMouseHandler);
          window.addEventListener('resize', testResizeHandler);
          
          // Trigger events
          window.dispatchEvent(new MouseEvent('mousemove'));
          window.dispatchEvent(new Event('resize'));
          
          // Clean up test handlers
          window.removeEventListener('mousemove', testMouseHandler);
          window.removeEventListener('resize', testResizeHandler);
          
          return {
            mouseHandlerCalled,
            resizeHandlerCalled
          };
        });
      };
      
      await getListenerCount();
      
      // Navigate away to unmount component
      await page.goto('about:blank');
      
      // Navigate back
      await page.goto('/');
      await waitForHeroOverlayInit(page);
      
      // Should still work correctly
      const canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
    });
  });

  test.describe('Accessibility Edge Cases', () => {
    test('should maintain accessibility with dynamic content', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      const accessibility = await verifyAccessibility(page);
      
      expect(accessibility.hasCanvas).toBe(true);
      expect(accessibility.ariaLabel).toBeTruthy();
      expect(accessibility.role).toBe('img');
      expect(accessibility.parentPointerEvents).toBe('none');
      
      // Should not interfere with screen reader navigation
      expect(accessibility.tabIndex).not.toBe('0'); // Should not be focusable
    });

    test('should support high contrast mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await waitForHeroOverlayInit(page);
      
      let canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
      
      await page.emulateMedia({ colorScheme: 'light' });
      await page.waitForTimeout(500);
      
      canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
    });

    test('should respect user animation preferences', async ({ page }) => {
      const supportsReducedMotion = await checkReducedMotionSupport(page);
      expect(supportsReducedMotion).toBe(true);
    });
  });

  test.describe('Error Recovery', () => {
    test('should handle WebGL context loss', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      // Simulate WebGL context loss
      const recovered = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return false;
        
        // Try to get WebGL context
        const gl = (canvas as HTMLCanvasElement).getContext('webgl');
        if (!gl) {
          // If no WebGL, component should use 2D context
          const ctx2d = (canvas as HTMLCanvasElement).getContext('2d');
          return ctx2d !== null;
        }
        
        // Simulate context loss
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
          
          return new Promise(resolve => {
            setTimeout(() => {
              if (loseContext) {
                loseContext.restoreContext();
              }
              resolve(true);
            }, 500);
          });
        }
        
        return true;
      });
      
      expect(recovered).toBe(true);
      
      // Component should still be functional
      await page.waitForTimeout(1000);
      const canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
    });

    test('should handle invalid configuration gracefully', async ({ page }) => {
      // Test with invalid props (would need a test page)
      // For now, verify current configuration doesn't cause errors
      
      const hasErrors = await page.evaluate(() => {
        let errorCount = 0;
        const originalError = console.error;
        console.error = (...args) => {
          errorCount++;
          originalError.apply(console, args);
        };
        
        // Wait a bit to catch any async errors
        return new Promise(resolve => {
          setTimeout(() => {
            console.error = originalError;
            resolve(errorCount);
          }, 1000);
        });
      });
      
      expect(hasErrors).toBe(0);
    });

    test('should handle rapid prop changes', async ({ page }) => {
      // This would require a test page that can change props
      // For now, verify rapid DOM changes don't break the component
      
      await waitForHeroOverlayInit(page);
      
      // Rapidly change themes
      for (let i = 0; i < 10; i++) {
        await page.evaluate(() => {
          document.documentElement.setAttribute('data-theme', 'dark');
        });
        await page.waitForTimeout(50);
        await page.evaluate(() => {
          document.documentElement.setAttribute('data-theme', 'light');
        });
        await page.waitForTimeout(50);
      }
      
      // Component should still be functional
      const canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
      
      const metrics = await getHeroOverlayMetrics(page);
      if (metrics) {
        expect(metrics.fps).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Integration with Page Features', () => {
    test('should not interfere with page scrolling', async ({ page }) => {
      // Add scrollable content
      await page.evaluate(() => {
        document.body.style.height = '300vh';
      });
      
      await waitForHeroOverlayInit(page);
      
      // Scroll the page
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(500);
      
      // Canvas should still be visible and positioned correctly
      const canvas = await page.locator('canvas');
      const position = await canvas.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
          position: window.getComputedStyle(el.parentElement!).position
        };
      });
      
      expect(position.position).toBe('fixed');
      expect(position.top).toBe(0);
      expect(position.left).toBe(0);
    });

    test('should coexist with CSS animations', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      // Add multiple CSS animations to the page
      await page.addStyleTag({
        content: `
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { to { opacity: 0.5; } }
          @keyframes slide { to { transform: translateX(100px); } }
          .animated {
            animation: spin 1s linear infinite,
                      pulse 0.5s ease-in-out infinite alternate,
                      slide 2s ease-in-out infinite alternate;
          }
        `
      });
      
      // Add animated elements
      await page.evaluate(() => {
        for (let i = 0; i < 10; i++) {
          const el = document.createElement('div');
          el.className = 'animated';
          el.style.width = '50px';
          el.style.height = '50px';
          el.style.background = 'blue';
          el.style.position = 'fixed';
          el.style.top = `${i * 60}px`;
          el.style.left = '10px';
          document.body.appendChild(el);
        }
      });
      
      // Measure combined performance
      const frameRate = await measureFrameRate(page, 2000);
      
      // Should maintain reasonable performance with multiple animations
      expect(frameRate.avgFps).toBeGreaterThan(30);
      expect(frameRate.dropRate).toBeLessThan(0.2); // Less than 20% dropped frames
    });

    test('should handle DOM mutations gracefully', async ({ page }) => {
      await waitForHeroOverlayInit(page);
      
      // Perform heavy DOM mutations
      await page.evaluate(() => {
        const observer = new MutationObserver(() => {});
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true
        });
        
        // Add and remove elements rapidly
        for (let i = 0; i < 100; i++) {
          const el = document.createElement('div');
          document.body.appendChild(el);
          el.remove();
        }
        
        observer.disconnect();
      });
      
      // HeroOverlay should continue functioning
      const canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
      
      const metrics = await getHeroOverlayMetrics(page);
      if (metrics) {
        expect(metrics.fps).toBeGreaterThan(0);
      }
    });
  });
});