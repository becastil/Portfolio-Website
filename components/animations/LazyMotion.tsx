'use client'

import { lazy, Suspense, ReactNode } from 'react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

// Lazy load heavy animation components
const HeavyAnimation = lazy(() => import('./HeavyAnimation'))

interface LazyMotionProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  once?: boolean
  className?: string
}

export default function LazyMotion({
  children,
  fallback,
  threshold = 0.1,
  once = true,
  className = '',
}: LazyMotionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  return (
    <div ref={ref} className={className}>
      {isInView ? (
        <Suspense fallback={fallback || <div>{children}</div>}>
          {children}
        </Suspense>
      ) : (
        fallback || <div className="min-h-[100px]">{/* Placeholder */}</div>
      )}
    </div>
  )
}

// Intersection Observer based lazy loading for animations
export function useAnimationInView(threshold = 0.1, once = true) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  return [ref, isInView] as const
}