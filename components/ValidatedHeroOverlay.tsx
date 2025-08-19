/**
 * @fileoverview ValidatedHeroOverlay Component
 * 
 * A validation wrapper for the HeroOverlay component that provides
 * runtime validation, error boundaries, and development-time warnings.
 * 
 * @module components/ValidatedHeroOverlay
 * @since 1.0.0
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  validateHeroOverlayComplete,
  createValidationReport,
  HeroOverlayValidationError,
  type ValidationResult
} from '@/lib/validation/hero-overlay-validators';
import type { HeroOverlayProps as SchemaHeroOverlayProps } from '@/lib/validation/hero-overlay-schemas';
import { 
  PerformanceMode, 
  AnimationIntensity, 
  DebugPosition,
  type HeroOverlayProps 
} from './HeroOverlay';

// Dynamically import HeroOverlay to avoid SSR issues
const HeroOverlay = dynamic(() => import('./HeroOverlay'), {
  ssr: false,
  loading: () => <HeroOverlayFallback />
});

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Converts string literal values from Zod schema to TypeScript enum values
 * @param props - Props from Zod validation
 * @returns Props with proper enum values
 * @since 1.0.0
 */
function convertToEnumProps(props: Partial<SchemaHeroOverlayProps>): HeroOverlayProps {
  const converted: HeroOverlayProps = { ...props } as any;
  
  // Convert performanceMode string to enum
  if (props.performanceMode) {
    converted.performanceMode = PerformanceMode[props.performanceMode as keyof typeof PerformanceMode];
  }
  
  // Convert intensity string to enum
  if (props.intensity) {
    converted.intensity = AnimationIntensity[props.intensity as keyof typeof AnimationIntensity];
  }
  
  // Convert debugPosition string to enum
  if (props.debugPosition) {
    converted.debugPosition = DebugPosition[props.debugPosition as keyof typeof DebugPosition];
  }
  
  return converted;
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * ValidatedHeroOverlay component props
 * Extends HeroOverlay props with validation options
 * 
 * @interface ValidatedHeroOverlayProps
 * @since 1.0.0
 */
export interface ValidatedHeroOverlayProps extends Partial<SchemaHeroOverlayProps> {
  /** Enable strict validation mode (throws on errors) */
  strictMode?: boolean;
  
  /** Show validation warnings in console */
  showWarnings?: boolean;
  
  /** Custom fallback component for validation errors */
  fallback?: React.ComponentType<{ error: Error }>;
  
  /** Callback when validation fails */
  onValidationError?: (error: HeroOverlayValidationError) => void;
  
  /** Callback when validation succeeds with warnings */
  onValidationWarning?: (warnings: string[]) => void;
  
  /** Enable validation in production */
  validateInProduction?: boolean;
  
  /** Custom error boundary */
  errorBoundary?: boolean;
}

/**
 * Error boundary state
 * @interface ErrorBoundaryState
 * @since 1.0.0
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ============================================================================
// FALLBACK COMPONENTS
// ============================================================================

/**
 * Default loading fallback
 * @since 1.0.0
 */
function HeroOverlayFallback() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="w-full h-full bg-gradient-to-br from-purple-900/5 to-blue-900/5" />
    </div>
  );
}

/**
 * Default error fallback
 * @since 1.0.0
 */
function HeroOverlayErrorFallback({ error }: { error: Error }) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-4 right-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md">
          <h3 className="text-red-500 font-bold mb-2">HeroOverlay Validation Error</h3>
          <pre className="text-red-400 text-xs overflow-auto max-h-40">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }
  
  // In production, render a simple fallback
  return <HeroOverlayFallback />;
}

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

/**
 * Error boundary for catching runtime errors
 * @since 1.0.0
 */
class HeroOverlayErrorBoundary extends React.Component<
  { 
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error }>;
  },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('HeroOverlay Error:', error);
      console.error('Error Info:', errorInfo);
    }
  }
  
  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback || HeroOverlayErrorFallback;
      return <Fallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ValidatedHeroOverlay Component
 * 
 * Provides runtime validation and error handling for HeroOverlay.
 * In development, validates all props and shows warnings/errors.
 * In production, can optionally validate or skip for performance.
 * 
 * @component
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * // Basic usage with validation
 * <ValidatedHeroOverlay
 *   particleCount={60}
 *   performanceMode="BALANCED"
 * />
 * 
 * // Strict mode - throws on validation errors
 * <ValidatedHeroOverlay
 *   strictMode={true}
 *   particleCount={60}
 *   onValidationError={(error) => console.error(error)}
 * />
 * 
 * // Custom error handling
 * <ValidatedHeroOverlay
 *   fallback={CustomErrorComponent}
 *   errorBoundary={true}
 *   particleCount={60}
 * />
 * ```
 */
export default function ValidatedHeroOverlay({
  strictMode = false,
  showWarnings = true,
  fallback,
  onValidationError,
  onValidationWarning,
  validateInProduction = false,
  errorBoundary = true,
  ...props
}: ValidatedHeroOverlayProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validatedProps, setValidatedProps] = useState<HeroOverlayProps | null>(null);
  
  /**
   * Perform validation
   * @since 1.0.0
   */
  const shouldValidate = useMemo(() => {
    return process.env.NODE_ENV === 'development' || validateInProduction;
  }, [validateInProduction]);
  
  /**
   * Validate props on mount and when they change
   * @since 1.0.0
   */
  useEffect(() => {
    if (!shouldValidate) {
      // Skip validation in production unless explicitly enabled
      // Still need to convert string literals to enums
      setValidatedProps(convertToEnumProps(props));
      return;
    }
    
    const performValidation = async () => {
      try {
        const result = await validateHeroOverlayComplete(props);
        setValidationResult(result);
      
      // Handle validation errors
      if (!result.success) {
        const error = new HeroOverlayValidationError(
          'HeroOverlay props validation failed',
          result.errors,
          'ValidatedHeroOverlay'
        );
        
        if (strictMode) {
          throw error;
        }
        
        onValidationError?.(error);
        
        if (process.env.NODE_ENV === 'development') {
          console.error(createValidationReport(result));
        }
        
        // Don't render if validation fails in strict mode
        if (strictMode) {
          setValidatedProps(null);
          return;
        }
      }
      
      // Handle warnings
      if (result.warnings.length > 0) {
        const warnings = result.warnings.map(w => `${w.path}: ${w.message}`);
        onValidationWarning?.(warnings);
        
        if (showWarnings && process.env.NODE_ENV === 'development') {
          console.warn(createValidationReport(result));
        }
      }
      
      // Set validated props with enum conversion
      const propsToUse = result.data || props;
      setValidatedProps(convertToEnumProps(propsToUse));
      
      } catch (error) {
        if (strictMode) {
          throw error;
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Validation error:', error);
        }
        
        // Fallback to unvalidated props in non-strict mode with enum conversion
        setValidatedProps(convertToEnumProps(props));
      }
    };
    
    performValidation();
  }, [props, shouldValidate, strictMode, showWarnings, onValidationError, onValidationWarning]);
  
  /**
   * Development mode validation panel
   * @since 1.0.0
   */
  const ValidationPanel = useMemo(() => {
    if (process.env.NODE_ENV !== 'development' || !validationResult) {
      return null;
    }
    
    const hasIssues = 
      validationResult.errors.length > 0 ||
      validationResult.warnings.length > 0 ||
      validationResult.info.length > 0;
    
    if (!hasIssues) {
      return null;
    }
    
    return (
      <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg font-mono text-xs max-w-sm pointer-events-auto z-50">
        <h4 className="font-bold mb-2">Validation Report</h4>
        
        {validationResult.errors.length > 0 && (
          <div className="mb-2">
            <span className="text-red-400 font-semibold">Errors:</span>
            {validationResult.errors.map((err, i) => (
              <div key={i} className="ml-2 text-red-300">
                • {err.path}: {err.message}
              </div>
            ))}
          </div>
        )}
        
        {validationResult.warnings.length > 0 && (
          <div className="mb-2">
            <span className="text-yellow-400 font-semibold">Warnings:</span>
            {validationResult.warnings.map((warn, i) => (
              <div key={i} className="ml-2 text-yellow-300">
                • {warn.path}: {warn.message}
              </div>
            ))}
          </div>
        )}
        
        {validationResult.info.length > 0 && (
          <div>
            <span className="text-blue-400 font-semibold">Info:</span>
            {validationResult.info.map((inf, i) => (
              <div key={i} className="ml-2 text-blue-300">
                • {inf.path}: {inf.message}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [validationResult]);
  
  /**
   * Render component
   * @since 1.0.0
   */
  if (!validatedProps) {
    // Props failed validation in strict mode or not yet validated
    const ErrorFallback = fallback || HeroOverlayErrorFallback;
    if (strictMode && validationResult && !validationResult.success) {
      const error = new HeroOverlayValidationError(
        'Props validation failed',
        validationResult.errors
      );
      return <ErrorFallback error={error} />;
    }
    return <HeroOverlayFallback />;
  }
  
  const content = (
    <>
      <HeroOverlay {...validatedProps} />
      {ValidationPanel}
    </>
  );
  
  if (errorBoundary) {
    return (
      <HeroOverlayErrorBoundary fallback={fallback}>
        {content}
      </HeroOverlayErrorBoundary>
    );
  }
  
  return content;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { HeroOverlayErrorBoundary, HeroOverlayFallback, HeroOverlayErrorFallback };