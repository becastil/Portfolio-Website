/**
 * @fileoverview Error Boundary Components Export
 * 
 * Central export point for all HeroOverlay error handling components.
 * 
 * @module components/errors
 * @since 1.0.0
 */

// Main error boundary component
export { 
  HeroOverlayErrorBoundary as default,
  HeroOverlayErrorBoundary 
} from './HeroOverlayErrorBoundary';

// Safe wrapper component with built-in error handling
export { default as SafeHeroOverlay } from './SafeHeroOverlay';

// Demo component for testing
export { default as ErrorBoundaryDemo } from './ErrorBoundaryDemo';

// Export types
export type { 
  ErrorDetails,
  SafeHeroOverlayProps,
  SafeHeroOverlayConfig 
} from './SafeHeroOverlay';

export { 
  FallbackMode, 
  ErrorType 
} from './HeroOverlayErrorBoundary';