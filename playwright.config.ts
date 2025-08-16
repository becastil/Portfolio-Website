import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ] : 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    // Tablet
    {
      name: 'chromium-tablet',
      use: { ...devices['iPad Pro'] },
    },
    {
      name: 'firefox-tablet',
      use: { 
        ...devices['iPad Pro'],
        browserName: 'firefox'
      },
    },
    
    // Mobile
    {
      name: 'chromium-mobile',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'firefox-mobile',
      use: { 
        ...devices['iPhone 13'],
        browserName: 'firefox'
      },
    },
  ],
  webServer: process.env.CI ? undefined : {
    command: 'npm run build && npx http-server out -p 3000',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});