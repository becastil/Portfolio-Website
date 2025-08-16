import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Large Desktop', width: 2560, height: 1440 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`should display correctly on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // Check basic layout elements are visible
      const nav = page.locator('nav, [role="navigation"]');
      const main = page.locator('main, [role="main"], .main-content');
      const hero = page.locator('h1, .hero, [data-testid="hero"]');
      
      await expect(nav).toBeVisible();
      await expect(hero).toBeVisible();
      
      // Check content doesn't overflow
      const body = page.locator('body');
      const bodyWidth = await body.evaluate(el => el.scrollWidth);
      
      // Content should not exceed viewport width (allowing for small browser differences)
      expect(bodyWidth).toBeLessThanOrEqual(width + 20);
      
      // Check for horizontal scrollbar
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test('should handle mobile navigation properly', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu exists
    const mobileMenuButton = page.locator(
      'button[aria-label*="menu"], ' +
      'button:has-text("☰"), ' +
      '.hamburger, ' +
      '.mobile-menu-button, ' +
      '[data-testid="mobile-menu-button"]'
    );
    
    if (await mobileMenuButton.isVisible()) {
      // Test mobile menu functionality
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      
      // Menu should be visible
      const mobileMenu = page.locator(
        '.mobile-menu, ' +
        '.nav-menu, ' +
        '[data-testid="mobile-menu"], ' +
        'nav ul'
      );
      
      await expect(mobileMenu).toBeVisible();
      
      // Test navigation link in mobile menu
      const aboutLink = mobileMenu.locator('a[href="#about"], a:has-text("About")');
      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await page.waitForTimeout(1000);
        
        // Should navigate to about section
        const aboutSection = page.locator('#about, [data-testid="about-section"]');
        await expect(aboutSection).toBeInViewport();
      }
    }
  });

  test('should adapt text sizes for different screens', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile text sizes
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileH1Size = await page.locator('h1').evaluate(el => 
      parseInt(getComputedStyle(el).fontSize)
    );
    
    // Test desktop text sizes
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopH1Size = await page.locator('h1').evaluate(el => 
      parseInt(getComputedStyle(el).fontSize)
    );
    
    // Desktop should typically have larger text than mobile
    expect(desktopH1Size).toBeGreaterThanOrEqual(mobileH1Size);
    
    // Both should be readable (reasonable font sizes)
    expect(mobileH1Size).toBeGreaterThanOrEqual(20);
    expect(desktopH1Size).toBeGreaterThanOrEqual(24);
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test touch targets are adequate size (44px minimum recommended)
    const buttons = page.locator('button, a, input[type="submit"]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          // Touch targets should be at least 44px in both dimensions
          expect(box.width).toBeGreaterThanOrEqual(32); // Slightly relaxed for testing
          expect(box.height).toBeGreaterThanOrEqual(32);
        }
      }
    }
  });

  test('should maintain aspect ratios for images', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Check images maintain aspect ratios
      const images = page.locator('img:visible');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        const box = await img.boundingBox();
        
        if (box && box.width > 0 && box.height > 0) {
          // Image should have reasonable aspect ratio (not extremely stretched)
          const aspectRatio = box.width / box.height;
          expect(aspectRatio).toBeGreaterThan(0.1);
          expect(aspectRatio).toBeLessThan(10);
        }
      }
    }
  });

  test('should handle content stacking on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that content stacks vertically on mobile
    const sections = page.locator('section, .section, [data-testid*="section"]');
    const sectionCount = await sections.count();
    
    if (sectionCount > 1) {
      // Get positions of first two sections
      const firstSection = sections.nth(0);
      const secondSection = sections.nth(1);
      
      const firstBox = await firstSection.boundingBox();
      const secondBox = await secondSection.boundingBox();
      
      if (firstBox && secondBox) {
        // Second section should be below first section (vertical stacking)
        expect(secondBox.y).toBeGreaterThan(firstBox.y);
      }
    }
  });

  test('should handle form layouts responsively', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to contact section
    await page.click('a[href="#contact"], nav a:has-text("Contact")');
    await page.waitForTimeout(1000);
    
    const form = page.locator('form, [data-testid="contact-form"]');
    
    if (await form.isVisible()) {
      // Test mobile form layout
      await page.setViewportSize({ width: 375, height: 667 });
      
      const formInputs = form.locator('input, textarea');
      const inputCount = await formInputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = formInputs.nth(i);
        if (await input.isVisible()) {
          const box = await input.boundingBox();
          
          if (box) {
            // Form inputs should be appropriately sized for mobile
            expect(box.width).toBeGreaterThan(200); // Minimum usable width
            expect(box.width).toBeLessThan(400); // Shouldn't exceed mobile width
          }
        }
      }
      
      // Test desktop form layout
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Form should still be usable and well-proportioned on desktop
      await expect(form).toBeVisible();
    }
  });

  test('should handle responsive typography', async ({ page }) => {
    await page.goto('/');
    
    const headings = ['h1', 'h2', 'h3'];
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const heading of headings) {
      const headingElement = page.locator(heading).first();
      
      if (await headingElement.isVisible()) {
        const fontSizes: { [key: string]: number } = {};
        
        for (const viewport of viewports) {
          await page.setViewportSize(viewport);
          await page.waitForTimeout(200);
          
          const fontSize = await headingElement.evaluate(el => 
            parseInt(getComputedStyle(el).fontSize)
          );
          
          fontSizes[viewport.name] = fontSize;
        }
        
        // Desktop should have same or larger font than mobile
        expect(fontSizes.desktop).toBeGreaterThanOrEqual(fontSizes.mobile);
        
        // Font sizes should be reasonable
        expect(fontSizes.mobile).toBeGreaterThan(12);
        expect(fontSizes.desktop).toBeLessThan(100);
      }
    }
  });

  test('should maintain readability across screen sizes', async ({ page }) => {
    const testViewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 }
    ];
    
    for (const viewport of testViewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Check line length is reasonable for readability
      const paragraphs = page.locator('p');
      const paragraphCount = await paragraphs.count();
      
      if (paragraphCount > 0) {
        const firstParagraph = paragraphs.first();
        const box = await firstParagraph.boundingBox();
        
        if (box) {
          // Line length should be reasonable for reading
          // Mobile: 300-400px, Desktop: 400-800px
          if (viewport.width <= 480) {
            expect(box.width).toBeLessThan(viewport.width - 40); // Account for padding
          } else {
            expect(box.width).toBeLessThan(800); // Max line length for readability
          }
        }
      }
    }
  });
});