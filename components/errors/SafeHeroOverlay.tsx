/**
 * @fileoverview Safe HeroOverlay Wrapper Component
 * 
 * A production-ready wrapper that includes error boundaries, compatibility checks,
 * and graceful degradation for the HeroOverlay component.
 * 
 * @module components/errors/SafeHeroOverlay
 * @since 1.0.0
 */

'use client';

import React, { useEffect, useState, Suspense, lazy } from 'react';
import HeroOverlayErrorBoundary, { 
  FallbackMode,
  type ErrorDetails 
} from './HeroOverlayErrorBoundary';
import type { HeroOverlayProps } from '../HeroOverlay';

// Lazy load the actual HeroOverlay component
const HeroOverlay = lazy(() => import('../HeroOverlay'));

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Safe HeroOverlay configuration
 */
export interface SafeHeroOverlayConfig {
  /** Enable WebGL context recovery */
  enableWebGLRecovery?: boolean;
  /** Enable performance monitoring */
  enablePerformanceMonitoring?: boolean;
  /** Minimum browser version requirements */
  minBrowserVersions?: {
    chrome?: number;
    firefox?: number;
    safari?: number;
    edge?: number;
  };
  /** Error reporting endpoint */
  errorReportingUrl?: string;
  /** Enable analytics tracking */
  enableAnalytics?: boolean;
}

/**
 * Props for SafeHeroOverlay component
 */
export interface SafeHeroOverlayProps extends HeroOverlayProps {
  /** Safety configuration */
  safetyConfig?: SafeHeroOverlayConfig;
  /** Fallback mode preference */
  preferredFallback?: FallbackMode;
  /** Disable overlay completely on error */
  disableOnError?: boolean;
  /** Loading component while lazy loading */
  loadingComponent?: React.ReactNode;
  /** Enable verbose logging */
  verbose?: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if browser meets minimum version requirements
 */
function checkBrowserVersion(minVersions?: SafeHeroOverlayConfig['minBrowserVersions']): boolean {
  if (!minVersions) return true;
  
  const ua = navigator.userAgent;
  
  // Chrome/Chromium
  const chromeMatch = ua.match(/Chrome\/(\d+)/);
  if (chromeMatch && minVersions.chrome) {
    const version = parseInt(chromeMatch[1], 10);
    if (version < minVersions.chrome) return false;
  }
  
  // Firefox
  const firefoxMatch = ua.match(/Firefox\/(\d+)/);
  if (firefoxMatch && minVersions.firefox) {
    const version = parseInt(firefoxMatch[1], 10);
    if (version < minVersions.firefox) return false;
  }
  
  // Safari
  const safariMatch = ua.match(/Version\/(\d+).*Safari/);
  if (safariMatch && minVersions.safari) {
    const version = parseInt(safariMatch[1], 10);
    if (version < minVersions.safari) return false;
  }
  
  // Edge
  const edgeMatch = ua.match(/Edg\/(\d+)/);
  if (edgeMatch && minVersions.edge) {
    const version = parseInt(edgeMatch[1], 10);
    if (version < minVersions.edge) return false;
  }
  
  return true;
}

/**
 * Check WebGL availability and health
 */
function checkWebGLHealth(): { available: boolean; version: string | null; error?: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      return { available: false, version: null, error: 'WebGL not supported' };
    }
    
    const version = gl.getParameter(gl.VERSION);
    const renderer = gl.getParameter(gl.RENDERER);
    
    // Check for software renderer (slow)
    if (renderer.toLowerCase().includes('swiftshader') || 
        renderer.toLowerCase().includes('software')) {
      return { 
        available: false, 
        version: version, 
        error: 'Software renderer detected' 
      };
    }
    
    return { available: true, version: version };
  } catch (error) {
    return { 
      available: false, 
      version: null, 
      error: error instanceof Error ? error.message : 'WebGL check failed' 
    };
  }
}

/**
 * Report error to analytics or monitoring service
 */
async function reportError(
  errorDetails: ErrorDetails, 
  config?: SafeHeroOverlayConfig
): Promise<void> {
  if (!config?.errorReportingUrl) return;
  
  try {
    await fetch(config.errorReportingUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...errorDetails,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      })
    });
  } catch (error) {
    console.error('Failed to report error:', error);
  }
}

/**
 * Monitor WebGL context for loss and recovery
 */
function setupWebGLContextMonitoring(
  canvas: HTMLCanvasElement,
  onContextLost: () => void,
  onContextRestored: () => void
): () => void {
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    onContextLost();
  };
  
  const handleContextRestored = () => {
    onContextRestored();
  };
  
  canvas.addEventListener('webglcontextlost', handleContextLost);
  canvas.addEventListener('webglcontextrestored', handleContextRestored);
  
  return () => {
    canvas.removeEventListener('webglcontextlost', handleContextLost);
    canvas.removeEventListener('webglcontextrestored', handleContextRestored);
  };
}

// ============================================================================
// LOADING COMPONENT
// ============================================================================

/**
 * Default loading component shown while lazy loading
 */
function DefaultLoadingComponent() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          opacity: 0.05,
          animation: 'pulse 2s ease-in-out infinite'
        }}
      />
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * SafeHeroOverlay Component
 * 
 * A production-ready wrapper for HeroOverlay that includes:
 * - Error boundaries with multiple fallback modes
 * - Browser compatibility checking
 * - WebGL context monitoring and recovery
 * - Performance monitoring
 * - Lazy loading
 * - Error reporting
 * 
 * @example
 * ```tsx
 * <SafeHeroOverlay
 *   particleCount={50}
 *   safetyConfig={{
 *     enableWebGLRecovery: true,
 *     minBrowserVersions: {
 *       chrome: 80,
 *       firefox: 75
 *     }
 *   }}
 *   preferredFallback={FallbackMode.GRADIENT}
 * />
 * ```
 */
export default function SafeHeroOverlay({
  safetyConfig,
  preferredFallback = FallbackMode.GRADIENT,
  disableOnError = false,
  loadingComponent,
  verbose = false,
  ...overlayProps
}: SafeHeroOverlayProps) {
  const [isCompatible, setIsCompatible] = useState(true);
  const [webGLStatus, setWebGLStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [contextLost, setContextLost] = useState(false);
  
  // Check browser compatibility on mount
  useEffect(() => {
    // Check browser version
    const versionOk = checkBrowserVersion(safetyConfig?.minBrowserVersions);
    if (!versionOk) {
      setIsCompatible(false);
      if (verbose) {
        console.warn('Browser version does not meet minimum requirements');
      }
      return;
    }
    
    // Check WebGL health
    const webglHealth = checkWebGLHealth();
    setWebGLStatus(webglHealth.available ? 'available' : 'unavailable');
    
    if (verbose && !webglHealth.available) {
      console.warn('WebGL unavailable:', webglHealth.error);
    }
  }, [safetyConfig?.minBrowserVersions, verbose]);
  
  // Handle WebGL context monitoring
  useEffect(() => {
    if (!safetyConfig?.enableWebGLRecovery || webGLStatus !== 'available') {
      return;
    }
    
    // Setup monitoring after a short delay to ensure canvas is ready
    const timeoutId = setTimeout(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      
      const cleanup = setupWebGLContextMonitoring(
        canvas,
        () => {
          setContextLost(true);
          if (verbose) console.warn('WebGL context lost');
        },
        () => {
          setContextLost(false);
          if (verbose) console.log('WebGL context restored');
        }
      );
      
      return cleanup;
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [safetyConfig?.enableWebGLRecovery, webGLStatus, verbose]);
  
  // Handle error reporting
  const handleError = (errorDetails: ErrorDetails) => {
    if (verbose) {
      console.error('HeroOverlay error:', errorDetails);
    }
    
    // Report to monitoring service
    reportError(errorDetails, safetyConfig);
    
    // Track in analytics if enabled
    if (safetyConfig?.enableAnalytics && typeof window !== 'undefined') {
      // Example: Google Analytics event
      if ((window as any).gtag) {
        (window as any).gtag('event', 'hero_overlay_error', {
          error_type: errorDetails.type,
          fallback_mode: errorDetails.fallbackMode,
          retry_count: errorDetails.retryCount
        });
      }
    }
  };
  
  // Determine if we should render the overlay
  const shouldRender = isCompatible && webGLStatus !== 'unavailable' && !contextLost;
  
  // Render nothing if disabled on error
  if (!shouldRender && disableOnError) {
    return null;
  }
  
  return (
    <HeroOverlayErrorBoundary
      fallbackMode={preferredFallback}
      maxRetries={3}
      onError={handleError}
      enableRecovery={!disableOnError}
      showErrorDetails={verbose && process.env.NODE_ENV === 'development'}
      retryDelay={2000}
    >
      <Suspense fallback={loadingComponent || <DefaultLoadingComponent />}>
        {shouldRender ? (
          <HeroOverlay {...overlayProps} />
        ) : (
          <FallbackByStatus 
            _webGLStatus={webGLStatus}
            contextLost={contextLost}
            fallbackMode={preferredFallback}
          />
        )}
      </Suspense>
    </HeroOverlayErrorBoundary>
  );
}

/**
 * Render appropriate fallback based on status
 */
function FallbackByStatus({ 
  _webGLStatus, 
  contextLost, 
  fallbackMode 
}: { 
  _webGLStatus: string; 
  contextLost: boolean; 
  fallbackMode: FallbackMode;
}) {
  if (contextLost) {
    return (
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="text-purple-500/10 text-xs">
          Graphics context temporarily unavailable
        </div>
      </div>
    );
  }
  
  // Use the error boundary's fallback rendering
  const FallbackComponent = getFallbackComponent(fallbackMode);
  return <FallbackComponent />;
}

/**
 * Get fallback component by mode
 */
function getFallbackComponent(mode: FallbackMode): React.FC {
  switch (mode) {
    case FallbackMode.GRADIENT:
      return () => (
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
        </div>
      );
    case FallbackMode.STATIC:
      return () => (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
            opacity: 0.1
          }}
          aria-hidden="true"
        />
      );
    case FallbackMode.MINIMAL:
      return () => (
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              opacity: 0.05
            }}
          />
        </div>
      );
    case FallbackMode.DISABLED:
    default:
      return () => null;
  }
}

// Re-export types for convenience
export { FallbackMode, ErrorType } from './HeroOverlayErrorBoundary';
export type { ErrorDetails } from './HeroOverlayErrorBoundary';