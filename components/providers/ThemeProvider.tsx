'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export default function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'portfolio-theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')
  const [mounted, setMounted] = useState(false)

  // Get system preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [])

  // Resolve the actual theme to apply
  const resolveTheme = useCallback((theme: Theme): ResolvedTheme => {
    if (theme === 'system') {
      return getSystemTheme()
    }
    return theme as ResolvedTheme
  }, [getSystemTheme])

  // Apply theme to DOM
  const applyTheme = useCallback((resolvedTheme: ResolvedTheme) => {
    const root = document.documentElement
    root.setAttribute('data-theme', resolvedTheme)
    
    // Set meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0e1117' : '#ffffff')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = resolvedTheme === 'dark' ? '#0e1117' : '#ffffff'
      document.head.appendChild(meta)
    }

    // Announce theme change to screen readers
    const announcement = `Theme changed to ${resolvedTheme} mode`
    const announcer = document.createElement('div')
    announcer.setAttribute('role', 'status')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = announcement
    document.body.appendChild(announcer)
    
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }, [])

  // Set theme and persist to localStorage
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    const resolved = resolveTheme(newTheme)
    setResolvedTheme(resolved)
    applyTheme(resolved)
    
    try {
      localStorage.setItem(storageKey, newTheme)
    } catch (error) {
      console.warn('Failed to save theme preference:', error)
    }
  }, [storageKey, resolveTheme, applyTheme])

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme | null
      const initialTheme = savedTheme || defaultTheme
      setThemeState(initialTheme)
      const resolved = resolveTheme(initialTheme)
      setResolvedTheme(resolved)
      applyTheme(resolved)
    } catch (error) {
      console.warn('Failed to load theme preference:', error)
      const resolved = resolveTheme(defaultTheme)
      setResolvedTheme(resolved)
      applyTheme(resolved)
    }
  }, [defaultTheme, storageKey, resolveTheme, applyTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newResolvedTheme = e.matches ? 'dark' : 'light'
      setResolvedTheme(newResolvedTheme)
      applyTheme(newResolvedTheme)
    }

    // Check for addEventListener support (modern browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [mounted, theme, applyTheme])

  // Prevent flash of incorrect theme
  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    root.style.colorScheme = resolvedTheme
  }, [mounted, resolvedTheme])

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  }

  // Render with theme applied
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}