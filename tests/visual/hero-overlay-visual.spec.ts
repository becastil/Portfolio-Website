/**
 * @fileoverview Visual Regression Tests for HeroOverlay Component
 * 
 * Comprehensive visual testing suite that captures and validates the appearance
 * of the HeroOverlay component across different states, modes, and configurations.
 * 
 * @module tests/visual/hero-overlay-visual
 * @requires @playwright/test
 */

import { test, expect, Page } from '@playwright/test';
import { PerformanceMode, AnimationIntensity, DebugPosition } from '../../components/HeroOverlay';

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

/**
 * Visual test configuration
 */
const VISUAL_CONFIG = {
  /** Screenshot options for consistency */
  screenshotOptions: {
    fullPage: false,
    animations: 'disabled' as const,
    mask: [], // Elements to mask if needed
    maxDiffPixels: 100,
    threshold: 0.2, // 20% threshold for pixel differences
  },
  
  /** Wait times for various states */
  waitTimes: {
    animationSettle: 2000,
    particleInit: 1000,
    interactionDelay: 500,
    reducedMotionDelay: 100,
  },
  
  /** Test viewports */
  viewports: {
    desktop: { width: 1920, height: 1080 },
    laptop: { width: 1440, height: 900 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 812 },
    ultrawide: { width: 3440, height: 1440 },
  },
  
  /** Test configurations */
  testConfigs: {
    performanceModes: [
      PerformanceMode.HIGH,
      PerformanceMode.BALANCED,
      PerformanceMode.LOW,
    ],
    intensities: [
      AnimationIntensity.SUBTLE,
      AnimationIntensity.NORMAL,
      AnimationIntensity.DRAMATIC,
    ],
    debugPositions: [
      DebugPosition.TOP_LEFT,
      DebugPosition.TOP_RIGHT,
      DebugPosition.BOTTOM_LEFT,
      DebugPosition.BOTTOM_RIGHT,
    ],
  },
};

// ============================================================================
// TEST HELPERS
// ============================================================================

/**
 * Sets up the test page with HeroOverlay component
 */
async function setupHeroOverlay(
  page: Page,
  config?: {
    performanceMode?: PerformanceMode;
    intensity?: AnimationIntensity;
    debug?: boolean;
    debugPosition?: DebugPosition;
    reducedMotion?: boolean;
  }
): Promise<void> {
  // Set reduced motion preference if specified
  if (config?.reducedMotion) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  }
  
  // Navigate to test page with query parameters for configuration
  const params = new URLSearchParams();
  if (config?.performanceMode) params.set('performanceMode', config.performanceMode);
  if (config?.intensity) params.set('intensity', config.intensity);
  if (config?.debug !== undefined) params.set('debug', String(config.debug));
  if (config?.debugPosition) params.set('debugPosition', config.debugPosition);
  
  const url = params.toString() ? `/test-hero-overlay?${params.toString()}` : '/test-hero-overlay';
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Wait for canvas to be ready
  await page.waitForSelector('canvas', { state: 'visible' });
  
  // Wait for particles to initialize
  await page.waitForTimeout(VISUAL_CONFIG.waitTimes.particleInit);
}

/**
 * Captures a screenshot with consistent settings
 */
async function captureScreenshot(
  page: Page,
  name: string,
  options?: Partial<typeof VISUAL_CONFIG.screenshotOptions>
): Promise<Buffer> {
  // Ensure animations have settled
  await page.waitForTimeout(VISUAL_CONFIG.waitTimes.animationSettle);
  
  // Capture screenshot
  return await page.screenshot({
    ...VISUAL_CONFIG.screenshotOptions,
    ...options,
  });
}

/**
 * Simulates mouse interaction at specific coordinates
 */
async function simulateMouseInteraction(
  page: Page,
  x: number,
  y: number,
  duration: number = 1000
): Promise<void> {
  await page.mouse.move(x, y, { steps: 10 });
  await page.waitForTimeout(duration);
}

// ============================================================================
// VISUAL REGRESSION TESTS
// ============================================================================

test.describe('HeroOverlay Visual Regression Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  // ==========================================================================
  // Performance Mode Tests
  // ==========================================================================
  
  test.describe('Performance Modes', () => {
    for (const mode of VISUAL_CONFIG.testConfigs.performanceModes) {
      test(`Performance Mode: ${mode}`, async ({ page }) => {
        await setupHeroOverlay(page, { performanceMode: mode });
        
        const screenshot = await captureScreenshot(page, `performance-${mode.toLowerCase()}`);
        
        // Compare with baseline
        expect(screenshot).toMatchSnapshot(`hero-overlay-performance-${mode.toLowerCase()}.png`);
        
        // Verify performance indicators
        const performanceMetrics = await page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          return {
            canvasPresent: !!canvas,
            canvasWidth: canvas?.width || 0,
            canvasHeight: canvas?.height || 0,
          };
        });
        
        expect(performanceMetrics.canvasPresent).toBe(true);
        expect(performanceMetrics.canvasWidth).toBeGreaterThan(0);
        expect(performanceMetrics.canvasHeight).toBeGreaterThan(0);
      });
    }
    
    test('Performance Mode Transitions', async ({ page }) => {
      // Start with HIGH mode
      await setupHeroOverlay(page, { performanceMode: PerformanceMode.HIGH });
      const highModeScreenshot = await captureScreenshot(page, 'transition-high');
      
      // Transition to BALANCED
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('performanceModeChange', { 
          detail: { mode: 'BALANCED' } 
        }));
      });
      await page.waitForTimeout(1000);
      const balancedModeScreenshot = await captureScreenshot(page, 'transition-balanced');
      
      // Transition to LOW
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('performanceModeChange', { 
          detail: { mode: 'LOW' } 
        }));
      });
      await page.waitForTimeout(1000);
      const lowModeScreenshot = await captureScreenshot(page, 'transition-low');
      
      // Verify screenshots are different
      expect(highModeScreenshot).not.toEqual(balancedModeScreenshot);
      expect(balancedModeScreenshot).not.toEqual(lowModeScreenshot);
    });
  });

  // ==========================================================================
  // Animation Intensity Tests
  // ==========================================================================
  
  test.describe('Animation Intensities', () => {
    for (const intensity of VISUAL_CONFIG.testConfigs.intensities) {
      test(`Animation Intensity: ${intensity}`, async ({ page }) => {
        await setupHeroOverlay(page, { intensity });
        
        // Capture initial state
        const initialScreenshot = await captureScreenshot(
          page,
          `intensity-${intensity.toLowerCase()}-initial`
        );
        expect(initialScreenshot).toMatchSnapshot(
          `hero-overlay-intensity-${intensity.toLowerCase()}-initial.png`
        );
        
        // Wait and capture after animation
        await page.waitForTimeout(3000);
        const animatedScreenshot = await captureScreenshot(
          page,
          `intensity-${intensity.toLowerCase()}-animated`
        );
        expect(animatedScreenshot).toMatchSnapshot(
          `hero-overlay-intensity-${intensity.toLowerCase()}-animated.png`
        );
        
        // Verify particles are moving (screenshots should differ)
        expect(initialScreenshot).not.toEqual(animatedScreenshot);
      });
    }
    
    test('Intensity with Mouse Interaction', async ({ page }) => {
      for (const intensity of VISUAL_CONFIG.testConfigs.intensities) {
        await setupHeroOverlay(page, { intensity });
        
        // Move mouse to center of viewport
        const viewport = page.viewportSize();
        if (viewport) {
          await simulateMouseInteraction(
            page,
            viewport.width / 2,
            viewport.height / 2,
            1500
          );
          
          const screenshot = await captureScreenshot(
            page,
            `intensity-${intensity.toLowerCase()}-interaction`
          );
          expect(screenshot).toMatchSnapshot(
            `hero-overlay-intensity-${intensity.toLowerCase()}-interaction.png`
          );
        }
      }
    });
  });

  // ==========================================================================
  // Viewport Tests
  // ==========================================================================
  
  test.describe('Responsive Viewports', () => {
    for (const [name, viewport] of Object.entries(VISUAL_CONFIG.viewports)) {
      test(`Viewport: ${name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        // Set viewport
        await page.setViewportSize(viewport);
        
        // Setup overlay
        await setupHeroOverlay(page, { 
          performanceMode: PerformanceMode.BALANCED 
        });
        
        // Capture screenshot
        const screenshot = await captureScreenshot(page, `viewport-${name}`);
        expect(screenshot).toMatchSnapshot(`hero-overlay-viewport-${name}.png`);
        
        // Verify canvas adapts to viewport
        const canvasSize = await page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          return {
            width: canvas?.width || 0,
            height: canvas?.height || 0,
            clientWidth: canvas?.clientWidth || 0,
            clientHeight: canvas?.clientHeight || 0,
          };
        });
        
        // Canvas should match viewport dimensions
        expect(canvasSize.clientWidth).toBe(viewport.width);
        expect(canvasSize.clientHeight).toBeGreaterThan(0);
      });
    }
    
    test('Viewport Resize Handling', async ({ page }) => {
      // Start with desktop viewport
      await page.setViewportSize(VISUAL_CONFIG.viewports.desktop);
      await setupHeroOverlay(page);
      
      const desktopScreenshot = await captureScreenshot(page, 'resize-desktop');
      
      // Resize to tablet
      await page.setViewportSize(VISUAL_CONFIG.viewports.tablet);
      await page.waitForTimeout(1000);
      
      const tabletScreenshot = await captureScreenshot(page, 'resize-tablet');
      
      // Resize to mobile
      await page.setViewportSize(VISUAL_CONFIG.viewports.mobile);
      await page.waitForTimeout(1000);
      
      const mobileScreenshot = await captureScreenshot(page, 'resize-mobile');
      
      // All screenshots should be different
      expect(desktopScreenshot).not.toEqual(tabletScreenshot);
      expect(tabletScreenshot).not.toEqual(mobileScreenshot);
    });
  });

  // ==========================================================================
  // Accessibility Tests
  // ==========================================================================
  
  test.describe('Accessibility Features', () => {
    test('Reduced Motion Preference', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await setupHeroOverlay(page);
      
      // Capture initial state
      const initialScreenshot = await captureScreenshot(page, 'reduced-motion-initial');
      
      // Wait for what would normally be animation time
      await page.waitForTimeout(3000);
      
      // Capture after wait
      const afterWaitScreenshot = await captureScreenshot(page, 'reduced-motion-after');
      
      // With reduced motion, screenshots should be nearly identical
      expect(initialScreenshot).toMatchSnapshot('hero-overlay-reduced-motion-initial.png');
      expect(afterWaitScreenshot).toMatchSnapshot('hero-overlay-reduced-motion-after.png');
      
      // Verify aria attributes
      const ariaAttributes = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        return {
          ariaHidden: canvas?.getAttribute('aria-hidden'),
          role: canvas?.getAttribute('role'),
        };
      });
      
      expect(ariaAttributes.ariaHidden).toBe('true');
      expect(ariaAttributes.role).toBe('presentation');
    });
    
    test('High Contrast Mode', async ({ page }) => {
      // Emulate high contrast mode
      await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
      await setupHeroOverlay(page);
      
      const screenshot = await captureScreenshot(page, 'high-contrast');
      expect(screenshot).toMatchSnapshot('hero-overlay-high-contrast.png');
    });
    
    test('Keyboard Navigation (No Visual Impact)', async ({ page }) => {
      await setupHeroOverlay(page);
      
      // Press Tab to ensure canvas doesn't receive focus
      await page.keyboard.press('Tab');
      await page.waitForTimeout(500);
      
      const screenshot = await captureScreenshot(page, 'keyboard-navigation');
      expect(screenshot).toMatchSnapshot('hero-overlay-keyboard-navigation.png');
      
      // Verify canvas is not focusable
      const canvasFocusable = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        return canvas?.tabIndex;
      });
      
      expect(canvasFocusable).toBe(-1);
    });
  });

  // ==========================================================================
  // Debug Overlay Tests
  // ==========================================================================
  
  test.describe('Debug Overlay', () => {
    for (const position of VISUAL_CONFIG.testConfigs.debugPositions) {
      test(`Debug Position: ${position}`, async ({ page }) => {
        await setupHeroOverlay(page, { 
          debug: true, 
          debugPosition: position,
          performanceMode: PerformanceMode.HIGH 
        });
        
        // Wait for debug panel to render
        await page.waitForSelector('[data-testid="debug-overlay"]', { state: 'visible' });
        
        const screenshot = await captureScreenshot(page, `debug-${position.toLowerCase()}`);
        expect(screenshot).toMatchSnapshot(`hero-overlay-debug-${position.toLowerCase()}.png`);
        
        // Verify debug panel position
        const debugPosition = await page.evaluate(() => {
          const debug = document.querySelector('[data-testid="debug-overlay"]');
          if (!debug) return null;
          const rect = debug.getBoundingClientRect();
          return {
            top: rect.top,
            left: rect.left,
            right: window.innerWidth - rect.right,
            bottom: window.innerHeight - rect.bottom,
          };
        });
        
        expect(debugPosition).not.toBeNull();
        
        // Verify position based on configuration
        switch (position) {
          case DebugPosition.TOP_LEFT:
            expect(debugPosition!.top).toBeLessThan(100);
            expect(debugPosition!.left).toBeLessThan(100);
            break;
          case DebugPosition.TOP_RIGHT:
            expect(debugPosition!.top).toBeLessThan(100);
            expect(debugPosition!.right).toBeLessThan(100);
            break;
          case DebugPosition.BOTTOM_LEFT:
            expect(debugPosition!.bottom).toBeLessThan(100);
            expect(debugPosition!.left).toBeLessThan(100);
            break;
          case DebugPosition.BOTTOM_RIGHT:
            expect(debugPosition!.bottom).toBeLessThan(100);
            expect(debugPosition!.right).toBeLessThan(100);
            break;
        }
      });
    }
    
    test('Debug Overlay Content Updates', async ({ page }) => {
      await setupHeroOverlay(page, { 
        debug: true,
        performanceMode: PerformanceMode.HIGH 
      });
      
      // Wait for debug panel
      await page.waitForSelector('[data-testid="debug-overlay"]');
      
      // Capture initial debug state
      const initialScreenshot = await captureScreenshot(page, 'debug-content-initial');
      
      // Trigger particle movement
      const viewport = page.viewportSize();
      if (viewport) {
        await simulateMouseInteraction(
          page,
          viewport.width / 2,
          viewport.height / 2,
          2000
        );
      }
      
      // Capture updated debug state
      const updatedScreenshot = await captureScreenshot(page, 'debug-content-updated');
      
      // Debug content should have changed
      expect(initialScreenshot).not.toEqual(updatedScreenshot);
      expect(updatedScreenshot).toMatchSnapshot('hero-overlay-debug-content-updated.png');
    });
  });

  // ==========================================================================
  // Error States and Fallbacks
  // ==========================================================================
  
  test.describe('Error States and Fallbacks', () => {
    test('Canvas Not Supported Fallback', async ({ page }) => {
      // Disable canvas support
      await page.addInitScript(() => {
        // @ts-ignore
        HTMLCanvasElement.prototype.getContext = null;
      });
      
      await page.goto('/test-hero-overlay', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      const screenshot = await captureScreenshot(page, 'canvas-not-supported');
      expect(screenshot).toMatchSnapshot('hero-overlay-canvas-not-supported.png');
      
      // Verify fallback is rendered
      const fallbackExists = await page.evaluate(() => {
        return document.querySelector('[data-testid="hero-overlay-fallback"]') !== null;
      });
      
      expect(fallbackExists).toBe(true);
    });
    
    test('WebGL Not Available', async ({ page }) => {
      // Disable WebGL
      await page.addInitScript(() => {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        // @ts-ignore
        HTMLCanvasElement.prototype.getContext = function(type: string) {
          if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
            return null;
          }
          return originalGetContext.call(this, type);
        };
      });
      
      await setupHeroOverlay(page, { performanceMode: PerformanceMode.HIGH });
      
      const screenshot = await captureScreenshot(page, 'webgl-fallback');
      expect(screenshot).toMatchSnapshot('hero-overlay-webgl-fallback.png');
    });
    
    test('Memory Constraint Handling', async ({ page }) => {
      // Simulate memory pressure
      await page.addInitScript(() => {
        // @ts-ignore
        if (window.performance && window.performance.memory) {
          Object.defineProperty(window.performance.memory, 'usedJSHeapSize', {
            get: () => 1000000000, // 1GB
          });
          Object.defineProperty(window.performance.memory, 'jsHeapSizeLimit', {
            get: () => 1073741824, // 1GB limit
          });
        }
      });
      
      await setupHeroOverlay(page, { performanceMode: PerformanceMode.HIGH });
      
      const screenshot = await captureScreenshot(page, 'memory-constraint');
      expect(screenshot).toMatchSnapshot('hero-overlay-memory-constraint.png');
    });
    
    test('Error Boundary Activation', async ({ page }) => {
      await setupHeroOverlay(page);
      
      // Trigger an error in the component
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('heroOverlayError', { 
          detail: { error: 'Test error' } 
        }));
      });
      
      await page.waitForTimeout(1000);
      
      const screenshot = await captureScreenshot(page, 'error-boundary');
      expect(screenshot).toMatchSnapshot('hero-overlay-error-boundary.png');
      
      // Verify error UI is shown
      const errorUIExists = await page.evaluate(() => {
        return document.querySelector('[data-testid="hero-overlay-error"]') !== null;
      });
      
      expect(errorUIExists).toBe(true);
    });
  });

  // ==========================================================================
  // Interaction States
  // ==========================================================================
  
  test.describe('Interaction States', () => {
    test('Mouse Hover Effects', async ({ page }) => {
      await setupHeroOverlay(page, { 
        intensity: AnimationIntensity.DRAMATIC 
      });
      
      const viewport = page.viewportSize();
      if (!viewport) return;
      
      // Test multiple hover positions
      const positions = [
        { x: viewport.width * 0.25, y: viewport.height * 0.25, name: 'top-left' },
        { x: viewport.width * 0.75, y: viewport.height * 0.25, name: 'top-right' },
        { x: viewport.width * 0.5, y: viewport.height * 0.5, name: 'center' },
        { x: viewport.width * 0.25, y: viewport.height * 0.75, name: 'bottom-left' },
        { x: viewport.width * 0.75, y: viewport.height * 0.75, name: 'bottom-right' },
      ];
      
      for (const pos of positions) {
        await simulateMouseInteraction(page, pos.x, pos.y, 1000);
        const screenshot = await captureScreenshot(page, `hover-${pos.name}`);
        expect(screenshot).toMatchSnapshot(`hero-overlay-hover-${pos.name}.png`);
      }
    });
    
    test('Mouse Trail Effect', async ({ page }) => {
      await setupHeroOverlay(page, { 
        intensity: AnimationIntensity.DRAMATIC,
        performanceMode: PerformanceMode.HIGH 
      });
      
      const viewport = page.viewportSize();
      if (!viewport) return;
      
      // Create a circular mouse movement
      const centerX = viewport.width / 2;
      const centerY = viewport.height / 2;
      const radius = Math.min(viewport.width, viewport.height) * 0.3;
      
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        await page.mouse.move(x, y, { steps: 5 });
        await page.waitForTimeout(100);
      }
      
      const screenshot = await captureScreenshot(page, 'mouse-trail');
      expect(screenshot).toMatchSnapshot('hero-overlay-mouse-trail.png');
    });
    
    test('Touch Interaction Simulation', async ({ page }) => {
      // Emulate touch device
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'maxTouchPoints', {
          get: () => 1,
        });
      });
      
      await setupHeroOverlay(page);
      
      const viewport = page.viewportSize();
      if (!viewport) return;
      
      // Simulate touch
      await page.touchscreen.tap(viewport.width / 2, viewport.height / 2);
      await page.waitForTimeout(1000);
      
      const screenshot = await captureScreenshot(page, 'touch-interaction');
      expect(screenshot).toMatchSnapshot('hero-overlay-touch-interaction.png');
    });
  });

  // ==========================================================================
  // Theme Integration
  // ==========================================================================
  
  test.describe('Theme Integration', () => {
    test('Light Theme', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await setupHeroOverlay(page);
      
      const screenshot = await captureScreenshot(page, 'theme-light');
      expect(screenshot).toMatchSnapshot('hero-overlay-theme-light.png');
    });
    
    test('Dark Theme', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await setupHeroOverlay(page);
      
      const screenshot = await captureScreenshot(page, 'theme-dark');
      expect(screenshot).toMatchSnapshot('hero-overlay-theme-dark.png');
    });
    
    test('Theme Transition', async ({ page }) => {
      // Start with light theme
      await page.emulateMedia({ colorScheme: 'light' });
      await setupHeroOverlay(page);
      
      const lightScreenshot = await captureScreenshot(page, 'theme-transition-light');
      
      // Switch to dark theme
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.waitForTimeout(1000);
      
      const darkScreenshot = await captureScreenshot(page, 'theme-transition-dark');
      
      // Screenshots should be different
      expect(lightScreenshot).not.toEqual(darkScreenshot);
      expect(darkScreenshot).toMatchSnapshot('hero-overlay-theme-transition-dark.png');
    });
  });

  // ==========================================================================
  // Performance Monitoring
  // ==========================================================================
  
  test.describe('Performance Visual Indicators', () => {
    test('FPS Counter Display', async ({ page }) => {
      await setupHeroOverlay(page, { 
        debug: true,
        performanceMode: PerformanceMode.HIGH 
      });
      
      // Wait for FPS counter to stabilize
      await page.waitForTimeout(3000);
      
      const screenshot = await captureScreenshot(page, 'fps-counter');
      expect(screenshot).toMatchSnapshot('hero-overlay-fps-counter.png');
      
      // Verify FPS is displayed
      const fpsText = await page.textContent('[data-testid="debug-fps"]');
      expect(fpsText).toMatch(/\d+(\.\d+)?\s*FPS/i);
    });
    
    test('Performance Degradation Indicator', async ({ page }) => {
      await setupHeroOverlay(page, { debug: true });
      
      // Simulate performance degradation
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('performanceDegradation', { 
          detail: { fps: 15 } 
        }));
      });
      
      await page.waitForTimeout(1000);
      
      const screenshot = await captureScreenshot(page, 'performance-degradation');
      expect(screenshot).toMatchSnapshot('hero-overlay-performance-degradation.png');
    });
  });

  // ==========================================================================
  // Combined States
  // ==========================================================================
  
  test.describe('Combined Visual States', () => {
    test('High Performance + Dramatic Intensity + Debug', async ({ page }) => {
      await setupHeroOverlay(page, {
        performanceMode: PerformanceMode.HIGH,
        intensity: AnimationIntensity.DRAMATIC,
        debug: true,
        debugPosition: DebugPosition.TOP_RIGHT,
      });
      
      const screenshot = await captureScreenshot(page, 'combined-high-dramatic-debug');
      expect(screenshot).toMatchSnapshot('hero-overlay-combined-high-dramatic-debug.png');
    });
    
    test('Low Performance + Subtle Intensity + Mobile', async ({ page }) => {
      await page.setViewportSize(VISUAL_CONFIG.viewports.mobile);
      await setupHeroOverlay(page, {
        performanceMode: PerformanceMode.LOW,
        intensity: AnimationIntensity.SUBTLE,
      });
      
      const screenshot = await captureScreenshot(page, 'combined-low-subtle-mobile');
      expect(screenshot).toMatchSnapshot('hero-overlay-combined-low-subtle-mobile.png');
    });
    
    test('Reduced Motion + High Contrast + Debug', async ({ page }) => {
      await page.emulateMedia({ 
        reducedMotion: 'reduce',
        forcedColors: 'active',
      });
      
      await setupHeroOverlay(page, {
        debug: true,
        debugPosition: DebugPosition.BOTTOM_LEFT,
      });
      
      const screenshot = await captureScreenshot(page, 'combined-accessibility');
      expect(screenshot).toMatchSnapshot('hero-overlay-combined-accessibility.png');
    });
  });
});

// ============================================================================
// VISUAL DIFF CONFIGURATION
// ============================================================================

/**
 * Custom matchers for visual regression
 */
test.beforeEach(async ({ page }, testInfo) => {
  // Add test metadata
  testInfo.annotations.push({
    type: 'visual-test',
    description: 'HeroOverlay visual regression test',
  });
  
  // Set up console error tracking
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`Console error in test "${testInfo.title}":`, msg.text());
    }
  });
  
  // Track uncaught exceptions
  page.on('pageerror', error => {
    console.error(`Page error in test "${testInfo.title}":`, error);
  });
});

test.afterEach(async ({ page }, testInfo) => {
  // Save additional artifacts on failure
  if (testInfo.status !== 'passed') {
    // Take a final screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('failure-screenshot', {
      body: screenshot,
      contentType: 'image/png',
    });
    
    // Save page HTML
    const html = await page.content();
    await testInfo.attach('failure-html', {
      body: html,
      contentType: 'text/html',
    });
    
    // Save console logs
    const logs = await page.evaluate(() => {
      return JSON.stringify(window.console.logs || [], null, 2);
    });
    await testInfo.attach('console-logs', {
      body: logs,
      contentType: 'application/json',
    });
  }
});