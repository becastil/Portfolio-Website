'use client'

import { ReactNode, useEffect, useState } from 'react'
import { motion, MotionProps, useReducedMotion } from 'framer-motion'

interface MotionWrapperProps extends MotionProps {
  children: ReactNode
  fallback?: ReactNode
  reduceMotion?: boolean
  className?: string
}

export default function MotionWrapper({
  children,
  fallback,
  reduceMotion = true,
  className = '',
  initial,
  animate,
  transition,
  ...motionProps
}: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render motion components on server to prevent hydration mismatch
  if (!isClient) {
    return <div className={className}>{fallback || children}</div>
  }

  // If user prefers reduced motion and we should respect it
  if (shouldReduceMotion && reduceMotion) {
    return <div className={className}>{fallback || children}</div>
  }

  // Create optimized transitions for performance
  const optimizedTransition = shouldReduceMotion 
    ? { duration: 0 }
    : {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        ...transition,
      }

  const optimizedInitial = shouldReduceMotion ? {} : initial
  const optimizedAnimate = shouldReduceMotion ? {} : animate

  return (
    <motion.div
      className={className}
      initial={optimizedInitial}
      animate={optimizedAnimate}
      transition={optimizedTransition}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}