/**
 * @fileoverview Validation Module Index
 * 
 * Central export point for all HeroOverlay validation utilities,
 * schemas, and types.
 * 
 * @module lib/validation
 * @since 1.0.0
 */

// Export all schemas and types
export * from './hero-overlay-schemas';

// Export all validators and utilities
export * from './hero-overlay-validators';

// Re-export commonly used items for convenience
export {
  // Schemas
  HeroOverlayPropsSchema,
  PerformanceModeSchema,
  AnimationIntensitySchema,
  ColorConfigSchema,
  AnimationConfigSchema,
  FeatureTogglesSchema,
  ParticleSchema,
  
  // Types
  type HeroOverlayProps,
  type PerformanceMode,
  type AnimationIntensity,
  type ColorConfig,
  type AnimationConfig,
  type FeatureToggles,
  type Particle,
  type PerformanceMetrics,
  type DeviceCapabilities,
  
  // Validation functions
  validateHeroOverlayProps,
  safeValidateProps,
  validatePerformanceSettings,
  isPerformanceMode,
  isAnimationIntensity,
  isValidCSSColor,
  
  // Default values
  DEFAULT_HERO_OVERLAY_PROPS
} from './hero-overlay-schemas';

export {
  // Validation utilities
  validateHeroOverlayComplete,
  validatePerformanceConfig,
  validateColorConfig,
  validateParticle,
  validateAndLog,
  createValidationReport,
  
  // Error classes
  HeroOverlayValidationError,
  
  // Types
  type ValidationError,
  type ValidationResult
} from './hero-overlay-validators';