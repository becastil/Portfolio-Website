# QA Testing Master Guide - Ben Castillo Portfolio Website

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Project Analysis](#project-analysis)
3. [Test Environment Setup](#test-environment-setup)
4. [Testing Strategy](#testing-strategy)
5. [Feature Inventory](#feature-inventory)
6. [Testing Tools Required](#testing-tools-required)
7. [Testing Methodology](#testing-methodology)
8. [Test Execution Guidelines](#test-execution-guidelines)
9. [Bug Reporting Process](#bug-reporting-process)

## Testing Overview

### Purpose
This master guide provides comprehensive testing documentation for Ben Castillo's portfolio website to ensure quality, accessibility, performance, and cross-browser compatibility.

### Scope
- **Frontend**: Single-page HTML5 application with CSS and JavaScript
- **Features**: Dark mode, navigation, project filtering, contact form, responsive design
- **Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Devices**: Desktop, tablet, mobile (320px - 1920px+)
- **Accessibility**: WCAG 2.2 AA compliance

### Testing Objectives
1. Verify all interactive features function correctly
2. Ensure responsive design works across all breakpoints
3. Validate accessibility standards compliance
4. Confirm cross-browser compatibility
5. Measure performance benchmarks
6. Test user experience flows

## Project Analysis

### Architecture
- **Type**: Static single-page application
- **Framework**: Vanilla HTML5, CSS3, JavaScript ES6+
- **Structure**: 
  - `/index.html` - Main page
  - `/assets/css/styles.css` - Comprehensive styling system
  - `/assets/js/script.js` - Interactive functionality
  - `/assets/images/` - Image assets

### Key Technologies
- **HTML5**: Semantic markup with ARIA attributes
- **CSS3**: Custom properties, flexbox, grid, animations
- **JavaScript**: ES6+ modules, localStorage, intersection observer
- **Accessibility**: Screen reader support, keyboard navigation
- **Performance**: Optimized loading, minimal dependencies

## Test Environment Setup

### Prerequisites
1. **Web Browsers** (latest versions):
   - Google Chrome
   - Mozilla Firefox
   - Safari (macOS/iOS)
   - Microsoft Edge

2. **Development Tools**:
   - Browser Developer Tools
   - Lighthouse extension
   - axe DevTools extension
   - Wave Web Accessibility Evaluator

3. **Testing Devices**:
   - Desktop (1920x1080, 1366x768)
   - Tablet (768x1024, 1024x768)
   - Mobile (375x667, 414x896, 360x640)

### Environment Configuration
1. Clear browser cache and cookies
2. Disable browser extensions (except testing tools)
3. Set browser zoom to 100%
4. Enable JavaScript
5. Configure screen reader (if testing accessibility)

### Local Testing Setup
```bash
# Navigate to project directory
cd /mnt/c/Users/becas/Portfolio-Website

# Serve locally using Python (if needed)
python -m http.server 8000

# Or use Node.js
npx serve .

# Access via: http://localhost:8000
```

## Testing Strategy

### 1. Functional Testing
- **Navigation**: Menu links, smooth scrolling, active states
- **Dark Mode**: Toggle functionality, persistence, visual changes
- **Project Filtering**: All filter states, animations, accessibility
- **Contact Form**: Validation, error handling, submission flow
- **Interactive Elements**: Hover states, focus indicators, keyboard support

### 2. Responsive Testing
- **Breakpoints**: 320px, 768px, 1024px, 1280px, 1920px+
- **Orientation**: Portrait and landscape modes
- **Content Reflow**: Text wrapping, image scaling, layout adaptation
- **Touch Targets**: Minimum 44px touch targets (WCAG)

### 3. Cross-Browser Testing
- **Rendering**: Visual consistency across browsers
- **Functionality**: JavaScript feature compatibility
- **Performance**: Loading times and responsiveness
- **CSS Support**: Modern CSS features (grid, flexbox, custom properties)

### 4. Accessibility Testing
- **WCAG 2.2 AA**: All success criteria compliance
- **Keyboard Navigation**: Tab order, focus management
- **Screen Readers**: NVDA, JAWS, VoiceOver compatibility
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **ARIA**: Proper labeling and semantic markup

### 5. Performance Testing
- **Core Web Vitals**: LCP, FID, CLS measurements
- **Lighthouse Scores**: Performance, Accessibility, Best Practices, SEO
- **Network Conditions**: Fast 3G, Slow 3G, offline scenarios
- **Resource Loading**: Images, fonts, CSS, JavaScript optimization

## Feature Inventory

### Core Features
1. **Header Navigation**
   - Logo/brand link
   - Navigation menu (About, Projects, Contact)
   - Dark mode toggle button
   - Sticky positioning

2. **Hero Section**
   - Name and title display
   - Professional tagline
   - Responsive typography

3. **About Section**
   - Professional description
   - Centered content layout
   - Readable typography

4. **Projects Section**
   - Project filter buttons (All, Web, Mobile, Data)
   - Project cards with hover effects
   - Technology tags
   - Smooth filtering animations

5. **Contact Section**
   - Contact form with validation
   - Required fields: Name, Email, Message
   - Optional field: Subject
   - Social media links
   - Real-time validation feedback

6. **Footer**
   - Copyright information
   - Minimalist design

### Interactive Elements
- **Theme Toggle**: Dark/light mode switching with localStorage persistence
- **Smooth Scrolling**: Navigation links scroll to sections
- **Project Filtering**: Category-based filtering with animations
- **Form Validation**: Real-time validation with error messages
- **Hover Effects**: Cards, buttons, links with smooth transitions
- **Focus Management**: Keyboard navigation support

### Accessibility Features
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **ARIA Attributes**: Labels, roles, states, live regions
- **Keyboard Support**: Tab navigation, Enter/Space activation
- **Skip Links**: Skip to main content
- **Screen Reader**: Announcements for dynamic content
- **Focus Indicators**: Visible focus states for all interactive elements

## Testing Tools Required

### Browser Extensions
1. **Lighthouse**: Performance and accessibility audits
2. **axe DevTools**: Accessibility testing
3. **Wave**: Web accessibility evaluation
4. **ColorZilla**: Color contrast checking
5. **Responsive Viewer**: Multiple device simulation

### Online Tools
1. **WebAIM Contrast Checker**: Color contrast validation
2. **PageSpeed Insights**: Google performance testing
3. **GTmetrix**: Performance analysis
4. **BrowserStack**: Cross-browser testing
5. **LambdaTest**: Live browser testing

### Screen Readers
1. **NVDA** (Windows): Free screen reader
2. **JAWS** (Windows): Professional screen reader
3. **VoiceOver** (macOS/iOS): Built-in screen reader
4. **TalkBack** (Android): Mobile screen reader

### Development Tools
1. **Browser DevTools**: Network, Console, Elements tabs
2. **Responsive Design Mode**: Device simulation
3. **Accessibility Tree**: Screen reader view
4. **Network Throttling**: Connection speed simulation

## Testing Methodology

### Test Execution Order
1. **Setup Phase**: Environment configuration and tool preparation
2. **Smoke Testing**: Basic functionality verification
3. **Functional Testing**: Feature-by-feature validation
4. **Responsive Testing**: Multi-device and orientation testing
5. **Cross-Browser Testing**: Browser compatibility verification
6. **Accessibility Testing**: WCAG compliance validation
7. **Performance Testing**: Speed and optimization analysis
8. **User Experience Testing**: Complete user journey validation

### Test Data Requirements
- **Valid Test Data**:
  - Name: "John Doe", "María García-López"
  - Email: "test@example.com", "user+tag@domain.co.uk"
  - Subject: "Project Inquiry", "General Question"
  - Message: Valid 10+ character messages

- **Invalid Test Data**:
  - Name: "123", "A", special characters only
  - Email: "invalid", "test@", "@domain.com"
  - Message: "Short", empty strings, only spaces

### Documentation Standards
- **Test Results**: Pass/Fail with detailed descriptions
- **Screenshots**: Before/after states for visual issues
- **Bug Reports**: Detailed reproduction steps and environment info
- **Performance Metrics**: Quantified measurements with benchmarks

## Test Execution Guidelines

### Pre-Test Checklist
- [ ] Clear browser cache and cookies
- [ ] Verify internet connection stability
- [ ] Confirm testing environment setup
- [ ] Prepare test data and scenarios
- [ ] Set browser to 100% zoom level

### During Testing
1. **Follow Test Cases**: Execute step-by-step instructions precisely
2. **Document Results**: Record outcomes immediately
3. **Capture Evidence**: Screenshots for failures and edge cases
4. **Note Environment**: Browser, OS, screen resolution for issues
5. **Time Tracking**: Record test execution duration

### Post-Test Activities
1. **Results Compilation**: Summarize pass/fail rates
2. **Bug Triage**: Categorize issues by severity and priority
3. **Report Generation**: Create comprehensive test summary
4. **Stakeholder Communication**: Share findings and recommendations

## Bug Reporting Process

### Bug Report Template
```
Title: [Component] - [Brief Description]
Severity: Critical/High/Medium/Low
Priority: P1/P2/P3/P4
Environment: [Browser] [Version] on [OS]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]
Expected Result: [What should happen]
Actual Result: [What actually happens]
Screenshots: [Attach evidence]
Additional Notes: [Any other relevant information]
```

### Severity Levels
- **Critical**: Site completely broken, major functionality unusable
- **High**: Core features broken, significant user impact
- **Medium**: Minor functionality issues, workarounds available
- **Low**: Cosmetic issues, minor inconveniences

### Priority Levels
- **P1**: Fix immediately, blocks release
- **P2**: Fix before release, significant impact
- **P3**: Fix in next iteration, minor impact
- **P4**: Fix when time permits, minimal impact

## Success Criteria

### Functional Requirements
- [ ] All navigation links work correctly
- [ ] Dark mode toggle functions and persists
- [ ] Project filtering works for all categories
- [ ] Contact form validation works properly
- [ ] All interactive elements respond to user input

### Performance Requirements
- [ ] Lighthouse Performance Score ≥ 90
- [ ] First Contentful Paint ≤ 1.5s
- [ ] Largest Contentful Paint ≤ 2.5s
- [ ] Cumulative Layout Shift ≤ 0.1

### Accessibility Requirements
- [ ] WCAG 2.2 AA compliance (100%)
- [ ] Lighthouse Accessibility Score = 100
- [ ] Keyboard navigation fully functional
- [ ] Screen reader compatibility verified

### Browser Compatibility
- [ ] Chrome (latest 2 versions): 100% functional
- [ ] Firefox (latest 2 versions): 100% functional
- [ ] Safari (latest 2 versions): 100% functional
- [ ] Edge (latest 2 versions): 100% functional

### Responsive Design
- [ ] All breakpoints render correctly
- [ ] Content remains readable at all sizes
- [ ] Touch targets meet minimum size requirements
- [ ] No horizontal scrolling on mobile

This master guide serves as the foundation for all testing activities. Refer to the specific testing documents for detailed test cases and procedures.