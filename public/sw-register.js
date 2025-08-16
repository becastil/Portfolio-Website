/**
 * Service Worker Registration with Update Management
 */

(function() {
  'use strict';

  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }

  // Configuration
  const SW_URL = '/sw.js';
  const UPDATE_INTERVAL = 60 * 60 * 1000; // Check for updates every hour

  // Register service worker on load
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(SW_URL, {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('Service Worker registered:', registration);

      // Check for updates immediately
      registration.update();

      // Set up periodic update checks
      setInterval(() => {
        registration.update();
      }, UPDATE_INTERVAL);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            showUpdateNotification(newWorker);
          }
        });
      });

      // Handle controller change
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'CACHE_UPDATED') {
          console.log('Cache updated:', event.data.payload);
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });

  // Show update notification
  function showUpdateNotification(worker) {
    const updateBanner = document.createElement('div');
    updateBanner.className = 'sw-update-banner';
    updateBanner.innerHTML = `
      <div class="sw-update-content">
        <span class="sw-update-message">A new version is available!</span>
        <button class="sw-update-button" id="sw-update-btn">Update</button>
        <button class="sw-dismiss-button" id="sw-dismiss-btn">Later</button>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .sw-update-banner {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1a1a1a;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
      }
      
      .sw-update-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      
      .sw-update-message {
        font-size: 14px;
      }
      
      .sw-update-button, .sw-dismiss-button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      
      .sw-update-button {
        background: #4CAF50;
        color: white;
      }
      
      .sw-dismiss-button {
        background: transparent;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      
      .sw-update-button:hover, .sw-dismiss-button:hover {
        opacity: 0.8;
      }
      
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 640px) {
        .sw-update-banner {
          left: 10px;
          right: 10px;
          transform: none;
        }
        
        .sw-update-content {
          flex-direction: column;
          text-align: center;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(updateBanner);
    
    // Handle update button click
    document.getElementById('sw-update-btn').addEventListener('click', () => {
      worker.postMessage({ type: 'SKIP_WAITING' });
      updateBanner.remove();
    });
    
    // Handle dismiss button click
    document.getElementById('sw-dismiss-btn').addEventListener('click', () => {
      updateBanner.remove();
    });
    
    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (updateBanner.parentNode) {
        updateBanner.remove();
      }
    }, 30000);
  }

  // Check online status
  window.addEventListener('online', () => {
    console.log('Back online - checking for updates');
    navigator.serviceWorker.ready.then(registration => {
      registration.update();
    });
  });

  window.addEventListener('offline', () => {
    console.log('Gone offline - using cached resources');
  });

  // Prefetch critical resources
  if ('connectionSpeed' in navigator.connection) {
    const connection = navigator.connection;
    
    if (connection.effectiveType === '4g' && !connection.saveData) {
      // Prefetch additional resources on fast connections
      prefetchResources();
    }
  }

  function prefetchResources() {
    const resources = [
      '/assets/images/hero-bg.jpg',
      '/assets/fonts/inter-var.woff2'
    ];
    
    resources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = url.endsWith('.woff2') ? 'font' : 'image';
      document.head.appendChild(link);
    });
  }

})();