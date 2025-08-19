#!/usr/bin/env node

/**
 * HeroOverlay Bundle Analysis Script
 * Analyzes the bundle size impact of the HeroOverlay component
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const zlib = require('zlib');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class HeroBundleAnalyzer {
  constructor() {
    this.buildDir = path.join(process.cwd(), '.next');
    this.chunksDir = path.join(this.buildDir, 'static', 'chunks');
    this.cssDir = path.join(this.buildDir, 'static', 'css');
    this.results = {
      heroOverlay: { raw: 0, gzip: 0, brotli: 0, files: [] },
      dependencies: { raw: 0, gzip: 0, brotli: 0, files: [] },
      animations: { raw: 0, gzip: 0, brotli: 0, files: [] },
      canvas: { raw: 0, gzip: 0, brotli: 0, files: [] },
      css: { raw: 0, gzip: 0, brotli: 0, files: [] },
      total: { raw: 0, gzip: 0, brotli: 0 },
    };
    this.thresholds = {
      heroOverlay: 35 * 1024, // 35KB
      dependencies: 75 * 1024, // 75KB
      animations: 50 * 1024, // 50KB
      total: 160 * 1024, // 160KB total for all HeroOverlay-related code
    };
  }

  formatSize(bytes) {
    const kb = bytes / 1024;
    if (kb < 1) return `${bytes} B`;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }

  getGzipSize(content) {
    return zlib.gzipSync(content).length;
  }

  getBrotliSize(content) {
    return zlib.brotliCompressSync(content).length;
  }

  analyzeFile(filePath, category) {
    try {
      const content = fs.readFileSync(filePath);
      const stats = fs.statSync(filePath);
      const fileName = path.basename(filePath);

      const fileData = {
        name: fileName,
        path: filePath,
        raw: stats.size,
        gzip: this.getGzipSize(content),
        brotli: this.getBrotliSize(content),
      };

      this.results[category].files.push(fileData);
      this.results[category].raw += fileData.raw;
      this.results[category].gzip += fileData.gzip;
      this.results[category].brotli += fileData.brotli;

      return fileData;
    } catch (error) {
      console.error(`Error analyzing file ${filePath}:`, error.message);
      return null;
    }
  }

  findHeroOverlayChunks() {
    if (!fs.existsSync(this.chunksDir)) {
      throw new Error('Build directory not found. Please run "npm run build" first.');
    }

    const chunks = fs.readdirSync(this.chunksDir);
    
    chunks.forEach(chunk => {
      const chunkPath = path.join(this.chunksDir, chunk);
      if (!fs.statSync(chunkPath).isFile()) return;

      const content = fs.readFileSync(chunkPath, 'utf8');
      const lowerContent = content.toLowerCase();

      // Categorize chunks based on content
      if (chunk.includes('herooverlay') || 
          lowerContent.includes('herooverlay') ||
          lowerContent.includes('particle system') ||
          lowerContent.includes('interactive hero')) {
        this.analyzeFile(chunkPath, 'heroOverlay');
      } else if (lowerContent.includes('framer-motion') || 
                 lowerContent.includes('popmotion') ||
                 lowerContent.includes('animation')) {
        this.analyzeFile(chunkPath, 'animations');
      } else if (lowerContent.includes('canvas') || 
                 lowerContent.includes('webgl') ||
                 lowerContent.includes('requestanimationframe')) {
        this.analyzeFile(chunkPath, 'canvas');
      }
    });

    // Also check pages directory for component usage
    const pagesDir = path.join(this.chunksDir, 'pages');
    if (fs.existsSync(pagesDir)) {
      const pages = fs.readdirSync(pagesDir);
      pages.forEach(page => {
        const pagePath = path.join(pagesDir, page);
        const content = fs.readFileSync(pagePath, 'utf8');
        if (content.toLowerCase().includes('herooverlay')) {
          this.analyzeFile(pagePath, 'dependencies');
        }
      });
    }
  }

  analyzeCSSImpact() {
    if (!fs.existsSync(this.cssDir)) return;

    const cssFiles = fs.readdirSync(this.cssDir);
    cssFiles.forEach(file => {
      const cssPath = path.join(this.cssDir, file);
      const content = fs.readFileSync(cssPath, 'utf8');
      
      // Check if CSS contains HeroOverlay-related styles
      if (content.includes('hero') || 
          content.includes('particle') || 
          content.includes('canvas') ||
          content.includes('animation')) {
        this.analyzeFile(cssPath, 'css');
      }
    });
  }

  calculateTotals() {
    ['raw', 'gzip', 'brotli'].forEach(type => {
      this.results.total[type] = 
        this.results.heroOverlay[type] +
        this.results.dependencies[type] +
        this.results.animations[type] +
        this.results.canvas[type] +
        this.results.css[type];
    });
  }

  checkThresholds() {
    const violations = [];

    if (this.results.heroOverlay.gzip > this.thresholds.heroOverlay) {
      violations.push({
        category: 'HeroOverlay Component',
        size: this.results.heroOverlay.gzip,
        threshold: this.thresholds.heroOverlay,
      });
    }

    if (this.results.animations.gzip > this.thresholds.animations) {
      violations.push({
        category: 'Animation Libraries',
        size: this.results.animations.gzip,
        threshold: this.thresholds.animations,
      });
    }

    if (this.results.total.gzip > this.thresholds.total) {
      violations.push({
        category: 'Total Bundle',
        size: this.results.total.gzip,
        threshold: this.thresholds.total,
      });
    }

    return violations;
  }

  generateReport() {
    console.log(`\n${colors.bright}${colors.cyan}=== HeroOverlay Bundle Analysis ===${colors.reset}\n`);

    // Display results for each category
    const categories = ['heroOverlay', 'animations', 'canvas', 'dependencies', 'css'];
    
    categories.forEach(category => {
      const data = this.results[category];
      if (data.files.length === 0) return;

      const label = category.charAt(0).toUpperCase() + category.slice(1);
      console.log(`${colors.bright}${label}:${colors.reset}`);
      
      data.files.forEach(file => {
        console.log(`  - ${file.name}`);
        console.log(`    Raw: ${this.formatSize(file.raw)} | Gzip: ${this.formatSize(file.gzip)} | Brotli: ${this.formatSize(file.brotli)}`);
      });

      console.log(`  ${colors.yellow}Subtotal: ${this.formatSize(data.gzip)} (gzipped)${colors.reset}\n`);
    });

    // Display totals
    console.log(`${colors.bright}${colors.blue}=== Bundle Size Summary ===${colors.reset}`);
    console.log(`Raw Size:    ${this.formatSize(this.results.total.raw)}`);
    console.log(`Gzipped:     ${this.formatSize(this.results.total.gzip)}`);
    console.log(`Brotli:      ${this.formatSize(this.results.total.brotli)}`);

    // Check thresholds
    const violations = this.checkThresholds();
    if (violations.length > 0) {
      console.log(`\n${colors.bright}${colors.red}⚠ Bundle Size Violations:${colors.reset}`);
      violations.forEach(v => {
        const overBy = v.size - v.threshold;
        console.log(`  ${v.category}: ${this.formatSize(v.size)} (exceeds limit by ${this.formatSize(overBy)})`);
      });
      return false;
    } else {
      console.log(`\n${colors.bright}${colors.green}✓ All bundle sizes within limits${colors.reset}`);
      return true;
    }
  }

  generateJSON() {
    const output = {
      timestamp: new Date().toISOString(),
      results: this.results,
      thresholds: this.thresholds,
      violations: this.checkThresholds(),
    };

    const outputPath = path.join(process.cwd(), 'hero-bundle-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\nDetailed report saved to: ${outputPath}`);
  }

  generateMarkdownReport() {
    let markdown = '# HeroOverlay Bundle Analysis Report\n\n';
    markdown += `Generated: ${new Date().toISOString()}\n\n`;

    markdown += '## Bundle Sizes\n\n';
    markdown += '| Category | Raw | Gzipped | Brotli | Files |\n';
    markdown += '|----------|-----|---------|--------|-------|\n';

    const categories = ['heroOverlay', 'animations', 'canvas', 'dependencies', 'css'];
    categories.forEach(category => {
      const data = this.results[category];
      if (data.files.length === 0) return;
      
      const label = category.charAt(0).toUpperCase() + category.slice(1);
      markdown += `| ${label} | ${this.formatSize(data.raw)} | ${this.formatSize(data.gzip)} | ${this.formatSize(data.brotli)} | ${data.files.length} |\n`;
    });

    markdown += `| **Total** | **${this.formatSize(this.results.total.raw)}** | **${this.formatSize(this.results.total.gzip)}** | **${this.formatSize(this.results.total.brotli)}** | - |\n\n`;

    markdown += '## Threshold Status\n\n';
    const violations = this.checkThresholds();
    if (violations.length === 0) {
      markdown += '✅ All bundle sizes are within configured thresholds.\n\n';
    } else {
      markdown += '⚠️ The following thresholds have been exceeded:\n\n';
      violations.forEach(v => {
        const overBy = v.size - v.threshold;
        markdown += `- **${v.category}**: ${this.formatSize(v.size)} (exceeds ${this.formatSize(v.threshold)} limit by ${this.formatSize(overBy)})\n`;
      });
      markdown += '\n';
    }

    markdown += '## File Details\n\n';
    categories.forEach(category => {
      const data = this.results[category];
      if (data.files.length === 0) return;

      const label = category.charAt(0).toUpperCase() + category.slice(1);
      markdown += `### ${label}\n\n`;
      
      data.files.forEach(file => {
        markdown += `- **${file.name}**\n`;
        markdown += `  - Raw: ${this.formatSize(file.raw)}\n`;
        markdown += `  - Gzipped: ${this.formatSize(file.gzip)}\n`;
        markdown += `  - Brotli: ${this.formatSize(file.brotli)}\n`;
      });
      markdown += '\n';
    });

    markdown += '## Recommendations\n\n';
    if (this.results.heroOverlay.gzip > 30 * 1024) {
      markdown += '- Consider code-splitting the HeroOverlay component further\n';
    }
    if (this.results.animations.gzip > 40 * 1024) {
      markdown += '- Review animation library usage and consider lighter alternatives\n';
    }
    if (this.results.total.gzip > 150 * 1024) {
      markdown += '- Implement lazy loading for the HeroOverlay component\n';
    }

    const outputPath = path.join(process.cwd(), 'hero-bundle-report.md');
    fs.writeFileSync(outputPath, markdown);
    console.log(`Markdown report saved to: ${outputPath}`);
  }

  async run() {
    try {
      console.log(`${colors.cyan}Analyzing HeroOverlay bundle impact...${colors.reset}\n`);

      // Check if build exists
      if (!fs.existsSync(this.buildDir)) {
        console.log(`${colors.yellow}Build directory not found. Running build...${colors.reset}`);
        execSync('npm run build', { stdio: 'inherit' });
      }

      // Analyze chunks
      this.findHeroOverlayChunks();
      this.analyzeCSSImpact();
      this.calculateTotals();

      // Generate reports
      const success = this.generateReport();
      this.generateJSON();
      this.generateMarkdownReport();

      // Exit with appropriate code
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.error(`${colors.red}Error during analysis:${colors.reset}`, error.message);
      process.exit(1);
    }
  }
}

// Run the analyzer
const analyzer = new HeroBundleAnalyzer();
analyzer.run();