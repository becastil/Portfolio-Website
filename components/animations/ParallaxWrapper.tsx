'use client'

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ParallaxWrapperProps {
  children: ReactNode
  offset?: number
  speed?: number
  className?: string
  direction?: 'up' | 'down'
}

export default function ParallaxWrapper({
  children,
  offset = 50,
  speed = 0.5,
  className = '',
  direction = 'up',
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' 
      ? [offset, -offset * speed] 
      : [-offset, offset * speed]
  )

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}