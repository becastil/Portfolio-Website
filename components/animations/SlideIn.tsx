'use client'

import { motion, useInView, HTMLMotionProps } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface SlideInProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  distance?: number
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
  stagger?: number
  className?: string
}

export default function SlideIn({
  children,
  direction = 'up',
  distance = 100,
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.1,
  className = '',
  ...props
}: SlideInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const directionOffset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
            }
          : {}
      }
      transition={{
        duration,
        delay,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}