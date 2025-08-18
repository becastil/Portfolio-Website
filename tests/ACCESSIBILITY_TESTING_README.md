# Accessibility Testing Suite

This comprehensive accessibility testing suite ensures the portfolio website meets WCAG 2.1 AA standards and provides an excellent experience for all users, including those using assistive technologies.

## Overview

The testing suite includes three main components:

1. **Manual Testing Checklist** - Structured manual tests for human testers
2. **Automated Accessibility Scanner** - Axe-core based automated testing
3. **End-to-End Accessibility Tests** - Playwright tests for interactive features

## Prerequisites

Install dependencies:
```bash
npm install
```

Ensure you have:
- Node.js 18+ installed
- Chrome/Chromium browser for automated tests
- Optional: Screen reader software (NVDA, JAWS, or VoiceOver)

## Running the Tests

### 1. Automated Accessibility Scanner

Run the comprehensive axe-core accessibility scan:

```bash
# Run against local development server
npm run dev
# In another terminal:
npm run test:a11y

# Or run against production build
npm run test:a11y:server
```

This will:
- Test all pages at multiple viewport sizes
- Check WCAG 2.1 AA compliance
- Test focus management
- Verify keyboard navigation
- Check ARIA implementation
- Test color contrast in all themes
- Generate HTML and JSON reports

**Output files:**
- `tests/a11y-report.html` - Visual HTML report
- `tests/a11y-report.json` - Machine-readable results

### 2. End-to-End Accessibility Tests (Playwright)

Run the Playwright accessibility test suite:

```bash
# Run all accessibility tests
npm run test:a11y:e2e

# Run with browser visible (for debugging)
npm run test:a11y:e2e:headed

# Run specific test file
npx playwright test tests/e2e/accessibility.spec.ts

# Run with debugging
npx playwright test tests/e2e/accessibility.spec.ts --debug
```

These tests cover:
- Skip link functionality
- Navigation keyboard interaction
- Theme toggle behavior
- Mobile menu accessibility
- Back to top button
- Focus trap in mobile menu
- ARIA live regions
- Reduced motion support
- Full WCAG compliance scan

### 3. Manual Testing

Use the manual testing checklist for human verification:

1. Open `tests/manual/accessibility-checklist.md`
2. Follow each test systematically
3. Mark items as pass/fail
4. Document any issues found

Manual testing is essential for:
- Screen reader compatibility
- Keyboard navigation flow
- Focus management verification
- User experience validation

## Test Coverage

### Components Tested

- **Navigation**
  - Skip link
  - Main navigation
  - Mobile menu
  - Active states
  - Focus management

- **Theme Toggle**
  - Keyboard operation
  - State persistence
  - System preference respect
  - Announcements

- **Interactive Elements**
  - Buttons
  - Links
  - Form controls
  - Back to top button

- **Accessibility Features**
  - ARIA landmarks
  - Heading hierarchy
  - Live regions
  - Focus indicators
  - Color contrast
  - Reduced motion

### WCAG 2.1 Criteria Covered

- **Level A**: All criteria tested
- **Level AA**: All criteria tested
- **Best Practices**: Additional usability checks

Key areas:
- 1.3.1 Info and Relationships
- 1.4.3 Contrast (Minimum)
- 2.1.1 Keyboard
- 2.1.2 No Keyboard Trap
- 2.4.3 Focus Order
- 2.4.7 Focus Visible
- 3.2.1 On Focus
- 4.1.2 Name, Role, Value

## Understanding Test Results

### Automated Test Results

The HTML report shows:
- **Summary cards** - Overview of passes, violations, incomplete
- **Severity breakdown** - Critical, serious, moderate, minor issues
- **Detailed violations** - Specific issues with remediation guidance
- **Page-by-page results** - Issues per page and viewport

Severity levels:
- **Critical**: Blocks access to content
- **Serious**: Significant barrier
- **Moderate**: Frustrating experience
- **Minor**: Annoyance

### Playwright Test Results

```bash
# View test results
npx playwright show-report

# Generate detailed report
npx playwright test --reporter=html
```

### Manual Test Results

Document findings using the template in the checklist:
- Test name and expected behavior
- Actual behavior observed
- Severity rating
- Suggested fixes

## Common Issues and Fixes

### Focus Management Issues

**Problem**: Focus not visible
```css
/* Fix: Add visible focus styles */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

**Problem**: Focus trapped
```javascript
// Fix: Implement proper focus trap with escape
if (e.key === 'Escape') {
  closeModal();
  triggerElement.focus();
}
```

### ARIA Issues

**Problem**: Missing labels
```html
<!-- Fix: Add aria-label -->
<button aria-label="Open navigation menu">
  <svg>...</svg>
</button>
```

**Problem**: Invalid ARIA usage
```html
<!-- Fix: Use correct ARIA attributes -->
<div role="navigation" aria-label="Main">
  <!-- navigation items -->
</div>
```

### Contrast Issues

**Problem**: Insufficient contrast
```css
/* Fix: Ensure 4.5:1 for normal text, 3:1 for large */
.text {
  color: #767676; /* 4.5:1 on white */
  background: #ffffff;
}
```

## Continuous Integration

Add to your CI pipeline:

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test:a11y:e2e
      - run: npm run test:a11y:server
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: accessibility-reports
          path: |
            tests/a11y-report.html
            tests/a11y-report.json
            playwright-report/
```

## Best Practices

1. **Test Early and Often**
   - Run tests during development
   - Include in pre-commit hooks
   - Automate in CI/CD

2. **Test with Real Users**
   - Include users with disabilities
   - Test with actual assistive technologies
   - Gather feedback on usability

3. **Document Accessibility Features**
   - Maintain accessibility statement
   - Document keyboard shortcuts
   - Provide usage instructions

4. **Regular Audits**
   - Monthly automated scans
   - Quarterly manual reviews
   - Annual third-party audit

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Axe-core Documentation](https://www.deque.com/axe/core-documentation/)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [WebAIM Resources](https://webaim.org/resources/)

## Support

For questions or issues:
1. Check the test output for specific guidance
2. Consult the WCAG documentation
3. Review the manual testing checklist
4. Open an issue with test results attached

## Expected Test Outcomes

When all tests pass, you should see:

### Automated Scanner
```
🎉 EXCELLENT! No accessibility violations found!
   All [number] tests passed successfully.
```

### Playwright Tests
```
  ✓ Skip link functionality
  ✓ Navigation keyboard interaction
  ✓ Theme toggle behavior
  ✓ Mobile menu accessibility
  ✓ Back to top button
  ✓ Focus trap in mobile menu
  ✓ WCAG 2.1 AA Compliance

  XX passed (XXs)
```

### Manual Testing
- All checklist items marked as passing
- Smooth keyboard navigation experience
- Clear screen reader announcements
- Proper focus management throughout

## Maintenance

Keep tests up-to-date:
1. Update tests when adding new features
2. Review and update WCAG criteria annually
3. Update dependencies regularly
4. Monitor for new accessibility standards

---

Remember: Accessibility is not a one-time task but an ongoing commitment to inclusive design.