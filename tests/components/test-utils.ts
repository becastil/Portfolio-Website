import { Page } from '@playwright/test';

/**
 * Test utilities for HeroOverlay component testing
 */

/**
 * Wait for the HeroOverlay canvas to be fully initialized
 */
export async function waitForHeroOverlayInit(page: Page, timeout = 5000) {
  await page.waitForFunction(
    () => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      
      // Check if canvas has been sized
      if (canvas.width === 0 || canvas.height === 0) return false;
      
      // Check if context is available
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      
      return true;
    },
    { timeout }
  );
}

/**
 * Get performance metrics from the HeroOverlay debug panel
 */
export async function getHeroOverlayMetrics(page: Page) {
  return await page.evaluate(() => {
    const debugPanel = document.querySelector('.font-mono.text-xs');
    if (!debugPanel) return null;
    
    const text = debugPanel.textContent || '';
    
    // Parse metrics from debug text
    const metrics: any = {};
    
    // FPS
    const fpsMatch = text.match(/FPS:\s*(\d+)/);
    if (fpsMatch) metrics.fps = parseInt(fpsMatch[1]);
    
    // Average FPS
    const avgFpsMatch = text.match(/avg:\s*(\d+)/);
    if (avgFpsMatch) metrics.avgFps = parseInt(avgFpsMatch[1]);
    
    // Particle count
    const particlesMatch = text.match(/Particles:\s*(\d+)/);
    if (particlesMatch) metrics.particleCount = parseInt(particlesMatch[1]);
    
    // Connection count
    const connectionsMatch = text.match(/Connections:\s*(\d+)/);
    if (connectionsMatch) metrics.connectionCount = parseInt(connectionsMatch[1]);
    
    // Performance mode
    const modeMatch = text.match(/Mode:\s*(\w+)/);
    if (modeMatch) metrics.mode = modeMatch[1];
    
    // Intensity
    const intensityMatch = text.match(/Intensity:\s*(\w+)/);
    if (intensityMatch) metrics.intensity = intensityMatch[1];
    
    // GPU Tier
    const gpuMatch = text.match(/GPU Tier:\s*(\d+)\/3/);
    if (gpuMatch) metrics.gpuTier = parseInt(gpuMatch[1]);
    
    // CPU Cores
    const cpuMatch = text.match(/CPU Cores:\s*(\d+)/);
    if (cpuMatch) metrics.cpuCores = parseInt(cpuMatch[1]);
    
    // Pixel Ratio
    const pixelRatioMatch = text.match(/Pixel Ratio:\s*([\d.]+)/);
    if (pixelRatioMatch) metrics.pixelRatio = parseFloat(pixelRatioMatch[1]);
    
    // Touch support
    const touchMatch = text.match(/Touch:\s*(Yes|No)/);
    if (touchMatch) metrics.hasTouch = touchMatch[1] === 'Yes';
    
    return metrics;
  });
}

/**
 * Get feature toggle states from debug panel
 */
export async function getHeroOverlayFeatures(page: Page) {
  return await page.evaluate(() => {
    const debugPanel = document.querySelector('.font-mono.text-xs');
    if (!debugPanel) return null;
    
    const text = debugPanel.textContent || '';
    const featuresSection = text.split('Features:')[1];
    if (!featuresSection) return null;
    
    const features: Record<string, boolean> = {};
    
    // Parse each feature line
    const featureLines = featuresSection.split('\n').filter(line => line.includes(':'));
    
    featureLines.forEach(line => {
      const match = line.match(/(\w+):\s*(✓|✗)/);
      if (match) {
        features[match[1]] = match[2] === '✓';
      }
    });
    
    return features;
  });
}

/**
 * Simulate mouse interaction with the HeroOverlay
 */
export async function simulateMouseInteraction(
  page: Page,
  pattern: 'circle' | 'zigzag' | 'random' = 'circle'
) {
  const viewport = page.viewportSize();
  if (!viewport) return;
  
  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2;
  const radius = Math.min(viewport.width, viewport.height) / 4;
  
  switch (pattern) {
    case 'circle':
      // Move mouse in a circle
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        await page.mouse.move(x, y);
        await page.waitForTimeout(50);
      }
      break;
      
    case 'zigzag':
      // Move mouse in a zigzag pattern
      for (let i = 0; i < 5; i++) {
        await page.mouse.move(viewport.width * 0.2, viewport.height * (0.2 + i * 0.15));
        await page.mouse.move(viewport.width * 0.8, viewport.height * (0.3 + i * 0.15));
      }
      break;
      
    case 'random':
      // Random mouse movements
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * viewport.width;
        const y = Math.random() * viewport.height;
        await page.mouse.move(x, y);
        await page.waitForTimeout(100);
      }
      break;
  }
}

/**
 * Take a canvas snapshot for comparison
 */
export async function getCanvasSnapshot(page: Page, sampleSize = 100) {
  return await page.evaluate((size) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Get a sample of the canvas data
    const imageData = ctx.getImageData(0, 0, size, size);
    
    // Convert to a simpler format for comparison
    const snapshot = {
      width: size,
      height: size,
      // Sample every 10th pixel to reduce data size
      pixels: [] as number[]
    };
    
    for (let i = 0; i < imageData.data.length; i += 40) { // Every 10th pixel (4 bytes per pixel)
      snapshot.pixels.push(
        imageData.data[i],     // R
        imageData.data[i + 1], // G
        imageData.data[i + 2], // B
        imageData.data[i + 3]  // A
      );
    }
    
    return snapshot;
  }, sampleSize);
}

/**
 * Check if animations are running
 */
export async function isAnimating(page: Page, duration = 1000) {
  const snapshot1 = await getCanvasSnapshot(page);
  await page.waitForTimeout(duration);
  const snapshot2 = await getCanvasSnapshot(page);
  
  if (!snapshot1 || !snapshot2) return false;
  
  // Compare snapshots - if they're different, animation is running
  return JSON.stringify(snapshot1.pixels) !== JSON.stringify(snapshot2.pixels);
}

/**
 * Measure animation frame rate
 */
export async function measureFrameRate(page: Page, duration = 2000) {
  return await page.evaluate((measureDuration) => {
    return new Promise((resolve) => {
      const frames: number[] = [];
      let lastTime = performance.now();
      let startTime = lastTime;
      
      function measure() {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        
        if (delta > 0) {
          frames.push(1000 / delta); // Convert to FPS
        }
        
        lastTime = currentTime;
        
        if (currentTime - startTime < measureDuration) {
          requestAnimationFrame(measure);
        } else {
          // Calculate statistics
          const avgFps = frames.reduce((a, b) => a + b, 0) / frames.length;
          const minFps = Math.min(...frames);
          const maxFps = Math.max(...frames);
          
          // Calculate frame drops (frames taking longer than 16.67ms)
          const droppedFrames = frames.filter(fps => fps < 60).length;
          
          resolve({
            avgFps: Math.round(avgFps),
            minFps: Math.round(minFps),
            maxFps: Math.round(maxFps),
            droppedFrames,
            totalFrames: frames.length,
            dropRate: droppedFrames / frames.length
          });
        }
      }
      
      requestAnimationFrame(measure);
    });
  }, duration);
}

/**
 * Check if HeroOverlay respects reduced motion preference
 */
export async function checkReducedMotionSupport(page: Page) {
  // Enable reduced motion
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForTimeout(500);
  
  // Check if animations are disabled
  const animating = await isAnimating(page, 500);
  
  // Reset to no preference
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  
  return !animating; // Should not be animating with reduced motion
}

/**
 * Simulate performance degradation
 */
export async function simulateSlowPerformance(page: Page) {
  await page.evaluate(() => {
    // Add heavy computation to slow down the page
    const slowDown = () => {
      const start = Date.now();
      while (Date.now() - start < 50) {
        // Busy loop to consume CPU
        Math.sqrt(Math.random());
      }
      requestAnimationFrame(slowDown);
    };
    
    requestAnimationFrame(slowDown);
    
    // Store reference to stop later
    (window as any).__stopSlowdown = () => {
      // Would need to implement a way to stop the slowdown
    };
  });
}

/**
 * Get canvas memory usage estimate
 */
export async function getCanvasMemoryUsage(page: Page) {
  return await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 0;
    
    // Estimate memory usage (width * height * 4 bytes per pixel * pixel ratio)
    const pixelRatio = window.devicePixelRatio || 1;
    const memoryBytes = canvas.width * canvas.height * 4;
    const memoryMB = memoryBytes / 1024 / 1024;
    
    return {
      bytes: memoryBytes,
      megabytes: memoryMB,
      dimensions: {
        width: canvas.width,
        height: canvas.height,
        displayWidth: canvas.clientWidth,
        displayHeight: canvas.clientHeight
      },
      pixelRatio
    };
  });
}

/**
 * Test particle system boundaries
 */
export async function testParticleBoundaries(page: Page, duration = 3000) {
  return await page.evaluate((testDuration) => {
    return new Promise((resolve) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        resolve({ success: false, error: 'No canvas found' });
        return;
      }
      
      let errorOccurred = false;
      const originalError = window.onerror;
      
      window.onerror = (msg, source, lineno, colno, error) => {
        errorOccurred = true;
        if (originalError) {
          return originalError(msg, source, lineno, colno, error);
        }
        return true;
      };
      
      setTimeout(() => {
        window.onerror = originalError;
        resolve({
          success: !errorOccurred,
          canvasStillVisible: canvas.offsetParent !== null,
          canvasHasContent: canvas.width > 0 && canvas.height > 0
        });
      }, testDuration);
    });
  }, duration);
}

/**
 * Verify accessibility attributes
 */
export async function verifyAccessibility(page: Page) {
  return await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { hasCanvas: false };
    
    return {
      hasCanvas: true,
      ariaLabel: canvas.getAttribute('aria-label'),
      role: canvas.getAttribute('role'),
      tabIndex: canvas.getAttribute('tabindex'),
      isInert: canvas.hasAttribute('inert'),
      parentPointerEvents: window.getComputedStyle(canvas.parentElement!).pointerEvents
    };
  });
}