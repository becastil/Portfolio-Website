# Manual Accessibility Testing Checklist

## Overview
This checklist provides manual testing procedures to verify accessibility features of the Next.js portfolio website. Each test should be performed manually to ensure the site is usable by people with disabilities and works with assistive technologies.

## Test Environment Setup
- **Browser**: Use Chrome, Firefox, Safari, and Edge for comprehensive testing
- **Screen Readers**: 
  - Windows: NVDA (free) or JAWS
  - macOS: VoiceOver (built-in)
  - Linux: Orca
- **Browser Extensions**: 
  - axe DevTools
  - WAVE (WebAIM)
  - Lighthouse

## 1. Keyboard Navigation Tests

### 1.1 Tab Order
- [ ] **Test**: Press Tab repeatedly from page load
- [ ] **Expected**: Focus moves through elements in logical order:
  1. Skip link (becomes visible on focus)
  2. Logo/Home link
  3. Navigation items (About, Projects, Contact)
  4. Theme toggle button
  5. Main content sections
  6. Footer links
  7. Back to top button (when visible)
- [ ] **Pass Criteria**: No focus gets trapped, all interactive elements are reachable

### 1.2 Reverse Tab Navigation
- [ ] **Test**: Press Shift+Tab to navigate backwards
- [ ] **Expected**: Focus moves in reverse order smoothly
- [ ] **Pass Criteria**: Can navigate backwards through all elements

### 1.3 Enter/Space Key Activation
- [ ] **Test**: Focus on buttons/links and press Enter or Space
- [ ] **Expected**: 
  - Links activate on Enter
  - Buttons activate on Enter and Space
  - Theme toggle changes state
- [ ] **Pass Criteria**: All controls respond appropriately to keyboard

### 1.4 Escape Key
- [ ] **Test**: Open mobile menu and press Escape
- [ ] **Expected**: Mobile menu closes and focus returns to menu button
- [ ] **Pass Criteria**: Escape closes overlays/modals properly

## 2. Screen Reader Tests

### 2.1 Page Structure
- [ ] **Test**: Navigate by headings (H key in NVDA/JAWS)
- [ ] **Expected**: Clear heading hierarchy:
  - h1: Page title
  - h2: Section headings (About, Projects, Contact)
  - h3: Subsection headings
- [ ] **Pass Criteria**: Can understand page structure through headings alone

### 2.2 Navigation Landmarks
- [ ] **Test**: Navigate by landmarks (D key in NVDA, VO+U in VoiceOver)
- [ ] **Expected**: Find these landmarks:
  - Banner (header)
  - Navigation (main nav)
  - Main (content area)
  - Contentinfo (footer)
- [ ] **Pass Criteria**: All major page regions are properly marked

### 2.3 Link Context
- [ ] **Test**: Tab through all links with screen reader on
- [ ] **Expected**: Each link text makes sense out of context
- [ ] **Pass Criteria**: No "click here" or "read more" without context

### 2.4 Image Descriptions
- [ ] **Test**: Navigate to images with screen reader
- [ ] **Expected**: 
  - Decorative images are hidden (aria-hidden or empty alt)
  - Meaningful images have descriptive alt text
- [ ] **Pass Criteria**: All images properly described or hidden

### 2.5 Form Labels
- [ ] **Test**: Navigate to contact form fields
- [ ] **Expected**: Each field announces its label and type
- [ ] **Pass Criteria**: All form fields have associated labels

### 2.6 Button States
- [ ] **Test**: Navigate to theme toggle and mobile menu button
- [ ] **Expected**: 
  - Theme toggle announces current state (light/dark/system)
  - Mobile menu announces expanded/collapsed state
- [ ] **Pass Criteria**: Button states are clearly communicated

## 3. Focus Management Tests

### 3.1 Focus Indicators
- [ ] **Test**: Tab through all interactive elements
- [ ] **Expected**: Clear visible focus indicator on each element
- [ ] **Pass Criteria**: 
  - Focus ring visible with sufficient contrast
  - No elements lose focus indicator
  - Custom focus styles maintain visibility

### 3.2 Focus After Navigation
- [ ] **Test**: Click navigation links to different sections
- [ ] **Expected**: Focus moves to the target section
- [ ] **Pass Criteria**: User knows where they are after navigation

### 3.3 Focus Restoration
- [ ] **Test**: Open and close mobile menu
- [ ] **Expected**: Focus returns to menu button after closing
- [ ] **Pass Criteria**: Focus doesn't get lost after interactions

### 3.4 Skip Link Functionality
- [ ] **Test**: 
  1. Load page
  2. Press Tab once
  3. Activate skip link with Enter
- [ ] **Expected**: Focus jumps to main content area
- [ ] **Pass Criteria**: Can bypass navigation to reach main content

## 4. Theme Toggle Tests

### 4.1 Keyboard Operation
- [ ] **Test**: Focus theme toggle and press Enter/Space
- [ ] **Expected**: Theme cycles through light → dark → system
- [ ] **Pass Criteria**: Theme changes without mouse

### 4.2 State Announcement
- [ ] **Test**: Activate theme toggle with screen reader on
- [ ] **Expected**: New theme state is announced
- [ ] **Pass Criteria**: User knows current theme setting

### 4.3 Visual Persistence
- [ ] **Test**: Change theme and refresh page
- [ ] **Expected**: Theme preference is remembered
- [ ] **Pass Criteria**: Theme persists across sessions

### 4.4 System Theme Respect
- [ ] **Test**: Set to system theme and change OS theme
- [ ] **Expected**: Site theme updates automatically
- [ ] **Pass Criteria**: Respects user's system preference

## 5. Mobile Menu Tests

### 5.1 Touch Target Size
- [ ] **Test**: Inspect mobile menu button and items on mobile
- [ ] **Expected**: Minimum 44x44px touch targets
- [ ] **Pass Criteria**: Easy to tap on mobile devices

### 5.2 Focus Trap
- [ ] **Test**: Open mobile menu and tab through items
- [ ] **Expected**: Focus cycles within menu, doesn't escape
- [ ] **Pass Criteria**: Tab wraps from last to first item

### 5.3 Backdrop Interaction
- [ ] **Test**: Click backdrop behind mobile menu
- [ ] **Expected**: Menu closes
- [ ] **Pass Criteria**: Can dismiss menu by clicking outside

### 5.4 Menu State Announcement
- [ ] **Test**: Open/close menu with screen reader
- [ ] **Expected**: "Menu opened" and "Menu closed" announcements
- [ ] **Pass Criteria**: State changes are announced

### 5.5 Scroll Lock
- [ ] **Test**: Open mobile menu and try to scroll
- [ ] **Expected**: Background doesn't scroll when menu is open
- [ ] **Pass Criteria**: Focus stays on menu content

## 6. Skip Link Tests

### 6.1 Visibility
- [ ] **Test**: Tab once from page load
- [ ] **Expected**: Skip link becomes visible
- [ ] **Pass Criteria**: Hidden by default, visible on focus

### 6.2 Functionality
- [ ] **Test**: Activate skip link
- [ ] **Expected**: Focus moves to main content
- [ ] **Pass Criteria**: Bypasses header navigation

### 6.3 Screen Reader Announcement
- [ ] **Test**: Focus skip link with screen reader
- [ ] **Expected**: Announces "Skip to main content"
- [ ] **Pass Criteria**: Purpose is clear to screen reader users

## 7. Color Contrast Tests

### 7.1 Text Contrast
- [ ] **Test**: Check all text with contrast analyzer
- [ ] **Expected**: 
  - Normal text: 4.5:1 minimum
  - Large text: 3:1 minimum
- [ ] **Pass Criteria**: WCAG AA compliance

### 7.2 Focus Indicator Contrast
- [ ] **Test**: Check focus ring contrast
- [ ] **Expected**: 3:1 contrast with background
- [ ] **Pass Criteria**: Focus clearly visible

### 7.3 Theme Contrast
- [ ] **Test**: Check contrast in both light and dark themes
- [ ] **Expected**: Both themes meet contrast requirements
- [ ] **Pass Criteria**: Accessible in all theme modes

## 8. Motion and Animation Tests

### 8.1 Reduced Motion
- [ ] **Test**: Enable reduced motion in OS settings
- [ ] **Expected**: 
  - Animations are reduced or removed
  - Smooth scroll becomes instant
  - Transitions are minimized
- [ ] **Pass Criteria**: Respects prefers-reduced-motion

### 8.2 Pause/Stop Controls
- [ ] **Test**: Check for auto-playing content
- [ ] **Expected**: Any animation can be paused/stopped
- [ ] **Pass Criteria**: User has control over motion

## 9. Form Accessibility Tests

### 9.1 Label Association
- [ ] **Test**: Click on form labels
- [ ] **Expected**: Focus moves to associated input
- [ ] **Pass Criteria**: All inputs have clickable labels

### 9.2 Error Messages
- [ ] **Test**: Submit form with errors
- [ ] **Expected**: 
  - Errors announced to screen readers
  - Clear error messages near fields
  - Focus moves to first error
- [ ] **Pass Criteria**: Errors are accessible and clear

### 9.3 Required Fields
- [ ] **Test**: Check required field indicators
- [ ] **Expected**: Required fields marked with aria-required
- [ ] **Pass Criteria**: Screen readers announce required state

## 10. ARIA Implementation Tests

### 10.1 Live Regions
- [ ] **Test**: Trigger dynamic content updates
- [ ] **Expected**: Changes announced via aria-live regions
- [ ] **Pass Criteria**: Important updates are communicated

### 10.2 Roles and Properties
- [ ] **Test**: Inspect ARIA attributes in DevTools
- [ ] **Expected**: 
  - Proper use of roles (navigation, main, etc.)
  - Correct aria-label/aria-labelledby usage
  - No conflicting ARIA attributes
- [ ] **Pass Criteria**: Valid ARIA implementation

### 10.3 Widget States
- [ ] **Test**: Check expandable elements
- [ ] **Expected**: aria-expanded updates correctly
- [ ] **Pass Criteria**: States accurately reflect UI

## Testing Report Template

```markdown
## Accessibility Testing Report
**Date**: [Date]
**Tester**: [Name]
**Browser/AT**: [Browser and Assistive Technology used]

### Summary
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Warnings: [Number]

### Failed Tests
[List each failed test with:
- Test name
- Expected behavior
- Actual behavior
- Severity (Critical/Major/Minor)
- Suggested fix]

### Recommendations
[Priority-ordered list of fixes needed]

### Notes
[Any additional observations or concerns]
```

## Severity Levels
- **Critical**: Prevents access to content or functionality
- **Major**: Significantly impairs user experience
- **Minor**: Causes inconvenience but has workaround
- **Enhancement**: Would improve experience but not required

## Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Testing Guide](https://webaim.org/articles/keyboard/)