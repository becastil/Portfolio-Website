'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { navLinks } from '@/lib/constants'
import { cn } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
              className="md:hidden touch-target"
              aria-label="Open mobile menu"
              aria-expanded="false"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}