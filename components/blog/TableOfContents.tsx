'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { List, ChevronRight } from 'lucide-react'
import { FadeIn, SlideIn } from '@/components/animations'

interface Heading {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  headings: Heading[]
  activeHeading: string
  onHeadingClick: (id: string) => void
}

export default function TableOfContents({ 
  headings, 
  activeHeading, 
  onHeadingClick 
}: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [visibleHeadings, setVisibleHeadings] = useState<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleHeadings = new Set(visibleHeadings)
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            newVisibleHeadings.add(entry.target.id)
          } else {
            newVisibleHeadings.delete(entry.target.id)
          }
        })
        
        setVisibleHeadings(newVisibleHeadings)
        
        // Set the first visible heading as active
        const sortedVisible = headings
          .filter(h => newVisibleHeadings.has(h.id))
          .sort((a, b) => {
            const aElement = document.getElementById(a.id)
            const bElement = document.getElementById(b.id)
            if (!aElement || !bElement) return 0
            return aElement.offsetTop - bElement.offsetTop
          })
        
        if (sortedVisible.length > 0) {
          onHeadingClick(sortedVisible[0].id)
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0
      }
    )

    // Observe all headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings, onHeadingClick, visibleHeadings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100 // Account for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      onHeadingClick(id)
    }
  }

  return (
    <FadeIn>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden">
        {/* Header */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <List className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Table of Contents
            </span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        </motion.button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-1">
                {headings.map((heading, index) => (
                  <motion.button
                    key={heading.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 group
                      ${heading.level === 3 ? 'ml-4' : ''}
                      ${heading.level === 4 ? 'ml-8' : ''}
                      ${activeHeading === heading.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                    `}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-2">
                      {/* Progress Indicator */}
                      <div className={`
                        w-2 h-2 rounded-full transition-all duration-200
                        ${visibleHeadings.has(heading.id)
                          ? 'bg-blue-500 scale-100'
                          : 'bg-gray-300 dark:bg-gray-600 scale-75'
                        }
                      `} />
                      
                      {/* Heading Text */}
                      <span className="flex-1 group-hover:translate-x-1 transition-transform">
                        {heading.title}
                      </span>

                      {/* Active Indicator */}
                      {activeHeading === heading.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-1 h-4 bg-blue-500 rounded-full"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${(visibleHeadings.size / headings.length) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </FadeIn>
  )
}