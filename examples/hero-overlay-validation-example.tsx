/**
 * @fileoverview HeroOverlay Validation Examples
 * 
 * Demonstrates various validation scenarios for the HeroOverlay component
 * with Zod schemas and runtime validation.
 * 
 * @module examples/hero-overlay-validation-example
 * @since 1.0.0
 */

'use client';

import React, { useState } from 'react';
import ValidatedHeroOverlay from '@/components/ValidatedHeroOverlay';
import { 
  validateHeroOverlayComplete,
  createValidationReport,
  validateAndLog
} from '@/lib/validation/hero-overlay-validators';
import {
  HeroOverlayPropsSchema,
  safeValidateProps,
  validatePerformanceSettings,
  isPerformanceMode,
  isValidCSSColor,
  type HeroOverlayProps
} from '@/lib/validation/hero-overlay-schemas';

/**
 * Example configurations for testing validation
 * @since 1.0.0
 */
const EXAMPLE_CONFIGS = {
  // Valid configuration
  valid: {
    particleCount: 60,
    performanceMode: 'BALANCED' as const,
    intensity: 'NORMAL' as const,
    colors: {
      primary: '#8B5CF6',
      secondary: '#3B82F6',
      connectionColor: 'rgba(139, 92, 246, 0.15)'
    },
    animation: {
      speedMultiplier: 1.0,
      connectionOpacity: 0.15
    },
    features: {
      particles: true,
      connections: true,
      mouseInteraction: true
    }
  },
  
  // Configuration with warnings
  warningConfig: {
    particleCount: 150, // Too many particles for balanced mode
    performanceMode: 'BALANCED' as const,
    intensity: 'DRAMATIC' as const,
    animation: {
      speedMultiplier: 4.0, // Very high speed
      connectionDistance: 300 // Large connection distance
    }
  },
  
  // Invalid configuration
  invalid: {
    particleCount: -10, // Invalid: negative count
    performanceMode: 'INVALID_MODE', // Invalid: not in enum
    colors: {
      primary: 'not-a-color', // Invalid: not a valid CSS color
      gradientColors: [] // Invalid: needs at least 2 colors
    },
    animation: {
      connectionOpacity: 2.0, // Invalid: > 1
      mouseForce: -0.5 // Invalid: negative
    }
  },
  
  // Performance-optimized configuration
  optimized: {
    particleCount: 30,
    performanceMode: 'LOW' as const,
    intensity: 'SUBTLE' as const,
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
 * HeroOverlay Validation Example Component
 * 
 * Interactive demonstration of validation features for the HeroOverlay component.
 * 
 * @component
 * @since 1.0.0
 */
export default function HeroOverlayValidationExample() {
  const [selectedConfig, setSelectedConfig] = useState<keyof typeof EXAMPLE_CONFIGS>('valid');
  const [strictMode, setStrictMode] = useState(false);
  const [showValidation, setShowValidation] = useState(true);
  const [validationResult, setValidationResult] = useState<string>('');
  
  /**
   * Validates the current configuration
   * @since 1.0.0
   */
  const validateCurrentConfig = async () => {
    const config = EXAMPLE_CONFIGS[selectedConfig];
    const result = await validateHeroOverlayComplete(config);
    const report = createValidationReport(result);
    setValidationResult(report);
    console.log(report);
  };
  
  /**
   * Tests various validation utilities
   * @since 1.0.0
   */
  const runValidationTests = () => {
    console.group('HeroOverlay Validation Tests');
    
    // Test 1: Schema validation
    console.log('\n=== Test 1: Schema Validation ===');
    const schemaResult = HeroOverlayPropsSchema.safeParse(EXAMPLE_CONFIGS.valid);
    console.log('Valid config passes schema:', schemaResult.success);
    
    // Test 2: Safe validation
    console.log('\n=== Test 2: Safe Validation ===');
    const safeResult = safeValidateProps(EXAMPLE_CONFIGS.invalid);
    console.log('Invalid config errors:', safeResult.errors);
    
    // Test 3: Performance validation
    console.log('\n=== Test 3: Performance Validation ===');
    const perfResult = validatePerformanceSettings('HIGH', 150);
    console.log('Performance warnings:', perfResult.warnings);
    
    // Test 4: Type guards
    console.log('\n=== Test 4: Type Guards ===');
    console.log('Is "HIGH" a valid mode?', isPerformanceMode('HIGH'));
    console.log('Is "INVALID" a valid mode?', isPerformanceMode('INVALID'));
    console.log('Is "#FF0000" a valid color?', isValidCSSColor('#FF0000'));
    console.log('Is "not-a-color" a valid color?', isValidCSSColor('not-a-color'));
    
    // Test 5: Validation with logging
    console.log('\n=== Test 5: Validation with Logging ===');
    validateAndLog(EXAMPLE_CONFIGS.warningConfig, 'info');
    
    console.groupEnd();
  };
  
  /**
   * Handle validation error callback
   * @since 1.0.0
   */
  const handleValidationError = (error: Error) => {
    console.error('Validation error caught:', error);
    setValidationResult(`ERROR: ${error.message}`);
  };
  
  /**
   * Handle validation warning callback
   * @since 1.0.0
   */
  const handleValidationWarning = (warnings: string[]) => {
    console.warn('Validation warnings:', warnings);
    setValidationResult(`WARNINGS:\n${warnings.join('\n')}`);
  };
  
  return (
    <div className="relative min-h-screen">
      {/* Validated HeroOverlay */}
      <ValidatedHeroOverlay
        {...EXAMPLE_CONFIGS[selectedConfig] as any}
        strictMode={strictMode}
        showWarnings={showValidation}
        onValidationError={handleValidationError}
        onValidationWarning={handleValidationWarning}
        errorBoundary={true}
        debug={true}
      />
      
      {/* Control Panel */}
      <div className="fixed top-4 left-4 bg-white/90 dark:bg-black/90 p-6 rounded-lg shadow-lg max-w-md z-50">
        <h2 className="text-xl font-bold mb-4">HeroOverlay Validation Demo</h2>
        
        {/* Configuration Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Configuration:
          </label>
          <select
            value={selectedConfig}
            onChange={(e) => setSelectedConfig(e.target.value as keyof typeof EXAMPLE_CONFIGS)}
            className="w-full p-2 border rounded dark:bg-gray-800"
          >
            <option value="valid">Valid Configuration</option>
            <option value="warningConfig">Configuration with Warnings</option>
            <option value="invalid">Invalid Configuration</option>
            <option value="optimized">Performance Optimized</option>
          </select>
        </div>
        
        {/* Options */}
        <div className="space-y-2 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={strictMode}
              onChange={(e) => setStrictMode(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Strict Mode (throw on errors)</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showValidation}
              onChange={(e) => setShowValidation(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Show Validation Warnings</span>
          </label>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={validateCurrentConfig}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Validate Config
          </button>
          
          <button
            onClick={runValidationTests}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Run Tests
          </button>
        </div>
        
        {/* Validation Result */}
        {validationResult && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <h3 className="text-sm font-semibold mb-2">Validation Result:</h3>
            <pre className="text-xs overflow-auto max-h-40 whitespace-pre-wrap">
              {validationResult}
            </pre>
          </div>
        )}
        
        {/* Current Config Display */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium">
            View Current Configuration
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-60">
            {JSON.stringify(EXAMPLE_CONFIGS[selectedConfig], null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

/**
 * Example: Using validation in a custom hook
 * @since 1.0.0
 */
export function useValidatedHeroOverlay(props: Partial<HeroOverlayProps>) {
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  React.useEffect(() => {
    const result = safeValidateProps(props);
    setIsValid(result.success);
    setErrors(result.errors || []);
  }, [props]);
  
  return { isValid, errors };
}

/**
 * Example: Type-safe configuration builder
 * @since 1.0.0
 */
export class HeroOverlayConfigBuilder {
  private config: Partial<HeroOverlayProps> = {};
  
  setParticleCount(count: number): this {
    if (count < 0 || count > 200) {
      throw new Error('Particle count must be between 0 and 200');
    }
    this.config.particleCount = count;
    return this;
  }
  
  setPerformanceMode(mode: 'HIGH' | 'BALANCED' | 'LOW'): this {
    this.config.performanceMode = mode;
    return this;
  }
  
  setColors(colors: Partial<HeroOverlayProps['colors']>): this {
    this.config.colors = colors;
    return this;
  }
  
  validate(): { valid: boolean; errors?: string[] } {
    const result = safeValidateProps(this.config);
    return {
      valid: result.success,
      errors: result.errors
    };
  }
  
  build(): HeroOverlayProps {
    const result = this.validate();
    if (!result.valid) {
      throw new Error(`Invalid configuration: ${result.errors?.join(', ')}`);
    }
    return HeroOverlayPropsSchema.parse(this.config);
  }
}