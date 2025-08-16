/**
 * Core functionality - Loaded immediately
 * Handles critical features: theme toggle, navigation
 */

(function() {
    'use strict';
    
    // Theme Management - Critical for preventing flash
    const ThemeManager = {
        init() {
            const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            const toggle = document.querySelector('[data-theme-toggle]');
            if (toggle) {
                toggle.addEventListener('click', () => this.toggleTheme());
                this.updateToggleState(savedTheme);
            }
        },
        
        toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('portfolio-theme', next);
            this.updateToggleState(next);
        },
        
        updateToggleState(theme) {
            const toggle = document.querySelector('[data-theme-toggle]');
            if (!toggle) return;
            
            const isDark = theme === 'dark';
            toggle.setAttribute('aria-pressed', isDark.toString());
            
            const text = toggle.querySelector('.theme-toggle-text');
            if (text) text.textContent = isDark ? 'Light' : 'Dark';
            
            // Update icon
            const svg = isDark ? 
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' :
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
            
            const iconContainer = toggle.querySelector('svg')?.parentElement;
            if (iconContainer) {
                iconContainer.innerHTML = svg + '<span class="theme-toggle-text">' + (isDark ? 'Light' : 'Dark') + '</span>';
            }
        }
    };
    
    // Smooth scroll for navigation
    const Navigation = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        const offset = 80; // Header height
                        const top = target.offsetTop - offset;
                        
                        window.scrollTo({
                            top: top,
                            behavior: 'smooth'
                        });
                        
                        // Update URL without jumping
                        history.pushState(null, null, targetId);
                    }
                });
            });
            
            // Active section highlighting
            this.observeSections();
        },
        
        observeSections() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('nav a[href^="#"]');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach(link => {
                            link.classList.toggle('nav__link--active', 
                                link.getAttribute('href') === `#${id}`);
                        });
                    }
                });
            }, {
                rootMargin: '-50% 0px -50% 0px'
            });
            
            sections.forEach(section => observer.observe(section));
        }
    };
    
    // Initialize core features immediately
    ThemeManager.init();
    
    // Initialize navigation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Navigation.init());
    } else {
        Navigation.init();
    }
    
})();