/**
 * @fileoverview HeroOverlay Component
 * 
 * A sophisticated particle animation system with adaptive performance optimization.
 * This component creates an interactive canvas-based particle field with connections,
 * mouse interactions, and various visual effects.
 * 
 * @module components/HeroOverlay
 * @since 1.0.0
 * @author Portfolio Website Team
 * 
 * @requires React 18.0+
 * @requires Canvas API support
 * @requires requestAnimationFrame support
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API} Canvas API Documentation
 * @see {@link https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html} WCAG Animation Guidelines
 */

'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Performance modes for the overlay animation
 * Controls the quality and resource usage of the particle system
 * 
 * @enum {string}
 * @since 1.0.0
 * @example
 * ```tsx
 * <HeroOverlay performanceMode={PerformanceMode.BALANCED} />
 * ```
 */
export enum PerformanceMode {
  /** Maximum quality with all effects enabled */
  HIGH = 'HIGH',
  /** Balanced performance with selective effects */
  BALANCED = 'BALANCED',
  /** Minimal effects for low-end devices */
  LOW = 'LOW'
}

/**
 * Animation intensity levels
 * Controls the speed and dramatic effect of particle movements
 * 
 * @enum {string}
 * @since 1.0.0
 * @example
 * ```tsx
 * <HeroOverlay intensity={AnimationIntensity.DRAMATIC} />
 * ```
 */
export enum AnimationIntensity {
  /** Minimal movement and effects */
  SUBTLE = 'SUBTLE',
  /** Standard animation intensity */
  NORMAL = 'NORMAL',
  /** Enhanced animations and effects */
  DRAMATIC = 'DRAMATIC'
}

/**
 * Debug overlay position options
 * Determines where the debug panel appears on screen
 * 
 * @enum {string}
 * @since 1.0.0
 * @example
 * ```tsx
 * <HeroOverlay debug={true} debugPosition={DebugPosition.TOP_RIGHT} />
 * ```
 */
export enum DebugPosition {
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT'
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Individual particle properties
 * Represents a single animated particle in the system
 * 
 * @interface Particle
 * @since 1.0.0
 */
export interface Particle {
  /** Current X position in pixels */
  x: number;
  /** Current Y position in pixels */
  y: number;
  /** Velocity in X direction (pixels per frame) */
  vx: number;
  /** Velocity in Y direction (pixels per frame) */
  vy: number;
  /** Particle radius in pixels */
  radius: number;
  /** Current opacity value (0-1) */
  opacity: number;
  /** Particle color as CSS color string */
  color: string;
  /** Current phase of pulse animation (radians) */
  pulsePhase: number;
  /** Array of indices of connected particles */
  connections: number[];
}

/**
 * Color configuration for the overlay
 * Defines the color scheme for particles and effects
 * 
 * @interface ColorConfig
 * @since 1.0.0
 * @example
 * ```tsx
 * const colors: ColorConfig = {
 *   primary: '#8B5CF6',
 *   secondary: '#3B82F6',
 *   connectionColor: 'rgba(139, 92, 246, 0.15)',
 *   gradientColors: ['#1e1b4b', '#312e81']
 * };
 * ```
 */
export interface ColorConfig {
  /** Primary particle color */
  primary: string;
  /** Secondary accent color */
  secondary: string;
  /** Connection line color */
  connectionColor: string;
  /** Background gradient colors */
  gradientColors: string[];
}

/**
 * Animation configuration parameters
 * Controls animation behavior and interaction settings
 * 
 * @interface AnimationConfig
 * @since 1.0.0
 * @example
 * ```tsx
 * const animation: AnimationConfig = {
 *   speedMultiplier: 1.5,
 *   connectionOpacity: 0.2,
 *   mouseRadius: 250
 * };
 * ```
 */
export interface AnimationConfig {
  /** Particle movement speed multiplier */
  speedMultiplier: number;
  /** Connection line opacity (0-1) */
  connectionOpacity: number;
  /** Maximum connection distance in pixels */
  connectionDistance: number;
  /** Pulse effect speed */
  pulseSpeed: number;
  /** Mouse interaction radius */
  mouseRadius: number;
  /** Mouse force strength */
  mouseForce: number;
}

/**
 * Performance metrics for monitoring
 * Real-time performance data for optimization and debugging
 * 
 * @interface PerformanceMetrics
 * @since 1.0.0
 * @example
 * ```tsx
 * onFrame={(metrics: PerformanceMetrics) => {
 *   console.log(`FPS: ${metrics.fps}`);
 * }}
 * ```
 */
export interface PerformanceMetrics {
  /** Current frames per second */
  fps: number;
  /** Average FPS over last second */
  avgFps: number;
  /** Frame time in milliseconds */
  frameTime: number;
  /** Number of active particles */
  particleCount: number;
  /** Number of rendered connections */
  connectionCount: number;
  /** Performance mode in use */
  mode: PerformanceMode;
}

/**
 * Device capability detection results
 * Hardware and browser capability information for adaptive performance
 * 
 * @interface DeviceCapabilities
 * @since 1.0.0
 */
export interface DeviceCapabilities {
  /** Device has touch support */
  hasTouch: boolean;
  /** Device pixel ratio */
  pixelRatio: number;
  /** Device is considered low-end */
  isLowEnd: boolean;
  /** GPU tier estimate (1-3) */
  gpuTier: number;
  /** Available CPU cores */
  cpuCores: number;
}

/**
 * Feature toggle configuration
 * Enables/disables specific visual features for performance tuning
 * 
 * @interface FeatureToggles
 * @since 1.0.0
 * @example
 * ```tsx
 * const features: FeatureToggles = {
 *   particles: true,
 *   connections: true,
 *   mouseInteraction: false
 * };
 * ```
 */
export interface FeatureToggles {
  /** Enable particle system */
  particles: boolean;
  /** Enable connection lines */
  connections: boolean;
  /** Enable mouse interaction */
  mouseInteraction: boolean;
  /** Enable pulse effects */
  pulseEffect: boolean;
  /** Enable gradient background */
  gradientBackground: boolean;
  /** Enable automatic quality adjustment */
  autoQuality: boolean;
}

/**
 * Mouse state tracking
 * Tracks mouse position and activity for interaction effects
 * 
 * @interface MouseState
 * @since 1.0.0
 * @internal
 */
export interface MouseState {
  x: number;
  y: number;
  isActive: boolean;
  lastMove: number;
}

/**
 * Canvas rendering context state
 * Manages canvas dimensions and rendering context
 * 
 * @interface CanvasState
 * @since 1.0.0
 * @internal
 */
export interface CanvasState {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D | null;
  isInitialized: boolean;
}

/**
 * Animation frame state
 * Tracks animation loop timing and status
 * 
 * @interface AnimationState
 * @since 1.0.0
 * @internal
 */
export interface AnimationState {
  lastFrame: number;
  deltaTime: number;
  isPaused: boolean;
  frameCount: number;
}

/**
 * Debug information display
 * Configuration and data for debug overlay
 * 
 * @interface DebugInfo
 * @since 1.0.0
 */
export interface DebugInfo {
  enabled: boolean;
  position: DebugPosition;
  metrics: PerformanceMetrics;
  deviceInfo: DeviceCapabilities;
}

/**
 * Preset configuration templates
 * Pre-defined configurations for common use cases
 * 
 * @interface PresetConfig
 * @since 1.0.0
 * @example
 * ```tsx
 * const preset: PresetConfig = {
 *   name: 'minimal',
 *   particleCount: 30,
 *   colors: minimalColors,
 *   animation: minimalAnimation,
 *   features: minimalFeatures
 * };
 * ```
 */
export interface PresetConfig {
  name: string;
  particleCount: number;
  colors: ColorConfig;
  animation: AnimationConfig;
  features: FeatureToggles;
}

/**
 * Event callbacks for the overlay
 * Lifecycle and performance event handlers
 * 
 * @interface OverlayEvents
 * @since 1.0.0
 * @example
 * ```tsx
 * const events: OverlayEvents = {
 *   onInit: () => console.log('Overlay initialized'),
 *   onFrame: (metrics) => console.log(`FPS: ${metrics.fps}`),
 *   onPerformanceModeChange: (mode) => console.log(`Mode: ${mode}`)
 * };
 * ```
 */
export interface OverlayEvents {
  /** Called when performance mode changes */
  onPerformanceModeChange?: (mode: PerformanceMode) => void;
  /** Called on each frame with metrics */
  onFrame?: (metrics: PerformanceMetrics) => void;
  /** Called when overlay initializes */
  onInit?: () => void;
  /** Called when overlay is destroyed */
  onDestroy?: () => void;
}

/**
 * Accessibility configuration
 * Settings for improved accessibility and user preferences
 * 
 * @interface AccessibilityConfig
 * @since 1.0.0
 * @accessibility Configures WCAG compliance features
 * @example
 * ```tsx
 * const a11y: AccessibilityConfig = {
 *   respectMotionPreference: true,
 *   ariaLabel: 'Decorative particle animation',
 *   keyboardControls: false
 * };
 * ```
 */
export interface AccessibilityConfig {
  /** Respect prefers-reduced-motion */
  respectMotionPreference: boolean;
  /** ARIA label for the canvas */
  ariaLabel: string;
  /** Enable keyboard controls */
  keyboardControls: boolean;
}

/**
 * Bounds configuration for particle movement
 * Controls particle behavior at canvas edges
 * 
 * @interface BoundsConfig
 * @since 1.0.0
 * @example
 * ```tsx
 * const bounds: BoundsConfig = {
 *   padding: 50,
 *   bounce: false,
 *   wrap: true
 * };
 * ```
 */
export interface BoundsConfig {
  /** Padding from edges in pixels */
  padding: number;
  /** Bounce off edges */
  bounce: boolean;
  /** Wrap around edges */
  wrap: boolean;
}

/**
 * Quality settings for different performance modes
 * Defines feature sets and limits for each performance tier
 * 
 * @interface QualitySettings
 * @since 1.0.0
 * @internal
 */
export interface QualitySettings {
  [PerformanceMode.HIGH]: {
    particleCount: number;
    connectionDistance: number;
    features: FeatureToggles;
  };
  [PerformanceMode.BALANCED]: {
    particleCount: number;
    connectionDistance: number;
    features: FeatureToggles;
  };
  [PerformanceMode.LOW]: {
    particleCount: number;
    connectionDistance: number;
    features: FeatureToggles;
  };
}

/**
 * Main component props
 * Configuration options for the HeroOverlay component
 * 
 * @interface HeroOverlayProps
 * @since 1.0.0
 * @example
 * ```tsx
 * <HeroOverlay
 *   particleCount={60}
 *   performanceMode={PerformanceMode.BALANCED}
 *   intensity={AnimationIntensity.NORMAL}
 *   colors={{ primary: '#FF0000' }}
 *   debug={true}
 * />
 * ```
 */
export interface HeroOverlayProps {
  /** Number of particles to render */
  particleCount?: number;
  /** Color configuration */
  colors?: Partial<ColorConfig>;
  /** Animation configuration */
  animation?: Partial<AnimationConfig>;
  /** Performance mode */
  performanceMode?: PerformanceMode;
  /** Animation intensity */
  intensity?: AnimationIntensity;
  /** Feature toggles */
  features?: Partial<FeatureToggles>;
  /** Enable debug overlay */
  debug?: boolean;
  /** Debug overlay position */
  debugPosition?: DebugPosition;
  /** Event callbacks */
  events?: OverlayEvents;
  /** Accessibility configuration */
  accessibility?: Partial<AccessibilityConfig>;
  /** Bounds configuration */
  bounds?: Partial<BoundsConfig>;
  /** Custom className for the container */
  className?: string;
  /** Custom styles for the container */
  style?: React.CSSProperties;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default color configuration
 * Provides a purple-blue gradient theme
 * 
 * @constant {ColorConfig}
 * @since 1.0.0
 */
const DEFAULT_COLORS: ColorConfig = {
  primary: '#8B5CF6',
  secondary: '#3B82F6',
  connectionColor: 'rgba(139, 92, 246, 0.15)',
  gradientColors: ['#1e1b4b', '#312e81', '#1e1b4b']
};

/**
 * Default animation configuration
 * Balanced settings for smooth performance
 * 
 * @constant {AnimationConfig}
 * @since 1.0.0
 */
const DEFAULT_ANIMATION: AnimationConfig = {
  speedMultiplier: 1.0,
  connectionOpacity: 0.15,
  connectionDistance: 150,
  pulseSpeed: 0.001,
  mouseRadius: 200,
  mouseForce: 0.05
};

/**
 * Default feature toggles
 * All features enabled by default for best visual experience
 * 
 * @constant {FeatureToggles}
 * @since 1.0.0
 */
const DEFAULT_FEATURES: FeatureToggles = {
  particles: true,
  connections: true,
  mouseInteraction: true,
  pulseEffect: true,
  gradientBackground: true,
  autoQuality: true
};

/**
 * Default accessibility configuration
 * Respects user preferences and provides appropriate labels
 * 
 * @constant {AccessibilityConfig}
 * @since 1.0.0
 * @accessibility WCAG 2.1 compliant defaults
 */
const DEFAULT_ACCESSIBILITY: AccessibilityConfig = {
  respectMotionPreference: true,
  ariaLabel: 'Interactive particle animation overlay',
  keyboardControls: false
};

/**
 * Default bounds configuration
 * Particles wrap around edges with padding
 * 
 * @constant {BoundsConfig}
 * @since 1.0.0
 */
const DEFAULT_BOUNDS: BoundsConfig = {
  padding: 50,
  bounce: false,
  wrap: true
};

/**
 * Quality settings for each performance mode
 * Defines particle counts, connection distances, and feature availability
 * 
 * @constant {QualitySettings}
 * @since 1.0.0
 * @performance Pre-configured for optimal performance at each tier
 */
const QUALITY_SETTINGS: QualitySettings = {
  [PerformanceMode.HIGH]: {
    particleCount: 80,
    connectionDistance: 150,
    features: { ...DEFAULT_FEATURES }
  },
  [PerformanceMode.BALANCED]: {
    particleCount: 50,
    connectionDistance: 120,
    features: {
      ...DEFAULT_FEATURES,
      pulseEffect: false,
      gradientBackground: false
    }
  },
  [PerformanceMode.LOW]: {
    particleCount: 30,
    connectionDistance: 80,
    features: {
      particles: true,
      connections: false,
      mouseInteraction: false,
      pulseEffect: false,
      gradientBackground: false,
      autoQuality: false
    }
  }
};

/**
 * Animation intensity multipliers
 * Scales particle velocities based on intensity setting
 * 
 * @constant {Record<AnimationIntensity, number>}
 * @since 1.0.0
 */
const INTENSITY_MULTIPLIERS = {
  [AnimationIntensity.SUBTLE]: 0.5,
  [AnimationIntensity.NORMAL]: 1.0,
  [AnimationIntensity.DRAMATIC]: 1.5
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Detects device capabilities for performance optimization
 * Analyzes hardware and browser features to determine optimal settings
 * 
 * @function detectDeviceCapabilities
 * @returns {DeviceCapabilities} Object containing device capability information
 * @since 1.0.0
 * @example
 * ```tsx
 * const capabilities = detectDeviceCapabilities();
 * if (capabilities.isLowEnd) {
 *   // Use reduced quality settings
 * }
 * ```
 */
function detectDeviceCapabilities(): DeviceCapabilities {
  const hasTouch = 'ontouchstart' in window;
  const pixelRatio = window.devicePixelRatio || 1;
  const cpuCores = navigator.hardwareConcurrency || 4;
  
  // Simple GPU tier estimation based on available info
  let gpuTier = 2; // Default to mid-tier
  if (pixelRatio > 2 && cpuCores >= 8) gpuTier = 3;
  else if (pixelRatio <= 1 || cpuCores <= 2) gpuTier = 1;
  
  const isLowEnd = gpuTier === 1 || cpuCores <= 2 || 
    (hasTouch && pixelRatio > 2); // High DPI mobile devices
  
  return {
    hasTouch,
    pixelRatio,
    isLowEnd,
    gpuTier,
    cpuCores
  };
}

/**
 * Creates a single particle with random properties
 * Generates initial position, velocity, and visual properties
 * 
 * @function createParticle
 * @param {number} canvasWidth - Width of the canvas in pixels
 * @param {number} canvasHeight - Height of the canvas in pixels
 * @param {ColorConfig} colors - Color configuration for the particle
 * @param {AnimationIntensity} intensity - Animation intensity level
 * @returns {Particle} Newly created particle with randomized properties
 * @since 1.0.0
 * @example
 * ```tsx
 * const particle = createParticle(1920, 1080, colors, AnimationIntensity.NORMAL);
 * ```
 */
function createParticle(
  canvasWidth: number,
  canvasHeight: number,
  colors: ColorConfig,
  intensity: AnimationIntensity
): Particle {
  const intensityMultiplier = INTENSITY_MULTIPLIERS[intensity];
  
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.5 * intensityMultiplier,
    vy: (Math.random() - 0.5) * 0.5 * intensityMultiplier,
    radius: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
    color: Math.random() > 0.5 ? colors.primary : colors.secondary,
    pulsePhase: Math.random() * Math.PI * 2,
    connections: []
  };
}

/**
 * Checks if reduced motion is preferred
 * Detects user's motion preference from system settings
 * 
 * @function prefersReducedMotion
 * @returns {boolean} True if user prefers reduced motion
 * @since 1.0.0
 * @accessibility Respects WCAG 2.1 Success Criterion 2.3.3
 * @example
 * ```tsx
 * if (prefersReducedMotion()) {
 *   // Disable or reduce animations
 * }
 * ```
 */
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * HeroOverlay Component
 * 
 * A high-performance, interactive particle animation overlay with extensive
 * customization options and adaptive performance optimization.
 * 
 * Features:
 * - Adaptive performance modes with automatic quality adjustment
 * - Mouse interaction with particle repulsion effects
 * - Configurable particle connections and visual effects
 * - Accessibility support with motion preference detection
 * - Real-time performance monitoring and debugging
 * 
 * @component
 * @since 1.0.0
 * @accessibility Respects prefers-reduced-motion, provides ARIA labels
 * @performance Targets 60 FPS with automatic quality degradation
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <HeroOverlay />
 * 
 * // Custom configuration
 * <HeroOverlay
 *   particleCount={60}
 *   performanceMode={PerformanceMode.BALANCED}
 *   intensity={AnimationIntensity.NORMAL}
 *   colors={{
 *     primary: '#FF0000',
 *     secondary: '#00FF00'
 *   }}
 *   debug={true}
 * />
 * 
 * // With event handlers
 * <HeroOverlay
 *   events={{
 *     onInit: () => console.log('Initialized'),
 *     onFrame: (metrics) => console.log(`FPS: ${metrics.fps}`)
 *   }}
 * />
 * ```
 */
export default function HeroOverlay({
  particleCount: propParticleCount,
  colors: propColors = {},
  animation: propAnimation = {},
  performanceMode = PerformanceMode.BALANCED,
  intensity = AnimationIntensity.NORMAL,
  features: propFeatures = {},
  debug = false,
  debugPosition = DebugPosition.TOP_RIGHT,
  events = {},
  accessibility: propAccessibility = {},
  bounds: propBounds = {},
  className = '',
  style = {}
}: HeroOverlayProps) {
  /**
   * Component References
   * @since 1.0.0
   */
  
  /** Canvas element reference for direct DOM manipulation */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  /** Animation frame ID for cleanup */
  const animationFrameRef = useRef<number>(0);
  
  /** Particle array stored outside React state for performance */
  const particlesRef = useRef<Particle[]>([]);
  
  /** Performance metrics stored in ref to avoid re-renders */
  const metricsRef = useRef<PerformanceMetrics>({
    fps: 60,
    avgFps: 60,
    frameTime: 16.67,
    particleCount: 0,
    connectionCount: 0,
    mode: performanceMode
  });
  
  /**
   * Component State
   * @since 1.0.0
   */
  
  /** Canvas dimensions and context state */
  const [canvasState, setCanvasState] = useState<CanvasState>({
    width: 0,
    height: 0,
    ctx: null,
    isInitialized: false
  });
  
  /** Mouse position and activity tracking */
  const [mouseState, setMouseState] = useState<MouseState>({
    x: 0,
    y: 0,
    isActive: false,
    lastMove: 0
  });
  
  /** Current performance mode (may change due to auto-quality) */
  const [currentPerformanceMode, setCurrentPerformanceMode] = useState(performanceMode);
  
  /** Device capabilities detected on mount */
  const [deviceCapabilities] = useState(detectDeviceCapabilities);
  
  /**
   * Configuration Merging
   * Combines user props with defaults using memoization for performance
   * @since 1.0.0
   */
  
  /** Merged color configuration */
  const colors = useMemo(() => ({ ...DEFAULT_COLORS, ...propColors }), [propColors]);
  
  /** Merged animation configuration */
  const animation = useMemo(() => ({ ...DEFAULT_ANIMATION, ...propAnimation }), [propAnimation]);
  
  /** Merged feature toggles */
  const features = useMemo(() => ({ ...DEFAULT_FEATURES, ...propFeatures }), [propFeatures]);
  
  /** Merged accessibility configuration */
  const accessibility = useMemo(() => ({ ...DEFAULT_ACCESSIBILITY, ...propAccessibility }), [propAccessibility]);
  
  /** Merged bounds configuration */
  const bounds = useMemo(() => ({ ...DEFAULT_BOUNDS, ...propBounds }), [propBounds]);
  
  /**
   * Computed Values
   * Performance-aware calculations that adapt to current mode
   * @since 1.0.0
   */
  
  /** 
   * Effective particle count based on performance mode
   * User-specified count takes precedence over mode defaults
   */
  const effectiveParticleCount = useMemo(() => {
    if (propParticleCount !== undefined) return propParticleCount;
    return QUALITY_SETTINGS[currentPerformanceMode].particleCount;
  }, [propParticleCount, currentPerformanceMode]);
  
  /** 
   * Effective features based on performance mode
   * Mode features are overridden by user-specified features
   */
  const effectiveFeatures = useMemo(() => {
    const modeFeatures = QUALITY_SETTINGS[currentPerformanceMode].features;
    return { ...modeFeatures, ...features };
  }, [currentPerformanceMode, features]);
  
  /**
   * Initialize canvas and particles
   * Sets up canvas dimensions, context, and creates initial particle array
   * 
   * @function initializeCanvas
   * @returns {void}
   * @since 1.0.0
   * @sideeffect Updates canvas dimensions and particle array
   * @sideeffect Triggers onInit event callback
   * @performance O(n) where n is particle count
   */
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true
    });
    
    if (!ctx) return;
    
    // Set canvas size
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width * deviceCapabilities.pixelRatio;
    canvas.height = height * deviceCapabilities.pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(deviceCapabilities.pixelRatio, deviceCapabilities.pixelRatio);
    
    // Initialize particles
    particlesRef.current = Array.from({ length: effectiveParticleCount }, () =>
      createParticle(width, height, colors, intensity)
    );
    
    setCanvasState({
      width,
      height,
      ctx,
      isInitialized: true
    });
    
    // Call init event
    events.onInit?.();
  }, [effectiveParticleCount, colors, intensity, deviceCapabilities.pixelRatio, events]);
  
  /**
   * Update particle positions and handle interactions
   * Calculates new positions, applies forces, and finds connections
   * 
   * @function updateParticles
   * @param {number} deltaTime - Time elapsed since last update (normalized to 60fps)
   * @returns {void}
   * @since 1.0.0
   * @sideeffect Modifies particle positions and connections
   * @sideeffect Applies mouse interaction forces when active
   * @performance O(n²) for connection finding, O(n) for position updates
   * @example
   * ```tsx
   * updateParticles(deltaTime / 16.67); // Normalize to 60fps
   * ```
   */
  const updateParticles = useCallback((deltaTime: number) => {
    const particles = particlesRef.current;
    const { width, height } = canvasState;
    
    particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx * deltaTime * animation.speedMultiplier;
      particle.y += particle.vy * deltaTime * animation.speedMultiplier;
      
      // Handle bounds
      if (bounds.wrap) {
        if (particle.x < -bounds.padding) particle.x = width + bounds.padding;
        if (particle.x > width + bounds.padding) particle.x = -bounds.padding;
        if (particle.y < -bounds.padding) particle.y = height + bounds.padding;
        if (particle.y > height + bounds.padding) particle.y = -bounds.padding;
      } else if (bounds.bounce) {
        if (particle.x <= bounds.padding || particle.x >= width - bounds.padding) {
          particle.vx *= -1;
        }
        if (particle.y <= bounds.padding || particle.y >= height - bounds.padding) {
          particle.vy *= -1;
        }
      }
      
      // Mouse interaction
      if (effectiveFeatures.mouseInteraction && mouseState.isActive) {
        const dx = mouseState.x - particle.x;
        const dy = mouseState.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < animation.mouseRadius) {
          const force = (1 - distance / animation.mouseRadius) * animation.mouseForce;
          particle.vx -= (dx / distance) * force;
          particle.vy -= (dy / distance) * force;
        }
      }
      
      // Pulse effect
      if (effectiveFeatures.pulseEffect) {
        particle.pulsePhase += animation.pulseSpeed * deltaTime;
        particle.opacity = 0.3 + Math.sin(particle.pulsePhase) * 0.2;
      }
      
      // Clear previous connections
      particle.connections = [];
    });
    
    // Find connections
    if (effectiveFeatures.connections) {
      const maxDistance = QUALITY_SETTINGS[currentPerformanceMode].connectionDistance;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            particles[i].connections.push(j);
          }
        }
      }
    }
  }, [
    canvasState,
    bounds,
    animation,
    effectiveFeatures,
    mouseState,
    currentPerformanceMode
  ]);
  
  /**
   * Render particles and connections
   * Draws all visual elements to the canvas
   * 
   * @function renderFrame
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
   * @returns {void}
   * @since 1.0.0
   * @sideeffect Draws to canvas context
   * @sideeffect Updates connection count in metrics
   * @performance Critical path - called 60 times per second
   * @performance Uses globalAlpha for opacity instead of per-particle fillStyle
   */
  const renderFrame = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = canvasState;
    const particles = particlesRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw gradient background
    if (effectiveFeatures.gradientBackground) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      colors.gradientColors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.gradientColors.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.05;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    }
    
    // Draw connections
    if (effectiveFeatures.connections) {
      ctx.strokeStyle = colors.connectionColor;
      ctx.lineWidth = 1;
      
      let connectionCount = 0;
      particles.forEach((particle) => {
        particle.connections.forEach(j => {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = QUALITY_SETTINGS[currentPerformanceMode].connectionDistance;
          
          ctx.globalAlpha = (1 - distance / maxDistance) * animation.connectionOpacity;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
          connectionCount++;
        });
      });
      
      metricsRef.current.connectionCount = connectionCount;
    }
    
    // Draw particles
    if (effectiveFeatures.particles) {
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    ctx.globalAlpha = 1;
  }, [
    canvasState,
    effectiveFeatures,
    colors,
    animation,
    currentPerformanceMode
  ]);
  
  /**
   * Main animation loop
   * Manages frame timing, performance monitoring, and orchestrates updates
   * 
   * @function animate
   * @param {number} timestamp - High-resolution timestamp from requestAnimationFrame
   * @returns {void}
   * @since 1.0.0
   * @sideeffect Updates performance metrics
   * @sideeffect Triggers automatic quality adjustments when FPS drops below 30
   * @sideeffect Schedules next animation frame
   * @sideeffect Triggers onFrame event callback
   * @performance Targets 60 FPS, automatically downgrades quality if needed
   * @example
   * ```tsx
   * animationFrameRef.current = requestAnimationFrame(animate);
   * ```
   */
  const animate = useCallback((timestamp: number) => {
    if (!canvasState.ctx || !canvasState.isInitialized) return;
    
    // Calculate delta time and FPS
    const deltaTime = timestamp - (metricsRef.current.frameTime || timestamp);
    const fps = 1000 / deltaTime;
    
    // Update metrics
    metricsRef.current = {
      ...metricsRef.current,
      fps: Math.round(fps),
      avgFps: Math.round((metricsRef.current.avgFps * 0.95 + fps * 0.05)),
      frameTime: timestamp,
      particleCount: particlesRef.current.length,
      mode: currentPerformanceMode
    };
    
    // Auto-adjust quality if enabled
    if (effectiveFeatures.autoQuality && metricsRef.current.avgFps < 30) {
      if (currentPerformanceMode === PerformanceMode.HIGH) {
        setCurrentPerformanceMode(PerformanceMode.BALANCED);
        events.onPerformanceModeChange?.(PerformanceMode.BALANCED);
      } else if (currentPerformanceMode === PerformanceMode.BALANCED) {
        setCurrentPerformanceMode(PerformanceMode.LOW);
        events.onPerformanceModeChange?.(PerformanceMode.LOW);
      }
    }
    
    // Update and render
    updateParticles(deltaTime / 16.67); // Normalize to 60fps
    renderFrame(canvasState.ctx);
    
    // Call frame event
    events.onFrame?.(metricsRef.current);
    
    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [
    canvasState,
    currentPerformanceMode,
    effectiveFeatures.autoQuality,
    updateParticles,
    renderFrame,
    events
  ]);
  
  /**
   * Handle mouse movement
   * Updates mouse state for particle interaction effects
   * 
   * @function handleMouseMove
   * @param {MouseEvent} e - Mouse move event from DOM
   * @returns {void}
   * @since 1.0.0
   * @sideeffect Updates mouse state with current position
   * @accessibility Mouse interaction is decorative and not required for functionality
   * @performance Throttled internally by React's event system
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!effectiveFeatures.mouseInteraction) return;
    
    setMouseState({
      x: e.clientX,
      y: e.clientY,
      isActive: true,
      lastMove: Date.now()
    });
  }, [effectiveFeatures.mouseInteraction]);
  
  /**
   * Handle mouse leave
   * Deactivates mouse interaction when cursor leaves viewport
   * 
   * @function handleMouseLeave
   * @returns {void}
   * @since 1.0.0
   * @sideeffect Sets mouse state isActive to false
   */
  const handleMouseLeave = useCallback(() => {
    setMouseState(prev => ({ ...prev, isActive: false }));
  }, []);
  
  /**
   * Handle window resize
   * Reinitializes canvas when viewport dimensions change
   * 
   * @function handleResize
   * @returns {void}
   * @since 1.0.0
   * @sideeffect Recreates canvas dimensions and particle array
   * @performance Consider debouncing in production for better performance
   * @example
   * ```tsx
   * // With debouncing (recommended)
   * const debouncedResize = debounce(handleResize, 250);
   * window.addEventListener('resize', debouncedResize);
   * ```
   */
  const handleResize = useCallback(() => {
    initializeCanvas();
  }, [initializeCanvas]);
  
  /**
   * Canvas initialization effect
   * Sets up the canvas and starts the animation loop on component mount
   * 
   * @effect
   * @since 1.0.0
   * @sideeffect Initializes canvas and starts animation
   * @sideeffect Respects reduced motion preference
   * @cleanup Cancels animation frame and triggers onDestroy event
   */
  useEffect(() => {
    if (accessibility.respectMotionPreference && prefersReducedMotion()) {
      return; // Skip animation for users who prefer reduced motion
    }
    
    initializeCanvas();
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      events.onDestroy?.();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  /**
   * Event listener management effect
   * Attaches and cleans up window event listeners
   * 
   * @effect
   * @since 1.0.0
   * @sideeffect Adds mousemove, mouseleave, and resize listeners
   * @cleanup Removes all event listeners
   */
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleMouseMove, handleMouseLeave, handleResize]);
  
  /**
   * Debug overlay position styles
   * CSS positioning for debug panel placement
   * 
   * @constant {Record<DebugPosition, React.CSSProperties>}
   * @since 1.0.0
   */
  const debugPositionStyles: Record<DebugPosition, React.CSSProperties> = {
    [DebugPosition.TOP_LEFT]: { top: 10, left: 10 },
    [DebugPosition.TOP_RIGHT]: { top: 10, right: 10 },
    [DebugPosition.BOTTOM_LEFT]: { bottom: 10, left: 10 },
    [DebugPosition.BOTTOM_RIGHT]: { bottom: 10, right: 10 }
  };
  
  /**
   * Component Render
   * Returns the canvas element and optional debug overlay
   * 
   * @returns {JSX.Element} Rendered component
   * @since 1.0.0
   * @accessibility Canvas has ARIA label and img role for screen readers
   */
  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-label={accessibility.ariaLabel}
        role="img"
      />
      
      {debug && (
        <div
          className="fixed bg-black/80 text-white p-4 rounded-lg font-mono text-xs pointer-events-auto"
          style={debugPositionStyles[debugPosition]}
        >
          <h3 className="font-bold mb-2">Debug Info</h3>
          <div className="space-y-1">
            <div>FPS: {metricsRef.current.fps} (avg: {metricsRef.current.avgFps})</div>
            <div>Particles: {metricsRef.current.particleCount}</div>
            <div>Connections: {metricsRef.current.connectionCount}</div>
            <div>Mode: {currentPerformanceMode}</div>
            <div>Intensity: {intensity}</div>
            <div>GPU Tier: {deviceCapabilities.gpuTier}/3</div>
            <div>CPU Cores: {deviceCapabilities.cpuCores}</div>
            <div>Pixel Ratio: {deviceCapabilities.pixelRatio}</div>
            <div>Touch: {deviceCapabilities.hasTouch ? 'Yes' : 'No'}</div>
          </div>
          
          <div className="mt-3 space-y-1">
            <h4 className="font-bold">Features:</h4>
            {Object.entries(effectiveFeatures).map(([key, value]) => (
              <div key={key} className="ml-2">
                {key}: {value ? '✓' : '✗'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}