export const blogConfig = {
  // Animation settings
  animations: {
    // Stagger delays for list items
    staggerDelay: 0.1,
    
    // Default animation duration
    defaultDuration: 0.6,
    
    // Page transition timing
    pageTransition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
    
    // Text reveal settings
    textReveal: {
      staggerChildren: 0.03,
      characterDelay: 0.02,
    },
    
    // Parallax settings
    parallax: {
      heroOffset: 50,
      heroSpeed: 0.3,
    },
    
    // Performance thresholds
    performance: {
      lowFpsThreshold: 30,
      reducedMotionDuration: 0.2,
    },
  },
  
  // Layout settings
  layout: {
    maxWidth: '7xl',
    containerPadding: 'px-4',
    gridCols: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
  },
  
  // Search and filtering
  search: {
    debounceDelay: 300,
    placeholder: 'Search articles...',
    noResultsMessage: 'No articles found',
  },
  
  // Social sharing
  sharing: {
    platforms: ['twitter', 'linkedin', 'facebook', 'email'] as const,
    messages: {
      copied: 'Link copied!',
      sharePrompt: 'Choose your platform',
    },
  },
  
  // Reading experience
  reading: {
    progressIndicator: true,
    tableOfContents: true,
    estimatedReadingSpeed: 200, // words per minute
    backToTopThreshold: 1000, // pixels
  },
  
  // Performance optimization
  optimization: {
    lazyLoadImages: true,
    lazyLoadAnimations: true,
    gpuAcceleration: true,
    respectReducedMotion: true,
    performanceMonitoring: true,
  },
} as const

export type BlogConfig = typeof blogConfig