'use client'

import { motion, useInView, HTMLMotionProps } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ScaleInProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: ReactNode
  scale?: number
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
  bounce?: boolean
  className?: string
}

export default function ScaleIn({
  children,
  scale = 0.3,
  delay = 0,
  duration = 0.6,
  once = true,
  threshold = 0.1,
  bounce = false,
  className = '',
  ...props
}: ScaleInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const springConfig = bounce
    ? {
        type: 'spring' as const,
        stiffness: 200,
        damping: 10,
        mass: 0.8,
      }
    : {
        ease: [0.34, 1.56, 0.64, 1] as const,
      }

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        scale,
        filter: 'blur(10px)',
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
            }
          : {}
      }
      transition={{
        duration,
        delay,
        ...springConfig,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}