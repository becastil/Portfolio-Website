#!/usr/bin/env node

/**
 * Bundle Size Comparison Script
 * Compares current bundle sizes with previous builds
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class BundleComparator {
  constructor() {
    this.currentReportPath = path.join(process.cwd(), 'bundle-size-report.json');
    this.previousReportPath = path.join(process.cwd(), '.bundle-size-baseline.json');
    this.heroAnalysisPath = path.join(process.cwd(), 'hero-bundle-analysis.json');
    this.previousHeroPath = path.join(process.cwd(), '.hero-bundle-baseline.json');
  }

  formatSize(bytes) {
    const kb = bytes / 1024;
    if (kb < 1) return `${bytes} B`;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }

  formatDiff(current, previous) {
    const diff = current - previous;
    const percent = ((diff / previous) * 100).toFixed(2);
    
    if (diff > 0) {
      return `${colors.red}+${this.formatSize(diff)} (+${percent}%)${colors.reset}`;
    } else if (diff < 0) {
      return `${colors.green}${this.formatSize(diff)} (${percent}%)${colors.reset}`;
    }
    return `${colors.yellow}No change${colors.reset}`;
  }

  loadReports() {
    const reports = {};

    // Load size-limit reports
    if (fs.existsSync(this.currentReportPath)) {
      try {
        reports.current = JSON.parse(fs.readFileSync(this.currentReportPath, 'utf8'));
      } catch (e) {
        console.error('Error loading current report:', e.message);
      }
    }

    if (fs.existsSync(this.previousReportPath)) {
      try {
        reports.previous = JSON.parse(fs.readFileSync(this.previousReportPath, 'utf8'));
      } catch (e) {
        console.error('Error loading previous report:', e.message);
      }
    }

    // Load HeroOverlay analysis
    if (fs.existsSync(this.heroAnalysisPath)) {
      try {
        reports.heroAnalysis = JSON.parse(fs.readFileSync(this.heroAnalysisPath, 'utf8'));
      } catch (e) {
        console.error('Error loading HeroOverlay analysis:', e.message);
      }
    }

    if (fs.existsSync(this.previousHeroPath)) {
      try {
        reports.previousHero = JSON.parse(fs.readFileSync(this.previousHeroPath, 'utf8'));
      } catch (e) {
        console.error('Error loading previous HeroOverlay analysis:', e.message);
      }
    }

    return reports;
  }

  compareSizeLimitReports(current, previous) {
    console.log(`\n${colors.bright}${colors.cyan}=== Bundle Size Comparison ===${colors.reset}\n`);

    if (!current || !previous) {
      console.log('No previous build data available for comparison.');
      return;
    }

    // Create a map of previous sizes for easy lookup
    const previousMap = new Map();
    previous.forEach(item => {
      previousMap.set(item.name, item.size);
    });

    // Compare each bundle
    let totalCurrentSize = 0;
    let totalPreviousSize = 0;

    current.forEach(item => {
      const currentSize = parseInt(item.size);
      const previousSize = previousMap.get(item.name);
      
      totalCurrentSize += currentSize;

      console.log(`${colors.bright}${item.name}:${colors.reset}`);
      console.log(`  Current: ${this.formatSize(currentSize)}`);

      if (previousSize) {
        totalPreviousSize += parseInt(previousSize);
        console.log(`  Previous: ${this.formatSize(parseInt(previousSize))}`);
        console.log(`  Change: ${this.formatDiff(currentSize, parseInt(previousSize))}`);
      } else {
        console.log(`  ${colors.yellow}New bundle (no previous data)${colors.reset}`);
      }

      // Check if over limit
      if (item.passed === false) {
        console.log(`  ${colors.red}⚠ Exceeds limit of ${item.limit}${colors.reset}`);
      }
      console.log();
    });

    // Total comparison
    if (totalPreviousSize > 0) {
      console.log(`${colors.bright}Total Bundle Size:${colors.reset}`);
      console.log(`  Current: ${this.formatSize(totalCurrentSize)}`);
      console.log(`  Previous: ${this.formatSize(totalPreviousSize)}`);
      console.log(`  Change: ${this.formatDiff(totalCurrentSize, totalPreviousSize)}`);
    }
  }

  compareHeroAnalysis(current, previous) {
    console.log(`\n${colors.bright}${colors.cyan}=== HeroOverlay Bundle Comparison ===${colors.reset}\n`);

    if (!current || !previous) {
      console.log('No previous HeroOverlay analysis available for comparison.');
      return;
    }

    const categories = ['heroOverlay', 'animations', 'canvas', 'dependencies', 'css', 'total'];

    categories.forEach(category => {
      const currentData = current.results[category];
      const previousData = previous.results[category];

      if (!currentData || !previousData) return;

      console.log(`${colors.bright}${category.charAt(0).toUpperCase() + category.slice(1)}:${colors.reset}`);
      console.log(`  Current (gzip): ${this.formatSize(currentData.gzip)}`);
      console.log(`  Previous (gzip): ${this.formatSize(previousData.gzip)}`);
      console.log(`  Change: ${this.formatDiff(currentData.gzip, previousData.gzip)}`);
      
      if (currentData.files && previousData.files) {
        const filesDiff = currentData.files.length - previousData.files.length;
        if (filesDiff !== 0) {
          const sign = filesDiff > 0 ? '+' : '';
          console.log(`  Files: ${currentData.files.length} (${sign}${filesDiff})`);
        }
      }
      console.log();
    });

    // Check for new violations
    if (current.violations && current.violations.length > 0) {
      console.log(`${colors.bright}${colors.red}Current Violations:${colors.reset}`);
      current.violations.forEach(v => {
        console.log(`  - ${v.category}: ${this.formatSize(v.size)} (limit: ${this.formatSize(v.threshold)})`);
      });
    }
  }

  saveBaseline() {
    // Save current reports as baseline for next comparison
    if (fs.existsSync(this.currentReportPath)) {
      fs.copyFileSync(this.currentReportPath, this.previousReportPath);
      console.log(`\n${colors.green}✓ Saved current bundle sizes as baseline${colors.reset}`);
    }

    if (fs.existsSync(this.heroAnalysisPath)) {
      fs.copyFileSync(this.heroAnalysisPath, this.previousHeroPath);
      console.log(`${colors.green}✓ Saved HeroOverlay analysis as baseline${colors.reset}`);
    }
  }

  generateGitHubComment() {
    const reports = this.loadReports();
    let comment = '## 📦 Bundle Size Report\n\n';

    if (reports.heroAnalysis) {
      const hero = reports.heroAnalysis.results;
      comment += '### HeroOverlay Component Impact\n\n';
      comment += '| Category | Size (gzip) | Status |\n';
      comment += '|----------|-------------|--------|\n';
      comment += `| HeroOverlay | ${this.formatSize(hero.heroOverlay.gzip)} | ${hero.heroOverlay.gzip < 35840 ? '✅' : '⚠️'} |\n`;
      comment += `| Animations | ${this.formatSize(hero.animations.gzip)} | ${hero.animations.gzip < 51200 ? '✅' : '⚠️'} |\n`;
      comment += `| Canvas Utils | ${this.formatSize(hero.canvas.gzip)} | ✅ |\n`;
      comment += `| **Total** | **${this.formatSize(hero.total.gzip)}** | ${hero.total.gzip < 163840 ? '✅' : '⚠️'} |\n`;
      comment += '\n';

      if (reports.previousHero) {
        const prevTotal = reports.previousHero.results.total.gzip;
        const currTotal = hero.total.gzip;
        const diff = currTotal - prevTotal;
        
        if (diff !== 0) {
          const sign = diff > 0 ? '+' : '';
          const percent = ((diff / prevTotal) * 100).toFixed(2);
          comment += `📊 Change from previous: ${sign}${this.formatSize(diff)} (${sign}${percent}%)\n\n`;
        }
      }
    }

    if (reports.current) {
      comment += '### Overall Bundle Sizes\n\n';
      comment += '| Bundle | Size | Limit | Status |\n';
      comment += '|--------|------|-------|--------|\n';
      
      reports.current.forEach(item => {
        const status = item.passed !== false ? '✅' : '❌';
        comment += `| ${item.name} | ${item.size} | ${item.limit} | ${status} |\n`;
      });
    }

    const outputPath = path.join(process.cwd(), 'bundle-comment.md');
    fs.writeFileSync(outputPath, comment);
    console.log(`\n${colors.cyan}GitHub comment saved to: ${outputPath}${colors.reset}`);
  }

  run() {
    const reports = this.loadReports();

    if (reports.current && reports.previous) {
      this.compareSizeLimitReports(reports.current, reports.previous);
    }

    if (reports.heroAnalysis && reports.previousHero) {
      this.compareHeroAnalysis(reports.heroAnalysis, reports.previousHero);
    }

    // Generate GitHub comment if in CI
    if (process.env.CI) {
      this.generateGitHubComment();
    }

    // Save baseline for next comparison
    if (process.argv.includes('--save-baseline')) {
      this.saveBaseline();
    }

    // Check for failures
    let hasFailures = false;
    if (reports.current) {
      hasFailures = reports.current.some(item => item.passed === false);
    }
    if (reports.heroAnalysis && reports.heroAnalysis.violations) {
      hasFailures = hasFailures || reports.heroAnalysis.violations.length > 0;
    }

    process.exit(hasFailures ? 1 : 0);
  }
}

// Run the comparator
const comparator = new BundleComparator();
comparator.run();