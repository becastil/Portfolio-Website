'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { socialLinks, siteMetadata } from '@/lib/constants'
import { cn } from '@/lib/utils'

const iconPaths = {
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 L12,13 L2,6',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  twitter: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
}

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
    // Announce to screen readers
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = 'Scrolled to top of page'
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
  
  return (
    <footer 
      className="bg-surface border-t border-border theme-transition"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary">
              {siteMetadata.author}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Full-stack developer passionate about creating elegant solutions to complex problems.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="#about"
                    className="text-text-secondary hover:text-accent transition-colors duration-normal inline-block py-1"
                    aria-label="Navigate to About section"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#projects"
                    className="text-text-secondary hover:text-accent transition-colors duration-normal inline-block py-1"
                    aria-label="Navigate to Projects section"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#contact"
                    className="text-text-secondary hover:text-accent transition-colors duration-normal inline-block py-1"
                    aria-label="Navigate to Contact section"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blog"
                    className="text-text-secondary hover:text-accent transition-colors duration-normal inline-block py-1"
                    aria-label="Navigate to Blog"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Connect
            </h3>
            <nav aria-label="Social media links">
              <ul className="flex flex-wrap gap-3">
                {socialLinks.map((link) => {
                  const isExternal = !link.href.startsWith('mailto:')
                  
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        aria-label={link.ariaLabel}
                        className={cn(
                          'touch-target-comfortable rounded-md border border-border',
                          'hover:bg-accent hover:text-accent-ink hover:border-accent',
                          'transition-all duration-normal ease-formless',
                          'flex items-center justify-center',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
                        )}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          {link.icon === 'mail' && (
                            <>
                              <path d={iconPaths.mail.split(' ')[0]} />
                              <polyline points={iconPaths.mail.split(' ')[1]} />
                            </>
                          )}
                          {link.icon === 'linkedin' && (
                            <>
                              <path d={iconPaths.linkedin.split(' ')[0]} />
                              <rect x="2" y="9" width="4" height="12" />
                              <circle cx="4" cy="4" r="2" />
                            </>
                          )}
                          {link.icon === 'github' && (
                            <path d={iconPaths.github} />
                          )}
                          {link.icon === 'twitter' && (
                            <path d={iconPaths.twitter} />
                          )}
                        </svg>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-text-muted text-sm">
              <p>
                © {currentYear} {siteMetadata.author}. All rights reserved.
              </p>
              <p className="mt-1">
                Built with Next.js, TypeScript, and Tailwind CSS.
              </p>
            </div>

            {/* Additional Links */}
            <nav aria-label="Legal links">
              <ul className="flex gap-6 text-sm">
                <li>
                  <Link 
                    href="/privacy"
                    className="text-text-muted hover:text-text-secondary transition-colors duration-normal"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms"
                    className="text-text-muted hover:text-text-secondary transition-colors duration-normal"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/sitemap"
                    className="text-text-muted hover:text-text-secondary transition-colors duration-normal"
                  >
                    Sitemap
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll back to top of page"
        className={cn(
          'fixed bottom-8 right-8 z-sticky',
          'touch-target rounded-full',
          'bg-accent text-accent-ink shadow-lg',
          'hover:bg-accent-hover hover:shadow-xl',
          'transition-all duration-normal ease-formless',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        )}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </footer>
  )
}