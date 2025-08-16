import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to contact section
    await page.click('a[href="#contact"], nav a:has-text("Contact")');
    await page.waitForTimeout(1000);
  });

  test('should display contact form', async ({ page }) => {
    // Check if contact form is visible
    const form = page.locator('form, [data-testid="contact-form"]');
    await expect(form).toBeVisible();
    
    // Check for required form fields
    const nameField = page.locator('input[name="name"], input[type="text"]:first, #name');
    const emailField = page.locator('input[name="email"], input[type="email"], #email');
    const messageField = page.locator('textarea[name="message"], textarea, #message');
    
    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(messageField).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const form = page.locator('form, [data-testid="contact-form"]');
    const submitButton = form.locator('button[type="submit"], input[type="submit"], button:has-text("Send")');
    
    if (await submitButton.isVisible()) {
      // Try to submit empty form
      await submitButton.click();
      
      // Check for validation messages (HTML5 or custom validation)
      const nameField = page.locator('input[name="name"], input[type="text"]:first, #name');
      const emailField = page.locator('input[name="email"], input[type="email"], #email');
      
      // Check HTML5 validation
      const nameValidity = await nameField.evaluate((el: HTMLInputElement) => el.validity.valid);
      const emailValidity = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
      
      // At least one field should be invalid if they're required
      if (await nameField.getAttribute('required') !== null) {
        expect(nameValidity).toBe(false);
      }
      
      if (await emailField.getAttribute('required') !== null) {
        expect(emailValidity).toBe(false);
      }
    }
  });

  test('should validate email format', async ({ page }) => {
    const emailField = page.locator('input[name="email"], input[type="email"], #email');
    
    if (await emailField.isVisible()) {
      // Enter invalid email
      await emailField.fill('invalid-email');
      
      // Tab to trigger validation
      await page.keyboard.press('Tab');
      
      // Check if field shows as invalid
      const validity = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(validity).toBe(false);
      
      // Enter valid email
      await emailField.fill('test@example.com');
      await page.keyboard.press('Tab');
      
      // Check if field is now valid
      const newValidity = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(newValidity).toBe(true);
    }
  });

  test('should handle form submission', async ({ page }) => {
    const form = page.locator('form, [data-testid="contact-form"]');
    const nameField = page.locator('input[name="name"], input[type="text"]:first, #name');
    const emailField = page.locator('input[name="email"], input[type="email"], #email');
    const messageField = page.locator('textarea[name="message"], textarea, #message');
    const submitButton = form.locator('button[type="submit"], input[type="submit"], button:has-text("Send")');
    
    if (await submitButton.isVisible()) {
      // Fill out the form
      await nameField.fill('Test User');
      await emailField.fill('test@example.com');
      await messageField.fill('This is a test message from the E2E test suite.');
      
      // Monitor network requests
      const responsePromise = page.waitForResponse(response => 
        response.url().includes('/api/contact') || 
        response.url().includes('contact') ||
        response.status() === 200
      );
      
      // Submit the form
      await submitButton.click();
      
      try {
        // Wait for response (with timeout)
        await responsePromise;
        
        // Check for success message or redirect
        const successMessage = page.locator('.success, .alert-success, [data-testid="success-message"]');
        const errorMessage = page.locator('.error, .alert-error, [data-testid="error-message"]');
        
        // Wait a bit for UI to update
        await page.waitForTimeout(2000);
        
        // Check if success or error message appeared
        const hasSuccess = await successMessage.isVisible();
        const hasError = await errorMessage.isVisible();
        
        // At least one should be visible (success preferred)
        expect(hasSuccess || hasError).toBe(true);
        
      } catch (error) {
        // If no API endpoint, check for client-side handling
        console.log('No API response - checking for client-side form handling');
        
        // Check if form shows loading state or success message
        const loadingState = submitButton.locator('text="Sending" | text="Loading"');
        const isDisabled = await submitButton.isDisabled();
        
        // Form should show some kind of feedback
        expect(isDisabled || await loadingState.isVisible()).toBe(true);
      }
    }
  });

  test('should be accessible via keyboard', async ({ page }) => {
    // Tab through form fields
    const nameField = page.locator('input[name="name"], input[type="text"]:first, #name');
    const emailField = page.locator('input[name="email"], input[type="email"], #email');
    const messageField = page.locator('textarea[name="message"], textarea, #message');
    const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Send")');
    
    // Start from name field
    await nameField.focus();
    await nameField.fill('Test User');
    
    // Tab to email field
    await page.keyboard.press('Tab');
    await expect(emailField).toBeFocused();
    await emailField.fill('test@example.com');
    
    // Tab to message field
    await page.keyboard.press('Tab');
    await expect(messageField).toBeFocused();
    await messageField.fill('Test message via keyboard navigation');
    
    // Tab to submit button
    await page.keyboard.press('Tab');
    await expect(submitButton).toBeFocused();
    
    // Could submit with Enter key
    // await page.keyboard.press('Enter');
  });

  test('should have proper form labels and accessibility', async ({ page }) => {
    const nameField = page.locator('input[name="name"], input[type="text"]:first, #name');
    const emailField = page.locator('input[name="email"], input[type="email"], #email');
    const messageField = page.locator('textarea[name="message"], textarea, #message');
    
    // Check for labels or aria-labels
    for (const field of [nameField, emailField, messageField]) {
      if (await field.isVisible()) {
        const hasLabel = await field.evaluate(el => {
          const id = el.id;
          const name = el.getAttribute('name');
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledby = el.getAttribute('aria-labelledby');
          
          // Check for associated label
          let hasAssociatedLabel = false;
          if (id) {
            hasAssociatedLabel = document.querySelector(`label[for="${id}"]`) !== null;
          }
          
          return hasAssociatedLabel || ariaLabel || ariaLabelledby;
        });
        
        expect(hasLabel).toBe(true);
      }
    }
  });

  test('should handle form on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Check form is still usable
      const form = page.locator('form, [data-testid="contact-form"]');
      await expect(form).toBeVisible();
      
      const nameField = page.locator('input[name="name"], input[type="text"]:first, #name');
      const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Send")');
      
      if (await nameField.isVisible() && await submitButton.isVisible()) {
        // Form should be functional on all screen sizes
        await nameField.fill('Responsive Test');
        await expect(nameField).toHaveValue('Responsive Test');
      }
    }
  });
});