/**
 * @fileoverview Error Boundary Demo Component
 * 
 * Demonstration and testing component for HeroOverlay error boundaries.
 * Shows different error scenarios and fallback modes.
 * 
 * @module components/errors/ErrorBoundaryDemo
 * @since 1.0.0
 */

'use client';

import React, { useState } from 'react';
import SafeHeroOverlay, { FallbackMode } from './SafeHeroOverlay';
import { PerformanceMode, AnimationIntensity } from '../HeroOverlay';

/**
 * Error simulation types
 */
enum ErrorSimulation {
  NONE = 'NONE',
  WEBGL_CONTEXT_LOSS = 'WEBGL_CONTEXT_LOSS',
  RENDER_ERROR = 'RENDER_ERROR',
  MEMORY_LEAK = 'MEMORY_LEAK',
  BROWSER_INCOMPATIBLE = 'BROWSER_INCOMPATIBLE'
}

/**
 * Demo component for testing error boundaries
 */
export default function ErrorBoundaryDemo() {
  const [errorType, setErrorType] = useState<ErrorSimulation>(ErrorSimulation.NONE);
  const [fallbackMode, setFallbackMode] = useState<FallbackMode>(FallbackMode.GRADIENT);
  const [showOverlay, setShowOverlay] = useState(true);
  const [verbose, setVerbose] = useState(true);
  const [disableOnError, setDisableOnError] = useState(false);

  // Force re-render to test error recovery
  const resetOverlay = () => {
    setShowOverlay(false);
    setTimeout(() => setShowOverlay(true), 100);
  };

  // Simulate WebGL context loss
  const simulateContextLoss = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (gl) {
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
          // Restore after 3 seconds
          setTimeout(() => {
            loseContext.restoreContext();
          }, 3000);
        }
      }
    }
  };

  // Create props that will cause errors based on simulation type
  const getOverlayProps = () => {
    switch (errorType) {
      case ErrorSimulation.RENDER_ERROR:
        // Force an error by passing invalid props
        return {
          particleCount: -1, // This will cause issues
          performanceMode: 'INVALID' as any
        };
      
      case ErrorSimulation.MEMORY_LEAK:
        // Excessive particle count
        return {
          particleCount: 10000,
          performanceMode: PerformanceMode.HIGH
        };
      
      case ErrorSimulation.BROWSER_INCOMPATIBLE:
        // This won't actually cause an error but demonstrates config
        return {
          particleCount: 50,
          safetyConfig: {
            minBrowserVersions: {
              chrome: 200, // Impossible version
              firefox: 200
            }
          }
        };
      
      default:
        return {
          particleCount: 50,
          performanceMode: PerformanceMode.BALANCED,
          intensity: AnimationIntensity.NORMAL
        };
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Overlay with error boundary */}
      {showOverlay && (
        <SafeHeroOverlay
          {...getOverlayProps()}
          preferredFallback={fallbackMode}
          disableOnError={disableOnError}
          verbose={verbose}
          safetyConfig={{
            enableWebGLRecovery: true,
            enablePerformanceMonitoring: true,
            enableAnalytics: false
          }}
        />
      )}

      {/* Control Panel */}
      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-6">HeroOverlay Error Boundary Demo</h1>
          
          {/* Error Simulation Controls */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Error Simulation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(ErrorSimulation).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setErrorType(type);
                    if (type === ErrorSimulation.WEBGL_CONTEXT_LOSS) {
                      simulateContextLoss();
                    } else {
                      resetOverlay();
                    }
                  }}
                  className={`px-4 py-2 rounded transition-colors ${
                    errorType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {type.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Fallback Mode Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Fallback Mode</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(FallbackMode).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    setFallbackMode(mode);
                    resetOverlay();
                  }}
                  className={`px-4 py-2 rounded transition-colors ${
                    fallbackMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Options</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={verbose}
                  onChange={(e) => setVerbose(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Verbose Logging</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={disableOnError}
                  onChange={(e) => setDisableOnError(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Disable Completely on Error</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetOverlay}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Reset Overlay
            </button>
            
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              {showOverlay ? 'Hide' : 'Show'} Overlay
            </button>
          </div>

          {/* Information Panel */}
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h3 className="font-semibold mb-2">Current Configuration:</h3>
            <ul className="text-sm space-y-1">
              <li>Error Type: <span className="font-mono">{errorType}</span></li>
              <li>Fallback Mode: <span className="font-mono">{fallbackMode}</span></li>
              <li>Verbose: <span className="font-mono">{verbose ? 'Yes' : 'No'}</span></li>
              <li>Disable on Error: <span className="font-mono">{disableOnError ? 'Yes' : 'No'}</span></li>
            </ul>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <h3 className="font-semibold mb-2">Testing Instructions:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Select an error type to simulate different failure scenarios</li>
              <li>Choose a fallback mode to see different graceful degradation options</li>
              <li>Enable verbose logging to see detailed error information in console</li>
              <li>WebGL Context Loss will auto-recover after 3 seconds</li>
              <li>Check browser console for detailed error logs when verbose is enabled</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}