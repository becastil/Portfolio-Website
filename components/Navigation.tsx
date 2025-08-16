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
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null)

  // Handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle mobile menu interactions
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

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
        'sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border transition-all duration-300',
        isScrolled && 'shadow-sm'
      )}
      role="banner"
    >
      <div className="container">
        <nav className="flex items-center justify-between py-4 min-h-[4rem]">
          <Link 
            href="/" 
            className="text-xl font-bold text-text-primary hover:text-accent-text transition-colors"
            aria-label="Ben Castillo - Home"
          >
            BC
          </Link>
          
          <div className="flex items-center gap-8">
            <ul className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-medium text-text-secondary hover:text-accent-text transition-colors py-2 px-4 rounded-md hover:bg-surface-hover"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button
              ref={mobileButtonRef}
              onClick={toggleMobileMenu}
              className="md:hidden touch-target p-2 rounded-md text-text-secondary hover:text-accent-text hover:bg-surface-hover transition-colors"
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
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.1,
                          duration: 0.3
                        }}
                      >
                        <Link
                          ref={index === 0 ? firstMenuItemRef : undefined}
                          href={link.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            "block w-full px-4 py-3 text-left font-medium text-text-secondary",
                            "hover:text-accent-text hover:bg-surface-hover",
                            "focus:text-accent-text focus:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent-focus focus:ring-offset-2 focus:ring-offset-surface",
                            "rounded-lg transition-colors duration-200",
                            "touch-target"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
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
    </header>
  )
}