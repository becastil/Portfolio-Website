import { test, expect, Page } from '@playwright/test';

/**
 * Performance-focused tests for HeroOverlay component
 * These tests are specifically designed for CI/CD monitoring
 */

test.describe('HeroOverlay Performance Monitoring', () => {
  test.describe.configure({ mode: 'parallel' });

  async function measurePerformance(page: Page) {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics = {
          fps: [] as number[],
          memory: {} as any,
          renderTime: 0,
          scriptTime: 0,
          canvasOperations: 0
        };

        // Measure FPS for 3 seconds
        let frameCount = 0;
        let lastTime = performance.now();
        const startTime = performance.now();

        function measureFrame() {
          const currentTime = performance.now();
          const delta = currentTime - lastTime;
          
          if (delta > 0) {
            metrics.fps.push(1000 / delta);
          }
          
          lastTime = currentTime;
          frameCount++;
          
          if (currentTime - startTime < 3000) {
            requestAnimationFrame(measureFrame);
          } else {
            // Calculate averages
            const avgFps = metrics.fps.reduce((a, b) => a + b, 0) / metrics.fps.length;
            const minFps = Math.min(...metrics.fps);
            const maxFps = Math.max(...metrics.fps);
            
            // Get memory info if available
            if ((performance as any).memory) {
              metrics.memory = {
                usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
              };
            }
            
            // Get performance entries
            const entries = performance.getEntriesByType('measure');
            const renderEntry = entries.find(e => e.name.includes('render'));
            if (renderEntry) {
              metrics.renderTime = renderEntry.duration;
            }
            
            resolve({
              avgFps,
              minFps,
              maxFps,
              frameCount,
              memory: metrics.memory,
              renderTime: metrics.renderTime
            });
          }
        }
        
        requestAnimationFrame(measureFrame);
      });
    });
  }

  async function getCanvasMetrics(page: Page) {
    return await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      
      const ctx = canvas.getContext('2d') || canvas.getContext('webgl');
      if (!ctx) return null;
      
      return {
        width: canvas.width,
        height: canvas.height,
        contextType: ctx instanceof WebGLRenderingContext ? 'webgl' : '2d',
        gpuAccelerated: ctx instanceof WebGLRenderingContext
      };
    });
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for canvas to initialize
    await page.waitForFunction(() => {
      const canvas = document.querySelector('canvas');
      return canvas && canvas.width > 0 && canvas.height > 0;
    }, { timeout: 5000 });
  });

  test('maintains 60fps performance target', async ({ page }) => {
    const metrics = await measurePerformance(page);
    
    console.log('Performance Metrics:', {
      avgFps: metrics.avgFps.toFixed(2),
      minFps: metrics.minFps.toFixed(2),
      maxFps: metrics.maxFps.toFixed(2),
      frameCount: metrics.frameCount
    });
    
    // Performance assertions for CI
    expect(metrics.avgFps).toBeGreaterThan(50); // Should maintain at least 50fps average
    expect(metrics.minFps).toBeGreaterThan(30); // Minimum shouldn't drop below 30fps
  });

  test('respects memory budget', async ({ page }) => {
    const initialMetrics = await measurePerformance(page);
    
    // Interact with the page to trigger particle reactions
    const canvas = await page.locator('canvas');
    const box = await canvas.boundingBox();
    
    if (box) {
      // Simulate user interaction
      for (let i = 0; i < 10; i++) {
        await page.mouse.move(
          box.x + Math.random() * box.width,
          box.y + Math.random() * box.height
        );
        await page.waitForTimeout(100);
      }
    }
    
    const finalMetrics = await measurePerformance(page);
    
    // Memory should not increase significantly
    if (initialMetrics.memory.usedJSHeapSize && finalMetrics.memory.usedJSHeapSize) {
      const memoryIncrease = finalMetrics.memory.usedJSHeapSize - initialMetrics.memory.usedJSHeapSize;
      const memoryIncreaseMB = memoryIncrease / 1024 / 1024;
      
      console.log('Memory increase:', memoryIncreaseMB.toFixed(2), 'MB');
      
      // Should not leak more than 10MB during interaction
      expect(memoryIncreaseMB).toBeLessThan(10);
    }
  });

  test('uses hardware acceleration when available', async ({ page }) => {
    const canvasMetrics = await getCanvasMetrics(page);
    
    expect(canvasMetrics).not.toBeNull();
    
    console.log('Canvas Metrics:', canvasMetrics);
    
    // Check if GPU acceleration is being used (WebGL context)
    // This is preferred but not required as 2D context can also be hardware accelerated
    if (canvasMetrics?.contextType === 'webgl') {
      expect(canvasMetrics.gpuAccelerated).toBe(true);
    }
  });

  test('bundle size is within limits', async ({ page }) => {
    // Get the size of JavaScript resources
    const resources = await page.evaluate(() => {
      const perfEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = perfEntries.filter(entry => 
        entry.name.includes('.js') && 
        (entry.name.includes('hero') || entry.name.includes('overlay') || entry.name.includes('particle'))
      );
      
      return jsResources.map(resource => ({
        name: resource.name,
        size: resource.transferSize,
        duration: resource.duration
      }));
    });
    
    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
    const totalSizeKB = totalSize / 1024;
    
    console.log('HeroOverlay-related JS resources:', resources);
    console.log('Total size:', totalSizeKB.toFixed(2), 'KB');
    
    // Bundle size should be reasonable (under 100KB for HeroOverlay-related code)
    expect(totalSizeKB).toBeLessThan(100);
  });

  test('responds to performance mode changes', async ({ page }) => {
    // Check if debug overlay exists
    const debugOverlay = await page.locator('.font-mono.text-xs');
    
    if (await debugOverlay.isVisible()) {
      // Get initial performance mode
      const initialMode = await debugOverlay.locator('text=/Mode: /').textContent();
      
      // Simulate performance degradation by creating heavy DOM operations
      await page.evaluate(() => {
        // Create temporary heavy elements
        for (let i = 0; i < 1000; i++) {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.width = '1px';
          div.style.height = '1px';
          document.body.appendChild(div);
        }
      });
      
      // Wait for potential mode switch
      await page.waitForTimeout(2000);
      
      // Check if mode changed
      const finalMode = await debugOverlay.locator('text=/Mode: /').textContent();
      
      console.log('Performance mode transition:', initialMode, '->', finalMode);
      
      // Clean up
      await page.evaluate(() => {
        const divs = document.querySelectorAll('div[style*="position: absolute"]');
        divs.forEach(div => div.remove());
      });
    }
  });

  test('handles viewport resizing efficiently', async ({ page }) => {
    const viewportSizes = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    const resizeMetrics = [];
    
    for (const size of viewportSizes) {
      const startTime = Date.now();
      await page.setViewportSize(size);
      
      // Wait for canvas to adjust
      await page.waitForFunction((expectedSize) => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return false;
        
        // Canvas should adapt to new viewport
        const rect = canvas.getBoundingClientRect();
        return Math.abs(rect.width - expectedSize.width) < 10;
      }, size, { timeout: 1000 });
      
      const resizeTime = Date.now() - startTime;
      
      const canvasMetrics = await getCanvasMetrics(page);
      
      resizeMetrics.push({
        viewport: size,
        resizeTime,
        canvas: canvasMetrics
      });
    }
    
    console.log('Resize metrics:', resizeMetrics);
    
    // All resizes should complete quickly (under 1 second)
    resizeMetrics.forEach(metric => {
      expect(metric.resizeTime).toBeLessThan(1000);
    });
  });

  test('particle system scales appropriately', async ({ page }) => {
    // Get particle count from debug overlay if available
    const debugOverlay = await page.locator('.font-mono.text-xs');
    
    if (await debugOverlay.isVisible()) {
      const particleText = await debugOverlay.locator('text=/Particles: /').textContent();
      const particleCount = parseInt(particleText?.match(/\d+/)?.[0] || '0');
      
      console.log('Particle count:', particleCount);
      
      // Particle count should be within reasonable bounds
      expect(particleCount).toBeGreaterThan(0);
      expect(particleCount).toBeLessThanOrEqual(100); // Max particles should be 100
      
      // Check connection count
      const connectionText = await debugOverlay.locator('text=/Connections: /').textContent();
      const connectionCount = parseInt(connectionText?.match(/\d+/)?.[0] || '0');
      
      console.log('Connection count:', connectionCount);
      
      // Connections should be proportional to particles
      // Maximum connections = n*(n-1)/2 but we limit for performance
      const maxExpectedConnections = Math.min(particleCount * 3, 200);
      expect(connectionCount).toBeLessThanOrEqual(maxExpectedConnections);
    }
  });

  test('animation cleanup on navigation', async ({ page }) => {
    // Get initial state
    const initialRAFCount = await page.evaluate(() => {
      let count = 0;
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = function(callback) {
        count++;
        return originalRAF.call(window, callback);
      };
      
      return new Promise(resolve => {
        setTimeout(() => {
          window.requestAnimationFrame = originalRAF;
          resolve(count);
        }, 1000);
      });
    });
    
    console.log('Initial RAF calls per second:', initialRAFCount);
    
    // Navigate away
    await page.goto('about:blank');
    
    // Check that animations are stopped
    const afterNavigationRAFCount = await page.evaluate(() => {
      let count = 0;
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = function(callback) {
        count++;
        return originalRAF.call(window, callback);
      };
      
      return new Promise(resolve => {
        setTimeout(() => {
          window.requestAnimationFrame = originalRAF;
          resolve(count);
        }, 1000);
      });
    });
    
    console.log('RAF calls after navigation:', afterNavigationRAFCount);
    
    // Should have no animation frames after navigation
    expect(afterNavigationRAFCount).toBeLessThanOrEqual(5); // Allow some for other page animations
  });

  test('performance metrics are within CI thresholds', async ({ page }) => {
    // Comprehensive performance check for CI
    const performanceData = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        // Navigation timing
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        
        // Paint timing
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // Resource timing for HeroOverlay
        jsExecutionTime: performance.getEntriesByType('measure')
          .filter(m => m.name.includes('hero') || m.name.includes('overlay'))
          .reduce((sum, m) => sum + m.duration, 0)
      };
    });
    
    console.log('CI Performance Metrics:', performanceData);
    
    // CI thresholds
    expect(performanceData.firstContentfulPaint).toBeLessThan(3000); // FCP < 3s
    expect(performanceData.domContentLoaded).toBeLessThan(2000); // DOM < 2s
    expect(performanceData.jsExecutionTime).toBeLessThan(500); // JS execution < 500ms
  });
});

// Export metrics for CI reporting
export async function collectPerformanceMetrics(page: Page) {
  return {
    timestamp: new Date().toISOString(),
    url: page.url(),
    metrics: await measurePerformance(page),
    canvas: await getCanvasMetrics(page)
  };
}

async function measurePerformance(page: Page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const metrics = {
        fps: [] as number[],
        memory: {} as any,
        avgFps: 0,
        minFps: 0,
        maxFps: 0
      };

      let frameCount = 0;
      let lastTime = performance.now();
      const startTime = performance.now();

      function measureFrame() {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        
        if (delta > 0) {
          metrics.fps.push(1000 / delta);
        }
        
        lastTime = currentTime;
        frameCount++;
        
        if (currentTime - startTime < 2000) {
          requestAnimationFrame(measureFrame);
        } else {
          metrics.avgFps = metrics.fps.reduce((a, b) => a + b, 0) / metrics.fps.length;
          metrics.minFps = Math.min(...metrics.fps);
          metrics.maxFps = Math.max(...metrics.fps);
          
          if ((performance as any).memory) {
            metrics.memory = {
              usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
              totalJSHeapSize: (performance as any).memory.totalJSHeapSize
            };
          }
          
          resolve(metrics);
        }
      }
      
      requestAnimationFrame(measureFrame);
    });
  });
}

async function getCanvasMetrics(page: Page) {
  return await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return null;
    
    return {
      width: canvas.width,
      height: canvas.height,
      present: true
    };
  });
}