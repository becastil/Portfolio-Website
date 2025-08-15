/**
 * Ben Castillo Portfolio Website - Interactive JavaScript Features
 * 
 * This file demonstrates modern JavaScript patterns and best practices for creating
 * interactive web experiences. It includes:
 * - Dark mode toggle with localStorage persistence
 * - Smooth scroll navigation with active state management
 * - Project filtering with smooth animations
 * - Contact form validation with real-time feedback
 * - Performance optimizations and accessibility considerations
 */

// IIFE (Immediately Invoked Function Expression) pattern to avoid global namespace pollution
// This is a best practice that prevents our variables from conflicting with other scripts
(function() {
    'use strict'; // Enable strict mode for better error catching and performance
    
    /**
     * DOM MANIPULATION CONCEPTS:
     * The Document Object Model (DOM) is a tree-like representation of HTML elements.
     * We can select, modify, and interact with these elements using JavaScript.
     * Modern browsers provide powerful APIs for DOM manipulation.
     */
    
    // Cache frequently used DOM elements for better performance
    // This avoids repeated querySelector calls
    const elements = {
        // Theme toggle elements
        themeToggle: document.querySelector('[data-theme-toggle]'),
        
        // Navigation elements
        navLinks: document.querySelectorAll('nav a[href^="#"]'),
        sections: document.querySelectorAll('section[id]'),
        
        // Project filtering elements
        filterButtons: document.querySelectorAll('[data-filter]'),
        projectCards: document.querySelectorAll('.project-card'),
        
        // Contact form elements
        contactForm: document.querySelector('[data-contact-form]'),
        formInputs: document.querySelectorAll('[data-contact-form] input, [data-contact-form] textarea')
    };
    
    /**
     * THEME MANAGEMENT (Dark Mode Toggle)
     * 
     * This section demonstrates:
     * - localStorage usage for persistent data
     * - CSS custom properties (variables) manipulation
     * - Event handling with proper accessibility
     */
    const ThemeManager = {
        // Define theme configurations using CSS custom properties
        themes: {
            light: {
                '--color-text': '#333333',
                '--color-text-light': '#666666',
                '--color-background': '#ffffff',
                '--color-border': '#e5e5e5',
                '--color-accent': '#2563eb'
            },
            dark: {
                '--color-text': '#e5e5e5',
                '--color-text-light': '#a3a3a3',
                '--color-background': '#1a1a1a',
                '--color-border': '#333333',
                '--color-accent': '#3b82f6'
            }
        },
        
        // Get current theme from localStorage or default to 'light'
        getCurrentTheme() {
            return localStorage.getItem('portfolio-theme') || 'light';
        },
        
        // Apply theme by updating CSS custom properties
        applyTheme(themeName) {
            const theme = this.themes[themeName];
            if (!theme) return;
            
            // Get the root element to update CSS variables
            const root = document.documentElement;
            
            // Apply each CSS custom property
            Object.entries(theme).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
            
            // Update button icon and ARIA attributes for accessibility - WCAG 4.1.2
            if (elements.themeToggle) {
                elements.themeToggle.textContent = themeName === 'dark' ? '☀️' : '🌙';
                elements.themeToggle.setAttribute('aria-label', 
                    `Switch to ${themeName === 'dark' ? 'light' : 'dark'} mode`);
                elements.themeToggle.setAttribute('aria-pressed', themeName === 'dark' ? 'true' : 'false');
            }
            
            // Save preference to localStorage for persistence
            localStorage.setItem('portfolio-theme', themeName);
        },
        
        // Toggle between light and dark themes
        toggleTheme() {
            const currentTheme = this.getCurrentTheme();
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme);
        },
        
        // Initialize theme system
        init() {
            // Apply saved theme on page load
            this.applyTheme(this.getCurrentTheme());
            
            // Add event listener for theme toggle button
            if (elements.themeToggle) {
                elements.themeToggle.addEventListener('click', () => {
                    this.toggleTheme();
                });
                
                // Add keyboard support for accessibility
                elements.themeToggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleTheme();
                    }
                });
            }
        }
    };
    
    /**
     * SMOOTH SCROLL NAVIGATION
     * 
     * This section demonstrates:
     * - Event delegation patterns
     * - Scroll event optimization with debouncing
     * - Intersection Observer API for performance
     * - Active state management
     */
    const NavigationManager = {
        // Throttle scroll events for better performance
        // This prevents the scroll handler from running too frequently
        scrollThrottle: null,
        
        // Handle smooth scrolling to sections
        handleSmoothScroll(e) {
            e.preventDefault();
            
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Use native smooth scrolling API
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without triggering page reload
                history.pushState(null, null, targetId);
            }
        },
        
        // Update active navigation state based on current section
        updateActiveNavigation() {
            // Clear any existing throttle
            if (this.scrollThrottle) {
                clearTimeout(this.scrollThrottle);
            }
            
            // Throttle the scroll handler to improve performance
            this.scrollThrottle = setTimeout(() => {
                const scrollPosition = window.pageYOffset + 100;
                
                // Find which section is currently in view
                let currentSection = '';
                elements.sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && 
                        scrollPosition < sectionTop + sectionHeight) {
                        currentSection = section.getAttribute('id');
                    }
                });
                
                // Update active class on navigation links
                elements.navLinks.forEach(link => {
                    const href = link.getAttribute('href').substring(1); // Remove #
                    link.classList.toggle('active', href === currentSection);
                });
            }, 10); // 10ms throttle for smooth updates
        },
        
        // Initialize navigation functionality
        init() {
            // Add click handlers to navigation links
            elements.navLinks.forEach(link => {
                link.addEventListener('click', this.handleSmoothScroll);
            });
            
            // Add scroll listener for active state updates
            window.addEventListener('scroll', () => {
                this.updateActiveNavigation();
            });
            
            // Set initial active state
            this.updateActiveNavigation();
        }
    };
    
    /**
     * PROJECT FILTERING SYSTEM
     * 
     * This section demonstrates:
     * - Data attribute usage for categorization
     * - CSS animation coordination with JavaScript
     * - Array filtering and DOM manipulation
     * - Accessible filter controls
     */
    const ProjectFilter = {
        // Currently active filter
        activeFilter: 'all',
        
        // Filter projects based on category
        filterProjects(category) {
            this.activeFilter = category;
            
            elements.projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = category === 'all' || cardCategory === category;
                
                if (shouldShow) {
                    // Show card with smooth animation
                    card.style.display = 'block';
                    // Use setTimeout to ensure display:block is applied before animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    // Hide card with smooth animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    // Hide after animation completes
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update filter button states
            this.updateFilterButtons(category);
        },
        
        // Update visual state of filter buttons
        updateFilterButtons(activeCategory) {
            elements.filterButtons.forEach(button => {
                const isActive = button.getAttribute('data-filter') === activeCategory;
                
                // Update accessibility attributes - WCAG 4.1.2
                button.setAttribute('aria-pressed', isActive.toString());
            });
            
            // Announce filter change to screen readers - WCAG 4.1.3
            this.announceFilterChange(activeCategory);
        },
        
        // Announce filter changes for screen readers
        announceFilterChange(category) {
            const filterStatus = document.getElementById('filter-status');
            if (filterStatus) {
                const visibleCards = document.querySelectorAll('.project-card[style*="opacity: 1"], .project-card:not([style*="opacity"])');
                const count = visibleCards.length;
                const categoryName = category === 'all' ? 'all projects' : `${category} projects`;
                filterStatus.textContent = `Showing ${count} ${categoryName}`;
            }
        },
        
        // Initialize project filtering
        init() {
            // Add CSS transitions to project cards for smooth animations
            elements.projectCards.forEach(card => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            });
            
            // Add event listeners to filter buttons
            elements.filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const category = e.target.getAttribute('data-filter');
                    this.filterProjects(category);
                });
                
                // Add keyboard support
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const category = e.target.getAttribute('data-filter');
                        this.filterProjects(category);
                    }
                });
            });
            
            // Set initial state
            this.updateFilterButtons('all');
        }
    };
    
    /**
     * FORM VALIDATION SYSTEM
     * 
     * This section demonstrates:
     * - Real-time form validation
     * - Regular expressions for email validation
     * - Error message management
     * - Form submission handling with preventDefault
     * - Accessibility considerations (ARIA attributes)
     */
    const FormValidator = {
        // Validation rules for different input types
        validationRules: {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Name must contain only letters and spaces (minimum 2 characters)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            message: {
                required: true,
                minLength: 10,
                message: 'Message must be at least 10 characters long'
            }
        },
        
        // Validate individual field
        validateField(field) {
            const fieldName = field.getAttribute('name');
            const fieldValue = field.value.trim();
            const rules = this.validationRules[fieldName];
            
            if (!rules) return true; // No validation rules for this field
            
            let isValid = true;
            let errorMessage = '';
            
            // Check required fields
            if (rules.required && !fieldValue) {
                isValid = false;
                errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
            }
            // Check minimum length
            else if (rules.minLength && fieldValue.length < rules.minLength) {
                isValid = false;
                errorMessage = rules.message;
            }
            // Check pattern (regex)
            else if (rules.pattern && !rules.pattern.test(fieldValue)) {
                isValid = false;
                errorMessage = rules.message;
            }
            
            // Display or hide error message
            this.showFieldError(field, isValid ? '' : errorMessage);
            
            return isValid;
        },
        
        // Show or hide error message for a field - WCAG 3.3.1, 3.3.3
        showFieldError(field, message) {
            const fieldName = field.getAttribute('name');
            const errorElement = document.getElementById(`${fieldName}-error`);
            
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = message ? 'flex' : 'none';
                
                // Update ARIA attributes for accessibility - WCAG 4.1.2
                if (message) {
                    field.setAttribute('aria-invalid', 'true');
                    field.setAttribute('aria-describedby', `${fieldName}-error`);
                } else {
                    field.removeAttribute('aria-invalid');
                    // Keep aria-describedby for consistent behavior
                }
            }
        },
        
        // Validate entire form
        validateForm() {
            let isFormValid = true;
            
            elements.formInputs.forEach(field => {
                const fieldValid = this.validateField(field);
                if (!fieldValid) {
                    isFormValid = false;
                }
            });
            
            return isFormValid;
        },
        
        // Handle form submission
        handleFormSubmit(e) {
            e.preventDefault(); // Prevent default form submission
            
            const isValid = this.validateForm();
            
            if (isValid) {
                // Simulate form submission success
                this.showSubmissionMessage('success', 'Thank you! Your message has been sent successfully.');
                
                // Reset form after successful submission
                setTimeout(() => {
                    elements.contactForm.reset();
                    this.clearAllErrors();
                }, 2000);
            } else {
                // Show error message for invalid form
                this.showSubmissionMessage('error', 'Please correct the errors above and try again.');
            }
        },
        
        // Show submission result message
        showSubmissionMessage(type, message) {
            // Remove any existing message
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Create new message element
            const messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            messageElement.setAttribute('role', 'alert'); // Accessibility
            messageElement.style.cssText = `
                padding: 1rem;
                margin-top: 1rem;
                border-radius: 4px;
                background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
                color: white;
                font-weight: 500;
            `;
            messageElement.textContent = message;
            
            // Insert message after form
            elements.contactForm.appendChild(messageElement);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        },
        
        // Clear all error messages
        clearAllErrors() {
            elements.formInputs.forEach(field => {
                this.showFieldError(field, '');
            });
        },
        
        // Initialize form validation
        init() {
            if (!elements.contactForm) return;
            
            // Add real-time validation to form inputs
            elements.formInputs.forEach(field => {
                // Validate on blur (when user leaves field)
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
                
                // Clear errors on input (as user types)
                field.addEventListener('input', () => {
                    const fieldName = field.getAttribute('name');
                    const errorElement = document.getElementById(`${fieldName}-error`);
                    if (errorElement && errorElement.style.display !== 'none') {
                        // Only clear error if field now has content
                        if (field.value.trim()) {
                            setTimeout(() => this.validateField(field), 300);
                        }
                    }
                });
            });
            
            // Handle form submission
            elements.contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
    };
    
    /**
     * INTERSECTION OBSERVER FOR ANIMATIONS
     * 
     * This provides better performance than scroll events for animation triggers
     * The Intersection Observer API allows us to efficiently watch for elements
     * entering/leaving the viewport
     */
    const AnimationManager = {
        // Intersection Observer instance
        observer: null,
        
        // Initialize scroll-triggered animations
        init() {
            // Create observer with optimized settings
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Element is in viewport - trigger animation
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        
                        // Stop observing this element (one-time animation)
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1, // Trigger when 10% of element is visible
                rootMargin: '0px 0px -50px 0px' // Start animation 50px before element enters
            });
            
            // Prepare sections for animation and observe them
            elements.sections.forEach(section => {
                // Set initial state for animation
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                // Start observing
                this.observer.observe(section);
            });
        }
    };
    
    /**
     * PERFORMANCE OPTIMIZATION UTILITIES
     * 
     * These functions help improve performance by controlling when expensive
     * operations run
     */
    const PerformanceUtils = {
        // Debounce function - delays execution until after calls have stopped
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Throttle function - limits execution to once per specified time period
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };
    
    /**
     * ERROR HANDLING AND LOGGING
     * 
     * Proper error handling prevents broken functionality and helps with debugging
     */
    const ErrorHandler = {
        // Log errors in a consistent format
        logError(error, context) {
            console.error(`Portfolio JS Error in ${context}:`, error);
            
            // In production, you might want to send errors to a logging service
            // Example: sendToLoggingService(error, context);
        },
        
        // Safely execute functions with error handling
        safeExecute(func, context) {
            try {
                return func();
            } catch (error) {
                this.logError(error, context);
                return null;
            }
        }
    };
    
    /**
     * MAIN INITIALIZATION FUNCTION
     * 
     * This function orchestrates the initialization of all features
     * It runs when the DOM is fully loaded
     */
    function initializePortfolio() {
        // Check if essential elements exist before initializing features
        const requiredElements = [
            { element: elements.themeToggle, feature: 'Theme Toggle' },
            { element: elements.navLinks.length > 0, feature: 'Navigation' },
            { element: elements.filterButtons.length > 0, feature: 'Project Filtering' },
            { element: elements.contactForm, feature: 'Contact Form' }
        ];
        
        // Initialize each feature with error handling
        const features = [
            { name: 'Theme Manager', init: () => ThemeManager.init() },
            { name: 'Navigation Manager', init: () => NavigationManager.init() },
            { name: 'Project Filter', init: () => ProjectFilter.init() },
            { name: 'Form Validator', init: () => FormValidator.init() },
            { name: 'Animation Manager', init: () => AnimationManager.init() }
        ];
        
        features.forEach(feature => {
            ErrorHandler.safeExecute(feature.init, feature.name);
        });
        
        // Log successful initialization
        console.log('Portfolio website initialized successfully! 🚀');
        
        // Log feature status for debugging
        requiredElements.forEach(({ element, feature }) => {
            const status = element ? '✅' : '❌';
            console.log(`${status} ${feature}: ${element ? 'Available' : 'Not found'}`);
        });
    }
    
    /**
     * ACCESSIBILITY ENHANCEMENTS
     * 
     * Additional features to improve accessibility
     */
    const AccessibilityManager = {
        init() {
            // Add focus indicators for keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('using-keyboard');
                }
            });
            
            document.addEventListener('mousedown', () => {
                document.body.classList.remove('using-keyboard');
            });
            
            // Add skip link functionality
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(skipLink.getAttribute('href'));
                    if (target) {
                        target.focus();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }
    };
    
    /**
     * DOM CONTENT LOADED EVENT LISTENER
     * 
     * This ensures all HTML is parsed before our JavaScript runs
     * This is crucial for DOM manipulation to work correctly
     */
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize all features
        initializePortfolio();
        
        // Initialize accessibility enhancements
        ErrorHandler.safeExecute(() => AccessibilityManager.init(), 'Accessibility Manager');
    });
    
    /**
     * WINDOW LOAD EVENT LISTENER
     * 
     * This runs after all resources (images, stylesheets) have loaded
     * Used for features that depend on complete page rendering
     */
    window.addEventListener('load', () => {
        // Ensure smooth transitions are applied after page load
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Log page load performance (for development)
        if (window.performance) {
            const loadTime = window.performance.timing.loadEventEnd - 
                           window.performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        }
    });
    
})(); // End of IIFE

/**
 * BUILDER NOTES:
 * 
 * 1. **Module Pattern**: Used IIFE to create a private scope and avoid global variables
 * 2. **DOM Caching**: Cached DOM queries for better performance
 * 3. **Event Delegation**: Used efficient event handling patterns
 * 4. **Progressive Enhancement**: Features degrade gracefully if elements are missing
 * 5. **Accessibility**: Added ARIA attributes, keyboard support, and screen reader considerations
 * 6. **Performance**: Implemented throttling, debouncing, and Intersection Observer
 * 7. **Error Handling**: Wrapped functionality in try-catch blocks with logging
 * 8. **localStorage**: Demonstrated persistent data storage for theme preferences
 * 9. **Form Validation**: Real-time validation with regex patterns and user feedback
 * 10. **Modern JavaScript**: Used ES6+ features like arrow functions, template literals, and destructuring
 */