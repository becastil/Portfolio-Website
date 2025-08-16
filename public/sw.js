/**
 * Service Worker for Ben Castillo Portfolio
 * Implements advanced caching strategies with Workbox
 * Version: 1.0.0
 */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Configure Workbox
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'https://storage.googleapis.com/workbox-cdn/releases/7.0.0/'
});

// Enable navigation preload
workbox.navigationPreload.enable();

// Core configuration
const CACHE_VERSION = 'v1.0.0';
const CACHE_PREFIX = 'bc-portfolio';

// Cache names
const CACHE_NAMES = {
  static: `${CACHE_PREFIX}-static-${CACHE_VERSION}`,
  dynamic: `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`,
  images: `${CACHE_PREFIX}-images-${CACHE_VERSION}`,
  fonts: `${CACHE_PREFIX}-fonts-${CACHE_VERSION}`
};

// Skip waiting and claim clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith(CACHE_PREFIX))
          .filter(cacheName => !Object.values(CACHE_NAMES).includes(cacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Precache critical assets
workbox.precaching.precacheAndRoute([
  { url: '/', revision: CACHE_VERSION },
  { url: '/index.html', revision: CACHE_VERSION },
  { url: '/assets/css/styles.css', revision: CACHE_VERSION },
  { url: '/assets/js/script.js', revision: CACHE_VERSION },
  { url: '/manifest.json', revision: CACHE_VERSION },
  { url: '/offline.html', revision: CACHE_VERSION }
]);

// Google Fonts caching
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAMES.fonts,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30
      })
    ]
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAMES.fonts,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30
      })
    ]
  })
);

// Image caching strategy
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: CACHE_NAMES.images,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true
      })
    ]
  })
);

// CSS and JavaScript caching
workbox.routing.registerRoute(
  /\.(?:css|js)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAMES.static,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      })
    ]
  })
);

// API caching strategy
workbox.routing.registerRoute(
  /^https:\/\/api\./,
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE_NAMES.dynamic,
    networkTimeoutSeconds: 5,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
);

// HTML pages - Network First strategy
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE_NAMES.static,
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Offline fallback
const offlineFallback = new workbox.strategies.CacheOnly();
workbox.routing.setCatchHandler(async ({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return await offlineFallback.handle({ event, request: '/offline.html' });
    case 'image':
      return await offlineFallback.handle({ event, request: '/assets/images/offline-placeholder.svg' });
    default:
      return Response.error();
  }
});

// Background sync for form submissions
workbox.backgroundSync.Queue('formQueue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
});

// Runtime caching for external resources
workbox.routing.registerRoute(
  /^https:\/\/cdn\./,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAMES.dynamic,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60 // 1 day
      })
    ]
  })
);

// Enable Google Analytics offline
workbox.googleAnalytics.initialize();

// Clean up old caches periodically
const cleanupOldCaches = async () => {
  const cacheWhitelist = Object.values(CACHE_NAMES);
  const cacheNames = await caches.keys();
  
  return Promise.all(
    cacheNames
      .filter(cacheName => !cacheWhitelist.includes(cacheName))
      .map(cacheName => caches.delete(cacheName))
  );
};

// Listen for periodicsync event for background updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    event.waitUntil(cleanupOldCaches());
  }
});

console.log('Service Worker loaded with Workbox', workbox.core.cacheNames);