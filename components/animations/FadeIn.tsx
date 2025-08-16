'use client'

import { motion, useInView, HTMLMotionProps } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface FadeInProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: ReactNode
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
  blur?: boolean
  scale?: boolean
  className?: string
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  once = true,
  threshold = 0.1,
  blur = false,
  scale = false,
  className = '',
  ...props
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const initialState = {
    opacity: 0,
    ...(blur && { filter: 'blur(10px)' }),
    ...(scale && { scale: 0.8 }),
  }

  const animateState = isInView
    ? {
        opacity: 1,
        ...(blur && { filter: 'blur(0px)' }),
        ...(scale && { scale: 1 }),
      }
    : {}

  return (
    <motion.div
      ref={ref}
      initial={initialState}
      animate={animateState}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}