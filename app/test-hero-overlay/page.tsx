/**
 * Test page for HeroOverlay visual regression testing
 * This page allows configuration of HeroOverlay through URL parameters
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import HeroOverlay to avoid SSR issues
const HeroOverlay = dynamic(() => import('@/components/HeroOverlay'), {
  ssr: false,
  loading: () => <div data-testid="hero-overlay-loading">Loading HeroOverlay...</div>
});

function HeroOverlayTestContent() {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Listen for custom error events
    const handleError = (event: CustomEvent) => {
      console.error('HeroOverlay error:', event.detail);
      setHasError(true);
    };

    window.addEventListener('heroOverlayError', handleError as EventListener);
    return () => {
      window.removeEventListener('heroOverlayError', handleError as EventListener);
    };
  }, []);

  // Parse configuration from URL parameters
  const performanceMode = searchParams.get('performanceMode') as any || undefined;
  const intensity = searchParams.get('intensity') as any || undefined;
  const debug = searchParams.get('debug') === 'true';
  const debugPosition = searchParams.get('debugPosition') as any || undefined;

  if (!isClient) {
    return <div data-testid="hero-overlay-ssr-placeholder">Initializing...</div>;
  }

  if (hasError) {
    return (
      <div data-testid="hero-overlay-error" className="flex items-center justify-center h-screen bg-red-50 dark:bg-red-900/10">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            HeroOverlay Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            An error occurred while rendering the HeroOverlay component.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <HeroOverlay
        performanceMode={performanceMode}
        intensity={intensity}
        debug={debug}
        debugPosition={debugPosition}
        className="absolute inset-0"
      />
      
      {/* Content overlay for testing interaction */}
      <div className="relative z-10 flex items-center justify-center h-full pointer-events-none">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white/20 mb-4">
            HeroOverlay Test Page
          </h1>
          <p className="text-white/10">
            Visual Regression Testing
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HeroOverlayTestPage() {
  return (
    <Suspense fallback={<div data-testid="hero-overlay-suspense">Loading test page...</div>}>
      <HeroOverlayTestContent />
    </Suspense>
  );
}