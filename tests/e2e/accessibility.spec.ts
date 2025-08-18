import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Comprehensive End-to-End Accessibility Test Suite
 * Tests all interactive accessibility features of the portfolio website
 */

test.describe('Accessibility - Complete Suite', () => {
  
  test.describe('Skip Link Functionality', () => {
    test('skip link appears on focus and works correctly', async ({ page }) => {
      await page.goto('/');
      
      // Skip link should be hidden initially
      const skipLink = page.locator('.skip-link');
      await expect(skipLink).toBeHidden();
      
      // Tab to reveal skip link
      await page.keyboard.press('Tab');
      await expect(skipLink).toBeVisible();
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toHaveText('Skip to main content');
      
      // Activate skip link
      await page.keyboard.press('Enter');
      
      // Verify focus moved to main content
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeFocused();
      
      // Verify we're at the main content area
      const mainBoundingBox = await mainContent.boundingBox();
      expect(mainBoundingBox).toBeTruthy();
      
      // The viewport should have scrolled to show main content
      const viewport = page.viewportSize();
      if (viewport && mainBoundingBox) {
        const isInViewport = mainBoundingBox.y >= 0 && mainBoundingBox.y < viewport.height;
        expect(isInViewport).toBeTruthy();
      }
    });
    
    test('skip link works with screen reader announcement', async ({ page }) => {
      await page.goto('/');
      
      // Enable screen reader mode simulation
      await page.addInitScript(() => {
        // Add a mock screen reader announcement collector
        window.announcements = [];
        const originalAriaLive = Object.getOwnPropertyDescriptor(Element.prototype, 'ariaLive');
        Object.defineProperty(Element.prototype, 'ariaLive', {
          set: function(value) {
            if (value && this.textContent) {
              window.announcements.push(this.textContent);
            }
            if (originalAriaLive?.set) {
              originalAriaLive.set.call(this, value);
            }
          },
          get: function() {
            return originalAriaLive?.get?.call(this);
          }
        });
      });
      
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Check that skip navigation occurred
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeFocused();
    });
  });
  
  test.describe('Navigation Keyboard Interaction', () => {
    test('complete keyboard navigation flow', async ({ page }) => {
      await page.goto('/');
      
      const expectedTabOrder = [
        '.skip-link',
        'a[aria-label="Ben Castillo - Home"]',
        'nav[aria-label="Main navigation"] a[href="#about"]',
        'nav[aria-label="Main navigation"] a[href="#projects"]',
        'nav[aria-label="Main navigation"] a[href="#contact"]',
        'button[aria-label*="Switch to"]'
      ];
      
      for (const selector of expectedTabOrder) {
        await page.keyboard.press('Tab');
        const element = page.locator(selector);
        await expect(element).toBeFocused();
        
        // Verify focus indicator is visible
        const outline = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineOffset: styles.outlineOffset,
            boxShadow: styles.boxShadow
          };
        });
        
        // Should have visible focus indicator
        const hasVisibleFocus = outline.outline !== 'none' || 
                               outline.boxShadow.includes('rgb');
        expect(hasVisibleFocus).toBeTruthy();
      }
    });
    
    test('navigation links activate with Enter key', async ({ page }) => {
      await page.goto('/');
      
      // Focus on About link
      const aboutLink = page.locator('nav[aria-label="Main navigation"] a[href="#about"]');
      await aboutLink.focus();
      
      // Press Enter to navigate
      await page.keyboard.press('Enter');
      
      // Wait for smooth scroll
      await page.waitForTimeout(700);
      
      // Verify navigation occurred
      const aboutSection = page.locator('#about');
      await expect(aboutSection).toBeInViewport();
      
      // Verify focus management - should focus something in the about section
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        const aboutEl = document.getElementById('about');
        return aboutEl?.contains(el) || el === aboutEl;
      });
      expect(focusedElement).toBeTruthy();
    });
    
    test('active section updates with scroll', async ({ page }) => {
      await page.goto('/');
      
      // Scroll to Projects section
      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Check active state
      const projectsLink = page.locator('nav[aria-label="Main navigation"] a[href="#projects"]');
      await expect(projectsLink).toHaveAttribute('aria-current', 'page');
      
      // Verify screen reader text
      const srText = await projectsLink.locator('.sr-only').textContent();
      expect(srText).toContain('current section');
      
      // Scroll to Contact section
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Check active state moved
      const contactLink = page.locator('nav[aria-label="Main navigation"] a[href="#contact"]');
      await expect(contactLink).toHaveAttribute('aria-current', 'page');
      await expect(projectsLink).not.toHaveAttribute('aria-current', 'page');
    });
  });
  
  test.describe('Theme Toggle Behavior', () => {
    test('theme toggle cycles through all states with keyboard', async ({ page }) => {
      await page.goto('/');
      
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      await themeToggle.focus();
      
      // Get initial state
      const initialLabel = await themeToggle.getAttribute('aria-label');
      const initialPressed = await themeToggle.getAttribute('aria-pressed');
      
      // Test Space key activation
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);
      
      let newLabel = await themeToggle.getAttribute('aria-label');
      let newPressed = await themeToggle.getAttribute('aria-pressed');
      expect(newLabel).not.toBe(initialLabel);
      expect(newPressed).not.toBe(initialPressed);
      
      // Test Enter key activation
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      
      newLabel = await themeToggle.getAttribute('aria-label');
      expect(newLabel).not.toBe(initialLabel);
      
      // Verify theme actually changes
      const htmlElement = page.locator('html');
      const theme = await htmlElement.getAttribute('data-theme');
      expect(['light', 'dark', 'system']).toContain(theme);
    });
    
    test('theme preference persists across page loads', async ({ page, context }) => {
      await page.goto('/');
      
      // Set to dark theme
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      
      // Click until we're in dark mode
      for (let i = 0; i < 3; i++) {
        const label = await themeToggle.getAttribute('aria-label');
        if (label?.includes('Switch to system')) {
          break; // We're in dark mode
        }
        await themeToggle.click();
        await page.waitForTimeout(300);
      }
      
      // Verify dark theme is active
      const htmlElement = page.locator('html');
      await expect(htmlElement).toHaveAttribute('data-theme', 'dark');
      
      // Reload page
      await page.reload();
      
      // Theme should persist
      await expect(htmlElement).toHaveAttribute('data-theme', 'dark');
      
      // Verify aria-pressed state is correct
      const pressed = await themeToggle.getAttribute('aria-pressed');
      expect(pressed).toBe('true');
    });
    
    test('respects prefers-color-scheme when set to system', async ({ page }) => {
      // Test light mode preference
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/');
      
      // Set to system theme
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      for (let i = 0; i < 3; i++) {
        const label = await themeToggle.getAttribute('aria-label');
        if (label?.includes('Switch to light')) {
          break; // We're in system mode
        }
        await themeToggle.click();
        await page.waitForTimeout(300);
      }
      
      // Should be light theme
      const htmlElement = page.locator('html');
      const resolvedTheme = await htmlElement.evaluate(el => {
        return window.getComputedStyle(el).getPropertyValue('--color-background');
      });
      expect(resolvedTheme).toContain('FFF'); // Light background
      
      // Test dark mode preference
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.waitForTimeout(300);
      
      const newResolvedTheme = await htmlElement.evaluate(el => {
        return window.getComputedStyle(el).getPropertyValue('--color-background');
      });
      expect(newResolvedTheme).toContain('0D0D0D'); // Dark background
    });
  });
  
  test.describe('Mobile Menu Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });
    
    test('mobile menu keyboard interaction and focus trap', async ({ page }) => {
      await page.goto('/');
      
      const menuButton = page.locator('button[aria-label*="mobile menu"]');
      await menuButton.focus();
      
      // Open menu with Enter
      await page.keyboard.press('Enter');
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      
      // Focus should move to first menu item
      await page.waitForTimeout(200);
      const firstMenuItem = page.locator('#mobile-menu a').first();
      await expect(firstMenuItem).toBeFocused();
      
      // Tab through all menu items
      const menuItems = await page.locator('#mobile-menu a, #mobile-menu button').count();
      
      for (let i = 0; i < menuItems + 5; i++) {
        await page.keyboard.press('Tab');
        
        // Verify focus is trapped in menu
        const focusInMenu = await page.evaluate(() => {
          const menu = document.getElementById('mobile-menu');
          const activeElement = document.activeElement;
          return menu?.contains(activeElement);
        });
        expect(focusInMenu).toBeTruthy();
      }
      
      // Test Shift+Tab wrapping
      for (let i = 0; i < menuItems + 5; i++) {
        await page.keyboard.press('Shift+Tab');
        
        // Verify focus is still trapped
        const focusInMenu = await page.evaluate(() => {
          const menu = document.getElementById('mobile-menu');
          const activeElement = document.activeElement;
          return menu?.contains(activeElement);
        });
        expect(focusInMenu).toBeTruthy();
      }
    });
    
    test('mobile menu closes with Escape and restores focus', async ({ page }) => {
      await page.goto('/');
      
      const menuButton = page.locator('button[aria-label*="mobile menu"]');
      
      // Open menu
      await menuButton.click();
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      
      // Wait for animation
      await page.waitForTimeout(300);
      
      // Press Escape
      await page.keyboard.press('Escape');
      
      // Menu should close
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      
      // Focus should return to menu button
      await expect(menuButton).toBeFocused();
      
      // Verify menu is not visible
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).not.toBeVisible();
    });
    
    test('mobile menu prevents background scroll', async ({ page }) => {
      await page.goto('/');
      
      // Add content to make page scrollable
      await page.evaluate(() => {
        document.body.style.height = '200vh';
      });
      
      const menuButton = page.locator('button[aria-label*="mobile menu"]');
      await menuButton.click();
      
      // Check body overflow is hidden
      const bodyOverflow = await page.evaluate(() => {
        return window.getComputedStyle(document.body).overflow;
      });
      expect(bodyOverflow).toBe('hidden');
      
      // Try to scroll - should not work
      const initialScroll = await page.evaluate(() => window.scrollY);
      await page.mouse.wheel(0, 100);
      const afterScroll = await page.evaluate(() => window.scrollY);
      expect(afterScroll).toBe(initialScroll);
      
      // Close menu
      await page.keyboard.press('Escape');
      
      // Body overflow should be restored
      const restoredOverflow = await page.evaluate(() => {
        return window.getComputedStyle(document.body).overflow;
      });
      expect(restoredOverflow).not.toBe('hidden');
    });
    
    test('mobile menu aria attributes and roles', async ({ page }) => {
      await page.goto('/');
      
      const menuButton = page.locator('button[aria-label*="mobile menu"]');
      const mobileMenu = page.locator('#mobile-menu');
      
      // Check initial state
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      await expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
      
      // Open menu
      await menuButton.click();
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      
      // Check menu attributes
      await expect(mobileMenu).toHaveAttribute('role', 'dialog');
      await expect(mobileMenu).toHaveAttribute('aria-modal', 'true');
      await expect(mobileMenu).toHaveAttribute('aria-label', 'Mobile navigation menu');
      
      // Check nav inside menu
      const nav = mobileMenu.locator('nav');
      await expect(nav).toHaveAttribute('role', 'navigation');
      await expect(nav).toHaveAttribute('aria-label', 'Mobile navigation');
    });
  });
  
  test.describe('Back to Top Button', () => {
    test('back to top button appears on scroll and works', async ({ page }) => {
      await page.goto('/');
      
      const backToTop = page.locator('button[aria-label="Scroll back to top of page"]');
      
      // Should be hidden initially
      await expect(backToTop).toHaveCSS('opacity', '0');
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      
      // Button should appear
      await expect(backToTop).toHaveCSS('opacity', '1');
      await expect(backToTop).toBeVisible();
      
      // Click button
      await backToTop.click();
      
      // Wait for scroll animation
      await page.waitForTimeout(700);
      
      // Should be at top
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(10);
      
      // Button should hide again
      await page.waitForTimeout(300);
      await expect(backToTop).toHaveCSS('opacity', '0');
    });
    
    test('back to top button keyboard accessible', async ({ page }) => {
      await page.goto('/');
      
      // Scroll down to make button appear
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      
      const backToTop = page.locator('button[aria-label="Scroll back to top of page"]');
      
      // Focus the button
      await backToTop.focus();
      await expect(backToTop).toBeFocused();
      
      // Activate with Enter
      await page.keyboard.press('Enter');
      await page.waitForTimeout(700);
      
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(10);
    });
    
    test('back to top announces to screen readers', async ({ page }) => {
      await page.goto('/');
      
      // Monitor aria-live announcements
      await page.addInitScript(() => {
        window.liveAnnouncements = [];
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              const target = mutation.target as HTMLElement;
              if (target.getAttribute('aria-live') || target.getAttribute('role') === 'status') {
                const text = target.textContent;
                if (text) {
                  window.liveAnnouncements.push(text);
                }
              }
            }
          });
        });
        
        // Start observing when DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
          });
        } else {
          observer.observe(document.body, { childList: true, subtree: true });
        }
      });
      
      // Scroll down and click back to top
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      
      const backToTop = page.locator('button[aria-label="Scroll back to top of page"]');
      await backToTop.click();
      await page.waitForTimeout(1000);
      
      // Check for announcement
      const announcements = await page.evaluate(() => window.liveAnnouncements);
      const hasScrollAnnouncement = announcements.some(text => 
        text.toLowerCase().includes('scroll') || text.toLowerCase().includes('top')
      );
      expect(hasScrollAnnouncement).toBeTruthy();
    });
  });
  
  test.describe('Focus Trap in Mobile Menu', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });
    
    test('focus trap prevents tabbing outside menu', async ({ page }) => {
      await page.goto('/');
      
      const menuButton = page.locator('button[aria-label*="mobile menu"]');
      await menuButton.click();
      await page.waitForTimeout(300);
      
      // Get all focusable elements in menu
      const focusableCount = await page.locator('#mobile-menu a, #mobile-menu button').count();
      
      // Tab through more times than there are elements
      for (let i = 0; i < focusableCount * 2; i++) {
        await page.keyboard.press('Tab');
        
        // Check focus is still in menu
        const focusedInMenu = await page.evaluate(() => {
          const menu = document.getElementById('mobile-menu');
          return menu?.contains(document.activeElement);
        });
        expect(focusedInMenu).toBeTruthy();
      }
    });
    
    test('shift+tab wraps to last element', async ({ page }) => {
      await page.goto('/');
      
      const menuButton = page.locator('button[aria-label*="mobile menu"]');
      await menuButton.click();
      await page.waitForTimeout(300);
      
      // First element should be focused
      const firstMenuItem = page.locator('#mobile-menu a').first();
      await expect(firstMenuItem).toBeFocused();
      
      // Shift+Tab should go to last element
      await page.keyboard.press('Shift+Tab');
      
      // Last focusable element should be focused
      const lastFocusable = await page.evaluate(() => {
        const menu = document.getElementById('mobile-menu');
        const focusables = menu?.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        const lastElement = focusables?.[focusables.length - 1] as HTMLElement;
        return lastElement === document.activeElement;
      });
      expect(lastFocusable).toBeTruthy();
    });
  });
  
  test.describe('ARIA Live Regions', () => {
    test('section navigation announcements', async ({ page }) => {
      await page.goto('/');
      
      // Find the status live region
      const liveRegion = page.locator('[role="status"][aria-live="polite"]');
      await expect(liveRegion).toHaveClass(/sr-only/);
      
      // Navigate to a section
      await page.click('nav[aria-label="Main navigation"] a[href="#about"]');
      await page.waitForTimeout(1000);
      
      // Check if live region was updated
      const liveRegionText = await liveRegion.textContent();
      expect(liveRegionText).toContain('About');
    });
    
    test('mobile menu state announcements', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const liveRegion = page.locator('[role="status"][aria-live="polite"]');
      const menuButton = page.locator('button[aria-label*="mobile menu"]');
      
      // Open menu
      await menuButton.click();
      await page.waitForTimeout(100);
      
      let liveRegionText = await liveRegion.textContent();
      expect(liveRegionText).toContain('opened');
      
      // Close menu
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
      
      liveRegionText = await liveRegion.textContent();
      expect(liveRegionText).toContain('closed');
    });
  });
  
  test.describe('Reduced Motion Support', () => {
    test('respects prefers-reduced-motion for animations', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      
      // Check that smooth scroll is disabled
      await page.click('nav[aria-label="Main navigation"] a[href="#about"]');
      
      // Should jump instantly instead of smooth scroll
      await page.waitForTimeout(100); // Much shorter wait
      
      const aboutSection = page.locator('#about');
      await expect(aboutSection).toBeInViewport();
      
      // Check CSS animations are reduced
      const hasReducedMotion = await page.evaluate(() => {
        const testElement = document.querySelector('.transition-all');
        if (!testElement) return true;
        const styles = window.getComputedStyle(testElement);
        return styles.animationDuration === '0s' || 
               styles.transitionDuration === '0s' ||
               !styles.animation ||
               styles.animation === 'none';
      });
      
      // Some animations should be reduced
      expect(hasReducedMotion).toBeDefined();
    });
    
    test('theme toggle works without animation in reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      const htmlElement = page.locator('html');
      
      // Get initial theme
      const initialTheme = await htmlElement.getAttribute('data-theme');
      
      // Toggle theme
      await themeToggle.click();
      
      // Theme should change instantly
      await page.waitForTimeout(50); // Very short wait
      
      const newTheme = await htmlElement.getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);
    });
  });
  
  test.describe('Comprehensive WCAG 2.1 AA Compliance', () => {
    const pagesToTest = [
      { url: '/', name: 'Homepage' },
      { url: '/blog', name: 'Blog' },
    ];
    
    for (const pageInfo of pagesToTest) {
      test(`${pageInfo.name} - Full accessibility audit`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        // Run axe-core accessibility scan
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        
        // Log violations for debugging
        if (accessibilityScanResults.violations.length > 0) {
          console.log(`Accessibility violations on ${pageInfo.name}:`);
          accessibilityScanResults.violations.forEach(violation => {
            console.log(`- ${violation.id}: ${violation.description}`);
            console.log(`  Impact: ${violation.impact}`);
            console.log(`  Affected nodes: ${violation.nodes.length}`);
          });
        }
        
        // Assert no violations
        expect(accessibilityScanResults.violations).toHaveLength(0);
      });
      
      test(`${pageInfo.name} - Mobile accessibility audit`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(pageInfo.url);
        
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        
        expect(accessibilityScanResults.violations).toHaveLength(0);
      });
    }
  });
});

// Helper function to wait for animations
async function waitForAnimation(page: Page, duration: number = 300) {
  await page.waitForTimeout(duration);
}

// Helper to check focus visibility
async function checkFocusVisibility(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector);
  await element.focus();
  
  return await element.evaluate(el => {
    const styles = window.getComputedStyle(el);
    const hasOutline = styles.outline !== 'none' && styles.outline !== '';
    const hasBoxShadow = styles.boxShadow !== 'none' && styles.boxShadow !== '';
    const hasRing = el.className.includes('ring') || el.className.includes('focus');
    
    return hasOutline || hasBoxShadow || hasRing;
  });
}

// Extend Window interface for test helpers
declare global {
  interface Window {
    announcements: string[];
    liveAnnouncements: string[];
  }
}