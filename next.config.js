/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // Optimize images
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Strict mode for better React development
  reactStrictMode: true,
  
  // SWC minification for better performance
  swcMinify: true,
  
  // Trailing slashes for GitHub Pages
  trailingSlash: true,
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  
  // Custom webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Bundle analyzer configuration
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer ? '../analyze/server.html' : '../analyze/client.html',
          openAnalyzer: false,
          generateStatsFile: true,
          statsFilename: isServer ? '../analyze/server-stats.json' : '../analyze/client-stats.json',
        })
      );
    }

    // Optimize bundle size with enhanced chunk splitting
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        // HeroOverlay specific chunk
        heroOverlay: {
          name: 'herooverlay',
          test: /[\\/]components[\\/]HeroOverlay/,
          chunks: 'all',
          priority: 40,
          enforce: true,
          reuseExistingChunk: false
        },
        // Particle and Canvas utilities
        canvas: {
          name: 'canvas-utils',
          test: /[\\/](particle|canvas|webgl)/i,
          chunks: 'all',
          priority: 35,
          enforce: true
        },
        // Animation libraries
        animations: {
          name: 'animations',
          test: /[\\/]node_modules[\\/](framer-motion|@motionone|popmotion)/,
          chunks: 'all',
          priority: 30,
          enforce: true
        },
        // Vendor libraries
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
          priority: 20
        },
        // Common shared modules
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    };

    // Add webpack stats for bundle analysis
    if (!dev && !isServer) {
      config.stats = {
        ...config.stats,
        assets: true,
        chunks: true,
        modules: true,
        entrypoints: true,
        children: true,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig