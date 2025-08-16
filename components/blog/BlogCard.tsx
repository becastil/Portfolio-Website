'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Tag, ArrowRight, Star } from 'lucide-react'
import { FadeIn, ScaleIn } from '@/components/animations'

import { BlogPostPreview } from '@/types'

interface BlogCardProps {
  post: BlogPostPreview
  featured?: boolean
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (featured) {
    return (
      <ScaleIn className="relative group">
        <motion.article
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
        >
          {/* Featured Badge */}
          <div className="absolute top-6 left-6 z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-full shadow-lg"
            >
              <Star className="w-4 h-4" />
              Featured
            </motion.div>
          </div>

          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2 relative overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Image
                  src={post.mainImage.url}
                  alt={post.mainImage.alt}
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-full object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/20"></div>
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category, index) => (
                  <motion.span
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full"
                  >
                    {category}
                  </motion.span>
                ))}
              </div>

              <FadeIn delay={0.5}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {post.title}
                </h2>
              </FadeIn>

              <FadeIn delay={0.6}>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  {post.excerpt}
                </p>
              </FadeIn>

              <FadeIn delay={0.7}>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formattedDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readingTime.text}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.8}>
                <Link href={`/blog/${post.slug}`}>
                  <motion.div
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </Link>
              </FadeIn>
            </div>
          </div>
        </motion.article>
      </ScaleIn>
    )
  }

  return (
    <ScaleIn>
      <motion.article
        whileHover={{ y: -8, rotateY: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={post.mainImage.url}
              alt={post.mainImage.alt}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full backdrop-blur-sm"
            >
              {post.categories[0]}
            </motion.span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <FadeIn delay={0.1}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h3>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {post.excerpt}
            </p>
          </FadeIn>

          {/* Tags */}
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </motion.span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          </FadeIn>

          {/* Meta info and CTA */}
          <FadeIn delay={0.4}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime.minutes}m
                </div>
              </div>

              <Link href={`/blog/${post.slug}`}>
                <motion.div
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm group"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            </div>
          </FadeIn>
        </div>
      </motion.article>
    </ScaleIn>
  )
}