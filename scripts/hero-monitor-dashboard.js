#!/usr/bin/env node

/**
 * HeroOverlay Monitoring Dashboard
 * Provides comprehensive monitoring and reporting of HeroOverlay component metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class HeroMonitorDashboard {
  constructor() {
    this.metricsPath = path.join(process.cwd(), '.hero-metrics');
    this.currentMetrics = {};
    this.historicalData = [];
    this.performanceBudget = null;
  }

  loadPerformanceBudget() {
    const budgetPath = path.join(process.cwd(), 'performance-budget.json');
    if (fs.existsSync(budgetPath)) {
      this.performanceBudget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
    }
  }

  collectBundleMetrics() {
    console.log('📦 Collecting bundle metrics...');
    
    try {
      // Run bundle analysis
      execSync('npm run perf:hero', { stdio: 'pipe' });
      
      // Load the analysis results
      const analysisPath = path.join(process.cwd(), 'hero-bundle-analysis.json');
      if (fs.existsSync(analysisPath)) {
        const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
        this.currentMetrics.bundle = {
          heroOverlay: analysis.results.heroOverlay,
          animations: analysis.results.animations,
          canvas: analysis.results.canvas,
          total: analysis.results.total,
          violations: analysis.violations
        };
      }
    } catch (error) {
      console.error('Failed to collect bundle metrics:', error.message);
    }
  }

  collectPerformanceMetrics() {
    console.log('🚀 Collecting performance metrics...');
    
    try {
      // Start a local server and run Lighthouse
      const lighthouseCmd = `
        npx http-server out -p 3000 &
        SERVER_PID=$!
        sleep 3
        npx lighthouse http://localhost:3000 --output=json --output-path=lighthouse-report.json --quiet --chrome-flags="--headless"
        kill $SERVER_PID
      `;
      
      execSync(lighthouseCmd, { shell: '/bin/bash', stdio: 'pipe' });
      
      // Parse Lighthouse results
      const reportPath = path.join(process.cwd(), 'lighthouse-report.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        this.currentMetrics.performance = {
          score: report.categories.performance.score * 100,
          fcp: report.audits['first-contentful-paint'].numericValue,
          lcp: report.audits['largest-contentful-paint'].numericValue,
          tti: report.audits['interactive'].numericValue,
          cls: report.audits['cumulative-layout-shift'].numericValue,
          tbt: report.audits['total-blocking-time'].numericValue
        };
        
        // Clean up report
        fs.unlinkSync(reportPath);
      }
    } catch (error) {
      console.error('Failed to collect performance metrics:', error.message);
    }
  }

  collectRuntimeMetrics() {
    console.log('⚡ Collecting runtime metrics...');
    
    // Create a test script to measure runtime performance
    const testScript = `
      const puppeteer = require('puppeteer');
      
      (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        // Enable performance monitoring
        await page.evaluateOnNewDocument(() => {
          window.__heroMetrics = {
            frameCount: 0,
            frameTimes: [],
            memorySnapshots: [],
            startTime: Date.now()
          };
          
          let lastTime = performance.now();
          const measureFrame = () => {
            const currentTime = performance.now();
            const delta = currentTime - lastTime;
            
            window.__heroMetrics.frameCount++;
            window.__heroMetrics.frameTimes.push(delta);
            
            if (window.__heroMetrics.frameCount % 60 === 0) {
              if (performance.memory) {
                window.__heroMetrics.memorySnapshots.push({
                  used: performance.memory.usedJSHeapSize,
                  total: performance.memory.totalJSHeapSize
                });
              }
            }
            
            lastTime = currentTime;
            
            if (window.__heroMetrics.frameCount < 300) {
              requestAnimationFrame(measureFrame);
            }
          };
          
          requestAnimationFrame(measureFrame);
        });
        
        // Start local server
        const { exec } = require('child_process');
        const server = exec('npx http-server out -p 3001');
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
        
        // Wait for measurements
        await page.waitForTimeout(5000);
        
        // Collect metrics
        const metrics = await page.evaluate(() => window.__heroMetrics);
        
        // Calculate FPS
        const avgFrameTime = metrics.frameTimes.reduce((a, b) => a + b, 0) / metrics.frameTimes.length;
        const fps = 1000 / avgFrameTime;
        
        // Calculate memory usage
        const avgMemory = metrics.memorySnapshots.length > 0
          ? metrics.memorySnapshots.reduce((a, b) => a + b.used, 0) / metrics.memorySnapshots.length
          : 0;
        
        console.log(JSON.stringify({
          fps: Math.round(fps),
          avgFrameTime: avgFrameTime.toFixed(2),
          memoryUsageMB: (avgMemory / 1024 / 1024).toFixed(2),
          frameCount: metrics.frameCount
        }));
        
        server.kill();
        await browser.close();
      })();
    `;
    
    try {
      const result = execSync(`node -e "${testScript}"`, { stdio: 'pipe' });
      const metrics = JSON.parse(result.toString());
      this.currentMetrics.runtime = metrics;
    } catch (error) {
      console.error('Failed to collect runtime metrics:', error.message);
      this.currentMetrics.runtime = {
        fps: 0,
        avgFrameTime: 0,
        memoryUsageMB: 0,
        frameCount: 0
      };
    }
  }

  saveMetrics() {
    // Create metrics directory if it doesn't exist
    if (!fs.existsSync(this.metricsPath)) {
      fs.mkdirSync(this.metricsPath);
    }
    
    // Add timestamp
    this.currentMetrics.timestamp = new Date().toISOString();
    
    // Save current metrics
    const currentPath = path.join(this.metricsPath, 'current.json');
    fs.writeFileSync(currentPath, JSON.stringify(this.currentMetrics, null, 2));
    
    // Append to historical data
    const historyPath = path.join(this.metricsPath, 'history.json');
    if (fs.existsSync(historyPath)) {
      this.historicalData = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }
    
    this.historicalData.push(this.currentMetrics);
    
    // Keep only last 30 days of data
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    this.historicalData = this.historicalData.filter(
      m => new Date(m.timestamp).getTime() > thirtyDaysAgo
    );
    
    fs.writeFileSync(historyPath, JSON.stringify(this.historicalData, null, 2));
  }

  generateDashboard() {
    console.log('\n📊 HeroOverlay Monitoring Dashboard\n');
    console.log('=' .repeat(60));
    
    // Bundle Size Metrics
    if (this.currentMetrics.bundle) {
      console.log('\n📦 Bundle Size Metrics:');
      console.log(`  HeroOverlay Core: ${(this.currentMetrics.bundle.heroOverlay.gzip / 1024).toFixed(2)} KB`);
      console.log(`  Animation Libs:   ${(this.currentMetrics.bundle.animations.gzip / 1024).toFixed(2)} KB`);
      console.log(`  Canvas Utils:     ${(this.currentMetrics.bundle.canvas.gzip / 1024).toFixed(2)} KB`);
      console.log(`  Total Impact:     ${(this.currentMetrics.bundle.total.gzip / 1024).toFixed(2)} KB`);
      
      if (this.currentMetrics.bundle.violations.length > 0) {
        console.log(`  ⚠️  Violations:     ${this.currentMetrics.bundle.violations.length}`);
      }
    }
    
    // Performance Metrics
    if (this.currentMetrics.performance) {
      console.log('\n🚀 Performance Metrics:');
      console.log(`  Performance Score: ${this.currentMetrics.performance.score.toFixed(0)}/100`);
      console.log(`  FCP:              ${this.currentMetrics.performance.fcp.toFixed(0)}ms`);
      console.log(`  LCP:              ${this.currentMetrics.performance.lcp.toFixed(0)}ms`);
      console.log(`  TTI:              ${this.currentMetrics.performance.tti.toFixed(0)}ms`);
      console.log(`  CLS:              ${this.currentMetrics.performance.cls.toFixed(3)}`);
    }
    
    // Runtime Metrics
    if (this.currentMetrics.runtime) {
      console.log('\n⚡ Runtime Metrics:');
      console.log(`  FPS:              ${this.currentMetrics.runtime.fps}`);
      console.log(`  Frame Time:       ${this.currentMetrics.runtime.avgFrameTime}ms`);
      console.log(`  Memory Usage:     ${this.currentMetrics.runtime.memoryUsageMB} MB`);
    }
    
    // Budget Status
    if (this.performanceBudget && this.performanceBudget.heroOverlaySpecific) {
      console.log('\n💰 Budget Status:');
      const budget = this.performanceBudget.heroOverlaySpecific;
      
      if (this.currentMetrics.bundle) {
        const componentSize = this.currentMetrics.bundle.heroOverlay.gzip / 1024;
        const componentStatus = componentSize <= budget.componentSize.budget ? '✅' : '❌';
        console.log(`  Component Size:   ${componentStatus} ${componentSize.toFixed(2)}/${budget.componentSize.budget} KB`);
        
        const totalSize = this.currentMetrics.bundle.total.gzip / 1024;
        const totalStatus = totalSize <= budget.withDependencies.budget ? '✅' : '❌';
        console.log(`  With Deps:        ${totalStatus} ${totalSize.toFixed(2)}/${budget.withDependencies.budget} KB`);
      }
      
      if (this.currentMetrics.runtime) {
        const fpsStatus = this.currentMetrics.runtime.fps >= 60 ? '✅' : '❌';
        console.log(`  FPS Target:       ${fpsStatus} ${this.currentMetrics.runtime.fps}/60 FPS`);
        
        const memoryStatus = parseFloat(this.currentMetrics.runtime.memoryUsageMB) <= budget.memoryUsage.budget ? '✅' : '❌';
        console.log(`  Memory Budget:    ${memoryStatus} ${this.currentMetrics.runtime.memoryUsageMB}/${budget.memoryUsage.budget} MB`);
      }
    }
    
    // Trend Analysis
    if (this.historicalData.length > 1) {
      console.log('\n📈 7-Day Trend:');
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const recentData = this.historicalData.filter(
        m => new Date(m.timestamp).getTime() > sevenDaysAgo
      );
      
      if (recentData.length > 0) {
        const firstMetric = recentData[0];
        const lastMetric = recentData[recentData.length - 1];
        
        if (firstMetric.bundle && lastMetric.bundle) {
          const sizeDiff = lastMetric.bundle.total.gzip - firstMetric.bundle.total.gzip;
          const sizePercent = ((sizeDiff / firstMetric.bundle.total.gzip) * 100).toFixed(1);
          const sizeIcon = sizeDiff > 0 ? '📈' : '📉';
          console.log(`  Bundle Size:      ${sizeIcon} ${sizePercent > 0 ? '+' : ''}${sizePercent}%`);
        }
        
        if (firstMetric.performance && lastMetric.performance) {
          const perfDiff = lastMetric.performance.score - firstMetric.performance.score;
          const perfIcon = perfDiff > 0 ? '📈' : '📉';
          console.log(`  Performance:      ${perfIcon} ${perfDiff > 0 ? '+' : ''}${perfDiff.toFixed(1)} points`);
        }
      }
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log(`Generated: ${new Date().toISOString()}`);
  }

  generateHTMLReport() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HeroOverlay Monitoring Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: white;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .card h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: #333;
    }
    .metric {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    .metric:last-child {
      border-bottom: none;
    }
    .metric-label {
      color: #666;
    }
    .metric-value {
      font-weight: bold;
      color: #333;
    }
    .status-good { color: #10b981; }
    .status-warning { color: #f59e0b; }
    .status-error { color: #ef4444; }
    .timestamp {
      text-align: center;
      color: white;
      opacity: 0.8;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 HeroOverlay Monitoring Dashboard</h1>
    
    <div class="grid">
      <div class="card">
        <h2>📦 Bundle Size</h2>
        ${this.currentMetrics.bundle ? `
          <div class="metric">
            <span class="metric-label">HeroOverlay Core</span>
            <span class="metric-value">${(this.currentMetrics.bundle.heroOverlay.gzip / 1024).toFixed(2)} KB</span>
          </div>
          <div class="metric">
            <span class="metric-label">Animation Libraries</span>
            <span class="metric-value">${(this.currentMetrics.bundle.animations.gzip / 1024).toFixed(2)} KB</span>
          </div>
          <div class="metric">
            <span class="metric-label">Canvas Utilities</span>
            <span class="metric-value">${(this.currentMetrics.bundle.canvas.gzip / 1024).toFixed(2)} KB</span>
          </div>
          <div class="metric">
            <span class="metric-label">Total Impact</span>
            <span class="metric-value ${this.currentMetrics.bundle.total.gzip > 163840 ? 'status-error' : 'status-good'}">${(this.currentMetrics.bundle.total.gzip / 1024).toFixed(2)} KB</span>
          </div>
        ` : '<p>No bundle data available</p>'}
      </div>
      
      <div class="card">
        <h2>🚀 Performance</h2>
        ${this.currentMetrics.performance ? `
          <div class="metric">
            <span class="metric-label">Performance Score</span>
            <span class="metric-value ${this.currentMetrics.performance.score >= 90 ? 'status-good' : this.currentMetrics.performance.score >= 50 ? 'status-warning' : 'status-error'}">${this.currentMetrics.performance.score.toFixed(0)}/100</span>
          </div>
          <div class="metric">
            <span class="metric-label">First Contentful Paint</span>
            <span class="metric-value">${this.currentMetrics.performance.fcp.toFixed(0)}ms</span>
          </div>
          <div class="metric">
            <span class="metric-label">Largest Contentful Paint</span>
            <span class="metric-value">${this.currentMetrics.performance.lcp.toFixed(0)}ms</span>
          </div>
          <div class="metric">
            <span class="metric-label">Time to Interactive</span>
            <span class="metric-value">${this.currentMetrics.performance.tti.toFixed(0)}ms</span>
          </div>
        ` : '<p>No performance data available</p>'}
      </div>
      
      <div class="card">
        <h2>⚡ Runtime Metrics</h2>
        ${this.currentMetrics.runtime ? `
          <div class="metric">
            <span class="metric-label">Frames Per Second</span>
            <span class="metric-value ${this.currentMetrics.runtime.fps >= 60 ? 'status-good' : this.currentMetrics.runtime.fps >= 30 ? 'status-warning' : 'status-error'}">${this.currentMetrics.runtime.fps} FPS</span>
          </div>
          <div class="metric">
            <span class="metric-label">Avg Frame Time</span>
            <span class="metric-value">${this.currentMetrics.runtime.avgFrameTime}ms</span>
          </div>
          <div class="metric">
            <span class="metric-label">Memory Usage</span>
            <span class="metric-value ${parseFloat(this.currentMetrics.runtime.memoryUsageMB) <= 10 ? 'status-good' : 'status-warning'}">${this.currentMetrics.runtime.memoryUsageMB} MB</span>
          </div>
        ` : '<p>No runtime data available</p>'}
      </div>
    </div>
    
    <p class="timestamp">Generated: ${new Date().toISOString()}</p>
  </div>
</body>
</html>
    `;
    
    const reportPath = path.join(process.cwd(), 'hero-monitor-dashboard.html');
    fs.writeFileSync(reportPath, html);
    console.log(`\n📄 HTML dashboard saved to: ${reportPath}`);
  }

  async run() {
    console.log('🎨 Starting HeroOverlay Monitoring...\n');
    
    // Load configuration
    this.loadPerformanceBudget();
    
    // Collect all metrics
    this.collectBundleMetrics();
    // this.collectPerformanceMetrics(); // Commented out as it requires a built app
    // this.collectRuntimeMetrics(); // Commented out as it requires puppeteer
    
    // Save metrics
    this.saveMetrics();
    
    // Generate reports
    this.generateDashboard();
    this.generateHTMLReport();
    
    // Check for issues
    let hasIssues = false;
    if (this.currentMetrics.bundle && this.currentMetrics.bundle.violations.length > 0) {
      hasIssues = true;
    }
    
    process.exit(hasIssues ? 1 : 0);
  }
}

// Run the dashboard
const dashboard = new HeroMonitorDashboard();
dashboard.run();