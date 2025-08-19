# HeroOverlay Configuration Reference

## Overview

This document provides a complete reference for all configuration options, props, interfaces, and enums available in the HeroOverlay component.

## Main Component Props

### HeroOverlayProps Interface

```typescript
interface HeroOverlayProps {
  particleCount?: number;
  colors?: Partial<ColorConfig>;
  animation?: Partial<AnimationConfig>;
  performanceMode?: PerformanceMode;
  intensity?: AnimationIntensity;
  features?: Partial<FeatureToggles>;
  debug?: boolean;
  debugPosition?: DebugPosition;
  events?: OverlayEvents;
  accessibility?: Partial<AccessibilityConfig>;
  bounds?: Partial<BoundsConfig>;
  className?: string;
  style?: React.CSSProperties;
}
```

### Core Props

#### `particleCount?: number`
Number of particles to render in the animation.

**Default:** Varies by performance mode (30-80)
**Range:** 1-200 (recommended: 20-80)
**Impact:** Higher counts increase visual density but reduce performance

```tsx
// Examples
<HeroOverlay particleCount={50} />  // Balanced
<HeroOverlay particleCount={30} />  // Performance-focused
<HeroOverlay particleCount={80} />  // Visual-focused
```

#### `performanceMode?: PerformanceMode`
Controls overall quality and resource usage.

**Default:** `PerformanceMode.BALANCED`
**Options:** `HIGH` | `BALANCED` | `LOW`

```tsx
<HeroOverlay performanceMode={PerformanceMode.HIGH} />
```

#### `intensity?: AnimationIntensity`
Controls animation speed and dramatic effect.

**Default:** `AnimationIntensity.NORMAL`
**Options:** `SUBTLE` | `NORMAL` | `DRAMATIC`

```tsx
<HeroOverlay intensity={AnimationIntensity.DRAMATIC} />
```

#### `debug?: boolean`
Enables debug overlay for development and performance monitoring.

**Default:** `false`
**Recommended:** `true` in development, `false` in production

```tsx
<HeroOverlay debug={process.env.NODE_ENV === 'development'} />
```

#### `className?: string`
Custom CSS class for the container element.

**Default:** `''`

```tsx
<HeroOverlay className="custom-overlay z-0" />
```

#### `style?: React.CSSProperties`
Inline styles for the container element.

**Default:** `{}`

```tsx
<HeroOverlay style={{ opacity: 0.8, mixBlendMode: 'multiply' }} />
```

## Configuration Objects

### ColorConfig Interface

Controls the color scheme for particles and visual effects.

```typescript
interface ColorConfig {
  primary: string;           // Main particle color
  secondary: string;         // Secondary particle color  
  connectionColor: string;   // Connection line color
  gradientColors: string[];  // Background gradient colors
}
```

#### Default Values
```typescript
const DEFAULT_COLORS: ColorConfig = {
  primary: '#8B5CF6',        // Purple
  secondary: '#3B82F6',      // Blue
  connectionColor: 'rgba(139, 92, 246, 0.15)', // Semi-transparent purple
  gradientColors: ['#1e1b4b', '#312e81', '#1e1b4b'] // Dark blue gradient
};
```

#### Examples
```tsx
// Custom brand colors
<HeroOverlay 
  colors={{
    primary: '#FF6B6B',      // Coral red
    secondary: '#4ECDC4',    // Teal
    connectionColor: 'rgba(255, 107, 107, 0.1)',
    gradientColors: ['#2C1810', '#8B4513', '#2C1810']
  }}
/>

// Monochrome theme
<HeroOverlay 
  colors={{
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    connectionColor: 'rgba(255, 255, 255, 0.05)',
    gradientColors: ['#000000', '#333333', '#000000']
  }}
/>

// Partial override (other values use defaults)
<HeroOverlay 
  colors={{
    primary: '#00FF00'  // Only change primary color
  }}
/>
```

### AnimationConfig Interface

Controls animation behavior and interaction settings.

```typescript
interface AnimationConfig {
  speedMultiplier: number;    // Particle movement speed
  connectionOpacity: number;  // Connection line opacity (0-1)
  connectionDistance: number; // Maximum connection distance (px)
  pulseSpeed: number;        // Pulse effect speed
  mouseRadius: number;       // Mouse interaction radius (px)
  mouseForce: number;        // Mouse interaction force
}
```

#### Default Values
```typescript
const DEFAULT_ANIMATION: AnimationConfig = {
  speedMultiplier: 1.0,      // Normal speed
  connectionOpacity: 0.15,   // 15% opacity
  connectionDistance: 150,   // 150px max distance
  pulseSpeed: 0.001,        // Subtle pulsing
  mouseRadius: 200,         // 200px interaction radius
  mouseForce: 0.05         // Gentle repulsion
};
```

#### Property Details

##### `speedMultiplier: number`
**Range:** 0.1 - 3.0
**Effect:** Multiplies particle velocity
```tsx
<HeroOverlay animation={{ speedMultiplier: 1.5 }} /> // 50% faster
<HeroOverlay animation={{ speedMultiplier: 0.5 }} /> // 50% slower
```

##### `connectionOpacity: number`
**Range:** 0.0 - 1.0
**Effect:** Transparency of connection lines
```tsx
<HeroOverlay animation={{ connectionOpacity: 0.3 }} /> // More visible
<HeroOverlay animation={{ connectionOpacity: 0.05 }} /> // Very subtle
```

##### `connectionDistance: number`
**Range:** 50 - 300 pixels
**Effect:** Maximum distance for particle connections
**Impact:** Higher values increase connection count and reduce performance
```tsx
<HeroOverlay animation={{ connectionDistance: 100 }} /> // Fewer connections
<HeroOverlay animation={{ connectionDistance: 200 }} /> // More connections
```

##### `pulseSpeed: number`
**Range:** 0.0001 - 0.01
**Effect:** Speed of particle pulsing animation
```tsx
<HeroOverlay animation={{ pulseSpeed: 0.005 }} /> // Faster pulsing
<HeroOverlay animation={{ pulseSpeed: 0.0001 }} /> // Very slow pulsing
```

##### `mouseRadius: number`
**Range:** 50 - 500 pixels
**Effect:** Area around cursor that affects particles
```tsx
<HeroOverlay animation={{ mouseRadius: 300 }} /> // Large interaction area
<HeroOverlay animation={{ mouseRadius: 100 }} /> // Small interaction area
```

##### `mouseForce: number`
**Range:** 0.01 - 0.2
**Effect:** Strength of mouse repulsion force
```tsx
<HeroOverlay animation={{ mouseForce: 0.1 }} /> // Strong repulsion
<HeroOverlay animation={{ mouseForce: 0.02 }} /> // Gentle repulsion
```

### FeatureToggles Interface

Enables or disables specific visual features for performance tuning.

```typescript
interface FeatureToggles {
  particles: boolean;           // Show particles
  connections: boolean;         // Show connection lines
  mouseInteraction: boolean;    // Enable mouse interaction
  pulseEffect: boolean;         // Enable particle pulsing
  gradientBackground: boolean;  // Show gradient background
  autoQuality: boolean;        // Enable automatic quality adjustment
}
```

#### Default Values
```typescript
const DEFAULT_FEATURES: FeatureToggles = {
  particles: true,
  connections: true,
  mouseInteraction: true,
  pulseEffect: true,
  gradientBackground: true,
  autoQuality: true
};
```

#### Feature Impact

| Feature | Performance Impact | Visual Impact | Recommendation |
|---------|-------------------|---------------|----------------|
| `particles` | Medium | High | Always enable |
| `connections` | High | Medium | Disable on low-end devices |
| `mouseInteraction` | Low | Medium | Keep enabled |
| `pulseEffect` | High | Low | Disable for performance |
| `gradientBackground` | Medium | Low | Optional |
| `autoQuality` | None | None | Always enable |

#### Examples
```tsx
// Performance-focused configuration
<HeroOverlay 
  features={{
    particles: true,
    connections: false,        // Disable expensive feature
    mouseInteraction: true,
    pulseEffect: false,        // Disable expensive feature
    gradientBackground: false,
    autoQuality: true
  }}
/>

// Visual-focused configuration
<HeroOverlay 
  features={{
    particles: true,
    connections: true,
    mouseInteraction: true,
    pulseEffect: true,
    gradientBackground: true,
    autoQuality: true
  }}
/>

// Minimal configuration
<HeroOverlay 
  features={{
    particles: true,
    connections: false,
    mouseInteraction: false,
    pulseEffect: false,
    gradientBackground: false,
    autoQuality: false
  }}
/>
```

### AccessibilityConfig Interface

Settings for improved accessibility and user preferences.

```typescript
interface AccessibilityConfig {
  respectMotionPreference: boolean;  // Respect prefers-reduced-motion
  ariaLabel: string;                // ARIA label for canvas
  keyboardControls: boolean;        // Enable keyboard controls
}
```

#### Default Values
```typescript
const DEFAULT_ACCESSIBILITY: AccessibilityConfig = {
  respectMotionPreference: true,
  ariaLabel: 'Interactive particle animation overlay',
  keyboardControls: false
};
```

#### Examples
```tsx
// Custom accessibility configuration
<HeroOverlay 
  accessibility={{
    respectMotionPreference: true,
    ariaLabel: 'Decorative background animation',
    keyboardControls: false
  }}
/>

// Accessibility-first approach
<HeroOverlay 
  accessibility={{
    respectMotionPreference: true,  // Always respect user preference
    ariaLabel: 'Background decoration - no interaction required',
    keyboardControls: false         // Keep simple for accessibility
  }}
/>
```

### BoundsConfig Interface

Controls particle behavior at canvas edges.

```typescript
interface BoundsConfig {
  padding: number;  // Padding from edges in pixels
  bounce: boolean;  // Bounce off edges
  wrap: boolean;    // Wrap around edges
}
```

#### Default Values
```typescript
const DEFAULT_BOUNDS: BoundsConfig = {
  padding: 50,    // 50px padding
  bounce: false,  // No bouncing
  wrap: true     // Wrap around edges
};
```

#### Examples
```tsx
// Bouncing particles
<HeroOverlay 
  bounds={{
    padding: 20,
    bounce: true,   // Particles bounce off edges
    wrap: false
  }}
/>

// Constrained area
<HeroOverlay 
  bounds={{
    padding: 100,   // Large padding area
    bounce: false,
    wrap: true
  }}
/>
```

## Enums

### PerformanceMode

```typescript
enum PerformanceMode {
  HIGH = 'HIGH',        // Maximum quality with all effects
  BALANCED = 'BALANCED', // Balanced performance (recommended)
  LOW = 'LOW'          // Minimal effects for low-end devices
}
```

#### Mode Characteristics

**HIGH Mode:**
- Particle count: 80
- Connection distance: 150px
- All features enabled
- Best for high-end desktop devices

**BALANCED Mode (Default):**
- Particle count: 50
- Connection distance: 120px
- Selective features (no pulse, no gradient)
- Best for most devices

**LOW Mode:**
- Particle count: 30
- Connection distance: 80px
- Minimal features (particles only)
- Best for low-end mobile devices

### AnimationIntensity

```typescript
enum AnimationIntensity {
  SUBTLE = 'SUBTLE',       // Minimal movement (0.5x speed)
  NORMAL = 'NORMAL',       // Standard intensity (1.0x speed)
  DRAMATIC = 'DRAMATIC'    // Enhanced animations (1.5x speed)
}
```

#### Intensity Effects
- **SUBTLE**: Professional, minimal distraction
- **NORMAL**: Balanced visual interest
- **DRAMATIC**: High visual impact

### DebugPosition

```typescript
enum DebugPosition {
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT'
}
```

## Event Interfaces

### OverlayEvents Interface

Lifecycle and performance event handlers.

```typescript
interface OverlayEvents {
  onPerformanceModeChange?: (mode: PerformanceMode) => void;
  onFrame?: (metrics: PerformanceMetrics) => void;
  onInit?: () => void;
  onDestroy?: () => void;
}
```

#### Examples
```tsx
<HeroOverlay 
  events={{
    onInit: () => {
      console.log('HeroOverlay initialized');
      analytics.track('overlay_loaded');
    },
    
    onFrame: (metrics) => {
      // Monitor performance
      if (metrics.fps < 30) {
        console.warn('Performance degraded');
      }
    },
    
    onPerformanceModeChange: (mode) => {
      console.log('Performance mode changed to:', mode);
      analytics.track('overlay_performance_change', { mode });
    },
    
    onDestroy: () => {
      console.log('HeroOverlay destroyed');
      analytics.track('overlay_unloaded');
    }
  }}
/>
```

### PerformanceMetrics Interface

Real-time performance data for monitoring and debugging.

```typescript
interface PerformanceMetrics {
  fps: number;              // Current frames per second
  avgFps: number;          // Average FPS over last second
  frameTime: number;       // Frame time in milliseconds
  particleCount: number;   // Number of active particles
  connectionCount: number; // Number of rendered connections
  mode: PerformanceMode;   // Current performance mode
}
```

## Quality Settings

### Performance Mode Quality Settings

The component uses predefined quality settings for each performance mode:

```typescript
const QUALITY_SETTINGS: QualitySettings = {
  [PerformanceMode.HIGH]: {
    particleCount: 80,
    connectionDistance: 150,
    features: {
      particles: true,
      connections: true,
      mouseInteraction: true,
      pulseEffect: true,
      gradientBackground: true,
      autoQuality: true
    }
  },
  
  [PerformanceMode.BALANCED]: {
    particleCount: 50,
    connectionDistance: 120,
    features: {
      particles: true,
      connections: true,
      mouseInteraction: true,
      pulseEffect: false,        // Disabled for performance
      gradientBackground: false, // Disabled for performance
      autoQuality: true
    }
  },
  
  [PerformanceMode.LOW]: {
    particleCount: 30,
    connectionDistance: 80,
    features: {
      particles: true,
      connections: false,        // Disabled for performance
      mouseInteraction: false,   // Disabled for performance
      pulseEffect: false,
      gradientBackground: false,
      autoQuality: false         // Manual control in low mode
    }
  }
};
```

## Device Capability Detection

### DeviceCapabilities Interface

```typescript
interface DeviceCapabilities {
  hasTouch: boolean;    // Touch device detection
  pixelRatio: number;   // Device pixel ratio
  isLowEnd: boolean;    // Low-end device classification
  gpuTier: number;      // GPU tier estimate (1-3)
  cpuCores: number;     // Available CPU cores
}
```

The component automatically detects these capabilities and adjusts settings accordingly.

## Configuration Presets

### Common Preset Examples

```tsx
// Minimal performance preset
const minimalPreset = {
  particleCount: 20,
  performanceMode: PerformanceMode.LOW,
  intensity: AnimationIntensity.SUBTLE,
  features: {
    particles: true,
    connections: false,
    mouseInteraction: false,
    pulseEffect: false,
    gradientBackground: false,
    autoQuality: false
  }
};

// High-end visual preset
const visualPreset = {
  particleCount: 80,
  performanceMode: PerformanceMode.HIGH,
  intensity: AnimationIntensity.DRAMATIC,
  features: {
    particles: true,
    connections: true,
    mouseInteraction: true,
    pulseEffect: true,
    gradientBackground: true,
    autoQuality: true
  },
  animation: {
    speedMultiplier: 1.2,
    connectionOpacity: 0.2,
    mouseRadius: 250
  }
};

// Balanced preset (recommended)
const balancedPreset = {
  particleCount: 50,
  performanceMode: PerformanceMode.BALANCED,
  intensity: AnimationIntensity.NORMAL,
  features: {
    particles: true,
    connections: true,
    mouseInteraction: true,
    pulseEffect: false,
    gradientBackground: false,
    autoQuality: true
  }
};
```

## Validation and Constraints

### Property Validation

The component includes built-in validation for configuration values:

- **particleCount**: Clamped to 1-200 range
- **animationConfig values**: Validated against safe ranges
- **colors**: Must be valid CSS color strings
- **performanceMode**: Must be valid enum value

### Performance Constraints

Automatic constraints based on device capabilities:

```typescript
// Example constraint logic
const getConstrainedConfig = (userConfig: Partial<HeroOverlayProps>) => {
  const maxParticles = deviceCapabilities.isLowEnd ? 30 : 80;
  
  return {
    ...userConfig,
    particleCount: Math.min(userConfig.particleCount || 50, maxParticles),
    features: {
      ...userConfig.features,
      connections: deviceCapabilities.isLowEnd ? false : userConfig.features?.connections
    }
  };
};
```

This configuration reference provides complete documentation for all available options in the HeroOverlay component. For implementation examples, see the [Integration Examples](../examples/hero-overlay-examples.md).