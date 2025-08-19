# HeroOverlay Component Documentation

## Overview

The `HeroOverlay` component is a sophisticated particle animation system with adaptive performance optimization designed for creating interactive background effects. It provides a canvas-based particle field with connections, mouse interactions, and various visual effects that automatically adapt to device capabilities.

## Features

- ✅ **Interactive Particle System**: Canvas-based particles with mouse/touch interaction
- ✅ **Adaptive Performance**: Automatic quality adjustment based on device capabilities and FPS
- ✅ **Accessibility Compliant**: Respects `prefers-reduced-motion` and provides ARIA support
- ✅ **Customizable Appearance**: Full control over colors, animations, and visual effects
- ✅ **Touch Support**: Works seamlessly on mobile devices with touch interactions
- ✅ **Debug Tools**: Built-in debug overlay for performance monitoring and tuning

## Quick Start

### Basic Usage

```tsx
import HeroOverlay from '@/components/HeroOverlay';

export default function HeroSection() {
  return (
    <div className="relative min-h-screen">
      {/* Background overlay */}
      <HeroOverlay />
      
      {/* Your content goes here */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1>Welcome to My Portfolio</h1>
      </div>
    </div>
  );
}
```

### Custom Configuration

```tsx
import HeroOverlay, { 
  PerformanceMode, 
  AnimationIntensity,
  DebugPosition 
} from '@/components/HeroOverlay';

export default function CustomHero() {
  return (
    <HeroOverlay
      particleCount={60}
      performanceMode={PerformanceMode.BALANCED}
      intensity={AnimationIntensity.DRAMATIC}
      colors={{
        primary: '#8B5CF6',
        secondary: '#3B82F6',
        connectionColor: 'rgba(139, 92, 246, 0.2)',
        gradientColors: ['#1e1b4b', '#312e81', '#1e1b4b']
      }}
      animation={{
        speedMultiplier: 1.2,
        mouseRadius: 300,
        mouseForce: 0.08
      }}
      features={{
        particles: true,
        connections: true,
        mouseInteraction: true,
        pulseEffect: true,
        gradientBackground: true,
        autoQuality: true
      }}
      debug={process.env.NODE_ENV === 'development'}
      debugPosition={DebugPosition.TOP_RIGHT}
    />
  );
}
```

## Configuration Options

### Performance Modes

Control the quality and resource usage of the particle system:

```tsx
// Maximum quality with all effects enabled
<HeroOverlay performanceMode={PerformanceMode.HIGH} />

// Balanced performance with selective effects (recommended)
<HeroOverlay performanceMode={PerformanceMode.BALANCED} />

// Minimal effects for low-end devices
<HeroOverlay performanceMode={PerformanceMode.LOW} />
```

### Animation Intensity

Control the speed and dramatic effect of particle movements:

```tsx
// Subtle animations for professional environments
<HeroOverlay intensity={AnimationIntensity.SUBTLE} />

// Standard animation intensity (default)
<HeroOverlay intensity={AnimationIntensity.NORMAL} />

// Enhanced animations for maximum visual impact
<HeroOverlay intensity={AnimationIntensity.DRAMATIC} />
```

### Color Customization

Create custom color schemes that match your brand:

```tsx
const customColors = {
  primary: '#FF6B6B',        // Main particle color
  secondary: '#4ECDC4',      // Secondary particle color
  connectionColor: 'rgba(255, 107, 107, 0.1)', // Connection line color
  gradientColors: [          // Background gradient colors
    '#2C1810',
    '#8B4513',
    '#2C1810'
  ]
};

<HeroOverlay colors={customColors} />
```

### Animation Configuration

Fine-tune animation behavior and interaction settings:

```tsx
const animationConfig = {
  speedMultiplier: 1.5,      // Particle movement speed
  connectionOpacity: 0.2,    // Connection line opacity
  connectionDistance: 150,   // Maximum connection distance
  pulseSpeed: 0.001,         // Pulse effect speed
  mouseRadius: 250,          // Mouse interaction radius
  mouseForce: 0.05          // Mouse interaction force
};

<HeroOverlay animation={animationConfig} />
```

### Feature Toggles

Enable or disable specific visual features:

```tsx
const features = {
  particles: true,           // Show particles
  connections: true,         // Show connection lines
  mouseInteraction: true,    // Enable mouse interaction
  pulseEffect: true,         // Enable particle pulsing
  gradientBackground: true,  // Show gradient background
  autoQuality: true         // Enable automatic quality adjustment
};

<HeroOverlay features={features} />
```

## Event Handlers

Monitor performance and react to component lifecycle events:

```tsx
const events = {
  onInit: () => {
    console.log('HeroOverlay initialized');
  },
  
  onFrame: (metrics) => {
    // Monitor performance metrics
    if (metrics.fps < 30) {
      console.warn('Performance degraded:', metrics);
    }
  },
  
  onPerformanceModeChange: (newMode) => {
    console.log('Performance mode changed to:', newMode);
  },
  
  onDestroy: () => {
    console.log('HeroOverlay destroyed');
  }
};

<HeroOverlay events={events} />
```

## Accessibility Features

The component is designed with accessibility in mind:

```tsx
const accessibilityConfig = {
  respectMotionPreference: true,              // Respects prefers-reduced-motion
  ariaLabel: 'Decorative particle animation', // Screen reader description
  keyboardControls: false                     // Keyboard interaction (optional)
};

<HeroOverlay accessibility={accessibilityConfig} />
```

### Motion Preference Support

The component automatically respects user motion preferences:

- **prefers-reduced-motion: reduce**: Disables all animations
- **prefers-reduced-motion: no-preference**: Full animations enabled

## Responsive Behavior

The overlay automatically adapts to different screen sizes and devices:

### Desktop
- Full mouse interaction with smooth cursor following
- All visual effects enabled by default
- Optimal particle count and connection density

### Mobile & Tablet
- Touch interaction support
- Automatic performance optimization for battery life
- Reduced particle count on low-end devices

### Bounds Configuration

Control how particles behave at screen edges:

```tsx
const boundsConfig = {
  padding: 50,    // Padding from edges in pixels
  bounce: false,  // Bounce off edges
  wrap: true     // Wrap around edges (default)
};

<HeroOverlay bounds={boundsConfig} />
```

## Debug Mode

Enable debug mode to monitor performance and tune settings:

```tsx
<HeroOverlay 
  debug={true}
  debugPosition={DebugPosition.TOP_RIGHT}
/>
```

The debug overlay shows:
- Current and average FPS
- Particle and connection counts
- Performance mode and GPU tier
- Feature toggle status
- Device capabilities

## Best Practices

### Performance Optimization

1. **Use Balanced Mode**: Start with `PerformanceMode.BALANCED` for most use cases
2. **Enable Auto Quality**: Keep `autoQuality: true` to automatically adjust performance
3. **Monitor FPS**: Use debug mode during development to monitor performance
4. **Test on Low-End Devices**: Verify performance on older mobile devices

### Accessibility

1. **Always Respect Motion Preferences**: Keep `respectMotionPreference: true`
2. **Provide Descriptive Labels**: Use meaningful `ariaLabel` text
3. **Test with Screen Readers**: Verify the overlay doesn't interfere with navigation

### Visual Design

1. **Maintain Text Contrast**: Ensure overlay doesn't reduce text readability
2. **Use Subtle Effects**: Avoid overwhelming the main content
3. **Brand Consistency**: Match colors to your design system
4. **Test in Dark Mode**: Verify appearance in both light and dark themes

## Common Patterns

### Hero Section with Overlay

```tsx
export default function Hero() {
  return (
    <section className="relative min-h-screen bg-slate-900">
      {/* Particle overlay */}
      <HeroOverlay
        intensity={AnimationIntensity.SUBTLE}
        colors={{
          primary: '#8B5CF6',
          secondary: '#3B82F6'
        }}
      />
      
      {/* Content with proper z-index */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6">
            Welcome to the Future
          </h1>
          <p className="text-xl opacity-90">
            Interactive experiences that captivate and engage
          </p>
        </div>
      </div>
    </section>
  );
}
```

### Full-Screen Background

```tsx
export default function FullScreenOverlay() {
  return (
    <div className="fixed inset-0 -z-10">
      <HeroOverlay
        performanceMode={PerformanceMode.HIGH}
        particleCount={100}
        features={{
          gradientBackground: true,
          autoQuality: true
        }}
      />
    </div>
  );
}
```

### Conditional Rendering

```tsx
export default function ConditionalOverlay() {
  const [showOverlay, setShowOverlay] = useState(true);
  
  return (
    <div className="relative">
      {showOverlay && (
        <HeroOverlay
          events={{
            onInit: () => console.log('Overlay loaded'),
            onDestroy: () => console.log('Overlay unloaded')
          }}
        />
      )}
      
      <button onClick={() => setShowOverlay(!showOverlay)}>
        Toggle Overlay
      </button>
    </div>
  );
}
```

## TypeScript Support

The component is fully typed with TypeScript. Import types for better development experience:

```tsx
import HeroOverlay, {
  type HeroOverlayProps,
  type ColorConfig,
  type AnimationConfig,
  type PerformanceMetrics,
  PerformanceMode,
  AnimationIntensity,
  DebugPosition
} from '@/components/HeroOverlay';

const config: Partial<HeroOverlayProps> = {
  particleCount: 50,
  performanceMode: PerformanceMode.BALANCED,
  // TypeScript will provide autocompletion and type checking
};
```

## Browser Support

- **Modern Browsers**: Full support with all features
- **Safari**: Canvas and requestAnimationFrame support required
- **Mobile Browsers**: Touch events and performance optimization
- **Legacy Browsers**: Graceful degradation with feature detection

## Next Steps

- [Performance Optimization Guide](../performance/hero-overlay-optimization.md)
- [Troubleshooting Common Issues](../troubleshooting/hero-overlay-troubleshooting.md)
- [Configuration Reference](../configuration/hero-overlay-config.md)
- [Integration Examples](../examples/hero-overlay-examples.md)