# HeroOverlay Documentation

## Overview

Complete documentation for the HeroOverlay component - a sophisticated particle animation system with adaptive performance optimization for interactive background effects.

## Quick Links

- 📚 **[Usage Guide](./components/hero-overlay.md)** - Start here for basic implementation
- ⚡ **[Performance Guide](./performance/hero-overlay-optimization.md)** - Optimization strategies and performance tuning
- 🔧 **[Troubleshooting](./troubleshooting/hero-overlay-troubleshooting.md)** - Common issues and solutions
- 📖 **[Configuration Reference](./configuration/hero-overlay-config.md)** - Complete API documentation
- 🔗 **[Integration Examples](./examples/hero-overlay-examples.md)** - Framework-specific implementations

## What is HeroOverlay?

HeroOverlay is a React component that creates interactive particle animations with:

- **Adaptive Performance**: Automatically adjusts quality based on device capabilities
- **Mouse/Touch Interaction**: Particles respond to cursor movement and touch
- **Accessibility Support**: Respects `prefers-reduced-motion` and provides ARIA labels
- **TypeScript Support**: Fully typed with comprehensive interfaces
- **Framework Agnostic**: Works with Next.js, Vite, and any React environment

## Getting Started

### Basic Implementation

```tsx
import HeroOverlay from '@/components/HeroOverlay';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen">
      <HeroOverlay />
      <div className="relative z-10">
        <h1>Your Content Here</h1>
      </div>
    </div>
  );
}
```

### Custom Configuration

```tsx
import HeroOverlay, { PerformanceMode, AnimationIntensity } from '@/components/HeroOverlay';

<HeroOverlay
  particleCount={60}
  performanceMode={PerformanceMode.BALANCED}
  intensity={AnimationIntensity.NORMAL}
  colors={{
    primary: '#8B5CF6',
    secondary: '#3B82F6'
  }}
  debug={process.env.NODE_ENV === 'development'}
/>
```

## Documentation Structure

### 📚 [Usage Guide](./components/hero-overlay.md)
- Quick start examples
- Configuration options
- Event handlers
- Accessibility features
- Best practices

### ⚡ [Performance Optimization](./performance/hero-overlay-optimization.md)
- Performance architecture overview
- Device-specific optimizations
- Automatic quality adjustment
- Memory management
- Lighthouse optimization

### 🔧 [Troubleshooting](./troubleshooting/hero-overlay-troubleshooting.md)
- Common issues and solutions
- Debug mode usage
- Performance problems
- Device-specific issues
- Error handling

### 📖 [Configuration Reference](./configuration/hero-overlay-config.md)
- Complete props documentation
- Interface definitions
- Enums and constants
- Default values
- Validation rules

### 🔗 [Integration Examples](./examples/hero-overlay-examples.md)
- Next.js implementation
- React + Vite setup
- TypeScript integration
- Responsive design
- State management
- Theme integration
- Testing examples

## Key Features

### 🎯 Performance Modes

| Mode | Particles | Features | Use Case |
|------|-----------|----------|----------|
| **HIGH** | 80 | All enabled | High-end desktop |
| **BALANCED** | 50 | Selective | Most devices (recommended) |
| **LOW** | 30 | Minimal | Low-end mobile |

### 🎨 Visual Effects

- **Particles**: Animated points with customizable colors and sizes
- **Connections**: Dynamic lines between nearby particles
- **Mouse Interaction**: Repulsion effects around cursor/touch
- **Pulse Effects**: Breathing animation for particles
- **Gradient Background**: Subtle background gradients

### 🔧 Configuration Options

- **Particle Count**: 1-200 particles (performance-aware)
- **Animation Intensity**: Subtle, Normal, or Dramatic
- **Color Schemes**: Fully customizable colors and gradients
- **Feature Toggles**: Enable/disable specific effects
- **Accessibility**: Motion preference support and ARIA labels

## Browser Support

- ✅ **Chrome/Edge**: Full support
- ✅ **Firefox**: Full support
- ✅ **Safari**: Full support with optimizations
- ✅ **Mobile Browsers**: Touch interaction support
- ✅ **Legacy Browsers**: Graceful degradation

## Performance Targets

- **Desktop**: 60 FPS sustained
- **Mobile**: 45+ FPS with battery optimization
- **Low-end devices**: 30+ FPS with automatic degradation
- **Memory**: < 50MB peak usage
- **Lighthouse**: 90+ performance score

## Accessibility

The component is built with accessibility in mind:

- Respects `prefers-reduced-motion` system setting
- Provides meaningful ARIA labels for screen readers
- Maintains focus management and keyboard navigation
- Ensures sufficient color contrast for overlaid content

## Quick Troubleshooting

### Component Not Rendering
1. Check for SSR issues - use dynamic imports
2. Verify Canvas API support
3. Ensure proper z-index stacking

### Poor Performance
1. Reduce particle count
2. Disable expensive features (connections, pulse)
3. Enable auto-quality adjustment
4. Check device capabilities in debug mode

### Mouse Interaction Issues
1. Verify `mouseInteraction` feature is enabled
2. Check z-index and pointer-events
3. Adjust interaction radius and force
4. Test touch events on mobile

## Development Workflow

### 1. Enable Debug Mode
```tsx
<HeroOverlay debug={true} debugPosition="TOP_RIGHT" />
```

### 2. Monitor Performance
```tsx
<HeroOverlay 
  events={{
    onFrame: (metrics) => {
      if (metrics.fps < 30) console.warn('Low FPS:', metrics);
    }
  }}
/>
```

### 3. Test Accessibility
```tsx
// Test with reduced motion
// Test with screen readers
// Verify keyboard navigation
```

### 4. Optimize for Production
```tsx
<HeroOverlay 
  performanceMode={PerformanceMode.BALANCED}
  features={{ autoQuality: true }}
  debug={false}
/>
```

## Contributing

When contributing to HeroOverlay documentation:

1. **Follow the existing structure** and format
2. **Include practical examples** with copy-paste code
3. **Test examples** across different browsers and devices
4. **Update cross-references** between documentation files
5. **Consider accessibility** in all examples and recommendations

## Support

For issues not covered in the documentation:

1. Check the [Troubleshooting Guide](./troubleshooting/hero-overlay-troubleshooting.md)
2. Review [Configuration Reference](./configuration/hero-overlay-config.md)
3. Examine [Integration Examples](./examples/hero-overlay-examples.md)
4. Enable debug mode and check console output
5. Test on different devices and browsers

## Examples by Use Case

### Landing Pages
- [Hero Section Implementation](./examples/hero-overlay-examples.md#next-js-integration)
- [Full-screen Background](./examples/hero-overlay-examples.md#full-screen-background)

### Performance-Critical
- [Mobile Optimization](./examples/hero-overlay-examples.md#mobile-devices)
- [Low-end Device Support](./examples/hero-overlay-examples.md#low-end-devices)

### Advanced Integration
- [State Management](./examples/hero-overlay-examples.md#state-management-integration)
- [Theme Integration](./examples/hero-overlay-examples.md#theme-integration)
- [Animation Libraries](./examples/hero-overlay-examples.md#animation-library-integration)

### Testing & Monitoring
- [Unit Testing](./examples/hero-overlay-examples.md#jest--testing-library)
- [E2E Testing](./examples/hero-overlay-examples.md#playwright-e2e-testing)
- [Performance Monitoring](./examples/hero-overlay-examples.md#performance-monitoring-integration)

---

**Last Updated**: August 2024  
**Version**: 1.0.0  
**Compatibility**: React 18+, TypeScript 4.5+