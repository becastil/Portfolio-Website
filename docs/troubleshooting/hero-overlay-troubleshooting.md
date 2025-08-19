# HeroOverlay Troubleshooting Guide

## Overview

This guide covers common issues, their causes, and solutions when working with the HeroOverlay component. Use this as your first reference when encountering problems.

## Quick Diagnostics

### Debug Mode

Enable debug mode to quickly identify issues:

```tsx
<HeroOverlay 
  debug={true} 
  debugPosition={DebugPosition.TOP_RIGHT}
  events={{
    onFrame: (metrics) => console.log('Performance:', metrics),
    onPerformanceModeChange: (mode) => console.log('Mode changed:', mode)
  }}
/>
```

The debug overlay shows:
- **FPS**: Current and average frames per second
- **Particles**: Active particle count
- **Connections**: Number of connection lines
- **Mode**: Current performance mode
- **Device Info**: GPU tier, CPU cores, pixel ratio

## Common Issues

### 1. Component Not Rendering

**Symptoms:**
- Blank screen where overlay should appear
- No particles visible
- Console errors about canvas

**Possible Causes & Solutions:**

#### Canvas Not Initialized
```tsx
// ❌ Wrong: Component unmounting too quickly
useEffect(() => {
  const timer = setTimeout(() => setShowOverlay(false), 100);
  return () => clearTimeout(timer);
}, []);

// ✅ Correct: Allow time for initialization
useEffect(() => {
  const timer = setTimeout(() => setShowOverlay(false), 1000);
  return () => clearTimeout(timer);
}, []);
```

#### SSR Issues
```tsx
// ❌ Wrong: Rendering on server
<HeroOverlay />

// ✅ Correct: Client-side only rendering
import dynamic from 'next/dynamic';

const HeroOverlay = dynamic(
  () => import('@/components/HeroOverlay'),
  { ssr: false }
);
```

#### Missing Canvas Support
```tsx
// Check for canvas support
useEffect(() => {
  const canvas = document.createElement('canvas');
  if (!canvas.getContext) {
    console.error('Canvas not supported');
    // Fallback to static background
  }
}, []);
```

### 2. Poor Performance / Low FPS

**Symptoms:**
- Choppy animations
- FPS below 30
- Browser becoming unresponsive
- High CPU usage

**Debugging Steps:**

1. **Check Debug Metrics**
   ```tsx
   events={{
     onFrame: (metrics) => {
       if (metrics.fps < 30) {
         console.warn('Low FPS detected:', {
           fps: metrics.fps,
           particles: metrics.particleCount,
           connections: metrics.connectionCount,
           mode: metrics.mode
         });
       }
     }
   }}
   ```

2. **Force Lower Performance Mode**
   ```tsx
   // Temporary fix for testing
   <HeroOverlay performanceMode={PerformanceMode.LOW} />
   ```

**Solutions:**

#### Reduce Particle Count
```tsx
// ❌ Too many particles for device
<HeroOverlay particleCount={100} />

// ✅ Appropriate for device capability
const getParticleCount = () => {
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return 20;
  if (cores <= 4) return 40;
  return 60;
};

<HeroOverlay particleCount={getParticleCount()} />
```

#### Disable Expensive Features
```tsx
// Minimal configuration for performance
<HeroOverlay 
  features={{
    particles: true,
    connections: false,        // Most expensive
    mouseInteraction: false,   // CPU intensive
    pulseEffect: false,        // GPU intensive
    gradientBackground: false,
    autoQuality: true
  }}
/>
```

#### Enable Auto-Quality
```tsx
// Let component manage performance automatically
<HeroOverlay 
  features={{ autoQuality: true }}
  events={{
    onPerformanceModeChange: (mode) => {
      console.log('Auto-adjusted to:', mode);
    }
  }}
/>
```

### 3. Mouse Interaction Not Working

**Symptoms:**
- Particles don't respond to mouse movement
- No repulsion effect around cursor
- Touch interaction not working on mobile

**Solutions:**

#### Check Feature Toggle
```tsx
// ❌ Mouse interaction disabled
<HeroOverlay features={{ mouseInteraction: false }} />

// ✅ Enable mouse interaction
<HeroOverlay features={{ mouseInteraction: true }} />
```

#### Verify Container Z-Index
```tsx
// ❌ Overlay blocked by other elements
<div className="relative z-50">
  <HeroOverlay />
</div>

// ✅ Proper layering
<div className="relative">
  <HeroOverlay /> {/* Inherits pointer-events: none */}
  <div className="relative z-10">Content</div>
</div>
```

#### Adjust Interaction Settings
```tsx
// Increase interaction radius and force
<HeroOverlay 
  animation={{
    mouseRadius: 300,    // Larger interaction area
    mouseForce: 0.1     // Stronger effect
  }}
/>
```

#### Mobile Touch Issues
```tsx
// Ensure touch events are handled
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const handleTouch = (e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    // Handle touch interaction
  };
  
  canvas.addEventListener('touchmove', handleTouch, { passive: false });
  return () => canvas.removeEventListener('touchmove', handleTouch);
}, []);
```

### 4. Memory Leaks

**Symptoms:**
- Memory usage increasing over time
- Browser becoming slow after extended use
- "Memory limit exceeded" errors

**Debugging:**
```tsx
// Monitor memory usage
events={{
  onFrame: (metrics) => {
    if (performance.memory) {
      const memoryMB = performance.memory.usedJSHeapSize / 1048576;
      if (memoryMB > 100) {
        console.warn('High memory usage:', memoryMB.toFixed(2), 'MB');
      }
    }
  }
}}
```

**Solutions:**

#### Proper Cleanup
```tsx
// ❌ Missing cleanup
useEffect(() => {
  const id = requestAnimationFrame(animate);
  // Missing return cleanup
}, []);

// ✅ Proper cleanup
useEffect(() => {
  const id = requestAnimationFrame(animate);
  return () => {
    cancelAnimationFrame(id);
    // Clean up other resources
  };
}, []);
```

#### Limit Particle Array Size
```tsx
// Prevent unbounded growth
const MAX_PARTICLES = 100;
const effectiveParticleCount = Math.min(
  propParticleCount || 50,
  MAX_PARTICLES
);
```

### 5. Accessibility Issues

**Symptoms:**
- Animations playing despite `prefers-reduced-motion`
- Screen readers reading canvas content
- Users reporting motion sickness

**Solutions:**

#### Respect Motion Preference
```tsx
// Check if animation should be disabled
const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

return shouldAnimate ? <HeroOverlay /> : <StaticBackground />;
```

#### Proper ARIA Labels
```tsx
<HeroOverlay 
  accessibility={{
    ariaLabel: 'Decorative particle animation',
    respectMotionPreference: true
  }}
/>
```

#### Provide Animation Toggle
```tsx
const [animationsEnabled, setAnimationsEnabled] = useState(true);

return (
  <>
    <button onClick={() => setAnimationsEnabled(!animationsEnabled)}>
      {animationsEnabled ? 'Disable' : 'Enable'} Animations
    </button>
    {animationsEnabled && <HeroOverlay />}
  </>
);
```

### 6. Visual Glitches

**Symptoms:**
- Particles jumping or flickering
- Connections appearing/disappearing rapidly
- Canvas content not clearing properly

**Solutions:**

#### Canvas Clearing Issues
```tsx
// Ensure proper canvas clearing
const renderFrame = useCallback((ctx: CanvasRenderingContext2D) => {
  const { width, height } = canvasState;
  
  // ❌ Incomplete clearing
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // ✅ Proper clearing with device pixel ratio
  ctx.clearRect(0, 0, width, height);
}, [canvasState]);
```

#### High DPI Display Issues
```tsx
// Proper high DPI handling
const pixelRatio = window.devicePixelRatio || 1;
canvas.width = width * pixelRatio;
canvas.height = height * pixelRatio;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
ctx.scale(pixelRatio, pixelRatio);
```

#### Animation Timing Issues
```tsx
// Normalize animation timing
const updateParticles = useCallback((deltaTime: number) => {
  // ❌ Direct deltaTime usage
  particle.x += particle.vx * deltaTime;
  
  // ✅ Normalized to 60fps
  const normalizedDelta = deltaTime / 16.67; // 60fps = 16.67ms
  particle.x += particle.vx * normalizedDelta;
}, []);
```

## Device-Specific Issues

### iOS Safari

**Issue**: Canvas not updating on iOS Safari
```tsx
// Force repaint on iOS
const canvas = canvasRef.current;
if (canvas && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
  canvas.style.transform = 'translateZ(0)'; // Force hardware acceleration
}
```

### Android Chrome

**Issue**: Poor performance on Android devices
```tsx
// Android-specific optimizations
const isAndroid = /Android/.test(navigator.userAgent);
const androidConfig = {
  particleCount: isAndroid ? 25 : 50,
  features: {
    connections: !isAndroid, // Disable on Android
    pulseEffect: false
  }
};
```

### High DPI Displays

**Issue**: Blurry rendering on Retina displays
```tsx
// Proper DPI handling
const setupCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  
  ctx.scale(dpr, dpr);
};
```

## Error Handling

### Canvas Context Errors

```tsx
const initializeCanvas = useCallback(() => {
  const canvas = canvasRef.current;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('2D context not supported');
    // Fallback to static content
    return;
  }
  
  // Continue initialization...
}, []);
```

### Performance Degradation

```tsx
// Automatic degradation on poor performance
const handlePerformanceDegradation = useCallback((metrics: PerformanceMetrics) => {
  if (metrics.avgFps < 20) {
    // Emergency performance mode
    setEmergencyMode(true);
    console.warn('Switching to emergency performance mode');
  }
}, []);
```

### Resource Loading Errors

```tsx
// Handle missing dependencies gracefully
try {
  // Initialize overlay
  initializeCanvas();
} catch (error) {
  console.error('Failed to initialize HeroOverlay:', error);
  // Show fallback content
  setShowFallback(true);
}
```

## Debugging Tools

### Performance Profiling

```tsx
// Built-in performance profiler
const useProfiler = () => {
  const [profile, setProfile] = useState<any[]>([]);
  
  const startProfiling = () => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      setProfile(prev => [...prev, { duration: end - start, timestamp: Date.now() }]);
    };
  };
  
  return { profile, startProfiling };
};
```

### Console Debugging

```tsx
// Enable detailed logging
const DEBUG = process.env.NODE_ENV === 'development';

events={{
  onFrame: DEBUG ? (metrics) => {
    console.log('Frame metrics:', metrics);
  } : undefined,
  
  onPerformanceModeChange: DEBUG ? (mode) => {
    console.log('Performance mode changed:', mode);
  } : undefined
}}
```

### Visual Debugging

```tsx
// Visual debugging overlays
<HeroOverlay 
  debug={true}
  debugPosition={DebugPosition.TOP_LEFT}
  events={{
    onFrame: (metrics) => {
      // Update external debug display
      updateDebugDisplay(metrics);
    }
  }}
/>
```

## Troubleshooting Checklist

### Before Reporting Issues

1. **Enable Debug Mode**: Check performance metrics and device info
2. **Test Performance Mode**: Try different performance settings
3. **Check Browser Console**: Look for error messages
4. **Verify Browser Support**: Ensure Canvas and requestAnimationFrame support
5. **Test on Different Devices**: Isolate device-specific issues
6. **Check Resource Usage**: Monitor CPU and memory consumption
7. **Validate Configuration**: Ensure props are correctly set

### Common Quick Fixes

1. **Reduce particle count to 30 or less**
2. **Disable connections and pulse effects**
3. **Enable auto-quality adjustment**
4. **Force LOW performance mode**
5. **Disable mouse interaction on mobile**
6. **Add proper cleanup in useEffect**
7. **Implement client-side only rendering**

### When to Contact Support

If you've tried the above solutions and still experience issues:

1. **Performance problems persist** despite LOW mode
2. **Canvas initialization failures** on supported browsers
3. **Memory leaks** with proper cleanup implemented
4. **Accessibility issues** with correct configuration
5. **Device-specific problems** not covered in this guide

Include the following in your report:
- Debug output from the overlay
- Browser and device information
- Console error messages
- Steps to reproduce the issue
- Expected vs. actual behavior

This troubleshooting guide should resolve most common issues with the HeroOverlay component. For additional help, refer to the [Configuration Reference](../configuration/hero-overlay-config.md) and [Performance Optimization Guide](../performance/hero-overlay-optimization.md).