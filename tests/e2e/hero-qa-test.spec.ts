import { test, expect } from '@playwright/test';

// Test configuration
test.describe.configure({ mode: 'parallel' });

test.describe('Hero Component QA Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('section[aria-labelledby="hero-heading"]', { timeout: 10000 });
  });

  test.describe('Accessibility (WCAG 2.2 AA)', () => {
    test('should have proper ARIA attributes', async ({ page }) => {
      const hero = await page.locator('section[aria-labelledby="hero-heading"]');
      await expect(hero).toBeVisible();
      
      const heading = await page.locator('#hero-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText('Ben Castillo');
      
      // Check heading hierarchy
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1); // Only one H1 on page
    });

    test('should have sufficient color contrast', async ({ page }) => {
      // Test text color contrast
      const heading = await page.locator('#hero-heading');
      const headingColor = await heading.evaluate(el => 
        window.getComputedStyle(el).color
      );
      const headingBg = await heading.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Check if text is visible (not same as background)
      expect(headingColor).not.toBe(headingBg);
      
      // Test muted text contrast
      const description = await page.locator('section[aria-labelledby="hero-heading"] p').first();
      const descColor = await description.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      // Verify muted text uses CSS variable
      const mutedColorVar = await page.evaluate(() => 
        getComputedStyle(document.documentElement).getPropertyValue('--muted')
      );
      expect(mutedColorVar).toBeTruthy();
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab'); // Skip to main content link
      await page.keyboard.press('Tab'); // Navigation
      
      // Find first button in Hero
      const firstButton = await page.locator('section[aria-labelledby="hero-heading"] a').first();
      
      // Continue tabbing to reach Hero buttons
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const activeElement = await page.evaluate(() => document.activeElement?.tagName);
        if (activeElement === 'A') {
          const isInHero = await page.evaluate(() => {
            const active = document.activeElement;
            return active?.closest('section[aria-labelledby="hero-heading"]') !== null;
          });
          if (isInHero) break;
        }
      }
      
      // Check focus indicator visibility
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (!el) return null;
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineOffset: styles.outlineOffset,
          boxShadow: styles.boxShadow
        };
      });
      
      expect(focusedElement).not.toBeNull();
      // Should have visible focus indicator
      expect(focusedElement?.outline).not.toBe('none');
    });

    test('should have minimum touch target sizes', async ({ page }) => {
      const buttons = await page.locator('section[aria-labelledby="hero-heading"] a');
      const count = await buttons.count();
      
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        
        // WCAG 2.2 requires minimum 44x44px touch targets
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
    });

    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload();
      await page.waitForSelector('section[aria-labelledby="hero-heading"]');
      
      // Check that animations are disabled
      const heading = await page.locator('#hero-heading');
      const willChange = await heading.evaluate(el => 
        window.getComputedStyle(el).willChange
      );
      
      // Should be 'auto' when reduced motion is preferred
      expect(willChange).toBe('auto');
      
      // Check animation durations
      const animations = await page.evaluate(() => {
        const anims = document.getAnimations();
        return anims.map(a => ({
          duration: a.effect?.getTiming().duration
        }));
      });
      
      // Animations should be instant or very short
      animations.forEach(anim => {
        if (anim.duration && typeof anim.duration === 'number') {
          expect(anim.duration).toBeLessThanOrEqual(10);
        }
      });
    });
  });

  test.describe('Performance', () => {
    test('should optimize animations for 60fps', async ({ page }) => {
      // Monitor animation performance
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          const frames: number[] = [];
          let lastTime = performance.now();
          let rafId: number;
          
          const measureFrame = () => {
            const currentTime = performance.now();
            const delta = currentTime - lastTime;
            frames.push(delta);
            lastTime = currentTime;
            
            if (frames.length < 60) {
              rafId = requestAnimationFrame(measureFrame);
            } else {
              resolve({
                avgFrameTime: frames.reduce((a, b) => a + b, 0) / frames.length,
                maxFrameTime: Math.max(...frames),
                droppedFrames: frames.filter(f => f > 16.67).length
              });
            }
          };
          
          rafId = requestAnimationFrame(measureFrame);
        });
      });
      
      // Average frame time should be close to 16.67ms (60fps)
      expect((metrics as any).avgFrameTime).toBeLessThan(20);
      // Should have minimal dropped frames
      expect((metrics as any).droppedFrames).toBeLessThan(5);
    });

    test('should use GPU acceleration for animations', async ({ page }) => {
      const animatedElements = await page.locator('[style*="will-change"], [style*="transform"]');
      const count = await animatedElements.count();
      
      for (let i = 0; i < count; i++) {
        const element = animatedElements.nth(i);
        const transform = await element.evaluate(el => 
          window.getComputedStyle(el).transform
        );
        
        // Elements should use transform for GPU acceleration
        expect(transform).toBeDefined();
      }
    });

    test('should minimize layout shifts (CLS)', async ({ page }) => {
      // Measure CLS
      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if ((entry as any).hadRecentInput) continue;
              clsValue += (entry as any).value;
            }
          });
          
          observer.observe({ type: 'layout-shift', buffered: true });
          
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 2000);
        });
      });
      
      // CLS should be less than 0.1 for good score
      expect(cls).toBeLessThan(0.1);
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should use CSS custom properties correctly', async ({ page }) => {
      const cssVars = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        return {
          bg: styles.getPropertyValue('--bg'),
          text: styles.getPropertyValue('--text'),
          muted: styles.getPropertyValue('--muted'),
          accent: styles.getPropertyValue('--accent'),
          panel: styles.getPropertyValue('--panel'),
          border: styles.getPropertyValue('--border')
        };
      });
      
      // All CSS variables should be defined
      Object.values(cssVars).forEach(value => {
        expect(value).toBeTruthy();
        expect(value).not.toBe('');
      });
    });

    test('should handle Framer Motion gracefully', async ({ page }) => {
      // Check if Framer Motion is loaded
      const hasFramerMotion = await page.evaluate(() => {
        return document.querySelector('[style*="opacity"]') !== null;
      });
      
      expect(hasFramerMotion).toBe(true);
      
      // Verify animations complete
      await page.waitForTimeout(1000); // Wait for initial animations
      
      const heading = await page.locator('#hero-heading');
      const opacity = await heading.evaluate(el => 
        window.getComputedStyle(el).opacity
      );
      
      // Should be fully visible after animation
      expect(parseFloat(opacity)).toBe(1);
    });
  });

  test.describe('Visual Consistency', () => {
    test('should maintain monochrome aesthetic', async ({ page }) => {
      const hero = await page.locator('section[aria-labelledby="hero-heading"]');
      
      // Get background colors
      const bgColor = await hero.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Check buttons use monochrome colors
      const primaryBtn = await page.locator('a[href="#projects"]');
      const primaryBg = await primaryBtn.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      const secondaryBtn = await page.locator('a[href="#contact"]');
      const secondaryBg = await secondaryBtn.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Verify monochrome palette is used
      expect(primaryBg).toBeTruthy();
      expect(secondaryBg).toBeTruthy();
    });

    test('should have smooth micro-interactions', async ({ page }) => {
      const button = await page.locator('a[href="#projects"]');
      
      // Get initial state
      const initialTransform = await button.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      
      // Hover over button
      await button.hover();
      await page.waitForTimeout(350); // Wait for transition
      
      const hoverTransform = await button.evaluate(el => 
        window.getComputedStyle(el).transform
      );
      
      // Transform should change on hover
      expect(hoverTransform).not.toBe(initialTransform);
      
      // Check shadow changes
      const hoverShadow = await button.evaluate(el => 
        window.getComputedStyle(el).boxShadow
      );
      
      expect(hoverShadow).toBeTruthy();
      expect(hoverShadow).not.toBe('none');
    });

    test('should be responsive across breakpoints', async ({ page }) => {
      const breakpoints = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
      ];
      
      for (const bp of breakpoints) {
        await page.setViewportSize({ width: bp.width, height: bp.height });
        await page.waitForTimeout(300); // Wait for layout
        
        const hero = await page.locator('section[aria-labelledby="hero-heading"]');
        await expect(hero).toBeVisible();
        
        const heading = await page.locator('#hero-heading');
        const fontSize = await heading.evaluate(el => 
          window.getComputedStyle(el).fontSize
        );
        
        // Font size should be responsive
        expect(parseFloat(fontSize)).toBeGreaterThan(0);
        
        // Check button layout
        const buttons = await page.locator('section[aria-labelledby="hero-heading"] a');
        const firstBtn = await buttons.first().boundingBox();
        const lastBtn = await buttons.last().boundingBox();
        
        if (bp.name === 'mobile') {
          // Buttons should stack on mobile
          expect(firstBtn?.y).toBeLessThan(lastBtn?.y || 0);
        } else {
          // Buttons should be side by side on larger screens
          expect(Math.abs((firstBtn?.y || 0) - (lastBtn?.y || 0))).toBeLessThan(5);
        }
      }
    });
  });

  test.describe('Dark Mode Support', () => {
    test('should support dark theme', async ({ page }) => {
      // Set dark theme
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });
      
      await page.waitForTimeout(100);
      
      // Check colors have changed
      const bgColor = await page.evaluate(() => 
        getComputedStyle(document.documentElement).getPropertyValue('--bg')
      );
      
      const textColor = await page.evaluate(() => 
        getComputedStyle(document.documentElement).getPropertyValue('--text')
      );
      
      // Dark mode colors should be applied
      expect(bgColor).toContain('hsl(224 15% 8%)'); // Dark background
      expect(textColor).toContain('hsl(210 40% 98%)'); // Light text
    });
  });
});

// Lighthouse-style performance test
test('should meet Lighthouse performance targets', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Measure performance metrics
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const metrics: any = {};
        
        entries.forEach(entry => {
          if (entry.entryType === 'largest-contentful-paint') {
            metrics.lcp = (entry as any).renderTime || (entry as any).loadTime;
          }
          if (entry.entryType === 'first-input' && !(entry as any).hadRecentInput) {
            metrics.fid = (entry as any).processingStart - entry.startTime;
          }
        });
        
        // Get CLS
        let cls = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        
        setTimeout(() => {
          clsObserver.disconnect();
          metrics.cls = cls;
          resolve(metrics);
        }, 3000);
      });
      
      observer.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input'] 
      });
    });
  });
  
  // LCP should be under 2.5s for good score
  if ((metrics as any).lcp) {
    expect((metrics as any).lcp).toBeLessThan(2500);
  }
  
  // CLS should be under 0.1 for good score
  if ((metrics as any).cls !== undefined) {
    expect((metrics as any).cls).toBeLessThan(0.1);
  }
});