# Click-by-Click Test Scenarios - Ben Castillo Portfolio Website

## Table of Contents
1. [Page Load and Initial State Testing](#page-load-and-initial-state-testing)
2. [Dark Mode Toggle Testing](#dark-mode-toggle-testing)
3. [Navigation Testing](#navigation-testing)
4. [Project Filtering Testing](#project-filtering-testing)
5. [Contact Form Testing](#contact-form-testing)
6. [Responsive Design Testing](#responsive-design-testing)
7. [Keyboard Navigation Testing](#keyboard-navigation-testing)
8. [Mobile Menu Interactions](#mobile-menu-interactions)
9. [Accessibility Testing Scenarios](#accessibility-testing-scenarios)

---

## Page Load and Initial State Testing

### Scenario 1: Initial Page Load
**Objective**: Verify page loads correctly and displays all elements in default state

**Steps**:
1. **Open browser** → Navigate to `http://localhost:8000` (or live URL)
2. **Wait for complete page load** (watch network tab until all resources loaded)
3. **Verify page title** → Should display "Ben Castillo - Full-Stack Developer"
4. **Check viewport** → Ensure no horizontal scrolling at 1920px width
5. **Verify header visibility** → Header should be sticky at top
6. **Check logo** → "BC" logo should be visible and clickable
7. **Verify navigation** → "About", "Projects", "Contact" links visible
8. **Check theme toggle** → Moon icon (🌙) should be visible in top-right
9. **Verify hero section** → "Ben Castillo" heading and tagline visible
10. **Check projects section** → Filter buttons and project cards loaded
11. **Verify contact section** → Form fields and social links visible
12. **Check footer** → Copyright text should be present

**Expected Results**:
- Page loads within 3 seconds
- All sections visible without scrolling horizontally
- No console errors
- All images load properly
- Text is readable and properly sized

**Success Criteria**: ✅ All elements render correctly, no layout issues

---

## Dark Mode Toggle Testing

### Scenario 2: Dark Mode Activation
**Objective**: Test dark mode toggle functionality and visual changes

**Steps**:
1. **Locate theme toggle** → Find moon icon (🌙) in top-right corner of header
2. **Note current colors** → Record background (white), text (dark), borders (light gray)
3. **Click theme toggle** → Single left-click on moon icon
4. **Observe immediate changes**:
   - Icon changes from 🌙 to ☀️
   - Background color changes from white to dark (#111827)
   - Text color changes from dark to light (#f9fafb)
   - Border colors change to dark theme variants
5. **Verify button accessibility** → aria-pressed should change to "true"
6. **Check localStorage** → Open DevTools → Application → LocalStorage → Verify "portfolio-theme": "dark"
7. **Scroll through page** → Verify all sections adopt dark theme colors
8. **Check project cards** → Cards should have dark backgrounds with light text
9. **Verify form elements** → Input fields should have dark styling
10. **Test persistence** → Refresh page (F5) → Dark mode should remain active

**Expected Results**:
- Instant color scheme change (no flicker)
- All UI elements transition smoothly
- Theme preference persists after page refresh
- No accessibility violations
- Button icon and aria-label update correctly

**Success Criteria**: ✅ Dark mode activates properly and persists across sessions

### Scenario 3: Dark Mode Deactivation
**Objective**: Test returning to light mode from dark mode

**Steps**:
1. **Ensure dark mode active** → Page should have dark background with sun icon (☀️)
2. **Click theme toggle** → Single left-click on sun icon
3. **Observe immediate changes**:
   - Icon changes from ☀️ to 🌙
   - Background reverts to white (#ffffff)
   - Text reverts to dark colors
   - All elements return to light theme styling
4. **Verify localStorage** → "portfolio-theme" should be "light"
5. **Check aria-pressed** → Should be "false"
6. **Test page refresh** → Light mode should persist

**Expected Results**:
- Smooth transition back to light mode
- No visual artifacts or layout shifts
- Preference saves correctly
- All interactive elements work in light mode

**Success Criteria**: ✅ Light mode restoration works flawlessly

---

## Navigation Testing

### Scenario 4: Smooth Scroll Navigation
**Objective**: Test navigation menu smooth scrolling and active states

**Steps**:
1. **Start at top of page** → Scroll to very top (Y position = 0)
2. **Click "About" link** → Single left-click on "About" in navigation
3. **Observe scrolling behavior**:
   - Page should smoothly scroll to About section
   - Scrolling should take 800-1000ms
   - No jarring jumps or stuttering
4. **Check URL update** → URL should show "#about"
5. **Verify active state** → "About" link should have visual indicator (underline or color change)
6. **Check section visibility** → About section heading should be visible
7. **Click "Projects" link** → Single left-click on "Projects"
8. **Observe smooth scroll** → Should scroll to Projects section smoothly
9. **Verify filter buttons** → Project filter buttons should be visible
10. **Click "Contact" link** → Navigate to Contact section
11. **Check form visibility** → Contact form should be in viewport
12. **Test logo click** → Click "BC" logo → Should scroll back to top

**Expected Results**:
- Smooth scrolling animation (no jumps)
- Active navigation states update correctly
- URL updates appropriately
- Sections appear in viewport after navigation
- Logo returns to top of page

**Success Criteria**: ✅ All navigation links work with smooth scrolling

### Scenario 5: Navigation Active State Updates
**Objective**: Test automatic active state updates during manual scrolling

**Steps**:
1. **Start at page top** → No navigation item should be active
2. **Scroll slowly to About section** → Use mouse wheel or scroll bar
3. **Watch navigation** → "About" should become active when section is 100px in viewport
4. **Continue scrolling to Projects** → "About" deactivates, "Projects" activates
5. **Scroll to Contact section** → "Projects" deactivates, "Contact" activates
6. **Scroll back up slowly** → Active states should update in reverse order
7. **Test scroll threshold** → Active state should change when section is prominently visible

**Expected Results**:
- Active states update automatically during scroll
- Only one navigation item active at a time
- Transitions happen at logical scroll positions
- Visual feedback is clear and immediate

**Success Criteria**: ✅ Active navigation states track scroll position correctly

---

## Project Filtering Testing

### Scenario 6: All Projects Filter (Default State)
**Objective**: Test initial filter state and "All Projects" functionality

**Steps**:
1. **Navigate to Projects section** → Scroll to or click "Projects" navigation
2. **Locate filter buttons** → Four buttons should be visible: "All Projects", "Web Applications", "Mobile Apps", "Data Projects"
3. **Verify default state**:
   - "All Projects" button should have active styling (blue background, white text)
   - Button should have aria-pressed="true"
   - All 6 project cards should be visible
4. **Count visible projects** → Should see: E-Commerce Platform, Task Management App, Data Visualization Dashboard, Machine Learning Model, API Development, Open Source Contribution
5. **Check project layout** → Cards should be in grid formation
6. **Verify accessibility** → Filter status should announce "Showing 6 all projects"

**Expected Results**:
- All 6 project cards visible
- Default filter state clearly indicated
- Grid layout displays properly
- Accessibility announcements work

**Success Criteria**: ✅ Default "All Projects" state displays correctly

### Scenario 7: Web Applications Filter
**Objective**: Test filtering to show only web application projects

**Steps**:
1. **Ensure all projects visible** → Start with "All Projects" active
2. **Click "Web Applications" button** → Single left-click on button
3. **Observe animation sequence**:
   - Non-web projects fade out (opacity: 0)
   - Cards slide down (transform: translateY(20px))
   - After 300ms, hidden cards get display: none
   - Web projects remain visible with opacity: 1
4. **Count visible projects** → Should show 3 projects:
   - E-Commerce Platform
   - API Development  
   - Open Source Contribution
5. **Verify button states**:
   - "Web Applications" should be active (blue background)
   - Other buttons should be inactive (white background, blue border)
6. **Check accessibility announcement** → Should hear "Showing 3 web applications projects"
7. **Verify grid layout** → Remaining cards should reflow to fill space

**Expected Results**:
- Smooth fade-out animation for filtered projects
- 3 web application projects remain visible
- Button active state updates correctly
- Screen reader announcement is accurate
- Layout adjusts without jarring movements

**Success Criteria**: ✅ Web applications filter works with smooth animations

### Scenario 8: Mobile Apps Filter
**Objective**: Test mobile apps category filtering

**Steps**:
1. **Start from any filter state** → Current filter can be any option
2. **Click "Mobile Apps" button** → Single left-click
3. **Watch animation sequence**:
   - Current visible projects fade out if not mobile
   - Mobile projects fade in if previously hidden
   - Animation duration should be 300ms
4. **Verify single project shown** → Only "Task Management App" should be visible
5. **Check project details** → Should display React Native, Firebase, Redux, TypeScript tags
6. **Verify button state** → "Mobile Apps" active, others inactive
7. **Check accessibility** → "Showing 1 mobile apps projects" announcement
8. **Test grid behavior** → Single card should maintain proper spacing

**Expected Results**:
- Only Task Management App visible
- Smooth transition animation
- Button states update correctly
- Single project maintains proper layout
- Accessibility announcement accurate

**Success Criteria**: ✅ Mobile apps filter displays single project correctly

### Scenario 9: Data Projects Filter
**Objective**: Test data projects category filtering

**Steps**:
1. **Click "Data Projects" button** → Single left-click from any current state
2. **Observe filtering animation** → Non-data projects fade out, data projects remain/fade in
3. **Count visible projects** → Should show 2 projects:
   - Data Visualization Dashboard
   - Machine Learning Model
4. **Verify project content**:
   - Data Visualization: D3.js, Python, Flask, PostgreSQL tags
   - Machine Learning: Python, TensorFlow, Docker, AWS tags
5. **Check button state** → "Data Projects" active styling
6. **Verify accessibility** → "Showing 2 data projects" announcement
7. **Test layout** → Two cards should display in grid with proper spacing

**Expected Results**:
- Exactly 2 data projects visible
- Smooth animation transitions
- Proper grid layout maintained
- Correct accessibility feedback

**Success Criteria**: ✅ Data projects filter works correctly

### Scenario 10: Filter State Transitions
**Objective**: Test rapid filter switching and animation handling

**Steps**:
1. **Start with "All Projects" active** → All 6 projects visible
2. **Quickly click "Web Applications"** → Don't wait for animation
3. **Immediately click "Mobile Apps"** → Click before web filter completes
4. **Watch for animation conflicts** → Should not see glitchy animations
5. **Wait for final state** → Only mobile app should be visible
6. **Test rapid clicking sequence**:
   - Click "Data Projects" → Wait 100ms
   - Click "All Projects" → Wait 100ms  
   - Click "Web Applications" → Wait for completion
7. **Verify final state** → Should show 3 web applications
8. **Check for layout issues** → No cards should be partially visible or stuck
9. **Test accessibility** → Final announcement should be accurate

**Expected Results**:
- Animations handle rapid clicking gracefully
- No visual glitches or stuck states
- Final filter state displays correctly
- Accessibility announcements remain accurate

**Success Criteria**: ✅ Filter transitions handle rapid user input properly

---

## Contact Form Testing

### Scenario 11: Valid Form Submission
**Objective**: Test successful form submission with valid data

**Steps**:
1. **Navigate to Contact section** → Scroll to contact form
2. **Fill Name field**:
   - Click in "Name" input field
   - Type "John Doe"
   - Tab to next field
3. **Fill Email field**:
   - Should automatically focus after tabbing
   - Type "john.doe@example.com"
   - Tab to next field
4. **Fill Subject field (optional)**:
   - Type "Portfolio Inquiry"
   - Tab to next field
5. **Fill Message field**:
   - Click in textarea
   - Type "Hello Ben, I'm interested in discussing a potential project collaboration. Your portfolio looks impressive!"
6. **Verify character count** → Message should be 10+ characters
7. **Click Submit button** → Single left-click on "Send Message"
8. **Watch for success feedback**:
   - Green success message appears: "Thank you! Your message has been sent successfully."
   - Message has role="alert" for screen readers
   - Form fields remain filled during success message display
9. **Wait 2 seconds** → Form should auto-reset to empty state
10. **Verify form reset** → All fields should be empty and validation errors cleared

**Expected Results**:
- Form accepts valid input without errors
- Success message displays prominently
- Form auto-resets after successful submission
- No console errors during submission
- Accessibility announcements work

**Success Criteria**: ✅ Valid form submission works flawlessly

### Scenario 12: Name Field Validation
**Objective**: Test name field validation with various inputs

**Steps**:
1. **Focus Name field** → Click in name input
2. **Test empty submission**:
   - Leave field empty
   - Tab to next field or click Submit
   - Should show error: "Name is required"
   - Field should have red border and aria-invalid="true"
3. **Test single character**:
   - Type "A"
   - Tab out of field
   - Should show error: "Name must contain only letters and spaces (minimum 2 characters)"
4. **Test numbers in name**:
   - Clear field and type "John123"
   - Tab out
   - Should show error about letters and spaces only
5. **Test special characters**:
   - Clear and type "John@Doe"
   - Should show validation error
6. **Test valid input**:
   - Clear and type "María García-López"
   - Error should disappear
   - Field border returns to normal
   - aria-invalid attribute removed

**Expected Results**:
- Empty field shows required error
- Single character shows length error
- Numbers and special characters trigger pattern error
- Valid names with international characters accepted
- Visual feedback (borders, colors) updates correctly
- ARIA attributes update for screen readers

**Success Criteria**: ✅ Name validation catches all invalid inputs

### Scenario 13: Email Field Validation
**Objective**: Test email field validation patterns

**Steps**:
1. **Focus Email field** → Click in email input
2. **Test empty field**:
   - Leave empty and tab out
   - Should show "Email is required"
3. **Test invalid formats**:
   - Type "invalid" → Tab out → Should show "Please enter a valid email address"
   - Clear and type "test@" → Should show validation error
   - Clear and type "@domain.com" → Should show validation error
   - Clear and type "test..test@domain.com" → Should show validation error
4. **Test valid formats**:
   - Clear and type "test@example.com" → Should accept
   - Clear and type "user+tag@domain.co.uk" → Should accept
   - Clear and type "name.lastname@company-name.org" → Should accept
5. **Test real-time validation**:
   - Start typing "test@exa"
   - Should not show error while typing
   - Complete to "test@example.com"
   - Error should clear immediately

**Expected Results**:
- All invalid email formats rejected with helpful message
- Valid email formats accepted without errors
- Real-time validation doesn't interfere with typing
- Visual feedback updates appropriately

**Success Criteria**: ✅ Email validation accurately identifies valid/invalid formats

### Scenario 14: Message Field Validation
**Objective**: Test message textarea validation and character requirements

**Steps**:
1. **Focus Message field** → Click in textarea
2. **Test empty message**:
   - Leave empty and try to submit form
   - Should show "Message is required"
3. **Test short message**:
   - Type "Hi"
   - Tab out of field
   - Should show "Message must be at least 10 characters long"
4. **Test exactly 10 characters**:
   - Clear and type "Hello Ben!" (10 chars)
   - Should accept without error
5. **Test long message**:
   - Type a message longer than 500 characters
   - Should accept without issues
   - Textarea should expand vertically
6. **Test only spaces**:
   - Clear and type "          " (only spaces)
   - Should show required field error

**Expected Results**:
- Messages under 10 characters rejected
- Exactly 10 characters accepted
- Long messages handled properly
- Spaces-only input treated as empty
- Textarea resizes appropriately

**Success Criteria**: ✅ Message validation enforces minimum length correctly

### Scenario 15: Form Error State Recovery
**Objective**: Test form recovery from error states

**Steps**:
1. **Create multiple errors**:
   - Leave Name empty
   - Enter invalid email "test@"
   - Leave Message empty
   - Click Submit
2. **Verify error display**:
   - All three fields should show errors
   - Fields should have red borders
   - Error messages should be visible
3. **Fix errors one by one**:
   - Type valid name "John Doe"
   - Watch error disappear immediately
   - Type valid email "john@example.com"
   - Email error should clear
   - Type valid message "This is a test message for validation"
   - Message error should clear
4. **Submit corrected form** → Should submit successfully
5. **Test error persistence**:
   - Create an error state
   - Navigate away and back to contact section
   - Errors should still be visible until corrected

**Expected Results**:
- Multiple errors display simultaneously
- Errors clear individually as fields are corrected
- Form submits successfully after all errors resolved
- Error states persist during navigation

**Success Criteria**: ✅ Form error recovery works intuitively

---

## Responsive Design Testing

### Scenario 16: Mobile Portrait Layout (375px width)
**Objective**: Test layout adaptation for mobile devices

**Steps**:
1. **Open browser DevTools** → Press F12
2. **Enable device simulation** → Click device icon in DevTools
3. **Set to iPhone SE** → 375px × 667px portrait
4. **Refresh page** → Reload to trigger responsive breakpoints
5. **Test header**:
   - Logo should remain visible
   - Navigation menu should be horizontal but compact
   - Theme toggle should maintain 44px minimum touch target
6. **Check hero section**:
   - Heading should be smaller but readable
   - Text should wrap appropriately
   - No horizontal overflow
7. **Test Projects section**:
   - Filter buttons should wrap to multiple lines if needed
   - Project cards should stack in single column
   - Cards should maintain proper spacing
8. **Verify Contact form**:
   - Form should be full width with proper padding
   - Input fields should be touch-friendly (min 44px height)
   - Submit button should be appropriately sized
9. **Check touch targets** → All interactive elements ≥ 44px × 44px
10. **Test scrolling** → Should be smooth without horizontal scroll

**Expected Results**:
- Single column layout for all content
- No horizontal scrolling
- Touch targets meet accessibility guidelines
- Text remains readable
- Proper spacing maintained

**Success Criteria**: ✅ Mobile layout displays properly without usability issues

### Scenario 17: Tablet Layout (768px width)
**Objective**: Test tablet breakpoint layout changes

**Steps**:
1. **Set viewport to 768px × 1024px** → Use DevTools device simulation
2. **Test header layout**:
   - Navigation should remain horizontal
   - Spacing should be comfortable for touch
3. **Check Projects grid**:
   - Should display 2 columns of project cards
   - Cards should be properly sized and spaced
4. **Test form layout**:
   - Contact form should have balanced width
   - Form controls should be appropriately sized
5. **Verify typography**:
   - Font sizes should be between mobile and desktop
   - Line heights should remain readable
6. **Test landscape orientation** → Rotate to 1024px × 768px:
   - Layout should adapt appropriately
   - No content cutoff or overflow

**Expected Results**:
- Two-column project grid displays correctly
- Touch-friendly interface elements
- Good use of available screen space
- Smooth transition between orientations

**Success Criteria**: ✅ Tablet layout optimizes screen real estate effectively

### Scenario 18: Desktop Layout (1920px width)
**Objective**: Test large desktop display optimization

**Steps**:
1. **Set viewport to 1920px × 1080px** → Full desktop size
2. **Test content width**:
   - Main content should have maximum width constraint
   - Content should be centered with appropriate margins
3. **Check Projects grid**:
   - Should display 3 columns of project cards
   - Grid should not stretch excessively wide
4. **Test navigation**:
   - Header should remain sticky
   - Navigation spacing should be comfortable
5. **Verify typography**:
   - Text should be large enough for comfortable reading
   - Line lengths should not exceed 65-75 characters
6. **Check interactive elements**:
   - Hover effects should work properly
   - Focus states should be visible
7. **Test zoom levels**:
   - 125% zoom: Layout should remain functional
   - 150% zoom: No horizontal scroll at 1280px browser width

**Expected Results**:
- Three-column project layout
- Centered content with proper max-width
- Excellent readability and usability
- Hover and focus states work correctly

**Success Criteria**: ✅ Desktop layout provides optimal user experience

---

## Keyboard Navigation Testing

### Scenario 19: Tab Order and Focus Management
**Objective**: Test complete keyboard navigation flow

**Steps**:
1. **Load page** → Press Ctrl+L to focus address bar, then Tab to enter page
2. **First Tab** → Should focus skip link ("Skip to main content")
   - Press Enter to test skip link functionality
   - Should jump to main content area
3. **Continue tabbing through header**:
   - Tab 1: BC logo (should have focus indicator)
   - Tab 2: "About" navigation link
   - Tab 3: "Projects" navigation link  
   - Tab 4: "Contact" navigation link
   - Tab 5: Theme toggle button
4. **Tab through Projects section**:
   - Tab to "All Projects" filter button
   - Tab to "Web Applications" button
   - Tab to "Mobile Apps" button
   - Tab to "Data Projects" button
   - Project cards should not be focusable (they're not interactive)
5. **Tab through Contact form**:
   - Tab to Name input field
   - Tab to Email input field
   - Tab to Subject input field
   - Tab to Message textarea
   - Tab to Submit button
6. **Tab through footer**:
   - Tab to social media links (if any)
7. **Test Shift+Tab** → Should reverse tab order correctly

**Expected Results**:
- Logical tab order follows visual layout
- All interactive elements focusable
- Clear focus indicators visible
- Skip link works properly
- Reverse tabbing works correctly

**Success Criteria**: ✅ Keyboard navigation follows logical flow

### Scenario 20: Keyboard Interaction Testing
**Objective**: Test keyboard activation of interactive elements

**Steps**:
1. **Test theme toggle**:
   - Tab to theme toggle button
   - Press Enter → Should toggle dark mode
   - Press Space → Should also toggle dark mode
2. **Test navigation links**:
   - Tab to "About" link
   - Press Enter → Should smooth scroll to About section
   - Verify focus moves to section heading (if implemented)
3. **Test filter buttons**:
   - Tab to "Web Applications" button
   - Press Enter → Should filter projects
   - Press Space → Should also activate filter
   - Verify screen reader announcement
4. **Test form submission**:
   - Fill out contact form using only keyboard
   - Tab to Submit button
   - Press Enter → Should submit form
5. **Test logo navigation**:
   - Tab to "BC" logo
   - Press Enter → Should return to top of page

**Expected Results**:
- Enter and Space keys activate buttons
- Navigation works with Enter key
- Form submission works via keyboard
- Focus indicators always visible
- Screen reader announcements work

**Success Criteria**: ✅ All interactive elements work with keyboard input

### Scenario 21: Focus Trap Testing (if modal dialogs exist)
**Objective**: Test focus management in modal contexts

**Note**: This scenario applies if any modal dialogs or overlay components are added

**Steps**:
1. **Trigger modal** → Use keyboard to open any modal dialog
2. **Test focus trap**:
   - Tab through modal elements
   - At last element, Tab should cycle to first modal element
   - Shift+Tab from first element should go to last modal element
3. **Test escape key** → Pressing Escape should close modal
4. **Test focus return** → Focus should return to element that opened modal

**Expected Results**:
- Focus stays within modal
- Tab cycling works correctly
- Escape key closes modal
- Focus returns to opener

**Success Criteria**: ✅ Modal focus management works properly (if applicable)

---

## Mobile Menu Interactions

### Scenario 22: Mobile Menu Behavior (if hamburger menu exists)
**Objective**: Test mobile navigation menu functionality

**Note**: Current design uses horizontal menu even on mobile. This scenario is for potential hamburger menu implementation.

**Steps**:
1. **Set mobile viewport** → 375px width in DevTools
2. **Check for hamburger menu** → Look for three-line menu icon
3. **If hamburger menu exists**:
   - Tap hamburger icon
   - Menu should slide in or drop down
   - Navigation links should be stacked vertically
   - Tap outside menu area → Should close menu
   - Tap menu item → Should navigate and close menu

**Expected Results**:
- Smooth menu animation
- Touch-friendly menu items
- Proper menu dismissal
- Navigation works from mobile menu

**Success Criteria**: ✅ Mobile menu provides good user experience (if implemented)

### Scenario 23: Touch Interaction Testing
**Objective**: Test touch-specific interactions on mobile devices

**Steps**:
1. **Use mobile device or touch simulation** → Enable touch mode in DevTools
2. **Test touch targets**:
   - All buttons should be minimum 44px × 44px
   - Adequate spacing between touch targets
3. **Test touch gestures**:
   - Tap theme toggle → Should respond immediately
   - Tap filter buttons → Should activate without delay
   - Tap form fields → Should focus and show keyboard
4. **Test scroll behavior**:
   - Touch scroll should be smooth
   - No accidental activations during scroll
   - Momentum scrolling should work naturally
5. **Test hover alternatives**:
   - On touch devices, tap project cards
   - Should provide visual feedback
   - No reliance on hover states for functionality

**Expected Results**:
- All touch targets appropriately sized
- Immediate response to touch
- Smooth scrolling experience
- No dependency on hover states

**Success Criteria**: ✅ Touch interactions work intuitively

---

## Accessibility Testing Scenarios

### Scenario 24: Screen Reader Navigation
**Objective**: Test screen reader compatibility and navigation

**Prerequisites**: Install NVDA (Windows) or enable VoiceOver (macOS)

**Steps**:
1. **Start screen reader** → Launch NVDA or enable VoiceOver
2. **Navigate by headings**:
   - Use H key (NVDA) or Control+Option+Command+H (VoiceOver)
   - Should hear: "Ben Castillo heading level 1"
   - Continue: "About heading level 2", "Projects heading level 2", "Get In Touch heading level 2"
3. **Navigate by landmarks**:
   - Use D key (NVDA) for landmarks
   - Should hear: "banner", "main", "contentinfo"
4. **Test form navigation**:
   - Navigate to contact form
   - Each field should announce label and required status
   - Error messages should be announced when present
5. **Test dynamic content**:
   - Activate project filter
   - Should hear filter status announcement
   - Theme toggle should announce current state

**Expected Results**:
- Clear heading hierarchy
- Proper landmark identification
- Form labels and requirements announced
- Dynamic content changes announced
- Navigation shortcuts work properly

**Success Criteria**: ✅ Screen reader navigation is logical and informative

### Scenario 25: High Contrast Mode Testing
**Objective**: Test visibility in high contrast mode

**Steps**:
1. **Enable high contrast mode**:
   - Windows: Settings → Ease of Access → High Contrast
   - macOS: System Preferences → Accessibility → Display → Increase Contrast
2. **Test color combinations**:
   - Text should remain readable
   - Borders should be visible
   - Focus indicators should be prominent
3. **Test interactive elements**:
   - Button borders should be visible
   - Form field boundaries should be clear
   - Active states should be distinguishable
4. **Check custom styling**:
   - CSS should adapt to high contrast preferences
   - No information conveyed by color alone

**Expected Results**:
- All text remains readable
- Interactive elements clearly defined
- Focus states highly visible
- No reliance on color alone for information

**Success Criteria**: ✅ High contrast mode maintains usability

### Scenario 26: Reduced Motion Testing
**Objective**: Test experience with reduced motion preferences

**Steps**:
1. **Enable reduced motion**:
   - Windows: Settings → Ease of Access → Display → Show animations
   - macOS: System Preferences → Accessibility → Display → Reduce motion
2. **Test animations**:
   - Page load animations should be minimal or disabled
   - Project filter animations should be reduced
   - Smooth scrolling should respect preference
3. **Test transitions**:
   - Hover effects should still provide feedback
   - Focus indicators should remain visible
   - Essential animations may remain but be faster

**Expected Results**:
- Non-essential animations disabled
- Essential feedback preserved
- No motion sickness triggers
- Interface remains functional

**Success Criteria**: ✅ Reduced motion preferences respected

This comprehensive click-by-click guide ensures thorough testing of all interactive elements and user scenarios. Each test includes specific actions, expected outcomes, and success criteria for consistent evaluation.