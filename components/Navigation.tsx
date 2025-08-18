'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { navLinks } from '@/lib/constants'
import { cn } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [lastAnnouncedSection, setLastAnnouncedSection] = useState('')
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // Enhanced scroll state and active section detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Intersection Observer for active section detection
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          setActiveSection(sectionId)
          
          // Announce section changes for screen readers (with throttling)
          if (sectionId !== lastAnnouncedSection && sectionId) {
            setLastAnnouncedSection(sectionId)
            if (statusRef.current) {
              const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
              statusRef.current.textContent = `Now viewing ${sectionName} section`
            }
          }
        }
      })
    }, observerOptions)

    // Observe sections
    const sections = ['hero', 'about', 'projects', 'contact']
    sections.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [lastAnnouncedSection])

  // Handle mobile menu interactions with accessibility announcements
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => {
      const newState = !prev
      // Announce menu state change
      if (statusRef.current) {
        statusRef.current.textContent = newState ? 'Mobile menu opened' : 'Mobile menu closed'
      }
      return newState
    })
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
    if (statusRef.current) {
      statusRef.current.textContent = 'Mobile menu closed'
    }
  }, [])

  // Enhanced smooth scrolling with focus management
  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      // Close mobile menu first
      if (isMobileMenuOpen) {
        closeMobileMenu()
      }
      
      // Smooth scroll with focus management
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      
      // Set focus after scroll completes (with delay for smooth scroll)
      setTimeout(() => {
        // Try to focus the first focusable element in the target section
        const focusTarget = targetElement.querySelector('h1, h2, h3, [tabindex="0"], button, [href]') as HTMLElement
        if (focusTarget) {
          focusTarget.focus()
        } else {
          // Fallback: make the section itself focusable and focus it
          targetElement.setAttribute('tabindex', '-1')
          targetElement.focus()
          targetElement.style.outline = 'none'
        }
      }, 650) // Slightly longer than typical smooth scroll duration
    }
  }, [isMobileMenuOpen, closeMobileMenu])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu()
        mobileButtonRef.current?.focus()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
      // Focus first menu item when menu opens
      setTimeout(() => {
        firstMenuItemRef.current?.focus()
      }, 100)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen, closeMobileMenu])

  // Focus trap for mobile menu
  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = mobileMenuRef.current?.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }, [])

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 bg-[color:var(--panel)]/80 backdrop-blur-md border-b border-[color:var(--border)] transition-all duration-300',
        isScrolled && 'bg-[color:var(--panel)]/90 shadow-sm'
      )}
      data-scrolled={isScrolled}
      role="banner"
    >
      <div className="container">
        <nav className="flex items-center justify-between py-4 min-h-[4rem]">
          <Link 
            href="/" 
            className="text-xl font-bold text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] rounded transition-colors duration-200"
            aria-label="Ben Castillo - Home"
          >
            BC
          </Link>
          
          <div className="flex items-center gap-8">
            <ul className="hidden md:flex items-center gap-4" role="navigation" aria-label="Main navigation">
              {navLinks.map(link => {
                const isActive = activeSection === link.href.replace('#', '')
                return (
                  <li key={link.href}>
                    {link.label === 'Contact' ? (
                      <Link
                        href={link.href}
                        onClick={(e) => handleSmoothScroll(e, link.href)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          "inline-flex items-center rounded-xl px-4 py-2 font-medium shadow-sm transition duration-200 ease-[cubic-bezier(.2,.6,0,1)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2",
                          isActive 
                            ? "bg-[color:var(--accent)] text-[color:var(--accent-ink)] ring-2 ring-[color:var(--accent)]/20"
                            : "bg-[color:var(--accent)] text-[color:var(--accent-ink)] hover:brightness-110"
                        )}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={(e) => handleSmoothScroll(e, link.href)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          "font-medium px-3 py-2 rounded-md transition-colors duration-200 ease-[cubic-bezier(.2,.6,0,1)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]",
                          isActive
                            ? "text-[color:var(--accent)] bg-[color:var(--surface)] shadow-sm"
                            : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
                        )}
                      >
                        {link.label}
                        {isActive && (
                          <span className="sr-only"> (current section)</span>
                        )}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
            
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button
              ref={mobileButtonRef}
              onClick={toggleMobileMenu}
              className="md:hidden touch-target p-2 rounded-md text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors duration-200 ease-[cubic-bezier(.2,.6,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <motion.svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                animate={isMobileMenuOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 90 },
                  closed: { rotate: 0 }
                }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </motion.svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            
            {/* Mobile menu */}
            <motion.div
              ref={mobileMenuRef}
              id="mobile-menu"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 0.8
              }}
              className="fixed top-20 left-4 right-4 bg-surface border border-border rounded-xl shadow-lg z-50 md:hidden"
              onKeyDown={handleMenuKeyDown}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="p-6">
                <nav role="navigation" aria-label="Mobile navigation">
                  <ul className="space-y-1">
                    {navLinks.map((link, index) => {
                      const isActive = activeSection === link.href.replace('#', '')
                      return (
                        <motion.li
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: index * 0.1,
                            duration: 0.3
                          }}
                        >
                          {link.label === 'Contact' ? (
                            <Link
                              ref={index === 0 ? firstMenuItemRef : undefined}
                              href={link.href}
                              onClick={(e) => {
                                handleSmoothScroll(e, link.href)
                                closeMobileMenu()
                              }}
                              aria-current={isActive ? 'page' : undefined}
                              className={cn(
                                "block w-full px-4 py-3 text-center font-medium",
                                "rounded-xl shadow-sm transition duration-200 ease-[cubic-bezier(.2,.6,0,1)]",
                                "focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:ring-offset-2 focus:ring-offset-surface",
                                "touch-target",
                                isActive 
                                  ? "bg-[color:var(--accent)] text-[color:var(--accent-ink)] ring-2 ring-[color:var(--accent)]/20"
                                  : "bg-[color:var(--accent)] text-[color:var(--accent-ink)] hover:brightness-110"
                              )}
                            >
                              {link.label}
                              {isActive && (
                                <span className="sr-only"> (current section)</span>
                              )}
                            </Link>
                          ) : (
                            <Link
                              ref={index === 0 ? firstMenuItemRef : undefined}
                              href={link.href}
                              onClick={(e) => {
                                handleSmoothScroll(e, link.href)
                                closeMobileMenu()
                              }}
                              aria-current={isActive ? 'page' : undefined}
                              className={cn(
                                "block w-full px-4 py-3 text-left font-medium",
                                "rounded-lg transition-colors duration-200 ease-[cubic-bezier(.2,.6,0,1)]",
                                "focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:ring-offset-2 focus:ring-offset-surface",
                                "touch-target",
                                isActive
                                  ? "text-[color:var(--accent)] bg-[color:var(--surface)] shadow-sm"
                                  : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
                              )}
                            >
                              {link.label}
                              {isActive && (
                                <span className="sr-only"> (current section)</span>
                              )}
                            </Link>
                          )}
                        </motion.li>
                      )
                    })}
                  </ul>
                  
                  {/* Mobile theme toggle */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: navLinks.length * 0.1,
                      duration: 0.3
                    }}
                    className="mt-6 pt-4 border-t border-border"
                  >
                    <div className="flex items-center justify-between px-4">
                      <span className="text-sm font-medium text-text-secondary">
                        Theme
                      </span>
                      <ThemeToggle />
                    </div>
                  </motion.div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* ARIA live region for accessibility announcements */}
      <div
        ref={statusRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />
    </header>
  )
}