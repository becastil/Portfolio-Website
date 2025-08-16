'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { FadeIn } from '@/components/animations'

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  totalPosts: number
  basePath?: string
}

export default function BlogPagination({ 
  currentPage, 
  totalPages, 
  totalPosts,
  basePath = '/blog' 
}: BlogPaginationProps) {
  if (totalPages <= 1) return null

  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 4) {
        // Close to beginning
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i)
        }
        if (totalPages > 5) {
          pages.push('ellipsis')
        }
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Close to end
        pages.push('ellipsis')
        for (let i = Math.max(totalPages - 4, 2); i <= totalPages - 1; i++) {
          pages.push(i)
        }
        pages.push(totalPages)
      } else {
        // Middle
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()
  const startPost = (currentPage - 1) * 9 + 1
  const endPost = Math.min(currentPage * 9, totalPosts)

  const getPageUrl = (page: number) => {
    if (page === 1) return basePath
    return `${basePath}?page=${page}`
  }

  return (
    <FadeIn className="mt-16">
      <nav className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Results Info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-medium">{startPost}</span> to{' '}
          <span className="font-medium">{endPost}</span> of{' '}
          <span className="font-medium">{totalPosts}</span> articles
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link href={getPageUrl(currentPage - 1)}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.div>
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </div>
          )}

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <div
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-gray-400 dark:text-gray-600"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                )
              }

              const isActive = page === currentPage

              return isActive ? (
                <motion.div
                  key={page}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg"
                >
                  {page}
                </motion.div>
              ) : (
                <Link key={page} href={getPageUrl(page)}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {page}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Mobile Page Indicator */}
          <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            {currentPage} of {totalPages}
          </div>

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link href={getPageUrl(currentPage + 1)}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed">
              Next
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </nav>
    </FadeIn>
  )
}