'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Moon, Sun, Monitor } from 'lucide-react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-[44px] h-[44px] rounded-md border border-border" aria-hidden="true" />
    )
  }

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode'
      case 'dark':
        return 'Dark mode'
      case 'system':
        return `System (${resolvedTheme} mode)`
      default:
        return 'Toggle theme'
    }
  }

  const getNextThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode'
      case 'dark':
        return 'Switch to system theme'
      case 'system':
        return 'Switch to light mode'
      default:
        return 'Toggle theme'
    }
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={getNextThemeLabel()}
      aria-pressed={resolvedTheme === 'dark'}
      className={cn(
        'touch-target rounded-md border border-border',
        'hover:bg-surface-hover hover:border-accent transition-all duration-300',
        'flex items-center justify-center gap-2 px-3',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        resolvedTheme === 'dark' && 'bg-surface-hover'
      )}
    >
      <span className="relative w-4 h-4 flex items-center justify-center">
        {theme === 'light' ? (
          <Sun className="w-4 h-4" aria-hidden="true" />
        ) : theme === 'dark' ? (
          <Moon className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Monitor className="w-4 h-4" aria-hidden="true" />
        )}
      </span>
      <span className="hidden md:inline text-sm font-medium">
        {getThemeLabel()}
      </span>
    </button>
  )
}