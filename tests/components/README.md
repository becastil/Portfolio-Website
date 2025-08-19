# HeroOverlay Component Test Suite

Comprehensive Playwright test suite for the HeroOverlay interactive particle animation component.

## Test Coverage

### Core Tests (`hero-overlay.spec.ts`)

#### Component Initialization
- Canvas element rendering and dimensions
- ARIA attributes for accessibility
- Container classes and styling
- Custom className prop support

#### Performance Mode Switching
- Debug overlay display
- Particle count adjustment per mode (HIGH/BALANCED/LOW)
- Feature toggling based on performance mode
- Automatic quality adjustment

#### Device Capability Detection
- GPU tier detection
- CPU core count
- Pixel ratio handling
- Touch support detection
- High DPI display adaptation

#### Interaction Handlers
- **Mouse Interaction**
  - Movement response
  - Leave event handling
  - Interaction toggle respect
- **Touch Interaction**
  - Touch event handling
  - Swipe gestures
  - Mobile device support

#### Accessibility Features
- `prefers-reduced-motion` support
- ARIA labels and roles
- Keyboard navigation non-interference
- Screen reader compatibility

#### Particle System Behavior
- Continuous animation
- Boundary wrapping/bouncing
- Connection line rendering
- Pulse effect application
- Particle physics simulation

#### Debug Overlay Functionality
- Debug information display
- Real-time FPS counter
- Performance metrics
- Feature toggle states
- Positioning options

#### Performance and Optimization
- 60fps maintenance
- Auto-quality adjustment
- RequestAnimationFrame usage
- Resource cleanup on unmount
- Memory management

#### Error States and Fallbacks
- Canvas context loss recovery
- Missing WebGL handling
- Rapid viewport resizing
- Invalid props handling
- Graceful degradation

### Edge Cases and Stress Tests (`hero-overlay-edge-cases.spec.ts`)

#### Extreme Viewport Sizes
- Very small viewports (320x568)
- 4K resolution (3840x2160)
- Extreme aspect ratios
- Dynamic viewport changes

#### Performance Stress Tests
- Rapid mouse movements
- Extended continuous interaction
- Performance recovery after drops
- Heavy page activity handling

#### Browser Compatibility
- Browser zoom levels (50% - 200%)
- Page visibility changes (tab switching)
- Print media handling
- Cross-browser rendering

#### Memory and Resource Management
- Memory leak prevention
- Event listener cleanup
- Garbage collection
- Resource disposal

#### Advanced Accessibility
- Dynamic content accessibility
- High contrast mode support
- Animation preference respect
- Focus management

#### Error Recovery
- WebGL context loss and restoration
- Invalid configuration handling
- Rapid prop changes
- Fallback mechanisms

#### Page Integration
- Scroll interaction
- CSS animation coexistence
- DOM mutation handling
- Layout shift prevention

## Test Utilities (`test-utils.ts`)

Helper functions for testing:

- `waitForHeroOverlayInit()` - Wait for canvas initialization
- `getHeroOverlayMetrics()` - Extract performance metrics
- `getHeroOverlayFeatures()` - Get feature toggle states
- `simulateMouseInteraction()` - Simulate mouse patterns
- `getCanvasSnapshot()` - Capture canvas state
- `measureFrameRate()` - Measure FPS statistics
- `checkReducedMotionSupport()` - Verify accessibility
- `getCanvasMemoryUsage()` - Calculate memory usage
- `testParticleBoundaries()` - Test boundary behavior
- `verifyAccessibility()` - Check ARIA attributes

## Running Tests

### Run all component tests
```bash
npm run test:components
```

### Run specific test file
```bash
npx playwright test tests/components/hero-overlay.spec.ts
```

### Run with UI mode for debugging
```bash
npx playwright test --ui tests/components/
```

### Run specific test suite
```bash
npx playwright test -g "Performance Mode Switching"
```

### Run edge case tests only
```bash
npx playwright test tests/components/hero-overlay-edge-cases.spec.ts
```

## Test Configuration

Tests are configured to run in parallel across multiple browsers:
- Chromium (Desktop, Tablet, Mobile)
- Firefox (Desktop, Tablet, Mobile)
- WebKit/Safari (Desktop)

Each test includes:
- Automatic retries on failure (2 in CI)
- Screenshots on failure
- Video recording on failure
- Trace collection for debugging

## Performance Benchmarks

Expected performance targets:
- **FPS**: Average 60fps, minimum 30fps
- **Memory**: < 100MB for standard viewport, < 200MB for 4K
- **Initialization**: < 500ms
- **Interaction latency**: < 16.67ms (single frame)
- **Context recovery**: < 1000ms

## Accessibility Requirements

All tests verify:
- WCAG 2.2 AA compliance
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion preference respect

## Browser Support

Tests verify compatibility with:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Continuous Integration

Tests are automatically run on:
- Pull requests
- Main branch commits
- Nightly builds
- Release candidates

Test results are reported in:
- HTML reports
- JUnit XML (for CI integration)
- JSON format (for custom tooling)

## Debugging Failed Tests

1. **View HTML report**:
   ```bash
   npx playwright show-report
   ```

2. **Run in headed mode**:
   ```bash
   npx playwright test --headed
   ```

3. **Use debug mode**:
   ```bash
   npx playwright test --debug
   ```

4. **View traces**:
   ```bash
   npx playwright show-trace trace.zip
   ```

## Contributing

When adding new tests:
1. Follow existing patterns and naming conventions
2. Include descriptive test names
3. Add appropriate assertions
4. Consider edge cases
5. Update this README with new coverage

## Test Maintenance

Regular maintenance tasks:
- Update performance benchmarks quarterly
- Review and update browser versions
- Add tests for new features
- Remove obsolete tests
- Optimize test execution time