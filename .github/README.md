# CI/CD Pipeline Documentation

This repository implements a comprehensive CI/CD pipeline for a Next.js 14 portfolio website with multiple quality gates and automated testing.

## 🏗️ Pipeline Overview

The CI/CD pipeline consists of 6 main workflows that ensure code quality, performance, security, and accessibility:

### 1. Continuous Integration (`ci.yml`)
**Triggers:** Push to main/develop, Pull Requests
**Purpose:** Core quality checks and gates

- **Pre-flight Checks**: Fast validation and dependency caching
- **Code Quality**: TypeScript checking, ESLint analysis
- **Security Scanning**: npm audit for vulnerabilities
- **Build & Test**: Next.js build verification
- **Accessibility**: Axe testing with WCAG 2.1 AA compliance
- **Quality Gate**: Summary of all checks with pass/fail status

### 2. End-to-End Testing (`e2e.yml`)
**Triggers:** Push to main, Pull Requests, Daily schedule
**Purpose:** Cross-browser functional testing

- **Multi-browser Testing**: Chromium, Firefox, WebKit
- **Responsive Testing**: Desktop, tablet, and mobile viewports
- **Critical User Flows**:
  - Homepage navigation and loading
  - Mobile menu functionality
  - Contact form submission
  - Blog system navigation
  - Theme toggle functionality
  - Responsive design validation

### 3. Lighthouse CI & Performance (`lighthouse-ci.yml`)
**Triggers:** Push to main, Pull Requests, Daily schedule
**Purpose:** Performance monitoring and optimization

- **Quality Gates**: Maintains 95+ scores for Performance, Accessibility, Best Practices, SEO
- **Performance Budgets**: Enforces Core Web Vitals thresholds
- **Automated Reporting**: PR comments with detailed metrics
- **Trend Analysis**: Historical performance tracking

### 4. Security Scanning (`security.yml`)
**Triggers:** Push to main, Pull Requests, Weekly schedule
**Purpose:** Comprehensive security analysis

- **Dependency Scanning**: npm audit with vulnerability assessment
- **Static Analysis**: CodeQL for security vulnerabilities
- **Secret Detection**: TruffleHog for exposed credentials
- **License Compliance**: Automated license checking

### 5. Deployment (`deploy.yml`)
**Triggers:** Push to main, Manual dispatch
**Purpose:** Production deployment with quality gate dependencies

- **Quality Gate Verification**: Waits for all quality checks to pass
- **Build Verification**: Final type/lint checks and build validation
- **GitHub Pages Deployment**: Automated static site deployment
- **Post-deployment Health Checks**: Verification of live site

### 6. Test Reporting (`test-report.yml`)
**Triggers:** Completion of other workflows
**Purpose:** Consolidated reporting and notifications

- **Report Aggregation**: Collects all test artifacts
- **Quality Dashboard**: Comprehensive test summary
- **PR Notifications**: Automated comments with results
- **Trend Analysis**: Quality metrics over time

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Playwright browsers (for E2E tests)

### Running Tests Locally

```bash
# Install dependencies
npm ci

# Run all quality checks
npm run test:all

# Individual test commands
npm run lint                    # ESLint analysis
npm run type-check             # TypeScript checking
npm run test:e2e               # E2E tests
npm run test:e2e:headed        # E2E tests with browser UI
npm run test:accessibility     # Accessibility testing
npm run lighthouse:local       # Local Lighthouse audit
```

### Setting Up the Pipeline

1. **Required Secrets** (if using external services):
   ```
   LHCI_GITHUB_APP_TOKEN  # Lighthouse CI GitHub App token (optional)
   LHCI_TOKEN             # Lighthouse CI server token (optional)
   ```

2. **Branch Protection Rules**:
   - Require status checks: `Quality Gate`, `Lighthouse Performance & Accessibility`
   - Require branches to be up to date
   - Require linear history (recommended)

3. **Workflow Permissions**:
   - Contents: read
   - Pages: write
   - Security events: write
   - Pull requests: write
   - Checks: write

## 📊 Quality Gates

### Code Quality
- **TypeScript**: Zero compilation errors
- **ESLint**: Zero errors (warnings allowed)
- **Build**: Successful Next.js static export

### Performance
- **Lighthouse Performance**: ≥95/100
- **First Contentful Paint**: ≤1.5s
- **Largest Contentful Paint**: ≤2.5s
- **Cumulative Layout Shift**: ≤0.1
- **Total Blocking Time**: ≤300ms

### Accessibility
- **Lighthouse Accessibility**: ≥95/100
- **Axe WCAG 2.1 AA**: Zero critical violations
- **Color Contrast**: Meets WCAG AA standards
- **Keyboard Navigation**: Full accessibility

### Security
- **Critical Vulnerabilities**: Zero tolerance
- **High Vulnerabilities**: Warning only
- **Secret Detection**: Zero exposed secrets
- **License Compliance**: No problematic licenses

## 🧪 Test Structure

### E2E Tests (`/tests/e2e/`)
```
tests/e2e/
├── homepage.spec.ts      # Homepage functionality
├── navigation.spec.ts    # Navigation and mobile menu
├── contact-form.spec.ts  # Contact form validation
├── blog.spec.ts          # Blog system functionality
├── theme-toggle.spec.ts  # Dark/light theme switching
└── responsive.spec.ts    # Responsive design validation
```

### Test Configuration
- **Playwright Config**: Cross-browser matrix testing
- **Viewports**: Mobile (375px), Tablet (768px), Desktop (1920px)
- **Browsers**: Chromium, Firefox, WebKit
- **Retry Strategy**: 2 retries in CI environment
- **Artifacts**: Screenshots, videos, traces on failure

## 📈 Performance Optimization

### Caching Strategy
- **Dependencies**: Cached based on `package-lock.json` hash
- **Build Output**: Cached using Next.js built-in caching
- **Playwright Browsers**: Cached per browser and version
- **Cache Cleanup**: Automated weekly cleanup of old entries

### Parallel Execution
- **CI Jobs**: 5 parallel quality check jobs
- **E2E Matrix**: 7 parallel browser/viewport combinations
- **Security Scans**: 4 parallel security analysis jobs

### Conditional Execution
- **File Change Detection**: E2E tests only run on significant changes
- **Branch-based Logic**: Different rules for main vs. feature branches
- **Scheduled vs. Triggered**: Different test depths based on trigger

## 🔧 Configuration Files

### Core Configuration
- `.github/workflows/` - GitHub Actions workflows
- `playwright.config.ts` - E2E test configuration
- `lighthouserc.json` - Performance budget configuration
- `package.json` - Test scripts and dependencies

### Quality Standards
- `.eslintrc.json` - Code quality rules
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js build configuration

## 📋 Troubleshooting

### Common Issues

**E2E Tests Failing:**
```bash
# Debug mode
npm run test:e2e:debug

# Check specific test
npx playwright test tests/e2e/homepage.spec.ts --headed
```

**Lighthouse Scores Low:**
```bash
# Local audit
npm run lighthouse:local

# Check specific URL
npx lhci autorun --collect.url=http://localhost:3000
```

**Build Failures:**
```bash
# Check TypeScript errors
npm run type-check

# Check linting issues
npm run lint

# Clean build
rm -rf .next out node_modules && npm ci && npm run build
```

### Performance Debugging
- Use Chrome DevTools for Core Web Vitals analysis
- Check bundle size with `npm run perf:analyze`
- Monitor CI performance with cache effectiveness reports

## 🚦 Deployment Process

### Automatic Deployment (Main Branch)
1. Code pushed to `main` branch
2. All quality gates must pass
3. Build verification and smoke tests
4. Deployment to GitHub Pages
5. Post-deployment health checks

### Manual Deployment
```bash
# Trigger manual deployment
gh workflow run deploy.yml
```

### Rollback Strategy
- Previous deployments are available in GitHub Pages history
- Manual rollback via GitHub Pages settings
- Emergency deployments can skip quality gates (not recommended)

## 📊 Monitoring & Reporting

### Automated Reports
- **PR Comments**: Real-time quality feedback
- **Workflow Artifacts**: Detailed test results and reports
- **Performance Trends**: Historical Lighthouse data
- **Security Dashboards**: Vulnerability and compliance status

### Manual Monitoring
- GitHub Actions dashboard for workflow status
- Lighthouse CI server (if configured) for performance trends
- Repository security tab for vulnerability alerts

## 🤝 Contributing

### Pull Request Process
1. Create feature branch from `main`
2. Make changes and add tests
3. Push branch and create PR
4. Automated quality checks run
5. Address any failing quality gates
6. Request review when all checks pass
7. Merge after approval

### Adding New Tests
1. Add E2E tests to appropriate spec files
2. Update Lighthouse config for new pages
3. Add accessibility tests for new components
4. Update documentation for new features

---

*This CI/CD pipeline ensures production-quality code through automated testing, performance monitoring, security scanning, and accessibility validation. All quality gates must pass before deployment to maintain high standards.*