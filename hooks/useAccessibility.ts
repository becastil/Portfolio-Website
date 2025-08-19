'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for enhanced accessibility features
 * Provides utilities for focus management, announcements, and keyboard navigation
 */
export function useAccessibility() {
  const announcementRef = useRef<HTMLDivElement>(null)

  /**
   * Announce a message to screen readers
   * @param message - The message to announce
   * @param priority - 'polite' (default) or 'assertive'
   */
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Try to find existing status element first
    let statusElement = document.querySelector(`[aria-live="${priority}"][role="status"]`) as HTMLElement
    
    if (!statusElement) {
      // Create a new status element if none exists
      statusElement = document.createElement('div')
      statusElement.setAttribute('aria-live', priority)
      statusElement.setAttribute('aria-atomic', 'true')
      statusElement.setAttribute('role', 'status')
      statusElement.className = 'sr-only'
      document.body.appendChild(statusElement)
    }
    
    // Clear previous message
    statusElement.textContent = ''
    
    // Set new message after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      statusElement.textContent = message
    }, 100)
    
    // Clear the message after it's been announced
    setTimeout(() => {
      if (statusElement.textContent === message) {
        statusElement.textContent = ''
      }
    }, 5000)
  }, [])

  /**
   * Enhanced focus management for smooth scrolling
   * @param targetId - The ID of the element to scroll to and focus
   */
  const focusAfterScroll = useCallback((targetId: string) => {
    const targetElement = document.getElementById(targetId)
    
    if (!targetElement) return
    
    // Smooth scroll with focus management
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    
    // Set focus after scroll completes
    setTimeout(() => {
      // Try to focus the first focusable element in the target section
      const focusableSelectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        '[tabindex="0"]', 
        'button:not([disabled])', 
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])'
      ]
      
      const focusTarget = targetElement.querySelector(focusableSelectors.join(', ')) as HTMLElement
      
      if (focusTarget) {
        focusTarget.focus()
      } else {
        // Fallback: make the section itself focusable and focus it
        targetElement.setAttribute('tabindex', '-1')
        targetElement.focus()
        targetElement.style.outline = 'none'
        
        // Remove the tabindex after focus is lost
        const removeFocusHandler = () => {
          targetElement.removeAttribute('tabindex')
          targetElement.removeEventListener('blur', removeFocusHandler)
        }
        targetElement.addEventListener('blur', removeFocusHandler)
      }
      
      // Announce the section change
      const sectionName = targetId.charAt(0).toUpperCase() + targetId.slice(1)
      announceToScreenReader(`Navigated to ${sectionName} section`)
    }, 650) // Slightly longer than typical smooth scroll duration
  }, [announceToScreenReader])

  /**
   * Handle keyboard navigation with arrow keys
   * @param elements - Array of elements to navigate between
   * @param currentIndex - Current focused element index
   * @param orientation - 'horizontal' or 'vertical' navigation
   */
  const handleArrowKeyNavigation = useCallback((
    elements: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ) => {
    return (event: KeyboardEvent) => {
      const { key } = event
      
      let nextIndex = currentIndex
      
      if (orientation === 'horizontal') {
        if (key === 'ArrowLeft' || key === 'ArrowUp') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1
          event.preventDefault()
        } else if (key === 'ArrowRight' || key === 'ArrowDown') {
          nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0
          event.preventDefault()
        }
      } else {
        if (key === 'ArrowUp') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1
          event.preventDefault()
        } else if (key === 'ArrowDown') {
          nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0
          event.preventDefault()
        }
      }
      
      if (key === 'Home') {
        nextIndex = 0
        event.preventDefault()
      } else if (key === 'End') {
        nextIndex = elements.length - 1
        event.preventDefault()
      }
      
      if (nextIndex !== currentIndex && elements[nextIndex]) {
        elements[nextIndex].focus()
      }
    }
  }, [])

  /**
   * Focus trap utility for modals and dropdowns
   * @param containerElement - The container to trap focus within
   */
  const trapFocus = useCallback((containerElement: HTMLElement) => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ]
    
    const focusableElements = containerElement.querySelectorAll(
      focusableSelectors.join(', ')
    ) as NodeListOf<HTMLElement>
    
    if (focusableElements.length === 0) return () => {}
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
      
      if (event.key === 'Escape') {
        // Let parent handle escape key
        event.stopPropagation()
      }
    }
    
    containerElement.addEventListener('keydown', handleKeyDown)
    
    // Focus the first element
    firstElement.focus()
    
    // Return cleanup function
    return () => {
      containerElement.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  /**
   * Detect if user prefers reduced motion
   */
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  /**
   * Detect if user prefers high contrast
   */
  const prefersHighContrast = useCallback(() => {
    return window.matchMedia('(prefers-contrast: high)').matches
  }, [])

  /**
   * Get appropriate scroll behavior based on user preferences
   */
  const getScrollBehavior = useCallback((): 'smooth' | 'auto' => {
    return prefersReducedMotion() ? 'auto' : 'smooth'
  }, [prefersReducedMotion])

  return {
    announceToScreenReader,
    focusAfterScroll,
    handleArrowKeyNavigation,
    trapFocus,
    prefersReducedMotion,
    prefersHighContrast,
    getScrollBehavior
  }
}

/**
 * Hook for managing ARIA live regions
 */
export function useAriaLiveRegion() {
  const liveRegionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Create a live region if it doesn't exist
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div')
      liveRegion.setAttribute('aria-live', 'polite')
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.setAttribute('role', 'status')
      liveRegion.className = 'sr-only'
      document.body.appendChild(liveRegion)
      liveRegionRef.current = liveRegion
    }

    return () => {
      if (liveRegionRef.current && document.body.contains(liveRegionRef.current)) {
        document.body.removeChild(liveRegionRef.current)
      }
    }
  }, [])

  const announce = useCallback((message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = ''
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = message
        }
      }, 100)
    }
  }, [])

  return { announce, liveRegionRef }
}

/**
 * Hook for keyboard navigation management
 */
export function useKeyboardNavigation(
  elements: HTMLElement[],
  options: {
    orientation?: 'horizontal' | 'vertical'
    wrap?: boolean
    initialIndex?: number
  } = {}
) {
  const { orientation = 'horizontal', wrap = true, initialIndex = 0 } = options
  const currentIndexRef = useRef(initialIndex)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event
    let nextIndex = currentIndexRef.current

    const isHorizontalKey = key === 'ArrowLeft' || key === 'ArrowRight'
    const isVerticalKey = key === 'ArrowUp' || key === 'ArrowDown'

    if (orientation === 'horizontal' && !isHorizontalKey) return
    if (orientation === 'vertical' && !isVerticalKey) return

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      nextIndex = wrap 
        ? (currentIndexRef.current > 0 ? currentIndexRef.current - 1 : elements.length - 1)
        : Math.max(0, currentIndexRef.current - 1)
      event.preventDefault()
    } else if (key === 'ArrowRight' || key === 'ArrowDown') {
      nextIndex = wrap
        ? (currentIndexRef.current < elements.length - 1 ? currentIndexRef.current + 1 : 0)
        : Math.min(elements.length - 1, currentIndexRef.current + 1)
      event.preventDefault()
    } else if (key === 'Home') {
      nextIndex = 0
      event.preventDefault()
    } else if (key === 'End') {
      nextIndex = elements.length - 1
      event.preventDefault()
    }

    if (nextIndex !== currentIndexRef.current && elements[nextIndex]) {
      currentIndexRef.current = nextIndex
      elements[nextIndex].focus()
    }
  }, [elements, orientation, wrap])

  return { handleKeyDown, currentIndex: currentIndexRef.current }
}