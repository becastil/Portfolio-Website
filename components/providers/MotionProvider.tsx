'use client'

import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

interface MotionProviderProps {
  children: ReactNode
}

export default function MotionProvider({ children }: MotionProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        transition={{
          duration: prefersReducedMotion ? 0 : 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        reducedMotion={prefersReducedMotion ? 'always' : 'never'}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}