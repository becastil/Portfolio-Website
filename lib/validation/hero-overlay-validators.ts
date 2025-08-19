/**
 * @fileoverview Advanced Validation Utilities for HeroOverlay
 * 
 * Provides comprehensive validation utilities, error handling,
 * and performance validation for the HeroOverlay component.
 * 
 * @module lib/validation/hero-overlay-validators
 * @since 1.0.0
 */

import type {
  HeroOverlayProps,
  ColorConfig,
  Particle
} from './hero-overlay-schemas';

// ============================================================================
// VALIDATION ERROR HANDLING
// ============================================================================

/**
 * Custom validation error class
 * @since 1.0.0
 */
export class HeroOverlayValidationError extends Error {
  public readonly errors: ValidationError[];
  public readonly context: string;
  
  constructor(message: string, errors: ValidationError[], context?: string) {
    super(message);
    this.name = 'HeroOverlayValidationError';
    this.errors = errors;
    this.context = context || 'HeroOverlay';
  }
  
  /**
   * Formats errors for console output
   * @returns Formatted error string
   */
  toString(): string {
    const errorList = this.errors
      .map(err => `  • ${err.path}: ${err.message}`)
      .join('\n');
    return `${this.message}\n${errorList}`;
  }
  
  /**
   * Converts errors to JSON format
   * @returns JSON representation of errors
   */
  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      context: this.context,
      errors: this.errors
    };
  }
}

/**
 * Individual validation error structure
 * @since 1.0.0
 */
export interface ValidationError {
  path: string;
  message: string;
  code?: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * Validation result structure
 * @since 1.0.0
 */
export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
  warnings: ValidationError[];
  info: ValidationError[];
}

// ============================================================================
// PERFORMANCE VALIDATION
// ============================================================================

/**
 * Performance validation configuration
 * @since 1.0.0
 */
interface PerformanceThresholds {
  maxParticles: Record<'HIGH' | 'BALANCED' | 'LOW', number>;
  maxConnections: Record<'HIGH' | 'BALANCED' | 'LOW', number>;
  recommendedFPS: Record<'HIGH' | 'BALANCED' | 'LOW', number>;
}

const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  maxParticles: {
    HIGH: 150,
    BALANCED: 80,
    LOW: 40
  },
  maxConnections: {
    HIGH: 200,
    BALANCED: 100,
    LOW: 0
  },
  recommendedFPS: {
    HIGH: 60,
    BALANCED: 45,
    LOW: 30
  }
};

/**
 * Validates performance configuration
 * @param props - HeroOverlay props to validate
 * @returns Validation result with performance recommendations
 * @since 1.0.0
 */
export function validatePerformanceConfig(
  props: Partial<HeroOverlayProps>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const info: ValidationError[] = [];
  
  const mode = props.performanceMode || 'BALANCED';
  const particleCount = props.particleCount || 50;
  const features = props.features || {};
  
  // Check particle count against mode
  const maxParticles = PERFORMANCE_THRESHOLDS.maxParticles[mode];
  if (particleCount > maxParticles) {
    warnings.push({
      path: 'particleCount',
      message: `Particle count (${particleCount}) exceeds recommended maximum (${maxParticles}) for ${mode} mode`,
      code: 'PERF_PARTICLE_COUNT',
      severity: 'warning'
    });
  }
  
  // Check feature compatibility with mode
  if (mode === 'LOW') {
    if (features.connections) {
      warnings.push({
        path: 'features.connections',
        message: 'Connections are not recommended in LOW performance mode',
        code: 'PERF_CONNECTIONS_LOW',
        severity: 'warning'
      });
    }
    if (features.pulseEffect) {
      warnings.push({
        path: 'features.pulseEffect',
        message: 'Pulse effects are not recommended in LOW performance mode',
        code: 'PERF_PULSE_LOW',
        severity: 'warning'
      });
    }
  }
  
  // Check animation config
  if (props.animation) {
    if (props.animation.connectionDistance && props.animation.connectionDistance > 200) {
      info.push({
        path: 'animation.connectionDistance',
        message: 'Large connection distances may impact performance',
        code: 'PERF_CONNECTION_DISTANCE',
        severity: 'info'
      });
    }
    
    if (props.animation.speedMultiplier && props.animation.speedMultiplier > 3) {
      warnings.push({
        path: 'animation.speedMultiplier',
        message: 'High speed multipliers may cause visual artifacts',
        code: 'PERF_SPEED_MULTIPLIER',
        severity: 'warning'
      });
    }
  }
  
  return {
    success: errors.length === 0,
    data: props,
    errors,
    warnings,
    info
  };
}

// ============================================================================
// COLOR VALIDATION
// ============================================================================

/**
 * Validates color configuration with contrast checks
 * @param colors - Color configuration to validate
 * @returns Validation result with accessibility warnings
 * @since 1.0.0
 */
export function validateColorConfig(
  colors: Partial<ColorConfig>
): ValidationResult<ColorConfig> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const info: ValidationError[] = [];
  
  // Check color contrast for connections
  if (colors.connectionColor) {
    const opacity = extractOpacityFromColor(colors.connectionColor);
    if (opacity < 0.1) {
      warnings.push({
        path: 'colors.connectionColor',
        message: 'Connection color opacity is very low and may not be visible',
        code: 'COLOR_LOW_OPACITY',
        severity: 'warning'
      });
    }
  }
  
  // Check gradient color count
  if (colors.gradientColors) {
    if (colors.gradientColors.length > 3) {
      info.push({
        path: 'colors.gradientColors',
        message: 'Using more than 3 gradient colors may impact performance',
        code: 'COLOR_GRADIENT_COUNT',
        severity: 'info'
      });
    }
  }
  
  return {
    success: errors.length === 0,
    data: colors as ColorConfig,
    errors,
    warnings,
    info
  };
}

/**
 * Extracts opacity value from a color string
 * @param color - CSS color string
 * @returns Opacity value (0-1)
 * @since 1.0.0
 */
function extractOpacityFromColor(color: string): number {
  // Check for rgba format
  const rgbaMatch = color.match(/rgba?\(.*,\s*([\d.]+)\)/);
  if (rgbaMatch) {
    return parseFloat(rgbaMatch[1]);
  }
  
  // Check for hex with alpha
  if (color.startsWith('#') && color.length === 9) {
    const alpha = parseInt(color.slice(7, 9), 16);
    return alpha / 255;
  }
  
  return 1; // Default opacity for non-transparent colors
}

// ============================================================================
// PARTICLE VALIDATION
// ============================================================================

/**
 * Validates a particle object
 * @param particle - Particle to validate
 * @param canvasWidth - Canvas width for bounds checking
 * @param canvasHeight - Canvas height for bounds checking
 * @returns Validation result
 * @since 1.0.0
 */
export function validateParticle(
  particle: Partial<Particle>,
  canvasWidth: number,
  canvasHeight: number
): ValidationResult<Particle> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const info: ValidationError[] = [];
  
  // Check position bounds
  if (particle.x !== undefined) {
    if (particle.x < 0 || particle.x > canvasWidth) {
      warnings.push({
        path: 'particle.x',
        message: `Particle X position (${particle.x}) is outside canvas bounds`,
        code: 'PARTICLE_OUT_OF_BOUNDS_X',
        severity: 'warning'
      });
    }
  }
  
  if (particle.y !== undefined) {
    if (particle.y < 0 || particle.y > canvasHeight) {
      warnings.push({
        path: 'particle.y',
        message: `Particle Y position (${particle.y}) is outside canvas bounds`,
        code: 'PARTICLE_OUT_OF_BOUNDS_Y',
        severity: 'warning'
      });
    }
  }
  
  // Check velocity
  if (particle.vx !== undefined && Math.abs(particle.vx) > 5) {
    info.push({
      path: 'particle.vx',
      message: 'High X velocity may cause particles to move too fast',
      code: 'PARTICLE_HIGH_VELOCITY_X',
      severity: 'info'
    });
  }
  
  if (particle.vy !== undefined && Math.abs(particle.vy) > 5) {
    info.push({
      path: 'particle.vy',
      message: 'High Y velocity may cause particles to move too fast',
      code: 'PARTICLE_HIGH_VELOCITY_Y',
      severity: 'info'
    });
  }
  
  return {
    success: errors.length === 0,
    data: particle as Particle,
    errors,
    warnings,
    info
  };
}

// ============================================================================
// COMPOSITE VALIDATION
// ============================================================================

/**
 * Performs comprehensive validation of all HeroOverlay props
 * @param props - Props to validate
 * @returns Complete validation result
 * @since 1.0.0
 */
export async function validateHeroOverlayComplete(
  props: unknown
): Promise<ValidationResult<HeroOverlayProps>> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const info: ValidationError[] = [];
  
  // First, validate schema
  const schemaResult = await validatePropsSchema(props);
  if (!schemaResult.success) {
    return schemaResult;
  }
  
  const validatedProps = schemaResult.data!;
  
  // Validate performance configuration
  const perfResult = validatePerformanceConfig(validatedProps);
  warnings.push(...perfResult.warnings);
  info.push(...perfResult.info);
  
  // Validate color configuration if provided
  if (validatedProps.colors) {
    const colorResult = validateColorConfig(validatedProps.colors);
    warnings.push(...colorResult.warnings);
    info.push(...colorResult.info);
  }
  
  // Check for conflicting settings
  if (validatedProps.bounds) {
    if (validatedProps.bounds.bounce && validatedProps.bounds.wrap) {
      errors.push({
        path: 'bounds',
        message: 'Cannot enable both bounce and wrap modes',
        code: 'BOUNDS_CONFLICT',
        severity: 'error'
      });
    }
  }
  
  // Check accessibility
  if (validatedProps.accessibility?.respectMotionPreference === false &&
      validatedProps.intensity === 'DRAMATIC') {
    warnings.push({
      path: 'accessibility.respectMotionPreference',
      message: 'Dramatic animations without respecting motion preference may cause accessibility issues',
      code: 'A11Y_MOTION',
      severity: 'warning'
    });
  }
  
  return {
    success: errors.length === 0,
    data: validatedProps,
    errors,
    warnings,
    info
  };
}

/**
 * Validates props against schema
 * @param props - Props to validate
 * @returns Validation result
 * @since 1.0.0
 */
async function validatePropsSchema(props: unknown): Promise<ValidationResult<HeroOverlayProps>> {
  try {
    // Import schema dynamically to avoid circular dependency
    const { HeroOverlayPropsSchema } = await import('./hero-overlay-schemas');
    const result = HeroOverlayPropsSchema.safeParse(props);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
        errors: [],
        warnings: [],
        info: []
      };
    }
    
    const errors: ValidationError[] = result.error.issues.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
      severity: 'error' as const
    }));
    
    return {
      success: false,
      errors,
      warnings: [],
      info: []
    };
  } catch (error) {
    return {
      success: false,
      errors: [{
        path: 'root',
        message: error instanceof Error ? error.message : 'Unknown validation error',
        severity: 'error'
      }],
      warnings: [],
      info: []
    };
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Creates a validation report for console output
 * @param result - Validation result
 * @returns Formatted report string
 * @since 1.0.0
 */
export function createValidationReport(result: ValidationResult): string {
  const lines: string[] = [];
  
  lines.push('=== HeroOverlay Validation Report ===');
  lines.push(`Status: ${result.success ? '✓ PASSED' : '✗ FAILED'}`);
  lines.push('');
  
  if (result.errors.length > 0) {
    lines.push('ERRORS:');
    result.errors.forEach(err => {
      lines.push(`  ✗ ${err.path}: ${err.message}`);
    });
    lines.push('');
  }
  
  if (result.warnings.length > 0) {
    lines.push('WARNINGS:');
    result.warnings.forEach(warn => {
      lines.push(`  ⚠ ${warn.path}: ${warn.message}`);
    });
    lines.push('');
  }
  
  if (result.info.length > 0) {
    lines.push('INFO:');
    result.info.forEach(inf => {
      lines.push(`  ℹ ${inf.path}: ${inf.message}`);
    });
    lines.push('');
  }
  
  lines.push('=====================================');
  
  return lines.join('\n');
}

/**
 * Validates props and logs report to console
 * @param props - Props to validate
 * @param logLevel - Minimum severity level to log
 * @returns Validation result
 * @since 1.0.0
 */
export async function validateAndLog(
  props: unknown,
  logLevel: 'error' | 'warning' | 'info' = 'warning'
): Promise<ValidationResult<HeroOverlayProps>> {
  const result = await validateHeroOverlayComplete(props);
  
  if (process.env.NODE_ENV === 'development') {
    const report = createValidationReport(result);
    
    if (!result.success) {
      console.error(report);
    } else if (result.warnings.length > 0 && logLevel !== 'error') {
      console.warn(report);
    } else if (result.info.length > 0 && logLevel === 'info') {
      console.info(report);
    }
  }
  
  return result;
}