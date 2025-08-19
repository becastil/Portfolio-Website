/**
 * @fileoverview Zod Validation Schemas for HeroOverlay Component
 * 
 * Comprehensive runtime validation schemas for all HeroOverlay props,
 * configurations, and data structures. Provides type inference and
 * validation utilities for ensuring type safety at runtime.
 * 
 * @module lib/validation/hero-overlay-schemas
 * @since 1.0.0
 */

import { z } from 'zod';

// ============================================================================
// ENUM SCHEMAS
// ============================================================================

/**
 * Performance mode validation schema
 * @since 1.0.0
 */
export const PerformanceModeSchema = z.enum(['HIGH', 'BALANCED', 'LOW']);
export type PerformanceMode = z.infer<typeof PerformanceModeSchema>;

/**
 * Animation intensity validation schema
 * @since 1.0.0
 */
export const AnimationIntensitySchema = z.enum(['SUBTLE', 'NORMAL', 'DRAMATIC']);
export type AnimationIntensity = z.infer<typeof AnimationIntensitySchema>;

/**
 * Debug position validation schema
 * @since 1.0.0
 */
export const DebugPositionSchema = z.enum(['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT']);
export type DebugPosition = z.infer<typeof DebugPositionSchema>;

// ============================================================================
// COLOR VALIDATION
// ============================================================================

/**
 * CSS color string validation
 * Validates hex colors, rgb/rgba, hsl/hsla, and named colors
 * @since 1.0.0
 */
const CSSColorSchema = z.string().refine(
  (val) => {
    // Check for valid CSS color formats
    const hexPattern = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
    const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;
    const hslPattern = /^hsla?\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*(,\s*[\d.]+\s*)?\)$/;
    const namedColors = ['transparent', 'white', 'black', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    
    return hexPattern.test(val) || 
           rgbPattern.test(val) || 
           hslPattern.test(val) || 
           namedColors.includes(val.toLowerCase());
  },
  { message: 'Invalid CSS color format' }
);

/**
 * Color configuration schema
 * @since 1.0.0
 */
export const ColorConfigSchema = z.object({
  primary: CSSColorSchema.describe('Primary particle color'),
  secondary: CSSColorSchema.describe('Secondary accent color'),
  connectionColor: CSSColorSchema.describe('Connection line color'),
  gradientColors: z.array(CSSColorSchema)
    .min(2, 'Gradient requires at least 2 colors')
    .max(5, 'Gradient supports maximum 5 colors')
    .describe('Background gradient colors')
});

export type ColorConfig = z.infer<typeof ColorConfigSchema>;

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

/**
 * Animation configuration schema
 * @since 1.0.0
 */
export const AnimationConfigSchema = z.object({
  speedMultiplier: z.number()
    .min(0.1, 'Speed multiplier must be at least 0.1')
    .max(5, 'Speed multiplier cannot exceed 5')
    .describe('Particle movement speed multiplier'),
  
  connectionOpacity: z.number()
    .min(0, 'Connection opacity must be between 0 and 1')
    .max(1, 'Connection opacity must be between 0 and 1')
    .describe('Connection line opacity'),
  
  connectionDistance: z.number()
    .min(50, 'Connection distance must be at least 50px')
    .max(500, 'Connection distance cannot exceed 500px')
    .describe('Maximum connection distance in pixels'),
  
  pulseSpeed: z.number()
    .min(0, 'Pulse speed must be positive')
    .max(0.1, 'Pulse speed cannot exceed 0.1')
    .describe('Pulse effect speed'),
  
  mouseRadius: z.number()
    .min(50, 'Mouse radius must be at least 50px')
    .max(500, 'Mouse radius cannot exceed 500px')
    .describe('Mouse interaction radius'),
  
  mouseForce: z.number()
    .min(0, 'Mouse force must be positive')
    .max(1, 'Mouse force cannot exceed 1')
    .describe('Mouse force strength')
});

export type AnimationConfig = z.infer<typeof AnimationConfigSchema>;

// ============================================================================
// FEATURE TOGGLES
// ============================================================================

/**
 * Feature toggles schema
 * @since 1.0.0
 */
export const FeatureTogglesSchema = z.object({
  particles: z.boolean().describe('Enable particle system'),
  connections: z.boolean().describe('Enable connection lines'),
  mouseInteraction: z.boolean().describe('Enable mouse interaction'),
  pulseEffect: z.boolean().describe('Enable pulse effects'),
  gradientBackground: z.boolean().describe('Enable gradient background'),
  autoQuality: z.boolean().describe('Enable automatic quality adjustment')
});

export type FeatureToggles = z.infer<typeof FeatureTogglesSchema>;

// ============================================================================
// ACCESSIBILITY CONFIGURATION
// ============================================================================

/**
 * Accessibility configuration schema
 * @since 1.0.0
 */
export const AccessibilityConfigSchema = z.object({
  respectMotionPreference: z.boolean()
    .describe('Respect prefers-reduced-motion setting'),
  
  ariaLabel: z.string()
    .min(1, 'ARIA label cannot be empty')
    .max(200, 'ARIA label too long')
    .describe('ARIA label for the canvas'),
  
  keyboardControls: z.boolean()
    .describe('Enable keyboard controls')
});

export type AccessibilityConfig = z.infer<typeof AccessibilityConfigSchema>;

// ============================================================================
// BOUNDS CONFIGURATION
// ============================================================================

/**
 * Bounds configuration schema
 * @since 1.0.0
 */
export const BoundsConfigSchema = z.object({
  padding: z.number()
    .min(0, 'Padding must be positive')
    .max(200, 'Padding cannot exceed 200px')
    .describe('Padding from edges in pixels'),
  
  bounce: z.boolean()
    .describe('Bounce particles off edges'),
  
  wrap: z.boolean()
    .describe('Wrap particles around edges')
}).refine(
  (data) => !(data.bounce && data.wrap),
  { message: 'Cannot enable both bounce and wrap modes simultaneously' }
);

export type BoundsConfig = z.infer<typeof BoundsConfigSchema>;

// ============================================================================
// PERFORMANCE METRICS
// ============================================================================

/**
 * Performance metrics schema
 * @since 1.0.0
 */
export const PerformanceMetricsSchema = z.object({
  fps: z.number()
    .min(0)
    .max(240)
    .describe('Current frames per second'),
  
  avgFps: z.number()
    .min(0)
    .max(240)
    .describe('Average FPS over last second'),
  
  frameTime: z.number()
    .min(0)
    .describe('Frame time in milliseconds'),
  
  particleCount: z.number()
    .min(0)
    .max(1000)
    .describe('Number of active particles'),
  
  connectionCount: z.number()
    .min(0)
    .describe('Number of rendered connections'),
  
  mode: PerformanceModeSchema
    .describe('Performance mode in use')
});

export type PerformanceMetrics = z.infer<typeof PerformanceMetricsSchema>;

// ============================================================================
// DEVICE CAPABILITIES
// ============================================================================

/**
 * Device capabilities schema
 * @since 1.0.0
 */
export const DeviceCapabilitiesSchema = z.object({
  hasTouch: z.boolean()
    .describe('Device has touch support'),
  
  pixelRatio: z.number()
    .min(0.5)
    .max(4)
    .describe('Device pixel ratio'),
  
  isLowEnd: z.boolean()
    .describe('Device is considered low-end'),
  
  gpuTier: z.number()
    .int()
    .min(1)
    .max(3)
    .describe('GPU tier estimate'),
  
  cpuCores: z.number()
    .int()
    .min(1)
    .max(64)
    .describe('Available CPU cores')
});

export type DeviceCapabilities = z.infer<typeof DeviceCapabilitiesSchema>;

// ============================================================================
// PARTICLE SCHEMA
// ============================================================================

/**
 * Individual particle schema
 * @since 1.0.0
 */
export const ParticleSchema = z.object({
  x: z.number()
    .describe('Current X position in pixels'),
  
  y: z.number()
    .describe('Current Y position in pixels'),
  
  vx: z.number()
    .min(-10)
    .max(10)
    .describe('Velocity in X direction'),
  
  vy: z.number()
    .min(-10)
    .max(10)
    .describe('Velocity in Y direction'),
  
  radius: z.number()
    .min(0.5)
    .max(10)
    .describe('Particle radius in pixels'),
  
  opacity: z.number()
    .min(0)
    .max(1)
    .describe('Current opacity value'),
  
  color: CSSColorSchema
    .describe('Particle color'),
  
  pulsePhase: z.number()
    .describe('Current phase of pulse animation'),
  
  connections: z.array(z.number().int().min(0))
    .describe('Array of connected particle indices')
});

export type Particle = z.infer<typeof ParticleSchema>;

// ============================================================================
// EVENT CALLBACKS
// ============================================================================

/**
 * Event callbacks interface
 * Note: Function types cannot be validated at runtime with Zod v4
 * @since 1.0.0
 */
export interface OverlayEvents {
  onPerformanceModeChange?: (mode: PerformanceMode) => void;
  onFrame?: (metrics: PerformanceMetrics) => void;
  onInit?: () => void;
  onDestroy?: () => void;
}

/**
 * Event callbacks schema - validates presence only
 * @since 1.0.0
 */
export const OverlayEventsSchema = z.object({
  onPerformanceModeChange: z.any().optional(),
  onFrame: z.any().optional(),
  onInit: z.any().optional(),
  onDestroy: z.any().optional()
}).optional();

// ============================================================================
// MAIN COMPONENT PROPS
// ============================================================================

/**
 * Main HeroOverlay component props schema
 * @since 1.0.0
 */
export const HeroOverlayPropsSchema = z.object({
  particleCount: z.number()
    .int()
    .min(0, 'Particle count must be positive')
    .max(200, 'Particle count cannot exceed 200 for performance')
    .optional()
    .describe('Number of particles to render'),
  
  colors: ColorConfigSchema.partial()
    .optional()
    .describe('Color configuration'),
  
  animation: AnimationConfigSchema.partial()
    .optional()
    .describe('Animation configuration'),
  
  performanceMode: PerformanceModeSchema
    .optional()
    .default('BALANCED')
    .describe('Performance mode'),
  
  intensity: AnimationIntensitySchema
    .optional()
    .default('NORMAL')
    .describe('Animation intensity'),
  
  features: FeatureTogglesSchema.partial()
    .optional()
    .describe('Feature toggles'),
  
  debug: z.boolean()
    .optional()
    .default(false)
    .describe('Enable debug overlay'),
  
  debugPosition: DebugPositionSchema
    .optional()
    .default('TOP_RIGHT')
    .describe('Debug overlay position'),
  
  events: OverlayEventsSchema
    .describe('Event callbacks'),
  
  accessibility: AccessibilityConfigSchema.partial()
    .optional()
    .describe('Accessibility configuration'),
  
  bounds: BoundsConfigSchema.partial()
    .optional()
    .describe('Bounds configuration'),
  
  className: z.string()
    .optional()
    .default('')
    .describe('Custom className for the container'),
  
  style: z.record(z.string(), z.any())
    .optional()
    .describe('Custom styles for the container')
});

export type HeroOverlayProps = z.infer<typeof HeroOverlayPropsSchema>;

// ============================================================================
// PRESET CONFIGURATION
// ============================================================================

/**
 * Preset configuration schema
 * @since 1.0.0
 */
export const PresetConfigSchema = z.object({
  name: z.string()
    .min(1)
    .max(50)
    .describe('Preset name'),
  
  particleCount: z.number()
    .int()
    .min(0)
    .max(200)
    .describe('Number of particles'),
  
  colors: ColorConfigSchema
    .describe('Color configuration'),
  
  animation: AnimationConfigSchema
    .describe('Animation configuration'),
  
  features: FeatureTogglesSchema
    .describe('Feature toggles')
});

export type PresetConfig = z.infer<typeof PresetConfigSchema>;

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates HeroOverlay props with detailed error reporting
 * @param props - Props to validate
 * @returns Validated props or throws with detailed errors
 * @since 1.0.0
 */
export function validateHeroOverlayProps(props: unknown): HeroOverlayProps {
  try {
    return HeroOverlayPropsSchema.parse(props);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodErrors(error);
      throw new Error(`HeroOverlay validation failed:\n${formattedErrors}`);
    }
    throw error;
  }
}

/**
 * Safely validates props without throwing
 * @param props - Props to validate
 * @returns Result object with success status and data or errors
 * @since 1.0.0
 */
export function safeValidateProps(props: unknown): {
  success: boolean;
  data?: HeroOverlayProps;
  errors?: string[];
} {
  const result = HeroOverlayPropsSchema.safeParse(props);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error?.issues?.map(err => 
      `${err.path.join('.')}: ${err.message}`
    ) || ['Unknown validation error']
  };
}

/**
 * Validates performance settings
 * @param mode - Performance mode
 * @param particleCount - Number of particles
 * @returns Validation result with recommendations
 * @since 1.0.0
 */
export function validatePerformanceSettings(
  mode: PerformanceMode,
  particleCount?: number
): {
  valid: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // Validate particle count for performance mode
  if (mode === 'LOW' && particleCount && particleCount > 50) {
    warnings.push('High particle count with LOW performance mode may cause lag');
    recommendations.push('Consider reducing particle count to 30 or less');
  }
  
  if (mode === 'HIGH' && particleCount && particleCount > 100) {
    warnings.push('Very high particle count may impact performance');
    recommendations.push('Enable autoQuality feature for adaptive performance');
  }
  
  return {
    valid: warnings.length === 0,
    warnings,
    recommendations
  };
}

/**
 * Formats Zod errors for better readability
 * @param error - Zod error object
 * @returns Formatted error string
 * @since 1.0.0
 */
function formatZodErrors(error: z.ZodError): string {
  return error.issues
    .map(err => {
      const path = err.path.join('.');
      const message = err.message;
      return `  • ${path}: ${message}`;
    })
    .join('\n');
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for PerformanceMode
 * @param value - Value to check
 * @returns True if value is a valid PerformanceMode
 * @since 1.0.0
 */
export function isPerformanceMode(value: unknown): value is PerformanceMode {
  return PerformanceModeSchema.safeParse(value).success;
}

/**
 * Type guard for AnimationIntensity
 * @param value - Value to check
 * @returns True if value is a valid AnimationIntensity
 * @since 1.0.0
 */
export function isAnimationIntensity(value: unknown): value is AnimationIntensity {
  return AnimationIntensitySchema.safeParse(value).success;
}

/**
 * Type guard for valid CSS color
 * @param value - Value to check
 * @returns True if value is a valid CSS color
 * @since 1.0.0
 */
export function isValidCSSColor(value: unknown): boolean {
  return CSSColorSchema.safeParse(value).success;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Default values derived from schemas
 * @since 1.0.0
 */
export const DEFAULT_HERO_OVERLAY_PROPS: HeroOverlayProps = {
  performanceMode: 'BALANCED',
  intensity: 'NORMAL',
  debug: false,
  debugPosition: 'TOP_RIGHT',
  className: '',
  style: {}
};