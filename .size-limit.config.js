/**
 * Size Limit Configuration with HeroOverlay Monitoring
 * This configuration tracks bundle sizes with special focus on the HeroOverlay component
 */

module.exports = [
  // HeroOverlay specific bundles
  {
    name: 'HeroOverlay Component Core',
    path: '.next/static/chunks/*herooverlay*.js',
    limit: '35 KB',
    gzip: true,
    brotli: true,
    running: false,
    webpack: false
  },
  {
    name: 'HeroOverlay + Dependencies',
    path: [
      '.next/static/chunks/*herooverlay*.js',
      '.next/static/chunks/*framer-motion*.js',
      '.next/static/chunks/*canvas*.js',
      '.next/static/chunks/*particle*.js'
    ],
    limit: '75 KB',
    gzip: true,
    brotli: true
  },
  {
    name: 'Animation Libraries',
    path: [
      '.next/static/chunks/*framer-motion*.js',
      '.next/static/chunks/*gsap*.js',
      '.next/static/chunks/*motion*.js'
    ],
    limit: '50 KB',
    gzip: true,
    brotli: true
  },
  {
    name: 'Canvas Utilities',
    path: [
      '.next/static/chunks/*canvas*.js',
      '.next/static/chunks/*webgl*.js',
      '.next/static/chunks/*particle*.js'
    ],
    limit: '30 KB',
    gzip: true,
    brotli: true
  },
  
  // Core application bundles
  {
    name: 'Main Bundle',
    path: '.next/static/chunks/main-*.js',
    limit: '90 KB',
    gzip: true
  },
  {
    name: 'Framework Bundle',
    path: '.next/static/chunks/framework-*.js',
    limit: '45 KB',
    gzip: true
  },
  {
    name: 'Pages Bundle',
    path: '.next/static/chunks/pages/*.js',
    limit: '30 KB',
    gzip: true
  },
  
  // CSS bundles
  {
    name: 'CSS Bundle',
    path: '.next/static/css/*.css',
    limit: '25 KB',
    gzip: true
  },
  {
    name: 'HeroOverlay Styles',
    path: '.next/static/css/*hero*.css',
    limit: '10 KB',
    gzip: true
  },
  
  // First load metrics
  {
    name: 'First Load JS (Homepage)',
    path: [
      '.next/static/chunks/main-*.js',
      '.next/static/chunks/framework-*.js',
      '.next/static/chunks/pages/index-*.js',
      '.next/static/chunks/*herooverlay*.js'
    ],
    limit: '185 KB',
    gzip: true,
    brotli: true
  },
  {
    name: 'First Load JS (Without HeroOverlay)',
    path: [
      '.next/static/chunks/main-*.js',
      '.next/static/chunks/framework-*.js',
      '.next/static/chunks/pages/index-*.js'
    ],
    limit: '150 KB',
    gzip: true
  },
  
  // Total application size
  {
    name: 'Total App Size',
    path: [
      '.next/static/chunks/**/*.js',
      '.next/static/css/**/*.css'
    ],
    limit: '300 KB',
    gzip: true
  },
  {
    name: 'Total JS Only',
    path: '.next/static/chunks/**/*.js',
    limit: '275 KB',
    gzip: true
  },
  
  // Critical performance paths
  {
    name: 'Critical Path (Above Fold)',
    path: [
      '.next/static/chunks/main-*.js',
      '.next/static/chunks/framework-*.js',
      '.next/static/css/*.css'
    ],
    limit: '120 KB',
    gzip: true,
    brotli: true
  },
  
  // Service Worker
  {
    name: 'Service Worker',
    path: 'public/sw.js',
    limit: '50 KB',
    gzip: true
  }
];