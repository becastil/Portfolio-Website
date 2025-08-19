import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ] : 'html',
  
  // Visual regression test configuration
  expect: {
    // Threshold for pixel differences (0-1, where 0.2 = 20% difference allowed)
    toMatchSnapshot: { 
      threshold: 0.2,
      maxDiffPixels: 100,
    },
    // Timeout for assertions
    timeout: 10000,
  },
  
  // Store snapshots in a dedicated directory
  snapshotDir: './tests/visual/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // HeroOverlay-specific settings
    contextOptions: {
      // Enable GPU acceleration for Canvas/WebGL tests
      ignoreHTTPSErrors: true,
      // Collect performance metrics
      recordHar: { path: './test-results/har/' },
    },
    launchOptions: {
      // Enable WebGL in headless mode
      args: [
        '--use-gl=swiftshader',
        '--enable-webgl',
        '--enable-webgl2',
        '--enable-accelerated-2d-canvas',
        '--disable-blink-features=AutomationControlled'
      ],
    },
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