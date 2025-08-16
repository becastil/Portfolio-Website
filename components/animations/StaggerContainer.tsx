'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode, Children, isValidElement } from 'react'

interface StaggerContainerProps {
  children: ReactNode
  delay?: number
  staggerChildren?: number
  once?: boolean
  threshold?: number
  className?: string
  direction?: 'vertical' | 'horizontal'
}

export default function StaggerContainer({
  children,
  delay = 0,
  staggerChildren = 0.1,
  once = true,
  threshold = 0.1,
  className = '',
  direction = 'vertical',
}: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren,
        delayChildren: delay,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'vertical' ? 30 : 0,
      x: direction === 'horizontal' ? 30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="w-full"
            >
              {child}
            </motion.div>
          )
        }
        return child
      })}
    </motion.div>
  )
}