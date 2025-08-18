# Comprehensive Accessibility Test Suite

## **WCAG 2.2 AA Compliance Test Scripts**

### **A. Keyboard Navigation Tests**

#### **Test A1: Skip Link Functionality**
**WCAG Reference:** 2.4.1 (Bypass Blocks)
**Steps:**
1. Load the homepage
2. Press `Tab` key once
3. **Expected:** Skip link appears with text "Skip to main content"
4. Press `Enter`
5. **Expected:** Focus moves to main content area (Hero section)
6. **Verify:** Focus ring is clearly visible around the first focusable element

**Pass Criteria:**
- Skip link appears on first Tab
- Skip link has sufficient contrast (4.5:1 minimum)
- Enter key activates skip function
- Focus moves to main content

#### **Test A2: Navigation Tab Order**
**WCAG Reference:** 2.4.3 (Focus Order)
**Steps:**
1. Load homepage and press Tab
2. Continue tabbing through navigation
3. **Expected order:** Skip link → Logo → Navigation items → Theme toggle → Mobile menu button
4. Test in both desktop and mobile viewports

**Pass Criteria:**
- Tab order is logical and follows visual layout
- All interactive elements are reachable
- Focus is clearly visible on all elements

#### **Test A3: Mobile Menu Keyboard Operation**
**WCAG Reference:** 2.1.1 (Keyboard), 2.1.2 (No Keyboard Trap)
**Steps:**
1. Resize to mobile viewport (< 768px)
2. Tab to mobile menu button
3. Press `Enter` or `Space`
4. **Expected:** Menu opens, focus moves to first menu item
5. Tab through all menu items
6. Press `Escape`
7. **Expected:** Menu closes, focus returns to menu button

**Pass Criteria:**
- Mobile menu opens with keyboard
- Focus trapped within open menu
- Escape closes menu
- Focus returns to trigger button

#### **Test A4: Smooth Scrolling with Focus Management**
**WCAG Reference:** 2.4.3 (Focus Order), 3.2.1 (On Focus)
**Steps:**
1. Tab to "About" navigation link
2. Press `Enter`
3. **Expected:** Smooth scroll to About section
4. **Expected:** Focus moves to About section heading or first focusable element
5. Repeat for Projects and Contact sections

**Pass Criteria:**
- Smooth scrolling works (respects prefers-reduced-motion)
- Focus moves to target section
- Focus is clearly visible after scroll

### **B. Screen Reader Tests**

#### **Test B1: NVDA + Firefox**
**WCAG Reference:** 4.1.3 (Status Messages)
**Steps:**
1. Start NVDA screen reader
2. Open Firefox and navigate to site
3. Use `H` key to navigate by headings
4. **Expected announcements:**
   - "Ben Castillo - Full-Stack Developer, heading level 1"
   - "About, heading level 2"
   - "Projects, heading level 3"
   - "Contact, heading level 2"

**Navigation Tests:**
1. Press `L` to navigate by landmarks
2. **Expected:** Banner, Main, Navigation regions announced
3. Navigate menu with arrow keys
4. **Expected:** "Now viewing [Section] section" when sections change

#### **Test B2: JAWS + Chrome**
**WCAG Reference:** 2.4.6 (Headings and Labels)
**Steps:**
1. Start JAWS screen reader
2. Open Chrome and navigate to site
3. Use `Insert + F6` to list headings
4. Verify heading structure is logical (H1 → H2 → H3, no skipping)

#### **Test B3: VoiceOver + Safari (macOS)**
**WCAG Reference:** 4.1.2 (Name, Role, Value)
**Steps:**
1. Start VoiceOver (`Cmd + F5`)
2. Navigate with `Control + Option + Arrow keys`
3. Test theme toggle button
4. **Expected:** "Switch to dark mode, button, pressed/not pressed"

### **C. Visual Accessibility Tests**

#### **Test C1: Color Contrast**
**WCAG Reference:** 1.4.3 (Contrast Minimum), 1.4.11 (Non-text Contrast)
**Tools:** WebAIM Color Contrast Checker, Chrome DevTools
**Steps:**
1. Check all text colors against backgrounds
2. **Requirements:**
   - Normal text: 4.5:1 minimum
   - Large text (18pt+): 3:1 minimum
   - UI components: 3:1 minimum
3. Test both light and dark themes

**Elements to Test:**
- Primary navigation text
- Body text on all backgrounds
- Button text and borders
- Focus indicators
- Active navigation states

#### **Test C2: Focus Indicators**
**WCAG Reference:** 2.4.7 (Focus Visible)
**Steps:**
1. Tab through all interactive elements
2. Verify focus indicators meet requirements:
   - Minimum 2px thickness
   - 3:1 contrast against adjacent colors
   - Not obscured by other content
3. Test in high contrast mode

#### **Test C3: High Contrast Mode**
**WCAG Reference:** 1.4.6 (Contrast Enhanced)
**Steps:**
1. Enable high contrast mode in OS
2. Check that all content remains visible
3. Verify enhanced focus rings appear
4. Test both Windows High Contrast and macOS Increase Contrast

### **D. Responsive and Zoom Tests**

#### **Test D1: Text Scaling**
**WCAG Reference:** 1.4.4 (Resize Text)
**Steps:**
1. Zoom browser to 200%
2. Verify all text remains readable
3. Check that no content is cut off
4. Ensure interactive elements remain usable

#### **Test D2: Viewport Reflow**
**WCAG Reference:** 1.4.10 (Reflow)
**Steps:**
1. Set viewport to 320px width
2. Zoom to 400%
3. Verify no horizontal scrolling required
4. Check mobile menu functions properly

#### **Test D3: Text Spacing**
**WCAG Reference:** 1.4.12 (Text Spacing)
**Steps:**
1. Apply CSS text spacing overrides:
   ```css
   * {
     line-height: 1.5 !important;
     letter-spacing: 0.12em !important;
     word-spacing: 0.16em !important;
   }
   p { margin-bottom: 2em !important; }
   ```
2. Verify no text is clipped or overlaps

### **E. Motion and Animation Tests**

#### **Test E1: Reduced Motion Preference**
**WCAG Reference:** 2.3.3 (Animation from Interactions)
**Steps:**
1. Enable "Reduce Motion" in OS settings
2. Navigate the site
3. **Expected:** 
   - No complex animations play
   - Smooth scrolling disabled
   - Essential state changes still visible
4. Test navigation and theme toggle

#### **Test E2: Animation Controls**
**WCAG Reference:** 2.2.2 (Pause, Stop, Hide)
**Steps:**
1. Identify any auto-playing animations
2. Verify they can be paused or stopped
3. Check that animations don't cycle more than 5 times

### **F. Form Accessibility Tests**

#### **Test F1: Contact Form (if present)**
**WCAG Reference:** 3.3.2 (Labels or Instructions)
**Steps:**
1. Navigate to contact form
2. Verify all inputs have explicit labels
3. Check for helpful instructions
4. Test error validation messaging

### **G. Live Region Tests**

#### **Test G1: Status Announcements**
**WCAG Reference:** 4.1.3 (Status Messages)
**Steps:**
1. With screen reader active, navigate between sections
2. **Expected:** "Now viewing [Section] section" announced
3. Toggle theme
4. **Expected:** "Theme changed to [light/dark] mode" announced
5. Open/close mobile menu
6. **Expected:** "Mobile menu opened/closed" announced

### **H. Automated Testing**

#### **Test H1: axe-core Automated Scan**
**Tools:** @axe-core/cli, Lighthouse
**Commands:**
```bash
# Install axe-core CLI
npm install -g @axe-core/cli

# Run accessibility scan
npx @axe-core/cli http://localhost:3000

# Run Lighthouse accessibility audit
lighthouse http://localhost:3000 --only-categories=accessibility --output=html --output-path=./accessibility-report.html
```

**Pass Criteria:**
- No serious or critical violations
- Lighthouse accessibility score ≥ 95

#### **Test H2: Pa11y Command Line Testing**
```bash
# Install Pa11y
npm install -g pa11y

# Test homepage
pa11y http://localhost:3000

# Test with different runners
pa11y http://localhost:3000 --runner htmlcs --standard WCAG2AA
```

### **I. Browser Compatibility Tests**

Test accessibility features across:
- Chrome + NVDA (Windows)
- Firefox + NVDA (Windows)
- Safari + VoiceOver (macOS)
- Edge + Narrator (Windows)

### **J. Mobile Accessibility Tests**

#### **Test J1: iOS VoiceOver**
1. Enable VoiceOver on iOS device
2. Test swipe navigation
3. Verify rotor controls work
4. Test pinch-to-zoom functionality

#### **Test J2: Android TalkBack**
1. Enable TalkBack on Android device
2. Test explore-by-touch
3. Verify global gestures work
4. Test reading controls

## **Definition of Done**

### **Critical Requirements (Must Pass)**
- ✅ Skip link functions correctly
- ✅ Keyboard navigation works throughout site
- ✅ Focus indicators meet 3:1 contrast ratio
- ✅ Mobile menu keyboard accessible
- ✅ Screen reader announcements for section changes
- ✅ No serious axe-core violations
- ✅ Text scales to 200% without horizontal scroll
- ✅ Respect prefers-reduced-motion

### **Enhanced Requirements (Should Pass)**
- ✅ Lighthouse accessibility score ≥ 95
- ✅ High contrast mode support
- ✅ ARIA live regions function properly
- ✅ Smooth scrolling with focus management
- ✅ Theme toggle announcements
- ✅ Active navigation state indicators

### **Future Enhancements (Nice to Have)**
- Voice control compatibility
- Switch device support
- Eye tracking support preparation
- Advanced keyboard shortcuts

## **Test Execution Checklist**

- [ ] A1-A4: Keyboard Navigation Tests
- [ ] B1-B3: Screen Reader Tests  
- [ ] C1-C3: Visual Accessibility Tests
- [ ] D1-D3: Responsive and Zoom Tests
- [ ] E1-E2: Motion and Animation Tests
- [ ] F1: Form Accessibility Tests
- [ ] G1: Live Region Tests
- [ ] H1-H2: Automated Testing
- [ ] I: Browser Compatibility Tests
- [ ] J1-J2: Mobile Accessibility Tests

## **Regression Testing**

After any code changes, re-run:
1. Automated axe-core scan
2. Keyboard navigation test (A1-A4)
3. Screen reader navigation test (B1)
4. Focus indicator verification (C2)

**Note:** This test suite should be integrated into CI/CD pipeline for continuous accessibility compliance.