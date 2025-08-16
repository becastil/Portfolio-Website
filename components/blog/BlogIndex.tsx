'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { 
  TextReveal, 
  FadeIn, 
  StaggerContainer, 
  ParallaxWrapper,
  AnimatedSection 
} from '@/components/animations'
import BlogCard from './BlogCard'
import BlogFilters from './BlogFilters'
import { useDebounce } from '@/hooks/useDebounce'

// Mock blog data - replace with actual Sanity queries
const mockBlogPosts = [
  {
    _id: '1',
    title: 'Building Interactive Web Experiences with Framer Motion',
    slug: { current: 'framer-motion-interactive-web' },
    excerpt: 'Learn how to create smooth animations and transitions that enhance user experience without overwhelming your audience.',
    mainImage: {
      asset: { url: '/api/placeholder/600/400' },
      alt: 'Framer Motion animation examples'
    },
    author: { name: 'Ben Castillo', slug: { current: 'ben-castillo' } },
    categories: [{ title: 'Frontend', slug: { current: 'frontend' } }],
    tags: ['React', 'Animation', 'UX'],
    publishedAt: '2024-01-15T10:00:00Z',
    readingTime: 8,
    featured: true,
  },
  {
    _id: '2',
    title: 'The Art of Progressive Enhancement in Modern Web Development',
    slug: { current: 'progressive-enhancement-modern-web' },
    excerpt: 'Discover how to build websites that work for everyone, regardless of their device or connection speed.',
    mainImage: {
      asset: { url: '/api/placeholder/600/400' },
      alt: 'Progressive enhancement diagram'
    },
    author: { name: 'Ben Castillo', slug: { current: 'ben-castillo' } },
    categories: [{ title: 'Web Development', slug: { current: 'web-dev' } }],
    tags: ['Performance', 'Accessibility', 'HTML'],
    publishedAt: '2024-01-10T14:30:00Z',
    readingTime: 12,
    featured: false,
  },
  {
    _id: '3',
    title: 'TypeScript Best Practices for Scalable Applications',
    slug: { current: 'typescript-best-practices-scalable' },
    excerpt: 'Essential TypeScript patterns and practices for building maintainable and type-safe applications.',
    mainImage: {
      asset: { url: '/api/placeholder/600/400' },
      alt: 'TypeScript code examples'
    },
    author: { name: 'Ben Castillo', slug: { current: 'ben-castillo' } },
    categories: [{ title: 'Backend', slug: { current: 'backend' } }],
    tags: ['TypeScript', 'Architecture', 'Best Practices'],
    publishedAt: '2024-01-05T09:15:00Z',
    readingTime: 15,
    featured: false,
  },
  {
    _id: '4',
    title: 'CSS Grid vs Flexbox: When to Use Which',
    slug: { current: 'css-grid-vs-flexbox-guide' },
    excerpt: 'A comprehensive guide to choosing between CSS Grid and Flexbox for your layout needs.',
    mainImage: {
      asset: { url: '/api/placeholder/600/400' },
      alt: 'CSS Grid and Flexbox comparison'
    },
    author: { name: 'Ben Castillo', slug: { current: 'ben-castillo' } },
    categories: [{ title: 'CSS', slug: { current: 'css' } }],
    tags: ['CSS', 'Layout', 'Grid', 'Flexbox'],
    publishedAt: '2023-12-28T16:45:00Z',
    readingTime: 10,
    featured: false,
  },
]

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

  // Extract unique categories and tags
  const categories = useMemo(() => {
    const cats = mockBlogPosts.flatMap(post => post.categories.map(cat => cat.title))
    return [...new Set(cats)]
  }, [])

  const tags = useMemo(() => {
    const allTags = mockBlogPosts.flatMap(post => post.tags)
    return [...new Set(allTags)]
  }, [])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = mockBlogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(debouncedSearch.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || 
                             post.categories.some(cat => cat.title === selectedCategory)

      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag)

      return matchesSearch && matchesCategory && matchesTag
    })

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        case 'reading-time-asc':
          return a.readingTime - b.readingTime
        case 'reading-time-desc':
          return b.readingTime - a.readingTime
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        case 'newest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      }
    })

    return filtered
  }, [debouncedSearch, selectedCategory, selectedTag, sortBy])

  const featuredPost = mockBlogPosts.find(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Hero Section */}
      <ParallaxWrapper offset={30} speed={0.3}>
        <AnimatedSection className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <TextReveal 
              as="h1" 
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-600 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6"
              staggerChildren={0.05}
            >
              Thoughts & Insights
            </TextReveal>
            <FadeIn delay={0.3}>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Exploring the intersection of design, technology, and user experience. 
                Join me on a journey through modern web development.
              </p>
            </FadeIn>
          </div>
        </AnimatedSection>
      </ParallaxWrapper>

      {/* Search and Filters */}
      <AnimatedSection delay={0.4} className="mb-12">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Toggle */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-5 h-5" />
              Filters
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4 rotate-90" />
              </motion.div>
            </motion.button>
          </div>

          {/* Expandable Filters */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <BlogFilters
              categories={categories}
              tags={tags}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              sortBy={sortBy}
              onCategoryChange={setSelectedCategory}
              onTagChange={setSelectedTag}
              onSortChange={setSortBy}
            />
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Featured Post */}
      {featuredPost && (
        <AnimatedSection delay={0.6} className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Featured Article</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <BlogCard post={featuredPost} featured />
        </AnimatedSection>
      )}

      {/* Results Count */}
      <FadeIn delay={0.8}>
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredPosts.length === 0 
              ? 'No articles found' 
              : `${filteredPosts.length} article${filteredPosts.length === 1 ? '' : 's'} found`
            }
          </p>
          {(debouncedSearch || selectedCategory !== 'all' || selectedTag !== 'all') && (
            <motion.button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedTag('all')
              }}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear filters
            </motion.button>
          )}
        </div>
      </FadeIn>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <StaggerContainer 
          delay={1} 
          staggerChildren={0.1}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {regularPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </StaggerContainer>
      ) : (
        <FadeIn delay={1}>
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <motion.button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedTag('all')
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset filters
            </motion.button>
          </div>
        </FadeIn>
      )}
    </div>
  )
}