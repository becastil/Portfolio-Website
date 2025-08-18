#!/usr/bin/env node

/**
 * Automated Accessibility Testing Script
 * Uses axe-core to scan the portfolio website for accessibility issues
 * 
 * Run with: npm run test:a11y
 */

const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const VIEWPORT_SIZES = [
  { width: 1920, height: 1080, name: 'desktop' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 375, height: 667, name: 'mobile' }
];

const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/blog', name: 'Blog' },
  { path: '/#about', name: 'About Section' },
  { path: '/#projects', name: 'Projects Section' },
  { path: '/#contact', name: 'Contact Section' }
];

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Test results storage
let testResults = {
  timestamp: new Date().toISOString(),
  url: BASE_URL,
  summary: {
    totalViolations: 0,
    totalPasses: 0,
    totalIncomplete: 0,
    totalInapplicable: 0,
    criticalIssues: 0,
    seriousIssues: 0,
    moderateIssues: 0,
    minorIssues: 0
  },
  pages: [],
  focusTests: [],
  keyboardTests: [],
  ariaTests: [],
  contrastTests: []
};

/**
 * Log with color and formatting
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Test axe-core accessibility
 */
async function testAccessibility(browser, page, pageInfo, viewport) {
  log(`\n  Testing ${pageInfo.name} at ${viewport.name} (${viewport.width}x${viewport.height})...`, 'cyan');
  
  await page.setViewport({ width: viewport.width, height: viewport.height });
  await page.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle2' });
  
  // Wait for any animations to complete
  await page.waitForTimeout(1000);
  
  // Run axe-core
  const results = await new AxePuppeteer(page)
    .withTags(WCAG_TAGS)
    .analyze();
  
  // Store results
  const pageResults = {
    page: pageInfo.name,
    viewport: viewport.name,
    url: `${BASE_URL}${pageInfo.path}`,
    timestamp: new Date().toISOString(),
    violations: results.violations,
    passes: results.passes.length,
    incomplete: results.incomplete.length,
    inapplicable: results.inapplicable.length
  };
  
  testResults.pages.push(pageResults);
  
  // Update summary
  testResults.summary.totalViolations += results.violations.length;
  testResults.summary.totalPasses += results.passes.length;
  testResults.summary.totalIncomplete += results.incomplete.length;
  testResults.summary.totalInapplicable += results.inapplicable.length;
  
  // Count by severity
  results.violations.forEach(violation => {
    switch (violation.impact) {
      case 'critical':
        testResults.summary.criticalIssues++;
        break;
      case 'serious':
        testResults.summary.seriousIssues++;
        break;
      case 'moderate':
        testResults.summary.moderateIssues++;
        break;
      case 'minor':
        testResults.summary.minorIssues++;
        break;
    }
  });
  
  // Display results
  if (results.violations.length === 0) {
    log(`    ✅ No accessibility violations found!`, 'green');
  } else {
    log(`    ❌ Found ${results.violations.length} accessibility violations:`, 'red');
    results.violations.forEach(violation => {
      const impactColor = violation.impact === 'critical' || violation.impact === 'serious' ? 'red' : 'yellow';
      log(`      - [${violation.impact.toUpperCase()}] ${violation.description}`, impactColor);
      log(`        Rule: ${violation.id}`, 'cyan');
      log(`        Affected: ${violation.nodes.length} element(s)`, 'cyan');
      if (violation.helpUrl) {
        log(`        Learn more: ${violation.helpUrl}`, 'blue');
      }
    });
  }
  
  return results;
}

/**
 * Test focus management
 */
async function testFocusManagement(browser, page) {
  log('\n📍 Testing Focus Management...', 'magenta');
  
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  
  const focusTests = {
    skipLink: false,
    tabOrder: false,
    focusVisible: false,
    focusRestoration: false
  };
  
  try {
    // Test skip link
    await page.keyboard.press('Tab');
    const skipLinkVisible = await page.evaluate(() => {
      const skipLink = document.querySelector('.skip-link');
      if (!skipLink) return false;
      const styles = window.getComputedStyle(skipLink);
      return styles.opacity !== '0' && styles.visibility !== 'hidden';
    });
    focusTests.skipLink = skipLinkVisible;
    log(`  ${skipLinkVisible ? '✅' : '❌'} Skip link becomes visible on focus`, skipLinkVisible ? 'green' : 'red');
    
    // Test tab order
    const tabOrder = await page.evaluate(() => {
      const focusableElements = Array.from(document.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      return focusableElements.length > 0;
    });
    focusTests.tabOrder = tabOrder;
    log(`  ${tabOrder ? '✅' : '❌'} Focusable elements present in tab order`, tabOrder ? 'green' : 'red');
    
    // Test focus visibility
    const focusVisible = await page.evaluate(() => {
      const testButton = document.querySelector('button');
      if (!testButton) return false;
      testButton.focus();
      const styles = window.getComputedStyle(testButton);
      return styles.outline !== 'none' || styles.boxShadow !== 'none';
    });
    focusTests.focusVisible = focusVisible;
    log(`  ${focusVisible ? '✅' : '❌'} Focus indicators are visible`, focusVisible ? 'green' : 'red');
    
    // Test focus restoration after modal
    await page.setViewport({ width: 375, height: 667 });
    const mobileMenuButton = await page.$('button[aria-label*="mobile menu"]');
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      await page.waitForTimeout(300);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      
      const focusRestored = await page.evaluate(() => {
        const activeElement = document.activeElement;
        return activeElement && activeElement.getAttribute('aria-label')?.includes('mobile menu');
      });
      focusTests.focusRestoration = focusRestored;
      log(`  ${focusRestored ? '✅' : '❌'} Focus returns to trigger after modal close`, focusRestored ? 'green' : 'red');
    }
    
  } catch (error) {
    log(`  ⚠️  Error during focus tests: ${error.message}`, 'yellow');
  }
  
  testResults.focusTests.push(focusTests);
  return focusTests;
}

/**
 * Test keyboard navigation
 */
async function testKeyboardNavigation(browser, page) {
  log('\n⌨️  Testing Keyboard Navigation...', 'magenta');
  
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  
  const keyboardTests = {
    enterActivation: false,
    spaceActivation: false,
    escapeKey: false,
    arrowKeys: false
  };
  
  try {
    // Test Enter key on links
    const firstLink = await page.$('a[href]');
    if (firstLink) {
      await firstLink.focus();
      const href = await page.evaluate(el => el.href, firstLink);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      const currentUrl = page.url();
      keyboardTests.enterActivation = currentUrl.includes(href) || href.includes('#');
      log(`  ${keyboardTests.enterActivation ? '✅' : '❌'} Enter key activates links`, keyboardTests.enterActivation ? 'green' : 'red');
    }
    
    // Test Space key on buttons
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    const themeToggle = await page.$('button[aria-label*="Switch to"]');
    if (themeToggle) {
      await themeToggle.focus();
      const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);
      const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      keyboardTests.spaceActivation = initialTheme !== newTheme;
      log(`  ${keyboardTests.spaceActivation ? '✅' : '❌'} Space key activates buttons`, keyboardTests.spaceActivation ? 'green' : 'red');
    }
    
    // Test Escape key
    await page.setViewport({ width: 375, height: 667 });
    const mobileMenuButton = await page.$('button[aria-label*="mobile menu"]');
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      await page.waitForTimeout(300);
      
      const menuOpenBefore = await page.$('#mobile-menu');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      
      const menuOpenAfter = await page.$('#mobile-menu:not([style*="display: none"])');
      keyboardTests.escapeKey = menuOpenBefore && !menuOpenAfter;
      log(`  ${keyboardTests.escapeKey ? '✅' : '❌'} Escape key closes overlays`, keyboardTests.escapeKey ? 'green' : 'red');
    }
    
  } catch (error) {
    log(`  ⚠️  Error during keyboard tests: ${error.message}`, 'yellow');
  }
  
  testResults.keyboardTests.push(keyboardTests);
  return keyboardTests;
}

/**
 * Test ARIA attributes
 */
async function testAriaAttributes(browser, page) {
  log('\n🏷️  Testing ARIA Attributes...', 'magenta');
  
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  
  const ariaTests = await page.evaluate(() => {
    const tests = {
      landmarks: false,
      headings: false,
      labels: false,
      liveRegions: false,
      states: false
    };
    
    // Check landmarks
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
    tests.landmarks = landmarks.length >= 4;
    
    // Check heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    let validHierarchy = true;
    headings.forEach(heading => {
      const level = parseInt(heading.tagName[1]);
      if (previousLevel > 0 && level > previousLevel + 1) {
        validHierarchy = false;
      }
      previousLevel = level;
    });
    tests.headings = validHierarchy && headings.length > 0;
    
    // Check form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    let allLabeled = true;
    inputs.forEach(input => {
      const hasLabel = input.labels?.length > 0 || 
                      input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby');
      if (!hasLabel) allLabeled = false;
    });
    tests.labels = allLabeled;
    
    // Check live regions
    const liveRegions = document.querySelectorAll('[aria-live], [role="status"], [role="alert"]');
    tests.liveRegions = liveRegions.length > 0;
    
    // Check button states
    const buttons = document.querySelectorAll('button[aria-pressed], button[aria-expanded]');
    tests.states = buttons.length > 0;
    
    return tests;
  });
  
  log(`  ${ariaTests.landmarks ? '✅' : '❌'} Landmark regions properly defined`, ariaTests.landmarks ? 'green' : 'red');
  log(`  ${ariaTests.headings ? '✅' : '❌'} Heading hierarchy is valid`, ariaTests.headings ? 'green' : 'red');
  log(`  ${ariaTests.labels ? '✅' : '❌'} Form elements have labels`, ariaTests.labels ? 'green' : 'red');
  log(`  ${ariaTests.liveRegions ? '✅' : '❌'} Live regions for dynamic content`, ariaTests.liveRegions ? 'green' : 'red');
  log(`  ${ariaTests.states ? '✅' : '❌'} Interactive elements have state indicators`, ariaTests.states ? 'green' : 'red');
  
  testResults.ariaTests.push(ariaTests);
  return ariaTests;
}

/**
 * Test color contrast
 */
async function testColorContrast(browser, page) {
  log('\n🎨 Testing Color Contrast...', 'magenta');
  
  const contrastTests = {
    lightTheme: { passed: false, issues: [] },
    darkTheme: { passed: false, issues: [] }
  };
  
  // Test light theme
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await page.waitForTimeout(300);
  
  const lightResults = await new AxePuppeteer(page)
    .withTags(['wcag2aa'])
    .withRules(['color-contrast'])
    .analyze();
  
  contrastTests.lightTheme.passed = lightResults.violations.length === 0;
  contrastTests.lightTheme.issues = lightResults.violations;
  
  log(`  ${contrastTests.lightTheme.passed ? '✅' : '❌'} Light theme contrast (${lightResults.violations.length} issues)`, 
      contrastTests.lightTheme.passed ? 'green' : 'red');
  
  // Test dark theme
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(300);
  
  const darkResults = await new AxePuppeteer(page)
    .withTags(['wcag2aa'])
    .withRules(['color-contrast'])
    .analyze();
  
  contrastTests.darkTheme.passed = darkResults.violations.length === 0;
  contrastTests.darkTheme.issues = darkResults.violations;
  
  log(`  ${contrastTests.darkTheme.passed ? '✅' : '❌'} Dark theme contrast (${darkResults.violations.length} issues)`, 
      contrastTests.darkTheme.passed ? 'green' : 'red');
  
  testResults.contrastTests.push(contrastTests);
  return contrastTests;
}

/**
 * Generate HTML report
 */
async function generateReport() {
  const reportPath = path.join(__dirname, 'a11y-report.html');
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; padding: 2rem; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #2c3e50; margin-bottom: 1rem; border-bottom: 3px solid #3498db; padding-bottom: 0.5rem; }
    h2 { color: #34495e; margin: 2rem 0 1rem; border-bottom: 2px solid #ecf0f1; padding-bottom: 0.5rem; }
    h3 { color: #7f8c8d; margin: 1.5rem 0 0.5rem; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
    .card { background: #f8f9fa; padding: 1rem; border-radius: 4px; border-left: 4px solid #3498db; }
    .card.error { border-left-color: #e74c3c; }
    .card.warning { border-left-color: #f39c12; }
    .card.success { border-left-color: #27ae60; }
    .card h4 { color: #2c3e50; margin-bottom: 0.5rem; }
    .card .number { font-size: 2rem; font-weight: bold; color: #3498db; }
    .card.error .number { color: #e74c3c; }
    .card.warning .number { color: #f39c12; }
    .card.success .number { color: #27ae60; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ecf0f1; }
    th { background: #f8f9fa; color: #2c3e50; font-weight: 600; }
    tr:hover { background: #f8f9fa; }
    .severity { padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.875rem; font-weight: 600; display: inline-block; }
    .severity.critical { background: #e74c3c; color: white; }
    .severity.serious { background: #e67e22; color: white; }
    .severity.moderate { background: #f39c12; color: white; }
    .severity.minor { background: #95a5a6; color: white; }
    .pass { color: #27ae60; font-weight: 600; }
    .fail { color: #e74c3c; font-weight: 600; }
    .test-result { margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; }
    .test-result.pass { border-left: 4px solid #27ae60; }
    .test-result.fail { border-left: 4px solid #e74c3c; }
    footer { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #ecf0f1; text-align: center; color: #7f8c8d; }
    .timestamp { color: #95a5a6; font-size: 0.875rem; }
    ul { margin: 0.5rem 0 0.5rem 2rem; }
    li { margin: 0.25rem 0; }
    code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: 'Monaco', 'Courier New', monospace; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 Accessibility Test Report</h1>
    <p class="timestamp">Generated: ${new Date(testResults.timestamp).toLocaleString()}</p>
    <p>URL: <code>${testResults.url}</code></p>
    
    <div class="summary">
      <div class="card success">
        <h4>Passed Tests</h4>
        <div class="number">${testResults.summary.totalPasses}</div>
      </div>
      <div class="card error">
        <h4>Violations</h4>
        <div class="number">${testResults.summary.totalViolations}</div>
      </div>
      <div class="card warning">
        <h4>Incomplete</h4>
        <div class="number">${testResults.summary.totalIncomplete}</div>
      </div>
      <div class="card">
        <h4>Not Applicable</h4>
        <div class="number">${testResults.summary.totalInapplicable}</div>
      </div>
    </div>
    
    <h2>📊 Severity Breakdown</h2>
    <div class="summary">
      <div class="card error">
        <h4>Critical Issues</h4>
        <div class="number">${testResults.summary.criticalIssues}</div>
      </div>
      <div class="card error">
        <h4>Serious Issues</h4>
        <div class="number">${testResults.summary.seriousIssues}</div>
      </div>
      <div class="card warning">
        <h4>Moderate Issues</h4>
        <div class="number">${testResults.summary.moderateIssues}</div>
      </div>
      <div class="card">
        <h4>Minor Issues</h4>
        <div class="number">${testResults.summary.minorIssues}</div>
      </div>
    </div>
    
    <h2>📍 Focus Management</h2>
    ${testResults.focusTests.map(test => `
      <div class="test-result ${Object.values(test).every(v => v) ? 'pass' : 'fail'}">
        <ul>
          <li>${test.skipLink ? '✅' : '❌'} Skip link functionality</li>
          <li>${test.tabOrder ? '✅' : '❌'} Tab order is logical</li>
          <li>${test.focusVisible ? '✅' : '❌'} Focus indicators visible</li>
          <li>${test.focusRestoration ? '✅' : '❌'} Focus restoration after modal</li>
        </ul>
      </div>
    `).join('')}
    
    <h2>⌨️ Keyboard Navigation</h2>
    ${testResults.keyboardTests.map(test => `
      <div class="test-result ${Object.values(test).every(v => v) ? 'pass' : 'fail'}">
        <ul>
          <li>${test.enterActivation ? '✅' : '❌'} Enter key activation</li>
          <li>${test.spaceActivation ? '✅' : '❌'} Space key activation</li>
          <li>${test.escapeKey ? '✅' : '❌'} Escape key functionality</li>
        </ul>
      </div>
    `).join('')}
    
    <h2>🏷️ ARIA Implementation</h2>
    ${testResults.ariaTests.map(test => `
      <div class="test-result ${Object.values(test).every(v => v) ? 'pass' : 'fail'}">
        <ul>
          <li>${test.landmarks ? '✅' : '❌'} Landmark regions defined</li>
          <li>${test.headings ? '✅' : '❌'} Valid heading hierarchy</li>
          <li>${test.labels ? '✅' : '❌'} Form elements labeled</li>
          <li>${test.liveRegions ? '✅' : '❌'} Live regions present</li>
          <li>${test.states ? '✅' : '❌'} State indicators on controls</li>
        </ul>
      </div>
    `).join('')}
    
    <h2>🎨 Color Contrast</h2>
    ${testResults.contrastTests.map(test => `
      <div class="test-result">
        <h3>Light Theme</h3>
        <p>${test.lightTheme.passed ? '✅ Passed' : `❌ Failed (${test.lightTheme.issues.length} issues)`}</p>
        <h3>Dark Theme</h3>
        <p>${test.darkTheme.passed ? '✅ Passed' : `❌ Failed (${test.darkTheme.issues.length} issues)`}</p>
      </div>
    `).join('')}
    
    <h2>📱 Page-by-Page Results</h2>
    ${testResults.pages.map(page => `
      <div class="test-result ${page.violations.length === 0 ? 'pass' : 'fail'}">
        <h3>${page.page} - ${page.viewport}</h3>
        <p>URL: <code>${page.url}</code></p>
        ${page.violations.length === 0 ? 
          '<p class="pass">✅ No violations found</p>' :
          `<p class="fail">❌ ${page.violations.length} violation(s) found</p>
          <ul>
            ${page.violations.map(v => `
              <li>
                <span class="severity ${v.impact}">${v.impact.toUpperCase()}</span>
                ${v.description}
                <br><small>Rule: <code>${v.id}</code> | ${v.nodes.length} instance(s)</small>
              </li>
            `).join('')}
          </ul>`
        }
      </div>
    `).join('')}
    
    <footer>
      <p>Generated by Automated Accessibility Testing Suite</p>
      <p>Powered by axe-core and Puppeteer</p>
    </footer>
  </div>
</body>
</html>`;
  
  await fs.writeFile(reportPath, html);
  log(`\n📄 HTML report generated: ${reportPath}`, 'green');
  
  // Also save JSON results
  const jsonPath = path.join(__dirname, 'a11y-report.json');
  await fs.writeFile(jsonPath, JSON.stringify(testResults, null, 2));
  log(`📄 JSON report generated: ${jsonPath}`, 'green');
}

/**
 * Main test runner
 */
async function runTests() {
  log(`${colors.bold}${colors.blue}
╔══════════════════════════════════════════════╗
║     Automated Accessibility Testing Suite    ║
║              Portfolio Website                ║
╚══════════════════════════════════════════════╝${colors.reset}`, 'reset');
  
  log(`\n🌐 Testing URL: ${BASE_URL}`, 'cyan');
  log(`📋 WCAG Standards: ${WCAG_TAGS.join(', ')}`, 'cyan');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Run axe-core tests for each page and viewport
    for (const pageInfo of PAGES_TO_TEST) {
      for (const viewport of VIEWPORT_SIZES) {
        const page = await browser.newPage();
        await testAccessibility(browser, page, pageInfo, viewport);
        await page.close();
      }
    }
    
    // Run additional focused tests
    const page = await browser.newPage();
    await testFocusManagement(browser, page);
    await testKeyboardNavigation(browser, page);
    await testAriaAttributes(browser, page);
    await testColorContrast(browser, page);
    await page.close();
    
    // Generate reports
    await generateReport();
    
    // Summary
    log(`\n${colors.bold}═══════════════════ SUMMARY ═══════════════════${colors.reset}`);
    
    const totalIssues = testResults.summary.totalViolations;
    const criticalCount = testResults.summary.criticalIssues + testResults.summary.seriousIssues;
    
    if (totalIssues === 0) {
      log(`\n🎉 ${colors.green}${colors.bold}EXCELLENT! No accessibility violations found!${colors.reset}`, 'reset');
      log(`   All ${testResults.summary.totalPasses} tests passed successfully.`, 'green');
    } else if (criticalCount === 0) {
      log(`\n⚠️  ${colors.yellow}${colors.bold}GOOD with minor issues${colors.reset}`, 'reset');
      log(`   ${totalIssues} non-critical issue(s) found.`, 'yellow');
      log(`   Passed: ${testResults.summary.totalPasses} tests`, 'green');
    } else {
      log(`\n❌ ${colors.red}${colors.bold}CRITICAL ISSUES FOUND${colors.reset}`, 'reset');
      log(`   ${criticalCount} critical/serious issue(s) require immediate attention.`, 'red');
      log(`   Total violations: ${totalIssues}`, 'red');
    }
    
    log(`\n📊 Issue Breakdown:`, 'cyan');
    log(`   Critical: ${testResults.summary.criticalIssues}`, testResults.summary.criticalIssues > 0 ? 'red' : 'green');
    log(`   Serious: ${testResults.summary.seriousIssues}`, testResults.summary.seriousIssues > 0 ? 'red' : 'green');
    log(`   Moderate: ${testResults.summary.moderateIssues}`, testResults.summary.moderateIssues > 0 ? 'yellow' : 'green');
    log(`   Minor: ${testResults.summary.minorIssues}`, 'cyan');
    
    // Exit with appropriate code
    process.exit(criticalCount > 0 ? 1 : 0);
    
  } catch (error) {
    log(`\n❌ Test execution failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(error => {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

module.exports = { runTests, testResults };