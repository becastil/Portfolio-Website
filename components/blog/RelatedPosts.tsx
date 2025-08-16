'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { 
  TextReveal, 
  StaggerContainer, 
  ScaleIn,
  FadeIn 
} from '@/components/animations'

interface RelatedPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  mainImage?: {
    asset: { url: string }
    alt: string
  }
  publishedAt?: string
  readingTime?: number
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <div>
      <TextReveal 
        as="h2"
        className="text-3xl md:text-4xl font-bold text-center mb-4"
        staggerChildren={0.05}
      >
        Related Articles
      </TextReveal>
      
      <FadeIn delay={0.3}>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-12"></div>
      </FadeIn>

      <StaggerContainer 
        delay={0.5}
        staggerChildren={0.15}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {posts.map((post) => (
          <RelatedPostCard key={post._id} post={post} />
        ))}
      </StaggerContainer>
    </div>
  )
}

function RelatedPostCard({ post }: { post: RelatedPost }) {
  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null

  return (
    <ScaleIn>
      <motion.article
        className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Image */}
        {post.mainImage ? (
          <div className="relative overflow-hidden aspect-[4/3]">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Image
                src={post.mainImage.asset.url}
                alt={post.mainImage.alt}
                fill
                className="object-cover"
              />
            </motion.div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Read More Button (appears on hover) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Link href={`/blog/${post.slug.current}`}>
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg font-medium hover:bg-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="relative overflow-hidden aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
        )}

        {/* Content */}
        <div className="p-6">
          <FadeIn delay={0.1}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm line-clamp-3">
              {post.excerpt}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-3">
                {formattedDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formattedDate}
                  </div>
                )}
                {post.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readingTime}m
                  </div>
                )}
              </div>

              <Link href={`/blog/${post.slug.current}`}>
                <motion.div
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium group"
                  whileHover={{ x: 3 }}
                >
                  Read
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Animated Border */}
        <motion.div
          className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.article>
    </ScaleIn>
  )
}