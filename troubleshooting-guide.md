# Troubleshooting Guide - Ben Castillo Portfolio Website

## Table of Contents
1. [Common Issues Quick Reference](#common-issues-quick-reference)
2. [Navigation and Scrolling Issues](#navigation-and-scrolling-issues)
3. [Dark Mode Toggle Problems](#dark-mode-toggle-problems)
4. [Project Filtering Issues](#project-filtering-issues)
5. [Form Validation Problems](#form-validation-problems)
6. [Responsive Design Issues](#responsive-design-issues)
7. [Performance Problems](#performance-problems)
8. [Browser-Specific Issues](#browser-specific-issues)
9. [Accessibility Issues](#accessibility-issues)
10. [Debug Tools and Techniques](#debug-tools-and-techniques)

## Common Issues Quick Reference

### Issue Priority Matrix
| Priority | Issue Type | Response Time | Examples |
|----------|------------|---------------|-----------|
| Critical | Site completely broken | Immediate | JavaScript errors preventing page load |
| High | Core features not working | < 2 hours | Navigation broken, form not submitting |
| Medium | Minor functionality issues | < 24 hours | Animation glitches, styling inconsistencies |
| Low | Cosmetic issues | < 1 week | Text alignment, color variations |

### Quick Diagnostic Checklist
```
□ Check browser console for JavaScript errors
□ Verify network requests are successful
□ Confirm CSS files are loading properly
□ Test in incognito/private browsing mode
□ Clear browser cache and cookies
□ Test on different browser/device
□ Check internet connection stability
```

---

## Navigation and Scrolling Issues

### Issue: Smooth Scrolling Not Working

#### Symptoms
- Clicking navigation links jumps instantly to sections
- No smooth scroll animation visible
- Jerky or stuttering scroll behavior

#### Root Causes
1. **CSS smooth-scroll not supported**
2. **JavaScript scroll behavior overridden**
3. **Browser preference set to reduce motion**
4. **CSS conflicts preventing smooth scrolling**

#### Diagnostic Steps
```javascript
// Check if smooth scroll is supported
console.log('CSS supports smooth scroll:', CSS.supports('scroll-behavior', 'smooth'));

// Check current scroll behavior setting
console.log('Scroll behavior:', getComputedStyle(document.documentElement).scrollBehavior);

// Test manual smooth scroll
document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
```

#### Solutions
1. **Browser Support Issue**:
   ```css
   /* Add fallback for older browsers */
   html {
     scroll-behavior: smooth;
   }
   
   /* JavaScript polyfill if needed */
   if (!CSS.supports('scroll-behavior', 'smooth')) {
     // Implement JavaScript smooth scroll
   }
   ```

2. **Motion Preferences**:
   ```css
   /* Respect user's motion preferences */
   @media (prefers-reduced-motion: reduce) {
     html {
       scroll-behavior: auto;
     }
   }
   ```

3. **Conflicting JavaScript**:
   ```javascript
   // Check for conflicting event handlers
   const links = document.querySelectorAll('nav a[href^="#"]');
   links.forEach(link => {
     console.log('Event listeners:', getEventListeners(link));
   });
   ```

### Issue: Navigation Active States Not Updating

#### Symptoms
- Navigation items don't highlight when scrolling
- Wrong navigation item shows as active
- Active states never change

#### Root Causes
1. **Intersection Observer not working**
2. **Section IDs don't match navigation hrefs**
3. **JavaScript timing issues**
4. **CSS active state styles missing**

#### Diagnostic Steps
```javascript
// Check section IDs and navigation hrefs
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

console.log('Sections:', Array.from(sections).map(s => s.id));
console.log('Nav hrefs:', Array.from(navLinks).map(l => l.getAttribute('href')));

// Test Intersection Observer
const observer = new IntersectionObserver(entries => {
  console.log('Intersection entries:', entries);
});
sections.forEach(section => observer.observe(section));
```

#### Solutions
1. **Fix ID/href mismatch**:
   ```html
   <!-- Ensure section IDs match navigation hrefs -->
   <section id="about">...</section>
   <a href="#about">About</a>
   ```

2. **Update Intersection Observer settings**:
   ```javascript
   const observer = new IntersectionObserver(entries => {
     // Observer logic
   }, {
     threshold: 0.1,
     rootMargin: '-100px 0px -50% 0px' // Adjust based on header height
   });
   ```

3. **Add CSS active states**:
   ```css
   nav a.active {
     color: var(--color-accent);
   }
   nav a.active::after {
     width: 100%;
   }
   ```

### Issue: Skip Link Not Working

#### Symptoms
- Skip link doesn't appear when focused
- Skip link doesn't scroll to main content
- Screen readers can't access skip link

#### Diagnostic Steps
```javascript
// Test skip link visibility and functionality
const skipLink = document.querySelector('.skip-link');
console.log('Skip link exists:', !!skipLink);
console.log('Skip link href:', skipLink?.getAttribute('href'));

// Test target existence
const target = document.querySelector(skipLink?.getAttribute('href'));
console.log('Skip target exists:', !!target);
```

#### Solutions
1. **Fix CSS positioning**:
   ```css
   .skip-link {
     position: absolute;
     top: -40px;
     left: 6px;
     z-index: 1000;
   }
   
   .skip-link:focus {
     top: 6px;
   }
   ```

2. **Ensure target is focusable**:
   ```html
   <main id="main-content" tabindex="-1">
   ```

---

## Dark Mode Toggle Problems

### Issue: Theme Not Switching

#### Symptoms
- Clicking theme toggle doesn't change colors
- Theme toggle button doesn't change icon
- No visual response to theme toggle clicks

#### Root Causes
1. **JavaScript event listeners not attached**
2. **CSS custom properties not defined**
3. **LocalStorage access blocked**
4. **Theme toggle button not found**

#### Diagnostic Steps
```javascript
// Check if theme toggle exists and has event listeners
const themeToggle = document.querySelector('[data-theme-toggle]');
console.log('Theme toggle exists:', !!themeToggle);
console.log('Event listeners:', getEventListeners(themeToggle));

// Test CSS custom properties
const root = document.documentElement;
console.log('Current theme colors:', {
  text: getComputedStyle(root).getPropertyValue('--color-text'),
  background: getComputedStyle(root).getPropertyValue('--color-background')
});

// Test localStorage
try {
  localStorage.setItem('test', 'value');
  localStorage.removeItem('test');
  console.log('localStorage available');
} catch (e) {
  console.error('localStorage blocked:', e);
}
```

#### Solutions
1. **Fix event listener attachment**:
   ```javascript
   // Ensure DOM is loaded before attaching listeners
   document.addEventListener('DOMContentLoaded', () => {
     const themeToggle = document.querySelector('[data-theme-toggle]');
     if (themeToggle) {
       themeToggle.addEventListener('click', toggleTheme);
     }
   });
   ```

2. **Verify CSS custom properties**:
   ```css
   :root {
     --color-text: #333333;
     --color-background: #ffffff;
   }
   
   [data-theme="dark"] {
     --color-text: #f9fafb;
     --color-background: #111827;
   }
   ```

3. **Handle localStorage fallback**:
   ```javascript
   function getStoredTheme() {
     try {
       return localStorage.getItem('portfolio-theme') || 'light';
     } catch (e) {
       console.warn('localStorage unavailable, using default theme');
       return 'light';
     }
   }
   ```

### Issue: Theme Not Persisting

#### Symptoms
- Theme resets to default on page reload
- Theme preference not remembered
- Different theme appears after browser restart

#### Diagnostic Steps
```javascript
// Check localStorage content
console.log('Stored theme:', localStorage.getItem('portfolio-theme'));

// Test theme persistence
localStorage.setItem('portfolio-theme', 'dark');
console.log('Theme set to dark, reloading page...');
// Reload and check if theme persists
```

#### Solutions
1. **Fix localStorage key consistency**:
   ```javascript
   const THEME_KEY = 'portfolio-theme';
   
   function saveTheme(theme) {
     localStorage.setItem(THEME_KEY, theme);
   }
   
   function loadTheme() {
     return localStorage.getItem(THEME_KEY) || 'light';
   }
   ```

2. **Initialize theme on page load**:
   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
     const savedTheme = loadTheme();
     applyTheme(savedTheme);
   });
   ```

---

## Project Filtering Issues

### Issue: Filter Buttons Not Working

#### Symptoms
- Clicking filter buttons doesn't change visible projects
- No animation when filtering
- All projects remain visible regardless of filter

#### Root Causes
1. **Data attributes missing on project cards**
2. **JavaScript filter logic broken**
3. **CSS animations not triggering**
4. **Event listeners not attached to filter buttons**

#### Diagnostic Steps
```javascript
// Check project cards have data-category attributes
const projectCards = document.querySelectorAll('.project-card');
console.log('Project categories:', 
  Array.from(projectCards).map(card => card.getAttribute('data-category'))
);

// Check filter buttons exist and have data-filter attributes
const filterButtons = document.querySelectorAll('[data-filter]');
console.log('Filter buttons:', 
  Array.from(filterButtons).map(btn => btn.getAttribute('data-filter'))
);

// Test filter function manually
filterProjects('web');
```

#### Solutions
1. **Add missing data attributes**:
   ```html
   <article class="project-card" data-category="web">
     <!-- Project content -->
   </article>
   
   <button data-filter="web" class="filter-btn">Web Applications</button>
   ```

2. **Fix filter logic**:
   ```javascript
   function filterProjects(category) {
     const cards = document.querySelectorAll('.project-card');
     cards.forEach(card => {
       const cardCategory = card.getAttribute('data-category');
       const shouldShow = category === 'all' || cardCategory === category;
       
       if (shouldShow) {
         card.style.display = 'block';
         card.style.opacity = '1';
       } else {
         card.style.opacity = '0';
         setTimeout(() => card.style.display = 'none', 300);
       }
     });
   }
   ```

### Issue: Filter Animations Glitchy

#### Symptoms
- Projects jump or flicker during filtering
- Animation timing inconsistent
- Layout shifts during filter transitions

#### Diagnostic Steps
```javascript
// Check CSS transition properties
const projectCard = document.querySelector('.project-card');
const computedStyle = getComputedStyle(projectCard);
console.log('Transition:', computedStyle.transition);
console.log('Opacity:', computedStyle.opacity);
console.log('Transform:', computedStyle.transform);
```

#### Solutions
1. **Improve CSS transitions**:
   ```css
   .project-card {
     transition: opacity 0.3s ease, transform 0.3s ease;
     will-change: opacity, transform;
   }
   ```

2. **Use transform instead of display**:
   ```javascript
   // Better animation approach
   if (shouldShow) {
     card.style.transform = 'scale(1)';
     card.style.opacity = '1';
   } else {
     card.style.transform = 'scale(0.8)';
     card.style.opacity = '0';
   }
   ```

---

## Form Validation Problems

### Issue: Form Validation Not Triggering

#### Symptoms
- Form submits with empty required fields
- No error messages appear
- Invalid data accepted without warning

#### Root Causes
1. **HTML5 validation disabled**
2. **JavaScript validation not running**
3. **Form submission not prevented**
4. **Required attributes missing**

#### Diagnostic Steps
```javascript
// Check form validation setup
const form = document.querySelector('[data-contact-form]');
console.log('Form exists:', !!form);
console.log('Form novalidate:', form?.hasAttribute('novalidate'));

// Check required fields
const requiredFields = form?.querySelectorAll('[required]');
console.log('Required fields:', requiredFields?.length);

// Test validation manually
const nameField = document.querySelector('#name');
console.log('Name field validity:', nameField?.validity);
```

#### Solutions
1. **Ensure HTML5 validation enabled**:
   ```html
   <form data-contact-form> <!-- No novalidate attribute -->
     <input type="text" id="name" name="name" required>
     <input type="email" id="email" name="email" required>
   </form>
   ```

2. **Add JavaScript validation**:
   ```javascript
   form.addEventListener('submit', (e) => {
     e.preventDefault();
     
     const isValid = validateForm();
     if (isValid) {
       // Submit form
     }
   });
   ```

### Issue: Error Messages Not Displaying

#### Symptoms
- Validation errors occur but no messages shown
- Error messages appear but aren't styled correctly
- Screen readers don't announce errors

#### Diagnostic Steps
```javascript
// Check error message elements exist
const nameError = document.querySelector('#name-error');
console.log('Name error element exists:', !!nameError);
console.log('Error element attributes:', {
  role: nameError?.getAttribute('role'),
  'aria-live': nameError?.getAttribute('aria-live')
});
```

#### Solutions
1. **Add error message containers**:
   ```html
   <div class="form-group">
     <label for="name">Name</label>
     <input type="text" id="name" name="name" required>
     <span id="name-error" role="alert" class="error-message"></span>
   </div>
   ```

2. **Style error messages**:
   ```css
   .error-message {
     color: #ef4444;
     font-size: 0.875rem;
     display: none;
   }
   
   .error-message.show {
     display: block;
   }
   ```

---

## Responsive Design Issues

### Issue: Layout Breaking on Mobile

#### Symptoms
- Horizontal scrolling on mobile devices
- Content overflowing viewport
- Touch targets too small
- Text too small to read

#### Diagnostic Steps
```javascript
// Check viewport meta tag
const viewport = document.querySelector('meta[name="viewport"]');
console.log('Viewport meta:', viewport?.getAttribute('content'));

// Check current viewport size
console.log('Viewport size:', {
  width: window.innerWidth,
  height: window.innerHeight,
  devicePixelRatio: window.devicePixelRatio
});

// Check for horizontal overflow
const body = document.body;
console.log('Body scroll width vs client width:', {
  scrollWidth: body.scrollWidth,
  clientWidth: body.clientWidth,
  hasHorizontalScroll: body.scrollWidth > body.clientWidth
});
```

#### Solutions
1. **Fix viewport meta tag**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **Prevent horizontal overflow**:
   ```css
   html, body {
     overflow-x: hidden;
   }
   
   * {
     box-sizing: border-box;
   }
   ```

3. **Ensure minimum touch targets**:
   ```css
   @media (max-width: 768px) {
     button, a, input {
       min-height: 44px;
       min-width: 44px;
     }
   }
   ```

### Issue: CSS Grid Not Responsive

#### Symptoms
- Project grid doesn't change columns at breakpoints
- Grid items overlap or have poor spacing
- Grid layout identical across all screen sizes

#### Solutions
1. **Fix grid responsive behavior**:
   ```css
   .projects-grid {
     display: grid;
     gap: 2rem;
     grid-template-columns: 1fr; /* Mobile default */
   }
   
   @media (min-width: 768px) {
     .projects-grid {
       grid-template-columns: repeat(2, 1fr); /* Tablet */
     }
   }
   
   @media (min-width: 1024px) {
     .projects-grid {
       grid-template-columns: repeat(3, 1fr); /* Desktop */
     }
   }
   ```

---

## Performance Problems

### Issue: Slow Page Loading

#### Symptoms
- Page takes longer than 3 seconds to load
- White screen for extended period
- Resources loading slowly

#### Diagnostic Steps
```javascript
// Check page load performance
window.addEventListener('load', () => {
  const perfData = performance.timing;
  const loadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log('Page load time:', loadTime + 'ms');
  
  // Check resource loading
  const resources = performance.getEntriesByType('resource');
  resources.forEach(resource => {
    if (resource.duration > 1000) {
      console.log('Slow resource:', resource.name, resource.duration + 'ms');
    }
  });
});
```

#### Solutions
1. **Optimize resource loading**:
   ```html
   <!-- Preconnect to external domains -->
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   
   <!-- Use font-display: swap -->
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
   ```

2. **Minify resources**:
   ```bash
   # Minify CSS and JavaScript
   npx cssnano styles.css styles.min.css
   npx terser script.js -o script.min.js
   ```

### Issue: Poor Core Web Vitals

#### Symptoms
- Lighthouse performance score below 90
- LCP, FID, or CLS failing thresholds
- Slow user interactions

#### Diagnostic Steps
```javascript
// Monitor Core Web Vitals
import {getCLS, getFID, getLCP} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

#### Solutions
1. **Improve LCP**:
   ```css
   /* Optimize font loading */
   @font-face {
     font-family: 'Inter';
     font-display: swap;
   }
   ```

2. **Reduce CLS**:
   ```css
   /* Set explicit dimensions for images */
   img {
     width: 100%;
     height: auto;
   }
   ```

---

## Browser-Specific Issues

### Issue: Features Not Working in Safari

#### Common Safari Issues
1. **CSS Grid gaps not rendering**
2. **Smooth scrolling not working**
3. **LocalStorage restrictions in private browsing**

#### Solutions
1. **Safari CSS fixes**:
   ```css
   /* Safari smooth scrolling */
   html {
     scroll-behavior: smooth;
     -webkit-scroll-behavior: smooth;
   }
   
   /* Safari flexbox fixes */
   .flex-container {
     display: -webkit-flex;
     display: flex;
   }
   ```

2. **Safari JavaScript considerations**:
   ```javascript
   // Handle Safari localStorage restrictions
   function safeLocalStorage(key, value) {
     try {
       if (value === undefined) {
         return localStorage.getItem(key);
       }
       localStorage.setItem(key, value);
     } catch (e) {
       console.warn('LocalStorage unavailable:', e);
       return null;
     }
   }
   ```

### Issue: Internet Explorer Compatibility (Legacy)

**Note**: IE is no longer supported, but for reference:

```css
/* IE fallbacks (not implemented in current site) */
.projects-grid {
  display: grid;
  display: -ms-grid; /* IE fallback */
}
```

---

## Accessibility Issues

### Issue: Screen Reader Not Announcing Changes

#### Symptoms
- Filter changes not announced
- Form errors not announced
- Dynamic content changes ignored

#### Solutions
1. **Add ARIA live regions**:
   ```html
   <div id="filter-status" aria-live="polite" class="sr-only"></div>
   ```

2. **Update live regions with changes**:
   ```javascript
   function announceFilterChange(category, count) {
     const statusElement = document.getElementById('filter-status');
     statusElement.textContent = `Showing ${count} ${category} projects`;
   }
   ```

### Issue: Keyboard Navigation Problems

#### Symptoms
- Tab order is illogical
- Focus indicators not visible
- Elements not reachable by keyboard

#### Solutions
1. **Fix tab order**:
   ```html
   <!-- Use proper tabindex values -->
   <button tabindex="0">Focusable</button>
   <div tabindex="-1">Programmatically focusable</div>
   ```

2. **Improve focus indicators**:
   ```css
   button:focus-visible,
   a:focus-visible {
     outline: 2px solid var(--color-accent);
     outline-offset: 2px;
   }
   ```

---

## Debug Tools and Techniques

### Browser Developer Tools

#### Console Debugging
```javascript
// Enable detailed logging
localStorage.debug = 'portfolio:*';

// Log function entry and exit
function debugFunction(name, fn) {
  return function(...args) {
    console.log(`[${name}] Called with:`, args);
    const result = fn.apply(this, args);
    console.log(`[${name}] Returned:`, result);
    return result;
  };
}

// Use for debugging
const originalToggleTheme = toggleTheme;
toggleTheme = debugFunction('toggleTheme', originalToggleTheme);
```

#### Network Tab Analysis
```
Monitor these requests:
□ HTML document (should be < 50KB)
□ CSS files (should load quickly)
□ JavaScript files (check for errors)
□ Font files (check loading strategy)
□ Failed requests (404s, CORS errors)
```

#### Performance Tab Usage
```
1. Start recording
2. Perform actions (navigate, filter, submit form)
3. Stop recording
4. Analyze:
   - Main thread blocking
   - Layout thrashing
   - JavaScript execution time
   - Memory usage patterns
```

### Accessibility Testing Tools

#### Browser Extensions
1. **axe DevTools**: Automated accessibility scanning
2. **WAVE**: Visual accessibility evaluation
3. **Lighthouse**: Built-in accessibility audit

#### Screen Reader Testing
```
NVDA (Windows):
- H: Navigate by headings
- D: Navigate by landmarks
- F: Navigate by form controls
- B: Navigate by buttons

VoiceOver (macOS):
- Control+Option+H: Navigate by headings
- Control+Option+U: Open rotor
```

### Performance Monitoring

#### Real User Monitoring
```javascript
// Basic RUM implementation
function sendMetrics(metrics) {
  // Send to analytics service
  console.log('Performance metrics:', metrics);
}

// Monitor page load
window.addEventListener('load', () => {
  setTimeout(() => {
    const perfData = performance.timing;
    sendMetrics({
      loadTime: perfData.loadEventEnd - perfData.navigationStart,
      domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart,
      firstPaint: perfData.domContentLoadedEventEnd - perfData.navigationStart
    });
  }, 0);
});
```

### Emergency Debugging Procedures

#### When Everything Seems Broken
1. **Check console for errors**
2. **Disable all CSS**: Add `<style>*{display:none;}</style>` temporarily
3. **Disable JavaScript**: See if basic HTML works
4. **Test in different browser**: Isolate browser-specific issues
5. **Check network connectivity**: Ensure resources are loading
6. **Clear all browser data**: Reset to clean state
7. **Test on different device**: Rule out device-specific issues

#### Quick Fixes for Common Emergencies
```javascript
// Emergency theme reset
document.documentElement.removeAttribute('data-theme');
localStorage.removeItem('portfolio-theme');

// Emergency scroll reset
document.documentElement.style.scrollBehavior = 'auto';

// Emergency form reset
document.querySelectorAll('form').forEach(form => form.reset());

// Emergency layout reset
document.querySelectorAll('*').forEach(el => {
  el.style.overflow = 'visible';
  el.style.transform = 'none';
});
```

This troubleshooting guide provides systematic approaches to identifying and resolving common issues that may arise during testing or production use of the portfolio website. Regular reference to these procedures will help maintain high quality and quick issue resolution.