# Visual Regression Tests for HeroOverlay Component

This directory contains comprehensive visual regression tests for the HeroOverlay component, ensuring visual consistency across different states, configurations, and environments.

## Overview

The visual regression tests capture screenshots of the HeroOverlay component in various states and compare them against baseline images to detect unintended visual changes.

## Test Coverage

### Performance Modes
- **HIGH**: Maximum quality with all effects enabled
- **BALANCED**: Balanced performance with selective effects  
- **LOW**: Minimal effects for low-end devices
- Performance mode transitions

### Animation Intensities
- **SUBTLE**: Minimal movement and effects
- **NORMAL**: Standard animation intensity
- **DRAMATIC**: Enhanced animations and effects
- Mouse interaction effects for each intensity

### Responsive Viewports
- Desktop (1920x1080)
- Laptop (1440x900)
- Tablet (768x1024)
- Mobile (375x812)
- Ultrawide (3440x1440)
- Dynamic viewport resize handling

### Accessibility Features
- Reduced motion preference
- High contrast mode
- Keyboard navigation (ensuring no visual impact)

### Debug Overlay
- All four position options (TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT)
- Debug content updates
- Performance metrics display

### Error States and Fallbacks
- Canvas not supported
- WebGL not available
- Memory constraints
- Error boundary activation

### Interaction States
- Mouse hover effects at multiple positions
- Mouse trail effects
- Touch interaction simulation

### Theme Integration
- Light theme
- Dark theme
- Theme transitions

### Combined States
- Complex combinations of modes, intensities, and settings
- Accessibility combinations (reduced motion + high contrast + debug)

## Running the Tests

### Prerequisites
1. Ensure you have Node.js and npm installed
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Test Commands

Run all visual tests:
```bash
npm run test:visual
```

Run visual tests in headed mode (see browser):
```bash
npm run test:visual:headed
```

Run visual tests with UI mode (interactive):
```bash
npm run test:visual:ui
```

Run only HeroOverlay visual tests:
```bash
npm run test:visual:hero
```

Update baseline snapshots:
```bash
npm run test:visual:update
# or for HeroOverlay only:
npm run test:visual:hero:update
```

### Running Specific Tests

Run tests for a specific browser:
```bash
npx playwright test tests/visual/ --project=chromium-desktop
```

Run a specific test suite:
```bash
npx playwright test tests/visual/hero-overlay-visual.spec.ts -g "Performance Modes"
```

## Test Structure

### Configuration
Tests use a comprehensive configuration object that defines:
- Screenshot options (threshold, animations, pixel differences)
- Wait times for various states
- Test viewports
- Test configurations for different modes

### Helper Functions
- `setupHeroOverlay()`: Configures and navigates to the test page
- `captureScreenshot()`: Takes consistent screenshots
- `simulateMouseInteraction()`: Simulates mouse movements

### Test Organization
Tests are organized into logical groups:
1. Performance Mode Tests
2. Animation Intensity Tests
3. Viewport Tests
4. Accessibility Tests
5. Debug Overlay Tests
6. Error States Tests
7. Interaction Tests
8. Theme Tests
9. Combined State Tests

## Snapshot Management

### Snapshot Storage
Snapshots are stored in `./tests/visual/snapshots/` with a structured naming convention:
```
hero-overlay-{test-type}-{variant}.png
```

### Updating Snapshots
When intentional visual changes are made to the HeroOverlay component:
1. Review the changes carefully
2. Run tests to see failures
3. Update snapshots: `npm run test:visual:update`
4. Commit the new snapshots with your changes

### Snapshot Comparison
The tests use a 20% threshold for pixel differences with a maximum of 100 different pixels allowed. This prevents false positives from minor rendering differences while catching significant visual changes.

## CI/CD Integration

Visual tests can be integrated into CI/CD pipelines:
1. Run tests on pull requests
2. Store snapshots as artifacts
3. Generate visual diff reports
4. Fail builds on visual regressions

## Debugging Failed Tests

When a visual test fails:

1. **Check the test report**: 
   ```bash
   npx playwright show-report
   ```

2. **Review the diff images**: Look for actual vs expected comparisons

3. **Run in headed mode**: 
   ```bash
   npm run test:visual:headed
   ```

4. **Use UI mode for debugging**:
   ```bash
   npm run test:visual:ui
   ```

5. **Check for timing issues**: Increase wait times if animations haven't settled

6. **Verify test environment**: Ensure the dev server is running and accessible

## Best Practices

1. **Consistent Environment**: Always run tests in the same environment to avoid false positives
2. **Disable Animations**: Tests disable animations for consistent snapshots
3. **Wait for Stability**: Ensure elements have fully rendered before capturing
4. **Meaningful Names**: Use descriptive names for snapshots
5. **Regular Updates**: Keep snapshots up-to-date with intentional changes
6. **Review Changes**: Always review snapshot diffs before updating baselines

## Troubleshooting

### Common Issues

**Tests timing out:**
- Ensure the development server is running (`npm run dev`)
- Check that the test page (`/test-hero-overlay`) is accessible
- Increase timeout values in test configuration

**Snapshots don't match:**
- Check for environment differences (OS, browser versions)
- Verify animations are properly disabled
- Review threshold settings if differences are minor

**Canvas/WebGL errors:**
- Ensure browser supports required features
- Check that GPU acceleration is enabled for tests
- Verify WebGL flags in Playwright configuration

**Memory issues:**
- Close other applications to free memory
- Run tests sequentially instead of in parallel
- Reduce the number of particles in test configurations

## Contributing

When adding new visual tests:
1. Follow the existing test structure and naming conventions
2. Add appropriate wait times for animations
3. Include both positive and negative test cases
4. Document any new test configurations
5. Update this README with new test coverage

## Related Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Visual Testing Best Practices](https://playwright.dev/docs/test-snapshots)
- [HeroOverlay Component Documentation](../../components/HeroOverlay.tsx)