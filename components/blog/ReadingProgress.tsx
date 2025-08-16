'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <>
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Circular Progress Indicator */}
      <div className="fixed bottom-8 left-8 z-50 hidden lg:block">
        <div className="relative w-16 h-16">
          {/* Background Circle */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
          </svg>
          
          {/* Progress Circle */}
          <svg className="absolute inset-0 w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={175.93} // 2 * π * 28
              style={{
                strokeDashoffset: useSpring(
                  useScroll().scrollYProgress.get() * 175.93,
                  { stiffness: 100, damping: 30 }
                )
              }}
              className="text-blue-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className="text-xs font-bold text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round(scrollYProgress.get() * 100)}%
            </motion.span>
          </div>
        </div>
      </div>
    </>
  )
}