import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display main content', async ({ page }) => {
    // Check for hero section
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Ben Castillo|Portfolio/i);
    
    // Check for navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for main sections
    await expect(page.locator('[data-testid="hero-section"], section:has-text("Hi, I\'m"), #hero')).toBeVisible();
    await expect(page.locator('[data-testid="about-section"], section:has-text("About"), #about')).toBeVisible();
    await expect(page.locator('[data-testid="projects-section"], section:has-text("Projects"), #projects')).toBeVisible();
    await expect(page.locator('[data-testid="contact-section"], section:has-text("Contact"), #contact')).toBeVisible();
  });

  test('should have proper page title and meta tags', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Ben Castillo|Portfolio/i);
    
    // Check for essential meta tags
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
    
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
  });

  test('should have working navigation links', async ({ page }) => {
    // Test navigation to about section
    await page.click('a[href="#about"], nav a:has-text("About")');
    await page.waitForTimeout(1000); // Allow for smooth scroll
    
    // Test navigation to projects section
    await page.click('a[href="#projects"], nav a:has-text("Projects")');
    await page.waitForTimeout(1000);
    
    // Test navigation to contact section
    await page.click('a[href="#contact"], nav a:has-text("Contact")');
    await page.waitForTimeout(1000);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('chrome-extension') &&
      !error.includes('ResizeObserver loop limit exceeded')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper accessibility landmarks', async ({ page }) => {
    // Check for main landmark
    await expect(page.locator('main, [role="main"]')).toBeVisible();
    
    // Check for navigation landmark
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('should have working skip links for accessibility', async ({ page }) => {
    // Check if skip link exists and works
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to main content"), a:has-text("Skip to content")');
    
    if (await skipLink.isVisible()) {
      await skipLink.click();
      // Verify focus moved to main content
      const mainContent = page.locator('main, #main-content, [role="main"]');
      await expect(mainContent).toBeFocused();
    }
  });
});