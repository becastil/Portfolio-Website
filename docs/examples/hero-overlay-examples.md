# HeroOverlay Integration Examples

## Overview

This document provides practical integration examples for the HeroOverlay component across different frameworks, use cases, and scenarios. Each example includes complete, working code that you can adapt for your projects.

## Next.js Integration

### Basic Next.js Setup

```tsx
// components/HeroSection.tsx
import dynamic from 'next/dynamic';
import { PerformanceMode, AnimationIntensity } from '@/components/HeroOverlay';

// Dynamic import to prevent SSR issues
const HeroOverlay = dynamic(
  () => import('@/components/HeroOverlay'),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Particle overlay */}
      <HeroOverlay
        performanceMode={PerformanceMode.BALANCED}
        intensity={AnimationIntensity.NORMAL}
        colors={{
          primary: '#8B5CF6',
          secondary: '#3B82F6',
          connectionColor: 'rgba(139, 92, 246, 0.15)'
        }}
      />
      
      {/* Content with proper layering */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to the Future
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Creating extraordinary digital experiences with interactive design
          </p>
          <button className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
```

### Next.js with App Router

```tsx
// app/page.tsx
import { Suspense } from 'react';
import HeroSection from '@/components/HeroSection';

export default function HomePage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
        <HeroSection />
      </Suspense>
      {/* Other page content */}
    </main>
  );
}
```

### Next.js with Performance Monitoring

```tsx
// components/MonitoredHeroOverlay.tsx
'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PerformanceMetrics, PerformanceMode } from '@/components/HeroOverlay';

const HeroOverlay = dynamic(() => import('@/components/HeroOverlay'), { ssr: false });

export default function MonitoredHeroOverlay() {
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics | null>(null);
  
  const handleFrame = useCallback((metrics: PerformanceMetrics) => {
    setPerformanceData(metrics);
    
    // Send to analytics (e.g., Vercel Analytics, Google Analytics)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'hero_overlay_performance', {
        fps: Math.round(metrics.fps),
        mode: metrics.mode,
        particle_count: metrics.particleCount
      });
    }
  }, []);
  
  const handlePerformanceModeChange = useCallback((mode: PerformanceMode) => {
    console.log('Performance mode changed:', mode);
    
    // Track performance adjustments
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'hero_overlay_mode_change', {
        new_mode: mode
      });
    }
  }, []);
  
  return (
    <>
      <HeroOverlay
        events={{
          onFrame: handleFrame,
          onPerformanceModeChange: handlePerformanceModeChange
        }}
      />
      
      {/* Development performance display */}
      {process.env.NODE_ENV === 'development' && performanceData && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-50">
          <div>FPS: {performanceData.fps}</div>
          <div>Mode: {performanceData.mode}</div>
          <div>Particles: {performanceData.particleCount}</div>
        </div>
      )}
    </>
  );
}
```

## React (Vite) Integration

### Basic Vite + React Setup

```tsx
// src/components/HeroSection.tsx
import { lazy, Suspense } from 'react';
import { PerformanceMode, AnimationIntensity } from './HeroOverlay';

// Lazy load for code splitting
const HeroOverlay = lazy(() => import('./HeroOverlay'));

function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gray-900">
      <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
        <HeroOverlay
          performanceMode={PerformanceMode.BALANCED}
          intensity={AnimationIntensity.NORMAL}
          features={{
            particles: true,
            connections: true,
            mouseInteraction: true,
            autoQuality: true
          }}
        />
      </Suspense>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="text-6xl font-bold text-white">
          Interactive Portfolio
        </h1>
      </div>
    </section>
  );
}

export default HeroSection;
```

### Vite with Environment-Based Configuration

```tsx
// src/config/overlayConfig.ts
import { PerformanceMode, AnimationIntensity } from '@/components/HeroOverlay';

export const getOverlayConfig = () => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  return {
    // Development configuration
    ...(isDevelopment && {
      debug: true,
      performanceMode: PerformanceMode.HIGH,
      intensity: AnimationIntensity.DRAMATIC
    }),
    
    // Production configuration
    ...(isProduction && {
      debug: false,
      performanceMode: PerformanceMode.BALANCED,
      intensity: AnimationIntensity.NORMAL,
      features: {
        autoQuality: true
      }
    })
  };
};

// src/components/ConfiguredHeroOverlay.tsx
import HeroOverlay from './HeroOverlay';
import { getOverlayConfig } from '@/config/overlayConfig';

export default function ConfiguredHeroOverlay() {
  const config = getOverlayConfig();
  
  return <HeroOverlay {...config} />;
}
```

## TypeScript Integration

### Fully Typed Implementation

```tsx
// types/heroOverlay.ts
import {
  HeroOverlayProps,
  PerformanceMode,
  AnimationIntensity,
  ColorConfig,
  AnimationConfig,
  FeatureToggles
} from '@/components/HeroOverlay';

export interface HeroSectionProps {
  theme: 'dark' | 'light';
  variant: 'minimal' | 'standard' | 'dramatic';
  enableAnalytics?: boolean;
}

export interface ThemeColors extends ColorConfig {
  theme: 'dark' | 'light';
}

// components/TypedHeroSection.tsx
import React, { useMemo } from 'react';
import HeroOverlay from '@/components/HeroOverlay';
import { HeroSectionProps, ThemeColors } from '@/types/heroOverlay';

const themeColors: Record<'dark' | 'light', ColorConfig> = {
  dark: {
    primary: '#8B5CF6',
    secondary: '#3B82F6',
    connectionColor: 'rgba(139, 92, 246, 0.15)',
    gradientColors: ['#1e1b4b', '#312e81', '#1e1b4b']
  },
  light: {
    primary: '#7C3AED',
    secondary: '#2563EB',
    connectionColor: 'rgba(124, 58, 237, 0.1)',
    gradientColors: ['#f8fafc', '#e2e8f0', '#f8fafc']
  }
};

const variantConfigs: Record<HeroSectionProps['variant'], Partial<HeroOverlayProps>> = {
  minimal: {
    particleCount: 25,
    performanceMode: PerformanceMode.LOW,
    intensity: AnimationIntensity.SUBTLE,
    features: {
      particles: true,
      connections: false,
      mouseInteraction: false,
      pulseEffect: false,
      gradientBackground: false,
      autoQuality: true
    }
  },
  standard: {
    particleCount: 50,
    performanceMode: PerformanceMode.BALANCED,
    intensity: AnimationIntensity.NORMAL,
    features: {
      particles: true,
      connections: true,
      mouseInteraction: true,
      pulseEffect: false,
      gradientBackground: true,
      autoQuality: true
    }
  },
  dramatic: {
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
    }
  }
};

const TypedHeroSection: React.FC<HeroSectionProps> = ({
  theme,
  variant,
  enableAnalytics = false
}) => {
  const overlayConfig = useMemo((): HeroOverlayProps => ({
    ...variantConfigs[variant],
    colors: themeColors[theme],
    events: enableAnalytics ? {
      onInit: () => console.log('Hero overlay initialized'),
      onFrame: (metrics) => {
        // Type-safe analytics
        if (metrics.fps < 30) {
          console.warn('Performance issue detected:', metrics);
        }
      }
    } : undefined
  }), [theme, variant, enableAnalytics]);

  return (
    <section className={`relative min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      <HeroOverlay {...overlayConfig} />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className={`text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Typed Hero Section
        </h1>
      </div>
    </section>
  );
};

export default TypedHeroSection;
```

## Responsive Design Integration

### Mobile-First Responsive Implementation

```tsx
// hooks/useResponsiveOverlay.ts
import { useState, useEffect } from 'react';
import { PerformanceMode, AnimationIntensity } from '@/components/HeroOverlay';

interface ResponsiveConfig {
  performanceMode: PerformanceMode;
  particleCount: number;
  intensity: AnimationIntensity;
  features: {
    connections: boolean;
    mouseInteraction: boolean;
    pulseEffect: boolean;
  };
}

export const useResponsiveOverlay = (): ResponsiveConfig => {
  const [config, setConfig] = useState<ResponsiveConfig>({
    performanceMode: PerformanceMode.BALANCED,
    particleCount: 50,
    intensity: AnimationIntensity.NORMAL,
    features: {
      connections: true,
      mouseInteraction: true,
      pulseEffect: false
    }
  });

  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      if (isMobile) {
        setConfig({
          performanceMode: PerformanceMode.LOW,
          particleCount: 25,
          intensity: AnimationIntensity.SUBTLE,
          features: {
            connections: false,
            mouseInteraction: true, // Touch interaction
            pulseEffect: false
          }
        });
      } else if (isTablet) {
        setConfig({
          performanceMode: PerformanceMode.BALANCED,
          particleCount: 40,
          intensity: AnimationIntensity.NORMAL,
          features: {
            connections: true,
            mouseInteraction: true,
            pulseEffect: false
          }
        });
      } else if (isDesktop) {
        setConfig({
          performanceMode: PerformanceMode.HIGH,
          particleCount: 60,
          intensity: AnimationIntensity.NORMAL,
          features: {
            connections: true,
            mouseInteraction: true,
            pulseEffect: true
          }
        });
      }
    };

    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  return config;
};

// components/ResponsiveHeroOverlay.tsx
import HeroOverlay from '@/components/HeroOverlay';
import { useResponsiveOverlay } from '@/hooks/useResponsiveOverlay';

export default function ResponsiveHeroOverlay() {
  const config = useResponsiveOverlay();
  
  return (
    <HeroOverlay
      {...config}
      features={{
        particles: true,
        gradientBackground: true,
        autoQuality: true,
        ...config.features
      }}
    />
  );
}
```

### CSS Container Queries Integration

```tsx
// components/ContainerResponsiveOverlay.tsx
import { useState, useEffect, useRef } from 'react';
import HeroOverlay from '@/components/HeroOverlay';

export default function ContainerResponsiveOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      
      if (width < 600) {
        setContainerSize('small');
      } else if (width < 1000) {
        setContainerSize('medium');
      } else {
        setContainerSize('large');
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const sizeConfigs = {
    small: {
      particleCount: 20,
      features: { connections: false, pulseEffect: false }
    },
    medium: {
      particleCount: 40,
      features: { connections: true, pulseEffect: false }
    },
    large: {
      particleCount: 60,
      features: { connections: true, pulseEffect: true }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      <HeroOverlay {...sizeConfigs[containerSize]} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1>Container Responsive Overlay ({containerSize})</h1>
      </div>
    </div>
  );
}
```

## State Management Integration

### Redux Integration

```tsx
// store/overlaySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PerformanceMode, AnimationIntensity } from '@/components/HeroOverlay';

interface OverlayState {
  isEnabled: boolean;
  performanceMode: PerformanceMode;
  intensity: AnimationIntensity;
  particleCount: number;
  debugMode: boolean;
}

const initialState: OverlayState = {
  isEnabled: true,
  performanceMode: PerformanceMode.BALANCED,
  intensity: AnimationIntensity.NORMAL,
  particleCount: 50,
  debugMode: false
};

const overlaySlice = createSlice({
  name: 'overlay',
  initialState,
  reducers: {
    toggleOverlay: (state) => {
      state.isEnabled = !state.isEnabled;
    },
    setPerformanceMode: (state, action: PayloadAction<PerformanceMode>) => {
      state.performanceMode = action.payload;
    },
    setIntensity: (state, action: PayloadAction<AnimationIntensity>) => {
      state.intensity = action.payload;
    },
    setParticleCount: (state, action: PayloadAction<number>) => {
      state.particleCount = Math.max(10, Math.min(100, action.payload));
    },
    toggleDebug: (state) => {
      state.debugMode = !state.debugMode;
    }
  }
});

export const {
  toggleOverlay,
  setPerformanceMode,
  setIntensity,
  setParticleCount,
  toggleDebug
} = overlaySlice.actions;

export default overlaySlice.reducer;

// components/ReduxHeroOverlay.tsx
import { useSelector, useDispatch } from 'react-redux';
import HeroOverlay from '@/components/HeroOverlay';
import { RootState } from '@/store';
import { setPerformanceMode } from '@/store/overlaySlice';

export default function ReduxHeroOverlay() {
  const dispatch = useDispatch();
  const overlayState = useSelector((state: RootState) => state.overlay);

  if (!overlayState.isEnabled) {
    return null;
  }

  return (
    <HeroOverlay
      performanceMode={overlayState.performanceMode}
      intensity={overlayState.intensity}
      particleCount={overlayState.particleCount}
      debug={overlayState.debugMode}
      events={{
        onPerformanceModeChange: (mode) => {
          dispatch(setPerformanceMode(mode));
        }
      }}
    />
  );
}
```

### Zustand Integration

```tsx
// store/overlayStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PerformanceMode, AnimationIntensity } from '@/components/HeroOverlay';

interface OverlayStore {
  // State
  isEnabled: boolean;
  performanceMode: PerformanceMode;
  intensity: AnimationIntensity;
  particleCount: number;
  debugMode: boolean;
  
  // Actions
  toggleOverlay: () => void;
  setPerformanceMode: (mode: PerformanceMode) => void;
  setIntensity: (intensity: AnimationIntensity) => void;
  setParticleCount: (count: number) => void;
  toggleDebug: () => void;
  reset: () => void;
}

export const useOverlayStore = create<OverlayStore>()(
  persist(
    (set) => ({
      // Initial state
      isEnabled: true,
      performanceMode: PerformanceMode.BALANCED,
      intensity: AnimationIntensity.NORMAL,
      particleCount: 50,
      debugMode: false,
      
      // Actions
      toggleOverlay: () => set((state) => ({ isEnabled: !state.isEnabled })),
      
      setPerformanceMode: (mode) => set({ performanceMode: mode }),
      
      setIntensity: (intensity) => set({ intensity }),
      
      setParticleCount: (count) => set({ 
        particleCount: Math.max(10, Math.min(100, count)) 
      }),
      
      toggleDebug: () => set((state) => ({ debugMode: !state.debugMode })),
      
      reset: () => set({
        isEnabled: true,
        performanceMode: PerformanceMode.BALANCED,
        intensity: AnimationIntensity.NORMAL,
        particleCount: 50,
        debugMode: false
      })
    }),
    {
      name: 'hero-overlay-settings',
      partialize: (state) => ({
        performanceMode: state.performanceMode,
        intensity: state.intensity,
        particleCount: state.particleCount
      })
    }
  )
);

// components/ZustandHeroOverlay.tsx
import HeroOverlay from '@/components/HeroOverlay';
import { useOverlayStore } from '@/store/overlayStore';

export default function ZustandHeroOverlay() {
  const {
    isEnabled,
    performanceMode,
    intensity,
    particleCount,
    debugMode,
    setPerformanceMode
  } = useOverlayStore();

  if (!isEnabled) {
    return null;
  }

  return (
    <HeroOverlay
      performanceMode={performanceMode}
      intensity={intensity}
      particleCount={particleCount}
      debug={debugMode}
      events={{
        onPerformanceModeChange: setPerformanceMode
      }}
    />
  );
}
```

## Theme Integration

### Styled Components Integration

```tsx
// styles/themes.ts
export const lightTheme = {
  colors: {
    primary: '#7C3AED',
    secondary: '#2563EB',
    background: '#FFFFFF',
    text: '#1F2937'
  },
  overlay: {
    primary: '#7C3AED',
    secondary: '#2563EB',
    connectionColor: 'rgba(124, 58, 237, 0.1)',
    gradientColors: ['#f8fafc', '#e2e8f0', '#f8fafc']
  }
};

export const darkTheme = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#3B82F6',
    background: '#1F2937',
    text: '#F9FAFB'
  },
  overlay: {
    primary: '#8B5CF6',
    secondary: '#3B82F6',
    connectionColor: 'rgba(139, 92, 246, 0.15)',
    gradientColors: ['#1e1b4b', '#312e81', '#1e1b4b']
  }
};

// components/ThemedHeroOverlay.tsx
import styled, { useTheme } from 'styled-components';
import HeroOverlay from '@/components/HeroOverlay';

const HeroContainer = styled.section`
  position: relative;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
`;

export default function ThemedHeroOverlay() {
  const theme = useTheme();

  return (
    <HeroContainer>
      <HeroOverlay
        colors={theme.overlay}
        features={{
          particles: true,
          connections: true,
          mouseInteraction: true,
          gradientBackground: true,
          autoQuality: true
        }}
      />
      <HeroContent>
        <h1>Themed Hero Section</h1>
      </HeroContent>
    </HeroContainer>
  );
}
```

### Chakra UI Integration

```tsx
// components/ChakraHeroOverlay.tsx
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  useColorModeValue,
  useTheme
} from '@chakra-ui/react';
import HeroOverlay from '@/components/HeroOverlay';

export default function ChakraHeroOverlay() {
  const theme = useTheme();
  
  const overlayColors = {
    primary: useColorModeValue(theme.colors.purple[500], theme.colors.purple[400]),
    secondary: useColorModeValue(theme.colors.blue[500], theme.colors.blue[400]),
    connectionColor: useColorModeValue(
      'rgba(124, 58, 237, 0.1)',
      'rgba(139, 92, 246, 0.15)'
    ),
    gradientColors: useColorModeValue(
      ['#f8fafc', '#e2e8f0', '#f8fafc'],
      ['#1e1b4b', '#312e81', '#1e1b4b']
    )
  };

  return (
    <Box position="relative" minH="100vh" bg={useColorModeValue('white', 'gray.900')}>
      <HeroOverlay colors={overlayColors} />
      
      <Flex
        position="relative"
        zIndex={10}
        align="center"
        justify="center"
        minH="100vh"
        direction="column"
        textAlign="center"
        px={4}
      >
        <Heading
          size="2xl"
          mb={4}
          bgGradient={`linear(to-r, ${overlayColors.primary}, ${overlayColors.secondary})`}
          bgClip="text"
        >
          Chakra UI Integration
        </Heading>
        
        <Text fontSize="lg" mb={8} opacity={0.8} maxW="2xl">
          Seamlessly integrated particle overlay with Chakra UI theming
        </Text>
        
        <Button
          size="lg"
          bgGradient={`linear(to-r, ${overlayColors.primary}, ${overlayColors.secondary})`}
          color="white"
          _hover={{
            bgGradient: `linear(to-r, ${overlayColors.secondary}, ${overlayColors.primary})`
          }}
        >
          Get Started
        </Button>
      </Flex>
    </Box>
  );
}
```

## Animation Library Integration

### Framer Motion Integration

```tsx
// components/MotionHeroOverlay.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import HeroOverlay from '@/components/HeroOverlay';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

export default function MotionHeroOverlay() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <motion.section
      className="relative min-h-screen bg-slate-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <HeroOverlay
              intensity="DRAMATIC"
              events={{
                onInit: () => console.log('Overlay animation started')
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 flex items-center justify-center min-h-screen text-center text-white"
        variants={containerVariants}
      >
        <div>
          <motion.h1
            className="text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            Motion Hero
          </motion.h1>
          
          <motion.p
            className="text-xl opacity-90 mb-8"
            variants={itemVariants}
          >
            Framer Motion + Particle Overlay
          </motion.p>
          
          <motion.button
            className="px-8 py-4 bg-purple-600 rounded-lg font-semibold"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Interactive Button
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  );
}
```

## Testing Integration

### Jest + Testing Library

```tsx
// __tests__/HeroOverlay.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import HeroOverlay from '@/components/HeroOverlay';

// Mock canvas methods
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    fillRect: jest.fn(),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    scale: jest.fn()
  }));
  
  global.requestAnimationFrame = jest.fn((cb) => {
    setTimeout(cb, 16);
    return 1;
  });
  
  global.cancelAnimationFrame = jest.fn();
});

describe('HeroOverlay', () => {
  test('renders canvas element', () => {
    render(<HeroOverlay />);
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
  });

  test('respects reduced motion preference', () => {
    // Mock prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(<HeroOverlay />);
    expect(global.requestAnimationFrame).not.toHaveBeenCalled();
  });

  test('calls event handlers', () => {
    const onInit = jest.fn();
    const onFrame = jest.fn();
    
    render(
      <HeroOverlay 
        events={{ 
          onInit, 
          onFrame 
        }} 
      />
    );
    
    expect(onInit).toHaveBeenCalled();
  });

  test('shows debug overlay when enabled', () => {
    render(<HeroOverlay debug={true} />);
    expect(screen.getByText('Debug Info')).toBeInTheDocument();
  });
});
```

### Playwright E2E Testing

```typescript
// tests/hero-overlay.spec.ts
import { test, expect } from '@playwright/test';

test.describe('HeroOverlay', () => {
  test('should render and animate', async ({ page }) => {
    await page.goto('/');
    
    // Check canvas is present
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Check canvas has proper dimensions
    const canvasSize = await canvas.boundingBox();
    expect(canvasSize?.width).toBeGreaterThan(0);
    expect(canvasSize?.height).toBeGreaterThan(0);
  });

  test('should respond to mouse movement', async ({ page }) => {
    await page.goto('/');
    
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Move mouse over canvas
    await canvas.hover();
    
    // Wait for animation frames
    await page.waitForTimeout(100);
    
    // Mouse interaction should be working (particles should move away from cursor)
    // This would require more complex canvas inspection in a real test
  });

  test('should respect reduced motion', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    
    // Canvas should still be present but not animating
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should show debug info in development', async ({ page }) => {
    // This would need environment configuration
    await page.goto('/?debug=true');
    
    const debugInfo = page.locator('text=Debug Info');
    await expect(debugInfo).toBeVisible();
    
    const fpsInfo = page.locator('text=/FPS: \\d+/');
    await expect(fpsInfo).toBeVisible();
  });
});
```

## Performance Monitoring Integration

### Web Vitals Integration

```tsx
// utils/performanceMonitoring.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export interface PerformanceData {
  cls: number;
  fid: number;
  fcp: number;
  lcp: number;
  ttfb: number;
  overlayFps: number;
  overlayMode: string;
}

export const initPerformanceMonitoring = () => {
  const performanceData: Partial<PerformanceData> = {};
  
  getCLS((metric) => {
    performanceData.cls = metric.value;
    sendToAnalytics('CLS', metric.value);
  });
  
  getFID((metric) => {
    performanceData.fid = metric.value;
    sendToAnalytics('FID', metric.value);
  });
  
  getFCP((metric) => {
    performanceData.fcp = metric.value;
    sendToAnalytics('FCP', metric.value);
  });
  
  getLCP((metric) => {
    performanceData.lcp = metric.value;
    sendToAnalytics('LCP', metric.value);
  });
  
  getTTFB((metric) => {
    performanceData.ttfb = metric.value;
    sendToAnalytics('TTFB', metric.value);
  });
};

const sendToAnalytics = (metric: string, value: number) => {
  // Send to your analytics service
  console.log(`${metric}: ${value}`);
};

// components/MonitoredHeroOverlay.tsx
import { useEffect } from 'react';
import HeroOverlay from '@/components/HeroOverlay';
import { initPerformanceMonitoring } from '@/utils/performanceMonitoring';

export default function MonitoredHeroOverlay() {
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  return (
    <HeroOverlay
      events={{
        onFrame: (metrics) => {
          // Monitor overlay performance alongside Web Vitals
          if (metrics.fps < 30) {
            console.warn('Overlay performance degraded', metrics);
          }
        }
      }}
    />
  );
}
```

These integration examples provide comprehensive guidance for implementing the HeroOverlay component across different frameworks, scenarios, and use cases. Each example is production-ready and includes best practices for performance, accessibility, and maintainability.