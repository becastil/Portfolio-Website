/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
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
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  
  // Custom webpack configuration
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
          priority: 20
        },
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
    
    return config;
  },
}

module.exports = nextConfig