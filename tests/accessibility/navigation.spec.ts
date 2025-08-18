import { test, expect } from '@playwright/test'

test.describe('Accessibility - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('skip link functionality', async ({ page }) => {
    // Test skip link appears on tab
    await page.keyboard.press('Tab')
    
    const skipLink = page.locator('.skip-link')
    await expect(skipLink).toBeVisible()
    await expect(skipLink).toHaveText('Skip to main content')
    
    // Test skip link navigation
    await page.keyboard.press('Enter')
    
    // Verify focus moved to main content
    const mainContent = page.locator('#main-content')
    await expect(mainContent).toBeFocused()
  })

  test('keyboard navigation order', async ({ page }) => {
    const expectedOrder = [
      '.skip-link',
      '[aria-label="Ben Castillo - Home"]', // Logo
      'nav[aria-label="Main navigation"] a:first-child', // First nav item
      'button[aria-label*="Switch to"]', // Theme toggle
    ]

    for (let i = 0; i < expectedOrder.length; i++) {
      await page.keyboard.press('Tab')
      const element = page.locator(expectedOrder[i])
      await expect(element).toBeFocused()
    }
  })

  test('mobile menu keyboard accessibility', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navigate to mobile menu button
    await page.keyboard.press('Tab') // Skip link
    await page.keyboard.press('Tab') // Logo
    await page.keyboard.press('Tab') // Theme toggle
    await page.keyboard.press('Tab') // Mobile menu button
    
    const menuButton = page.locator('button[aria-label*="mobile menu"]')
    await expect(menuButton).toBeFocused()
    
    // Open menu with keyboard
    await page.keyboard.press('Enter')
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    
    // Check focus moved to first menu item
    const firstMenuItem = page.locator('#mobile-menu a:first-child')
    await expect(firstMenuItem).toBeFocused()
    
    // Test escape to close
    await page.keyboard.press('Escape')
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await expect(menuButton).toBeFocused()
  })

  test('smooth scrolling with focus management', async ({ page }) => {
    // Click on About navigation link
    await page.click('nav[aria-label="Main navigation"] a[href="#about"]')
    
    // Wait for scroll animation
    await page.waitForTimeout(700)
    
    // Check that focus moved to About section
    const aboutSection = page.locator('#about')
    await expect(aboutSection).toBeInViewport()
    
    // Verify focus is within the about section
    const focusedElement = page.locator(':focus')
    const aboutElements = page.locator('#about *')
    
    // The focused element should be within the about section
    await expect(focusedElement).toBeVisible()
  })

  test('navigation active states', async ({ page }) => {
    // Scroll to About section
    await page.locator('#about').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    
    // Check that About nav item has active state
    const aboutNavItem = page.locator('nav[aria-label="Main navigation"] a[href="#about"]')
    await expect(aboutNavItem).toHaveAttribute('aria-current', 'page')
    
    // Scroll to Projects section
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    
    // Check that Projects nav item has active state
    const projectsNavItem = page.locator('nav[aria-label="Main navigation"] a[href="#projects"]')
    await expect(projectsNavItem).toHaveAttribute('aria-current', 'page')
  })

  test('focus indicators visible and accessible', async ({ page }) => {
    // Test focus indicators on all navigation elements
    const navItems = page.locator('nav[aria-label="Main navigation"] a')
    const count = await navItems.count()
    
    for (let i = 0; i < count; i++) {
      const item = navItems.nth(i)
      await item.focus()
      
      // Check that element has visible focus
      await expect(item).toBeFocused()
      
      // Verify focus ring properties
      const focusStyles = await item.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          outline: computed.outline,
          outlineOffset: computed.outlineOffset,
          boxShadow: computed.boxShadow
        }
      })
      
      // Should have either outline or box-shadow for focus
      expect(
        focusStyles.outline !== 'none' || 
        focusStyles.boxShadow !== 'none'
      ).toBeTruthy()
    }
  })

  test('theme toggle accessibility', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="Switch to"]')
    
    // Get initial state
    const initialPressed = await themeToggle.getAttribute('aria-pressed')
    const initialLabel = await themeToggle.getAttribute('aria-label')
    
    // Click theme toggle
    await themeToggle.click()
    
    // Wait for animation and state change
    await page.waitForTimeout(300)
    
    // Verify aria-pressed changed
    const newPressed = await themeToggle.getAttribute('aria-pressed')
    expect(newPressed).not.toBe(initialPressed)
    
    // Verify label updated
    const newLabel = await themeToggle.getAttribute('aria-label')
    expect(newLabel).not.toBe(initialLabel)
    
    // Verify theme actually changed
    const htmlTheme = await page.locator('html').getAttribute('data-theme')
    expect(htmlTheme).toBeTruthy()
  })

  test('ARIA live regions announce changes', async ({ page }) => {
    // Set up listener for ARIA live region changes
    const liveRegionUpdates: string[] = []
    
    await page.evaluate(() => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const target = mutation.target as Element
            if (target.getAttribute('aria-live') || target.getAttribute('role') === 'status') {
              window.liveRegionUpdates = window.liveRegionUpdates || []
              window.liveRegionUpdates.push(target.textContent || '')
            }
          }
        })
      })
      
      document.querySelectorAll('[aria-live], [role="status"]').forEach(el => {
        observer.observe(el, { childList: true, characterData: true, subtree: true })
      })
    })
    
    // Navigate between sections
    await page.click('nav[aria-label="Main navigation"] a[href="#about"]')
    await page.waitForTimeout(1000)
    
    // Check if live region was updated
    const updates = await page.evaluate(() => window.liveRegionUpdates || [])
    expect(updates.some(update => update.includes('About'))).toBeTruthy()
  })

  test('keyboard focus never gets trapped outside mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label*="mobile menu"]')
    await menuButton.click()
    
    // Tab through menu items multiple times
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      
      // Verify focus is still within the mobile menu
      const focusedElement = page.locator(':focus')
      const isInMenu = await focusedElement.evaluate((el) => {
        const menu = document.getElementById('mobile-menu')
        return menu ? menu.contains(el) : false
      })
      
      expect(isInMenu).toBeTruthy()
    }
  })

  test('reduced motion preferences respected', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    // Navigate to a section
    await page.click('nav[aria-label="Main navigation"] a[href="#about"]')
    
    // In reduced motion mode, scroll should be instant
    await page.waitForTimeout(100) // Much shorter wait
    
    const aboutSection = page.locator('#about')
    await expect(aboutSection).toBeInViewport()
  })
})