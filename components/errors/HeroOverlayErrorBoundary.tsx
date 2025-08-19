/**
 * @fileoverview HeroOverlay Error Boundary Component
 * 
 * Comprehensive error handling system for the HeroOverlay component.
 * Provides graceful fallbacks, error recovery, and browser compatibility checks.
 * 
 * @module components/errors/HeroOverlayErrorBoundary
 * @since 1.0.0
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Fallback mode types for error recovery
 */
export enum FallbackMode {
  /** Static gradient background */
  STATIC = 'STATIC',
  /** Animated gradient background */
  GRADIENT = 'GRADIENT',
  /** Completely disabled overlay */
  DISABLED = 'DISABLED',
  /** Minimal particle system */
  MINIMAL = 'MINIMAL'
}

/**
 * Error types that can occur in the overlay
 */
export enum ErrorType {
  /** WebGL context lost or unavailable */
  WEBGL_ERROR = 'WEBGL_ERROR',
  /** Browser compatibility issue */
  BROWSER_INCOMPATIBLE = 'BROWSER_INCOMPATIBLE',
  /** Runtime rendering error */
  RENDER_ERROR = 'RENDER_ERROR',
  /** Memory or performance issue */
  PERFORMANCE_ERROR = 'PERFORMANCE_ERROR',
  /** Unknown error type */
  UNKNOWN = 'UNKNOWN'
}

/**
 * Browser capability check results
 */
interface BrowserCapabilities {
  canvas: boolean;
  webgl: boolean;
  requestAnimationFrame: boolean;
  intersectionObserver: boolean;
  matchMedia: boolean;
  cssGradients: boolean;
  cssAnimations: boolean;
}

/**
 * Error information for logging and reporting
 */
export interface ErrorDetails {
  type: ErrorType;
  message: string;
  stack?: string;
  timestamp: number;
  userAgent: string;
  capabilities: BrowserCapabilities;
  fallbackMode: FallbackMode;
  retryCount: number;
}

/**
 * Props for the error boundary component
 */
interface HeroOverlayErrorBoundaryProps {
  children: ReactNode;
  /** Fallback mode to use when errors occur */
  fallbackMode?: FallbackMode;
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Callback for error reporting */
  onError?: (error: ErrorDetails) => void;
  /** Enable error recovery attempts */
  enableRecovery?: boolean;
  /** Show error details in development */
  showErrorDetails?: boolean;
  /** Custom fallback component */
  customFallback?: ReactNode;
  /** Retry delay in milliseconds */
  retryDelay?: number;
}

/**
 * State for the error boundary component
 */
interface HeroOverlayErrorBoundaryState {
  hasError: boolean;
  errorType: ErrorType;
  errorMessage: string;
  errorStack?: string;
  retryCount: number;
  fallbackMode: FallbackMode;
  isRecovering: boolean;
  capabilities: BrowserCapabilities;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check browser capabilities for overlay features
 */
function checkBrowserCapabilities(): BrowserCapabilities {
  if (typeof window === 'undefined') {
    return {
      canvas: false,
      webgl: false,
      requestAnimationFrame: false,
      intersectionObserver: false,
      matchMedia: false,
      cssGradients: false,
      cssAnimations: false
    };
  }

  // Canvas support
  const canvas = !!document.createElement('canvas').getContext;
  
  // WebGL support
  let webgl = false;
  try {
    const testCanvas = document.createElement('canvas');
    webgl = !!(
      testCanvas.getContext('webgl') || 
      testCanvas.getContext('experimental-webgl')
    );
  } catch (e) {
    webgl = false;
  }

  // Animation frame support
  const requestAnimationFrame = !!(
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame
  );

  // Intersection Observer support
  const intersectionObserver = 'IntersectionObserver' in window;

  // Match Media support
  const matchMedia = 'matchMedia' in window;

  // CSS Gradients support
  const cssGradients = (() => {
    const elem = document.createElement('div');
    elem.style.cssText = 'background: linear-gradient(to right, red, blue);';
    return elem.style.background.includes('gradient');
  })();

  // CSS Animations support
  const cssAnimations = (() => {
    const elem = document.createElement('div');
    const animations = ['animation', 'webkitAnimation', 'mozAnimation', 'msAnimation'];
    return animations.some(prop => prop in elem.style);
  })();

  return {
    canvas,
    webgl,
    requestAnimationFrame,
    intersectionObserver,
    matchMedia,
    cssGradients,
    cssAnimations
  };
}

/**
 * Determine error type from error object
 */
function determineErrorType(error: Error): ErrorType {
  const message = error.message.toLowerCase();
  
  if (message.includes('webgl') || message.includes('context')) {
    return ErrorType.WEBGL_ERROR;
  }
  
  if (message.includes('browser') || message.includes('support')) {
    return ErrorType.BROWSER_INCOMPATIBLE;
  }
  
  if (message.includes('memory') || message.includes('performance')) {
    return ErrorType.PERFORMANCE_ERROR;
  }
  
  if (message.includes('render') || message.includes('canvas')) {
    return ErrorType.RENDER_ERROR;
  }
  
  return ErrorType.UNKNOWN;
}

/**
 * Determine best fallback mode based on capabilities
 */
function determineFallbackMode(capabilities: BrowserCapabilities): FallbackMode {
  if (!capabilities.canvas || !capabilities.requestAnimationFrame) {
    return FallbackMode.DISABLED;
  }
  
  if (capabilities.cssGradients && capabilities.cssAnimations) {
    return FallbackMode.GRADIENT;
  }
  
  if (capabilities.cssGradients) {
    return FallbackMode.STATIC;
  }
  
  return FallbackMode.MINIMAL;
}

// ============================================================================
// FALLBACK COMPONENTS
// ============================================================================

/**
 * Static gradient fallback component
 */
function StaticGradientFallback() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        opacity: 0.1
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Animated gradient fallback component
 */
function AnimatedGradientFallback() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(270deg, #1e1b4b, #312e81, #4c1d95, #312e81, #1e1b4b)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 30s ease infinite',
          opacity: 0.15
        }}
      />
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

/**
 * Minimal particle fallback using CSS only
 */
function MinimalParticleFallback() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          opacity: 0.05
        }}
      />
      
      {/* CSS-only floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/20"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${20 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 20}s`
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * Disabled fallback (no visual effect)
 */
function DisabledFallback() {
  return null;
}

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

/**
 * Error boundary component for HeroOverlay
 * 
 * Provides comprehensive error handling with multiple fallback modes,
 * browser compatibility checking, and automatic recovery mechanisms.
 */
export class HeroOverlayErrorBoundary extends Component<
  HeroOverlayErrorBoundaryProps,
  HeroOverlayErrorBoundaryState
> {
  private retryTimeoutId?: NodeJS.Timeout;
  private recoveryAttempts = 0;

  constructor(props: HeroOverlayErrorBoundaryProps) {
    super(props);
    
    const capabilities = checkBrowserCapabilities();
    
    this.state = {
      hasError: false,
      errorType: ErrorType.UNKNOWN,
      errorMessage: '',
      errorStack: undefined,
      retryCount: 0,
      fallbackMode: props.fallbackMode || determineFallbackMode(capabilities),
      isRecovering: false,
      capabilities
    };
  }

  static getDerivedStateFromError(error: Error): Partial<HeroOverlayErrorBoundaryState> {
    const errorType = determineErrorType(error);
    
    return {
      hasError: true,
      errorType,
      errorMessage: error.message,
      errorStack: error.stack
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, enableRecovery = true, maxRetries = 3 } = this.props;
    const { capabilities, retryCount } = this.state;

    // Create error details for logging
    const errorDetails: ErrorDetails = {
      type: determineErrorType(error),
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      capabilities,
      fallbackMode: this.state.fallbackMode,
      retryCount
    };

    // Report error if callback provided
    onError?.(errorDetails);

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('HeroOverlay Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.log('Browser Capabilities:', capabilities);
      console.log('Fallback Mode:', this.state.fallbackMode);
    }

    // Attempt recovery if enabled and under retry limit
    if (enableRecovery && retryCount < maxRetries) {
      this.attemptRecovery();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  /**
   * Attempt to recover from error
   */
  attemptRecovery = () => {
    const { retryDelay = 2000, maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    this.setState({ isRecovering: true });

    this.retryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        isRecovering: false,
        retryCount: prevState.retryCount + 1,
        // Downgrade fallback mode on each retry
        fallbackMode: this.getDowngradedFallbackMode(prevState.fallbackMode)
      }));
    }, retryDelay * (retryCount + 1)); // Exponential backoff
  };

  /**
   * Get a less resource-intensive fallback mode
   */
  getDowngradedFallbackMode(currentMode: FallbackMode): FallbackMode {
    const downgradeMap: Record<FallbackMode, FallbackMode> = {
      [FallbackMode.MINIMAL]: FallbackMode.GRADIENT,
      [FallbackMode.GRADIENT]: FallbackMode.STATIC,
      [FallbackMode.STATIC]: FallbackMode.DISABLED,
      [FallbackMode.DISABLED]: FallbackMode.DISABLED
    };
    
    return downgradeMap[currentMode];
  }

  /**
   * Render appropriate fallback based on mode
   */
  renderFallback() {
    const { customFallback, showErrorDetails = false } = this.props;
    const { fallbackMode, errorMessage, isRecovering } = this.state;

    if (customFallback) {
      return <>{customFallback}</>;
    }

    // Show recovery indicator
    if (isRecovering) {
      return (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-purple-500/20 text-sm">
            Recovering overlay...
          </div>
        </div>
      );
    }

    // Show error details in development
    if (showErrorDetails && process.env.NODE_ENV === 'development') {
      return (
        <>
          {this.renderFallbackByMode(fallbackMode)}
          <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-sm">
            <h3 className="text-red-500 font-semibold mb-2">Overlay Error</h3>
            <p className="text-red-400 text-sm">{errorMessage}</p>
            <p className="text-red-400/60 text-xs mt-2">
              Fallback: {fallbackMode} | Retry: {this.state.retryCount}/{this.props.maxRetries || 3}
            </p>
          </div>
        </>
      );
    }

    return this.renderFallbackByMode(fallbackMode);
  }

  /**
   * Render fallback component based on mode
   */
  renderFallbackByMode(mode: FallbackMode) {
    switch (mode) {
      case FallbackMode.GRADIENT:
        return <AnimatedGradientFallback />;
      case FallbackMode.STATIC:
        return <StaticGradientFallback />;
      case FallbackMode.MINIMAL:
        return <MinimalParticleFallback />;
      case FallbackMode.DISABLED:
      default:
        return <DisabledFallback />;
    }
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

export default HeroOverlayErrorBoundary;