/**
 * Performance Monitoring and Analytics
 * Tracks Web Vitals, custom metrics, and user interactions
 */

(function() {
  'use strict';

  // Performance monitoring configuration
  const config = {
    analyticsEndpoint: '/api/analytics',
    sampleRate: 1.0, // 100% sampling in development
    debug: window.location.hostname === 'localhost',
    thresholds: {
      FCP: { good: 1800, needs_improvement: 3000 },
      LCP: { good: 2500, needs_improvement: 4000 },
      FID: { good: 100, needs_improvement: 300 },
      CLS: { good: 0.1, needs_improvement: 0.25 },
      TTFB: { good: 800, needs_improvement: 1800 },
      INP: { good: 200, needs_improvement: 500 }
    }
  };

  // Performance observer for various metrics
  class PerformanceMonitor {
    constructor() {
      this.metrics = {};
      this.observers = [];
      this.navigationTimings = {};
      this.resourceTimings = [];
      this.userTimings = [];
      
      this.init();
    }

    init() {
      // Wait for page load
      if (document.readyState === 'complete') {
        this.startMonitoring();
      } else {
        window.addEventListener('load', () => this.startMonitoring());
      }

      // Track page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flushMetrics();
        }
      });

      // Track before unload
      window.addEventListener('beforeunload', () => {
        this.flushMetrics();
      });
    }

    startMonitoring() {
      this.measureNavigationTimings();
      this.observePaintTimings();
      this.observeLayoutShifts();
      this.observeLargestContentfulPaint();
      this.observeFirstInput();
      this.observeInteractionToNextPaint();
      this.observeResourceTimings();
      this.observeLongTasks();
      this.measureMemoryUsage();
      this.measureNetworkInformation();
      this.trackCustomMetrics();
    }

    measureNavigationTimings() {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      if (navigation) {
        this.navigationTimings = {
          // DNS lookup
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          // TCP connection
          tcp: navigation.connectEnd - navigation.connectStart,
          // SSL negotiation
          ssl: navigation.secureConnectionStart > 0 
            ? navigation.connectEnd - navigation.secureConnectionStart 
            : 0,
          // Time to first byte
          ttfb: navigation.responseStart - navigation.requestStart,
          // Download time
          download: navigation.responseEnd - navigation.responseStart,
          // DOM processing
          domProcessing: navigation.domComplete - navigation.domInteractive,
          // DOM content loaded
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          // Full page load
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          // Total time
          total: navigation.loadEventEnd - navigation.fetchStart
        };

        this.reportMetric('navigation_timings', this.navigationTimings);
      }
    }

    observePaintTimings() {
      if ('PerformanceObserver' in window) {
        try {
          const paintObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name === 'first-paint') {
                this.metrics.FP = entry.startTime;
                this.reportMetric('FP', entry.startTime);
              }
              if (entry.name === 'first-contentful-paint') {
                this.metrics.FCP = entry.startTime;
                this.reportMetric('FCP', entry.startTime);
              }
            }
          });
          
          paintObserver.observe({ entryTypes: ['paint'] });
          this.observers.push(paintObserver);
        } catch (e) {
          console.error('Paint observer error:', e);
        }
      }
    }

    observeLayoutShifts() {
      if ('PerformanceObserver' in window) {
        try {
          let clsValue = 0;
          let clsEntries = [];
          let sessionValue = 0;
          let sessionEntries = [];
          let previousValue = 0;

          const layoutShiftObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                const firstSessionEntry = sessionEntries[0];
                const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                if (sessionValue &&
                    entry.startTime - lastSessionEntry.startTime < 1000 &&
                    entry.startTime - firstSessionEntry.startTime < 5000) {
                  sessionValue += entry.value;
                  sessionEntries.push(entry);
                } else {
                  sessionValue = entry.value;
                  sessionEntries = [entry];
                }

                if (sessionValue > clsValue) {
                  clsValue = sessionValue;
                  clsEntries = sessionEntries;
                  
                  // Only report if the value has changed significantly
                  if (clsValue > previousValue + 0.01) {
                    previousValue = clsValue;
                    this.metrics.CLS = clsValue;
                    this.reportMetric('CLS', clsValue);
                  }
                }
              }
            }
          });

          layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
          this.observers.push(layoutShiftObserver);
        } catch (e) {
          console.error('Layout shift observer error:', e);
        }
      }
    }

    observeLargestContentfulPaint() {
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
            this.reportMetric('LCP', this.metrics.LCP);
          });

          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          this.observers.push(lcpObserver);
        } catch (e) {
          console.error('LCP observer error:', e);
        }
      }
    }

    observeFirstInput() {
      if ('PerformanceObserver' in window) {
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entry = list.getEntries()[0];
            
            this.metrics.FID = entry.processingStart - entry.startTime;
            this.reportMetric('FID', this.metrics.FID);
            
            // Disconnect after first input
            fidObserver.disconnect();
          });

          fidObserver.observe({ entryTypes: ['first-input'] });
          this.observers.push(fidObserver);
        } catch (e) {
          console.error('FID observer error:', e);
        }
      }
    }

    observeInteractionToNextPaint() {
      if ('PerformanceObserver' in window && 'interactionCount' in performance) {
        try {
          let maxINP = 0;
          const inpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.interactionId) {
                const inp = entry.duration;
                if (inp > maxINP) {
                  maxINP = inp;
                  this.metrics.INP = inp;
                  this.reportMetric('INP', inp);
                }
              }
            }
          });

          inpObserver.observe({ entryTypes: ['event'] });
          this.observers.push(inpObserver);
        } catch (e) {
          console.error('INP observer error:', e);
        }
      }
    }

    observeResourceTimings() {
      if ('PerformanceObserver' in window) {
        try {
          const resourceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const resourceData = {
                name: entry.name,
                type: entry.initiatorType,
                duration: entry.duration,
                size: entry.transferSize || 0,
                protocol: entry.nextHopProtocol,
                cached: entry.transferSize === 0 && entry.decodedBodySize > 0
              };
              
              this.resourceTimings.push(resourceData);
              
              // Track slow resources
              if (entry.duration > 1000) {
                this.reportMetric('slow_resource', resourceData);
              }
            }
          });

          resourceObserver.observe({ entryTypes: ['resource'] });
          this.observers.push(resourceObserver);
        } catch (e) {
          console.error('Resource observer error:', e);
        }
      }
    }

    observeLongTasks() {
      if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              this.reportMetric('long_task', {
                duration: entry.duration,
                startTime: entry.startTime,
                attribution: entry.attribution
              });
            }
          });

          longTaskObserver.observe({ entryTypes: ['longtask'] });
          this.observers.push(longTaskObserver);
        } catch (e) {
          console.error('Long task observer error:', e);
        }
      }
    }

    measureMemoryUsage() {
      if (performance.memory) {
        const memoryData = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          usage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
        };
        
        this.metrics.memory = memoryData;
        
        // Report if memory usage is high
        if (memoryData.usage > 90) {
          this.reportMetric('high_memory_usage', memoryData);
        }
      }
    }

    measureNetworkInformation() {
      if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        const networkData = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData || false
        };
        
        this.metrics.network = networkData;
        this.reportMetric('network_info', networkData);
      }
    }

    trackCustomMetrics() {
      // Time to Interactive (custom implementation)
      const tti = this.calculateTimeToInteractive();
      if (tti) {
        this.metrics.TTI = tti;
        this.reportMetric('TTI', tti);
      }

      // Track bundle sizes
      this.trackBundleSizes();

      // Track third-party scripts
      this.trackThirdPartyScripts();
    }

    calculateTimeToInteractive() {
      // Simplified TTI calculation
      const fcp = this.metrics.FCP;
      const domContentLoaded = this.navigationTimings.domContentLoaded;
      
      if (fcp && domContentLoaded) {
        return Math.max(fcp, domContentLoaded);
      }
      
      return null;
    }

    trackBundleSizes() {
      const resources = performance.getEntriesByType('resource');
      const bundles = {
        js: { count: 0, size: 0 },
        css: { count: 0, size: 0 },
        images: { count: 0, size: 0 },
        fonts: { count: 0, size: 0 },
        total: { count: 0, size: 0 }
      };

      resources.forEach(resource => {
        const size = resource.transferSize || 0;
        bundles.total.count++;
        bundles.total.size += size;

        if (resource.name.match(/\.js$/)) {
          bundles.js.count++;
          bundles.js.size += size;
        } else if (resource.name.match(/\.css$/)) {
          bundles.css.count++;
          bundles.css.size += size;
        } else if (resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)$/)) {
          bundles.images.count++;
          bundles.images.size += size;
        } else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/)) {
          bundles.fonts.count++;
          bundles.fonts.size += size;
        }
      });

      this.metrics.bundles = bundles;
      this.reportMetric('bundle_sizes', bundles);
    }

    trackThirdPartyScripts() {
      const resources = performance.getEntriesByType('resource');
      const thirdParty = resources.filter(resource => {
        const url = new URL(resource.name);
        return url.hostname !== window.location.hostname;
      });

      const thirdPartyData = {
        count: thirdParty.length,
        totalSize: thirdParty.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        totalDuration: thirdParty.reduce((sum, r) => sum + r.duration, 0),
        domains: [...new Set(thirdParty.map(r => new URL(r.name).hostname))]
      };

      this.metrics.thirdParty = thirdPartyData;
      this.reportMetric('third_party', thirdPartyData);
    }

    getRating(metric, value) {
      const threshold = config.thresholds[metric];
      if (!threshold) return 'unknown';
      
      if (value <= threshold.good) return 'good';
      if (value <= threshold.needs_improvement) return 'needs-improvement';
      return 'poor';
    }

    reportMetric(name, value) {
      const data = {
        name,
        value,
        rating: this.getRating(name, value),
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

      if (config.debug) {
        console.log(`[Performance] ${name}:`, value, `(${data.rating})`);
      }

      // Buffer metrics for batch sending
      if (!this.metricsBuffer) {
        this.metricsBuffer = [];
      }
      this.metricsBuffer.push(data);

      // Send metrics in batches
      if (this.metricsBuffer.length >= 10) {
        this.flushMetrics();
      }
    }

    flushMetrics() {
      if (!this.metricsBuffer || this.metricsBuffer.length === 0) return;

      const metrics = [...this.metricsBuffer];
      this.metricsBuffer = [];

      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(metrics)], { type: 'application/json' });
        navigator.sendBeacon(config.analyticsEndpoint, blob);
      } else {
        // Fallback to fetch
        fetch(config.analyticsEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metrics),
          keepalive: true
        }).catch(error => {
          if (config.debug) {
            console.error('Failed to send metrics:', error);
          }
        });
      }
    }

    destroy() {
      // Clean up observers
      this.observers.forEach(observer => observer.disconnect());
      this.observers = [];
      
      // Send remaining metrics
      this.flushMetrics();
    }
  }

  // Initialize performance monitoring
  window.__performanceMonitor = new PerformanceMonitor();

  // Expose API for manual tracking
  window.trackPerformance = function(name, value) {
    if (window.__performanceMonitor) {
      window.__performanceMonitor.reportMetric(name, value);
    }
  };

})();