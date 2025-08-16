'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearch } from '@/hooks/useSearch'
import { FadeIn, StaggerContainer } from '@/components/animations'

interface BlogSearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function BlogSearch({ isOpen, onClose }: BlogSearchProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const { results, isLoading, error, totalResults, search, clearResults } = useSearch()

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery)
    } else {
      clearResults()
    }
  }, [debouncedQuery, search, clearResults])

  // Clear search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      clearResults()
    }
  }, [isOpen, clearResults])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleResultClick = () => {
    onClose()
  }

  const highlightMatch = (text: string, matches?: Array<{ indices: number[][] }>) => {
    if (!matches || matches.length === 0) return text

    const allIndices: number[][] = []
    matches.forEach(match => {
      allIndices.push(...match.indices)
    })

    if (allIndices.length === 0) return text

    // Sort indices by start position
    allIndices.sort((a, b) => a[0] - b[0])

    let result = ''
    let lastIndex = 0

    allIndices.forEach(([start, end]) => {
      // Add text before match
      result += text.slice(lastIndex, start)
      // Add highlighted match
      result += `<mark class="bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded">${text.slice(start, end + 1)}</mark>`
      lastIndex = end + 1
    })

    // Add remaining text
    result += text.slice(lastIndex)
    return result
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Search Header */}
            <div className="flex items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  autoFocus
                />
                {isLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto max-h-96">
              {error && (
                <FadeIn className="p-6 text-center">
                  <div className="text-red-500 dark:text-red-400 mb-2">
                    {error}
                  </div>
                </FadeIn>
              )}

              {!error && query && !isLoading && results.length === 0 && (
                <FadeIn className="p-6 text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">
                    No articles found for &quot;{query}&quot;
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Try different keywords or check your spelling
                  </p>
                </FadeIn>
              )}

              {!error && query && totalResults > 0 && (
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {totalResults} result{totalResults === 1 ? '' : 's'} for &quot;{query}&quot;
                  </p>
                </div>
              )}

              {!error && results.length > 0 && (
                <StaggerContainer className="divide-y divide-gray-200 dark:divide-gray-700">
                  {results.map((post) => (
                    <motion.div
                      key={post.slug}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <Link 
                        href={`/blog/${post.slug}`}
                        onClick={handleResultClick}
                        className="block group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 
                              className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(
                                  post.title,
                                  post.matches?.filter(m => m.key === 'title')
                                )
                              }}
                            />
                            <p 
                              className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(
                                  post.excerpt,
                                  post.matches?.filter(m => m.key === 'excerpt')
                                )
                              }}
                            />
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{post.readingTime.text}</span>
                              {post.categories.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span 
                                    dangerouslySetInnerHTML={{
                                      __html: highlightMatch(
                                        post.categories[0],
                                        post.matches?.filter(m => m.key === 'categories')
                                      )
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </StaggerContainer>
              )}

              {!query && (
                <FadeIn className="p-6 text-center">
                  <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Search Articles
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Start typing to find articles, tutorials, and insights
                  </p>
                </FadeIn>
              )}
            </div>

            {/* Search Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Press ESC to close</span>
                <span>Search by title, content, tags, or categories</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}