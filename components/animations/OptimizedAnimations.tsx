'use client'

import { motion, useReducedMotion, MotionProps } from 'framer-motion'
import { ReactNode, useMemo } from 'react'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

interface OptimizedMotionProps extends Omit<MotionProps, 'children'> {
  children: ReactNode
  enableGPUAcceleration?: boolean
  respectReducedMotion?: boolean
  className?: string
}

export function OptimizedMotion({
  children,
  enableGPUAcceleration = true,
  respectReducedMotion = true,
  className = '',
  initial,
  animate,
  transition,
  ...props
}: OptimizedMotionProps) {
  const shouldReduceMotion = useReducedMotion()
  const { isLowPerformance, getOptimizedAnimationSettings } = usePerformanceMonitor()

  const optimizedProps = useMemo(() => {
    const settings = getOptimizedAnimationSettings()
    
    // If reduced motion is preferred, disable animations
    if (shouldReduceMotion && respectReducedMotion) {
      return {
        initial: {},
        animate: {},
        transition: { duration: 0 },
      }
    }

    // Optimize for low performance
    const optimizedTransition = {
      duration: settings.duration,
      ease: settings.ease,
      ...transition,
    }

    // Add GPU acceleration for better performance
    const gpuAcceleration = enableGPUAcceleration
      ? {
          style: {
            willChange: 'transform',
            transform: 'translateZ(0)', // Force GPU layer
          },
        }
      : {}

    return {
      initial,
      animate,
      transition: optimizedTransition,
      ...gpuAcceleration,
    }
  }, [
    shouldReduceMotion,
    respectReducedMotion,
    isLowPerformance,
    getOptimizedAnimationSettings,
    enableGPUAcceleration,
    initial,
    animate,
    transition,
  ])

  return (
    <motion.div className={className} {...optimizedProps} {...props}>
      {children}
    </motion.div>
  )
}

// Pre-configured optimized animations for common use cases
export const OptimizedFadeIn = ({ children, ...props }: OptimizedMotionProps) => (
  <OptimizedMotion
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
    {...props}
  >
    {children}
  </OptimizedMotion>
)

export const OptimizedSlideUp = ({ children, ...props }: OptimizedMotionProps) => (
  <OptimizedMotion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    enableGPUAcceleration
    {...props}
  >
    {children}
  </OptimizedMotion>
)

export const OptimizedScale = ({ children, ...props }: OptimizedMotionProps) => (
  <OptimizedMotion
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
    enableGPUAcceleration
    {...props}
  >
    {children}
  </OptimizedMotion>
)