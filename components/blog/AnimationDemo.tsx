'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Zap,
  Eye,
  MousePointer,
  Layers
} from 'lucide-react'
import {
  AnimatedSection,
  FadeIn,
  SlideIn,
  ScaleIn,
  TextReveal,
  StaggerContainer,
  ParallaxWrapper,
  OptimizedMotion,
  OptimizedFadeIn,
  OptimizedSlideUp,
  OptimizedScale
} from '@/components/animations'

export default function AnimationDemo() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedDemo, setSelectedDemo] = useState('all')

  const demoSections = [
    {
      id: 'text-reveal',
      title: 'Text Reveal Animations',
      description: 'Smooth character and word-based text animations',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      id: 'scroll-triggered',
      title: 'Scroll-Triggered Animations', 
      description: 'Elements animate as they enter the viewport',
      icon: <Eye className="w-5 h-5" />,
    },
    {
      id: 'interactive',
      title: 'Interactive Animations',
      description: 'Hover and click-based interactions',
      icon: <MousePointer className="w-5 h-5" />,
    },
    {
      id: 'performance',
      title: 'Performance Optimized',
      description: 'GPU-accelerated animations with reduced motion support',
      icon: <Zap className="w-5 h-5" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Header */}
      <TextReveal 
        as="h1"
        className="text-4xl md:text-6xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        staggerChildren={0.05}
      >
        Animation Showcase
      </TextReveal>

      <FadeIn delay={0.5}>
        <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          Explore the power of Framer Motion with these interactive animation examples. 
          Each component is optimized for performance and accessibility.
        </p>
      </FadeIn>

      {/* Controls */}
      <FadeIn delay={0.7}>
        <div className="flex items-center justify-center gap-4 mb-16">
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isPlaying ? 'Pause' : 'Play'} Animations
          </motion.button>

          <select
            value={selectedDemo}
            onChange={(e) => setSelectedDemo(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Demos</option>
            {demoSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </div>
      </FadeIn>

      {/* Demo Sections */}
      <div className="space-y-24">
        {/* Text Reveal Section */}
        {(selectedDemo === 'all' || selectedDemo === 'text-reveal') && (
          <AnimatedSection delay={0.8}>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-3xl font-bold mb-6 text-center">Text Reveal Animations</h2>
              
              <div className="space-y-8">
                <div className="text-center">
                  <TextReveal 
                    as="h3"
                    className="text-2xl font-semibold mb-4"
                    staggerChildren={0.03}
                  >
                    Character-by-character reveal
                  </TextReveal>
                  
                  <TextReveal 
                    as="p"
                    className="text-lg text-gray-600 dark:text-gray-300"
                    splitBy="word"
                    staggerChildren={0.05}
                  >
                    This text reveals word by word with smooth animations
                  </TextReveal>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Scroll-Triggered Section */}
        {(selectedDemo === 'all' || selectedDemo === 'scroll-triggered') && (
          <AnimatedSection delay={1}>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-3xl font-bold mb-8 text-center">Scroll-Triggered Animations</h2>
              
              <StaggerContainer staggerChildren={0.1} className="grid md:grid-cols-3 gap-6">
                <FadeIn className="p-6 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <h3 className="font-semibold mb-2">Fade In</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Smooth opacity transition as element enters viewport
                  </p>
                </FadeIn>

                <SlideIn direction="up" className="p-6 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <h3 className="font-semibold mb-2">Slide Up</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Element slides up from below with spring animation
                  </p>
                </SlideIn>

                <ScaleIn className="p-6 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                  <h3 className="font-semibold mb-2">Scale In</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Scales from small to full size with bounce effect
                  </p>
                </ScaleIn>
              </StaggerContainer>

              <ParallaxWrapper offset={30} speed={0.5} className="mt-12">
                <div className="text-center p-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl">
                  <h3 className="text-xl font-semibold mb-2">Parallax Effect</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    This section moves at a different speed as you scroll
                  </p>
                </div>
              </ParallaxWrapper>
            </div>
          </AnimatedSection>
        )}

        {/* Interactive Section */}
        {(selectedDemo === 'all' || selectedDemo === 'interactive') && (
          <AnimatedSection delay={1.2}>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-3xl font-bold mb-8 text-center">Interactive Animations</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Hover Scale', color: 'bg-blue-500', hoverScale: 1.1 },
                  { title: 'Hover Rotate', color: 'bg-purple-500', hoverRotate: 15 },
                  { title: 'Tap Scale', color: 'bg-pink-500', tapScale: 0.9 },
                  { title: 'Complex Motion', color: 'bg-green-500', hoverY: -10, hoverRotate: 5 },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`${item.color} text-white p-6 rounded-xl text-center cursor-pointer`}
                    whileHover={{ 
                      scale: item.hoverScale, 
                      rotate: item.hoverRotate,
                      y: item.hoverY 
                    }}
                    whileTap={{ scale: item.tapScale || 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm opacity-90">
                      Try {item.title.toLowerCase().includes('tap') ? 'clicking' : 'hovering'} me!
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Performance Section */}
        {(selectedDemo === 'all' || selectedDemo === 'performance') && (
          <AnimatedSection delay={1.4}>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-3xl font-bold mb-8 text-center">Performance Optimized</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <OptimizedFadeIn className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <h3 className="font-semibold mb-2">Optimized Fade</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    GPU-accelerated with reduced motion support
                  </p>
                </OptimizedFadeIn>

                <OptimizedSlideUp className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <h3 className="font-semibold mb-2">Optimized Slide</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Respects user motion preferences automatically
                  </p>
                </OptimizedSlideUp>

                <OptimizedScale className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <h3 className="font-semibold mb-2">Optimized Scale</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Includes performance monitoring and adaptation
                  </p>
                </OptimizedScale>
              </div>

              <div className="text-center p-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                  Accessibility Note
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  All animations respect the <code>prefers-reduced-motion</code> setting and 
                  include fallbacks for users who prefer reduced motion.
                </p>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>

      {/* Footer */}
      <FadeIn delay={1.6}>
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl">
          <h3 className="text-xl font-semibold mb-4">Ready to implement?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            All animations are ready to use in your blog with full TypeScript support and accessibility features.
          </p>
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </FadeIn>
    </div>
  )
}