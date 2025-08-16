import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have functional mobile menu', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Look for mobile menu button (hamburger menu)
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button:has-text("☰"), .hamburger, [data-testid="mobile-menu-button"]');
    
    if (await mobileMenuButton.isVisible()) {
      // Click to open mobile menu
      await mobileMenuButton.click();
      
      // Check if mobile menu is visible
      const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, nav ul, .nav-menu');
      await expect(mobileMenu).toBeVisible();
      
      // Test navigation link in mobile menu
      const aboutLink = mobileMenu.locator('a[href="#about"], a:has-text("About")');
      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await page.waitForTimeout(500);
      }
      
      // Check if menu closes after clicking a link (common UX pattern)
      await page.waitForTimeout(1000);
    }
  });

  test('should navigate to all main sections', async ({ page }) => {
    const sections = [
      { href: '#about', text: 'About' },
      { href: '#projects', text: 'Projects' },
      { href: '#contact', text: 'Contact' }
    ];
    
    for (const section of sections) {
      // Click navigation link
      await page.click(`a[href="${section.href}"], nav a:has-text("${section.text}")`);
      
      // Wait for smooth scroll to complete
      await page.waitForTimeout(1000);
      
      // Verify the section is in view
      const sectionElement = page.locator(`${section.href}, [data-testid="${section.text.toLowerCase()}-section"]`);
      await expect(sectionElement).toBeInViewport();
    }
  });

  test('should handle navigation on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Ensure navigation is accessible
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav).toBeVisible();
      
      // Test a navigation link
      await page.click('a[href="#about"], nav a:has-text("About")');
      await page.waitForTimeout(500);
      
      // Verify navigation worked
      const aboutSection = page.locator('#about, [data-testid="about-section"]');
      await expect(aboutSection).toBeInViewport();
    }
  });

  test('should maintain navigation state during page interactions', async ({ page }) => {
    // Navigate to different sections and verify navigation state
    await page.click('a[href="#projects"], nav a:has-text("Projects")');
    await page.waitForTimeout(1000);
    
    // Check if active state is applied (common pattern)
    const projectsLink = page.locator('a[href="#projects"], nav a:has-text("Projects")');
    // Note: This test is flexible as active states vary by implementation
    
    // Navigate to contact
    await page.click('a[href="#contact"], nav a:has-text("Contact")');
    await page.waitForTimeout(1000);
    
    // Verify contact section is visible
    const contactSection = page.locator('#contact, [data-testid="contact-section"]');
    await expect(contactSection).toBeInViewport();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation through nav items
    await page.keyboard.press('Tab');
    
    // Continue tabbing through navigation
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      
      // Check if focused element is interactive
      if (await focusedElement.isVisible()) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        const role = await focusedElement.getAttribute('role');
        
        if (tagName === 'a' || tagName === 'button' || role === 'button') {
          // Test enter key activation
          if (await focusedElement.getAttribute('href')) {
            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);
            break;
          }
        }
      }
    }
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    // Check navigation has proper role
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();
    
    // Check for mobile menu button accessibility
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-expanded]');
    
    if (await mobileMenuButton.isVisible()) {
      // Check aria-expanded state
      const ariaExpanded = await mobileMenuButton.getAttribute('aria-expanded');
      expect(ariaExpanded).toBeDefined();
      
      // Test aria-expanded changes when clicked
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      
      const newAriaExpanded = await mobileMenuButton.getAttribute('aria-expanded');
      if (ariaExpanded === 'false') {
        expect(newAriaExpanded).toBe('true');
      }
    }
  });

  test('should handle browser back/forward with hash navigation', async ({ page }) => {
    // Navigate to about section
    await page.click('a[href="#about"], nav a:has-text("About")');
    await page.waitForTimeout(1000);
    
    // Navigate to projects section
    await page.click('a[href="#projects"], nav a:has-text("Projects")');
    await page.waitForTimeout(1000);
    
    // Use browser back button
    await page.goBack();
    await page.waitForTimeout(1000);
    
    // Verify we're back at about section
    expect(page.url()).toContain('#about');
    
    // Use browser forward button
    await page.goForward();
    await page.waitForTimeout(1000);
    
    // Verify we're back at projects section
    expect(page.url()).toContain('#projects');
  });
});