'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Calendar, 
  Clock, 
  Tag, 
  ArrowLeft, 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook,
  Link as LinkIcon,
  ChevronUp,
  Star,
  User,
  Edit3
} from 'lucide-react'
import { 
  TextReveal, 
  FadeIn, 
  SlideIn, 
  ParallaxWrapper,
  AnimatedSection,
  StaggerContainer 
} from '@/components/animations'
import ReadingProgress from './ReadingProgress'
import TableOfContents from './TableOfContents'
import ShareButtons from './ShareButtons'
import RelatedPosts from './RelatedPosts'

interface BlogPostProps {
  post: {
    _id: string
    title: string
    slug: { current: string }
    excerpt: string
    mainImage: {
      asset: { url: string }
      alt: string
    }
    author: {
      name: string
      slug: { current: string }
      bio: string
      image: { asset: { url: string } }
    }
    categories: { title: string, slug: { current: string } }[]
    tags: string[]
    publishedAt: string
    updatedAt?: string
    readingTime: number
    featured?: boolean
    content: any[]
    relatedArticles?: any[]
    series?: {
      title: string
      order: number
      total: number
    }
  }
}

export default function BlogPost({ post }: BlogPostProps) {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeHeading, setActiveHeading] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ['start start', 'end end']
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 1000)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const updatedDate = post.updatedAt 
    ? new Date(post.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

  // Mock table of contents - in real app, extract from content
  const tableOfContents = [
    { id: 'introduction', title: 'Introduction to Framer Motion', level: 2 },
    { id: 'installation', title: 'Installation and Setup', level: 2 },
    { id: 'basic-animations', title: 'Basic Animations', level: 2 },
    { id: 'layout-animations', title: 'Layout Animations', level: 3 },
    { id: 'gesture-animations', title: 'Gesture-based Animations', level: 3 },
    { id: 'performance', title: 'Performance Considerations', level: 2 },
    { id: 'conclusion', title: 'Conclusion', level: 2 },
  ]

  return (
    <div ref={contentRef} className="relative">
      <ReadingProgress />

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={post.mainImage.asset.url}
            alt={post.mainImage.alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          {/* Back to Blog */}
          <SlideIn direction="left" delay={0.2}>
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 mb-8 text-white/80 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </SlideIn>

          {/* Series Info */}
          {post.series && (
            <FadeIn delay={0.3}>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                {post.series.title} • Part {post.series.order} of {post.series.total}
              </div>
            </FadeIn>
          )}

          {/* Categories and Featured Badge */}
          <FadeIn delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {post.categories.map((category, index) => (
                <motion.span
                  key={category.slug.current}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm text-blue-200 text-sm font-medium rounded-full border border-blue-300/30"
                >
                  {category.title}
                </motion.span>
              ))}
              {post.featured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 backdrop-blur-sm text-yellow-200 text-sm font-medium rounded-full border border-yellow-300/30"
                >
                  <Star className="w-4 h-4" />
                  Featured
                </motion.div>
              )}
            </div>
          </FadeIn>

          {/* Title */}
          <TextReveal 
            as="h1"
            delay={0.6}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight max-w-5xl mx-auto"
            staggerChildren={0.03}
          >
            {post.title}
          </TextReveal>

          {/* Excerpt */}
          <FadeIn delay={1}>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>
          </FadeIn>

          {/* Meta Info */}
          <FadeIn delay={1.2}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.author.name}</span>
              </div>
              {updatedDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Edit3 className="w-4 h-4" />
                  <span>Updated {updatedDate}</span>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Share Buttons */}
          <FadeIn delay={1.4}>
            <ShareButtons 
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug.current}`}
              title={post.title}
              description={post.excerpt}
            />
          </FadeIn>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        >
          <ChevronUp className="w-6 h-6 rotate-180" />
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="relative bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Table of Contents - Sticky Sidebar */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <TableOfContents 
                  headings={tableOfContents}
                  activeHeading={activeHeading}
                  onHeadingClick={setActiveHeading}
                />
              </div>
            </aside>

            {/* Article Content */}
            <article className="lg:col-span-3">
              <AnimatedSection className="prose prose-lg dark:prose-invert max-w-none">
                {/* Article Body */}
                <div className="space-y-8">
                  <FadeIn>
                    <h2 id="introduction" className="scroll-mt-24">Introduction to Framer Motion</h2>
                    <p>
                      Framer Motion is a production-ready motion library for React that brings your components to life with smooth, 
                      performant animations. In this comprehensive guide, we'll explore how to leverage its powerful features to 
                      create engaging user experiences that enhance rather than distract from your content.
                    </p>
                  </FadeIn>

                  <SlideIn direction="right" delay={0.2}>
                    <h2 id="installation" className="scroll-mt-24">Installation and Setup</h2>
                    <p>
                      Getting started with Framer Motion is straightforward. Let's walk through the installation process and 
                      basic configuration to get you up and running quickly.
                    </p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                      <code>npm install framer-motion</code>
                    </pre>
                  </SlideIn>

                  <FadeIn delay={0.4}>
                    <h2 id="basic-animations" className="scroll-mt-24">Basic Animations</h2>
                    <p>
                      The foundation of any good animation system is a solid understanding of basic principles. 
                      Framer Motion provides intuitive APIs that make complex animations feel simple.
                    </p>
                    
                    <h3 id="layout-animations" className="scroll-mt-24">Layout Animations</h3>
                    <p>
                      One of Framer Motion's most powerful features is its ability to automatically animate between layouts. 
                      This creates smooth transitions when elements change size, position, or structure.
                    </p>

                    <h3 id="gesture-animations" className="scroll-mt-24">Gesture-based Animations</h3>
                    <p>
                      Interactive animations respond to user input, creating a more engaging experience. 
                      Learn how to implement drag, hover, and tap animations that feel natural and responsive.
                    </p>
                  </FadeIn>

                  <SlideIn direction="left" delay={0.6}>
                    <h2 id="performance" className="scroll-mt-24">Performance Considerations</h2>
                    <p>
                      While animations can greatly enhance user experience, they must be implemented thoughtfully to avoid 
                      performance issues. We'll cover optimization techniques and best practices for smooth 60fps animations.
                    </p>
                  </SlideIn>

                  <FadeIn delay={0.8}>
                    <h2 id="conclusion" className="scroll-mt-24">Conclusion</h2>
                    <p>
                      Framer Motion opens up a world of possibilities for creating engaging, interactive web experiences. 
                      By following the principles and techniques outlined in this guide, you'll be well-equipped to add 
                      meaningful animations to your React applications.
                    </p>
                  </FadeIn>
                </div>

                {/* Tags */}
                <AnimatedSection delay={1} className="pt-12 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag, index) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <Tag className="w-4 h-4" />
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Author Bio */}
                <AnimatedSection delay={1.2} className="pt-12 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                    >
                      <Image
                        src={post.author.image.asset.url}
                        alt={post.author.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    </motion.div>
                    <div className="flex-1">
                      <FadeIn delay={1.3}>
                        <h4 className="text-xl font-bold mb-2">{post.author.name}</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {post.author.bio}
                        </p>
                      </FadeIn>
                    </div>
                  </div>
                </AnimatedSection>
              </AnimatedSection>
            </article>
          </div>
        </div>

        {/* Related Posts */}
        {post.relatedArticles && post.relatedArticles.length > 0 && (
          <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
            <div className="container mx-auto px-4 max-w-7xl">
              <RelatedPosts posts={post.relatedArticles} />
            </div>
          </section>
        )}
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0 
        }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp className="w-6 h-6" />
      </motion.button>
    </div>
  )
}