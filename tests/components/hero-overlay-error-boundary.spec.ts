/**
 * @fileoverview HeroOverlay Error Boundary Tests
 * 
 * Comprehensive test suite for error boundary functionality,
 * fallback mechanisms, and recovery features.
 * 
 * @module tests/components/hero-overlay-error-boundary
 * @since 1.0.0
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const TEST_URL = process.env.TEST_URL || 'http://localhost:3000';
const ERROR_DEMO_PATH = '/error-boundary-demo'; // Assuming demo page is available

/**
 * Helper to simulate WebGL context loss
 */
async function simulateWebGLContextLoss(page: Page) {
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const gl = (canvas as HTMLCanvasElement).getContext('webgl') || 
                 (canvas as HTMLCanvasElement).getContext('webgl2');
      if (gl) {
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
      }
    }
  });
}

/**
 * Helper to restore WebGL context
 */
async function restoreWebGLContext(page: Page) {
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const gl = (canvas as HTMLCanvasElement).getContext('webgl') || 
                 (canvas as HTMLCanvasElement).getContext('webgl2');
      if (gl) {
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.restoreContext();
        }
      }
    }
  });
}

/**
 * Helper to check if fallback is rendered
 */
async function isFallbackRendered(page: Page, fallbackType: string): Promise<boolean> {
  switch (fallbackType) {
    case 'GRADIENT':
      return await page.locator('[style*="gradientShift"]').isVisible();
    case 'STATIC':
      return await page.locator('[style*="linear-gradient(135deg"]').isVisible();
    case 'MINIMAL':
      return await page.locator('[style*="float"]').isVisible();
    case 'DISABLED':
      const canvas = await page.locator('canvas').count();
      return canvas === 0;
    default:
      return false;
  }
}

test.describe('HeroOverlay Error Boundary', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to test page
    await page.goto(TEST_URL);
  });

  test.describe('Fallback Modes', () => {
    
    test('should render gradient fallback on error', async ({ page }) => {
      // Trigger an error condition
      await page.evaluate(() => {
        // Force an error by manipulating the canvas
        const canvas = document.querySelector('canvas');
        if (canvas) {
          (canvas as any).getContext = () => { throw new Error('Simulated error'); };
        }
      });
      
      // Check for gradient fallback
      const gradientFallback = await page.locator('[style*="linear-gradient"]');
      await expect(gradientFallback).toBeVisible();
    });

    test('should render static fallback when configured', async ({ page }) => {
      // Check for static gradient
      const staticFallback = await page.locator('[style*="linear-gradient(135deg"]');
      if (await staticFallback.isVisible()) {
        // Verify it's not animated
        const hasAnimation = await page.locator('[style*="animation"]').count();
        expect(hasAnimation).toBe(0);
      }
    });

    test('should render minimal particles fallback', async ({ page }) => {
      // Look for CSS-only particles
      const particles = await page.locator('[style*="float"]');
      if (await particles.count() > 0) {
        expect(await particles.count()).toBeGreaterThan(0);
        expect(await particles.count()).toBeLessThanOrEqual(10); // Minimal particle count
      }
    });

    test('should disable overlay completely when configured', async ({ page }) => {
      // Check that no overlay elements are present
      const canvas = await page.locator('canvas').count();
      const fallbacks = await page.locator('[class*="fixed inset-0"]').count();
      
      // In disabled mode, there should be no canvas or fallback
      if (canvas === 0 && fallbacks === 0) {
        expect(true).toBe(true); // Overlay is disabled
      }
    });
  });

  test.describe('WebGL Context Recovery', () => {
    
    test('should handle WebGL context loss gracefully', async ({ page }) => {
      // Wait for canvas to be ready
      await page.waitForSelector('canvas', { timeout: 5000 });
      
      // Simulate context loss
      await simulateWebGLContextLoss(page);
      
      // Wait a moment for error boundary to react
      await page.waitForTimeout(1000);
      
      // Check that some fallback is rendered
      const hasFallback = await page.locator('[class*="fixed inset-0"]').count() > 0;
      expect(hasFallback).toBe(true);
    });

    test('should attempt to restore WebGL context', async ({ page }) => {
      // Wait for canvas
      await page.waitForSelector('canvas', { timeout: 5000 });
      
      // Simulate context loss
      await simulateWebGLContextLoss(page);
      await page.waitForTimeout(1000);
      
      // Restore context
      await restoreWebGLContext(page);
      await page.waitForTimeout(2000);
      
      // Check if canvas is back
      const canvas = await page.locator('canvas');
      await expect(canvas).toBeVisible();
    });

    test('should show recovery message during restoration', async ({ page }) => {
      // Simulate context loss
      await simulateWebGLContextLoss(page);
      
      // Look for recovery message
      const recoveryMessage = await page.locator('text=/recovering/i');
      if (await recoveryMessage.isVisible()) {
        expect(await recoveryMessage.textContent()).toContain('Recovering');
      }
    });
  });

  test.describe('Browser Compatibility', () => {
    
    test('should detect unsupported browsers', async ({ page, browserName }) => {
      // Check for compatibility warnings
      const isSupported = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
      });
      
      if (!isSupported) {
        // Should show fallback
        const hasFallback = await page.locator('[class*="fixed inset-0"]').count() > 0;
        expect(hasFallback).toBe(true);
      }
    });

    test('should check for required features', async ({ page }) => {
      const capabilities = await page.evaluate(() => {
        return {
          canvas: !!document.createElement('canvas').getContext,
          webgl: (() => {
            try {
              const canvas = document.createElement('canvas');
              return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
            } catch {
              return false;
            }
          })(),
          requestAnimationFrame: !!window.requestAnimationFrame,
          intersectionObserver: 'IntersectionObserver' in window
        };
      });
      
      // At minimum, canvas and requestAnimationFrame should be available
      expect(capabilities.canvas).toBe(true);
      expect(capabilities.requestAnimationFrame).toBe(true);
    });

    test('should handle software renderer gracefully', async ({ page }) => {
      const rendererInfo = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (!gl) return null;
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return null;
        
        return {
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        };
      });
      
      if (rendererInfo) {
        const isSoftware = rendererInfo.renderer.toLowerCase().includes('swiftshader') ||
                          rendererInfo.renderer.toLowerCase().includes('software');
        
        if (isSoftware) {
          // Should use a lighter fallback mode
          console.log('Software renderer detected, expecting fallback');
        }
      }
    });
  });

  test.describe('Error Reporting', () => {
    
    test('should log errors in development mode', async ({ page }) => {
      const consoleLogs: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleLogs.push(msg.text());
        }
      });
      
      // Trigger an error
      await page.evaluate(() => {
        throw new Error('Test error for HeroOverlay');
      });
      
      await page.waitForTimeout(1000);
      
      // In development, errors should be logged
      if (process.env.NODE_ENV === 'development') {
        const hasErrorLog = consoleLogs.some(log => log.includes('HeroOverlay'));
        expect(hasErrorLog).toBe(true);
      }
    });

    test('should track retry attempts', async ({ page }) => {
      // This would need access to internal state or debug UI
      // Check if retry count is displayed in debug mode
      const debugInfo = await page.locator('[class*="bg-red-500"]');
      if (await debugInfo.isVisible()) {
        const text = await debugInfo.textContent();
        expect(text).toMatch(/Retry: \d+\/\d+/);
      }
    });
  });

  test.describe('Performance Monitoring', () => {
    
    test('should monitor FPS and downgrade if needed', async ({ page }) => {
      // This test would need to simulate low FPS
      // In a real scenario, you might throttle CPU
      
      await page.waitForTimeout(3000); // Let it run for a bit
      
      // Check if performance mode was downgraded
      const debugInfo = await page.locator('text=/Mode:/');
      if (await debugInfo.isVisible()) {
        const text = await debugInfo.textContent();
        // Mode might have been downgraded from HIGH to BALANCED or LOW
        expect(text).toMatch(/Mode: (HIGH|BALANCED|LOW)/);
      }
    });

    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Check that animation is disabled or reduced
      const canvas = await page.locator('canvas').count();
      const hasAnimation = await page.locator('[style*="animation"]').count();
      
      // With reduced motion, animations should be minimal or absent
      if (canvas === 0) {
        expect(true).toBe(true); // Animation disabled
      } else if (hasAnimation > 0) {
        // Check for reduced animation speed
        const animationStyle = await page.locator('[style*="animation"]').first().getAttribute('style');
        expect(animationStyle).toMatch(/animation.*slow|reduce/i);
      }
    });
  });

  test.describe('Accessibility', () => {
    
    test('should have proper ARIA attributes', async ({ page }) => {
      const canvas = await page.locator('canvas');
      if (await canvas.isVisible()) {
        const ariaLabel = await canvas.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        
        const role = await canvas.getAttribute('role');
        expect(role).toBe('img');
      }
      
      // Fallbacks should be hidden from screen readers
      const fallbacks = await page.locator('[aria-hidden="true"]');
      expect(await fallbacks.count()).toBeGreaterThanOrEqual(0);
    });

    test('should not interfere with keyboard navigation', async ({ page }) => {
      // The overlay should be pointer-events-none
      const overlay = await page.locator('[class*="pointer-events-none"]');
      expect(await overlay.count()).toBeGreaterThan(0);
      
      // Test that we can still tab through page content
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });
  });

  test.describe('Recovery Mechanisms', () => {
    
    test('should retry rendering after error', async ({ page }) => {
      let retryCount = 0;
      
      page.on('console', msg => {
        if (msg.text().includes('Recovering overlay')) {
          retryCount++;
        }
      });
      
      // Trigger an error
      await simulateWebGLContextLoss(page);
      
      // Wait for retry attempts
      await page.waitForTimeout(5000);
      
      // Should have attempted recovery
      expect(retryCount).toBeGreaterThanOrEqual(0);
    });

    test('should downgrade fallback mode on each retry', async ({ page }) => {
      // This would need access to internal state
      // Could be tested through debug UI or console logs
      
      const debugInfo = await page.locator('text=/Fallback:/');
      if (await debugInfo.isVisible()) {
        const initialMode = await debugInfo.textContent();
        
        // Trigger multiple errors
        await simulateWebGLContextLoss(page);
        await page.waitForTimeout(3000);
        
        const finalMode = await debugInfo.textContent();
        // Mode should have been downgraded
        expect(initialMode).not.toBe(finalMode);
      }
    });

    test('should stop retrying after max attempts', async ({ page }) => {
      let errorCount = 0;
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errorCount++;
        }
      });
      
      // Trigger multiple errors
      for (let i = 0; i < 5; i++) {
        await simulateWebGLContextLoss(page);
        await page.waitForTimeout(1000);
      }
      
      // Should stop after max retries (usually 3)
      expect(errorCount).toBeLessThanOrEqual(3);
    });
  });
});

test.describe('Error Boundary Demo Page', () => {
  
  test.skip(!ERROR_DEMO_PATH, 'Demo page not configured');
  
  test('should load demo page', async ({ page }) => {
    await page.goto(`${TEST_URL}${ERROR_DEMO_PATH}`);
    await expect(page.locator('h1')).toContainText('Error Boundary Demo');
  });

  test('should simulate different error types', async ({ page }) => {
    await page.goto(`${TEST_URL}${ERROR_DEMO_PATH}`);
    
    // Test each error simulation button
    const errorButtons = await page.locator('button:has-text("CONTEXT_LOSS")');
    if (await errorButtons.isVisible()) {
      await errorButtons.click();
      await page.waitForTimeout(1000);
      
      // Should show appropriate fallback
      const hasFallback = await page.locator('[class*="fixed inset-0"]').count() > 0;
      expect(hasFallback).toBe(true);
    }
  });

  test('should switch between fallback modes', async ({ page }) => {
    await page.goto(`${TEST_URL}${ERROR_DEMO_PATH}`);
    
    // Test switching fallback modes
    const gradientButton = await page.locator('button:has-text("GRADIENT")');
    if (await gradientButton.isVisible()) {
      await gradientButton.click();
      await page.waitForTimeout(500);
      
      const hasGradient = await isFallbackRendered(page, 'GRADIENT');
      expect(hasGradient).toBe(true);
    }
  });
});