'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { FadeIn } from '@/components/animations'

interface BlogFiltersProps {
  categories: string[]
  tags: string[]
  selectedCategory: string
  selectedTag: string
  sortBy: string
  onCategoryChange: (category: string) => void
  onTagChange: (tag: string) => void
  onSortChange: (sort: string) => void
}

export default function BlogFilters({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  sortBy,
  onCategoryChange,
  onTagChange,
  onSortChange,
}: BlogFiltersProps) {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'reading-time-asc', label: 'Shortest Read' },
    { value: 'reading-time-desc', label: 'Longest Read' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ]

  return (
    <FadeIn>
      <div className="pt-6 border-t border-gray-200 dark:border-gray-600 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tag
            </label>
            <div className="relative">
              <select
                value={selectedTag}
                onChange={(e) => onTagChange(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => onCategoryChange('all')}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              Category: {selectedCategory}
              <span className="text-xs">×</span>
            </motion.button>
          )}

          {selectedTag !== 'all' && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => onTagChange('all')}
              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              Tag: {selectedTag}
              <span className="text-xs">×</span>
            </motion.button>
          )}

          {sortBy !== 'newest' && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => onSortChange('newest')}
              className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
              <span className="text-xs">×</span>
            </motion.button>
          )}
        </div>
      </div>
    </FadeIn>
  )
}