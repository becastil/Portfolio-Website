'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface TextRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
  staggerChildren?: number
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  splitBy?: 'character' | 'word' | 'line'
}

export default function TextReveal({
  children,
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.1,
  staggerChildren = 0.02,
  className = '',
  as: Component = 'div',
  splitBy = 'word',
}: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const text = typeof children === 'string' ? children : ''
  
  const splitText = () => {
    switch (splitBy) {
      case 'character':
        return text.split('')
      case 'word':
        return text.split(' ')
      case 'line':
        return text.split('\n')
      default:
        return text.split(' ')
    }
  }

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
      y: 75,
      rotateX: -90,
      transformOrigin: 'bottom',
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transformOrigin: 'bottom',
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // If not a string, render without animation
  if (typeof children !== 'string') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  const textElements = splitText()

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {Component === 'div' ? (
        <div className="overflow-hidden">
          {textElements.map((element, index) => (
            <motion.span
              key={index}
              variants={itemVariants}
              className="inline-block"
              style={{ 
                marginRight: splitBy === 'word' ? '0.25em' : '0',
                whiteSpace: splitBy === 'line' ? 'pre' : 'normal'
              }}
            >
              {element}
              {splitBy === 'line' && index < textElements.length - 1 && <br />}
            </motion.span>
          ))}
        </div>
      ) : (
        <Component className="overflow-hidden">
          {textElements.map((element, index) => (
            <motion.span
              key={index}
              variants={itemVariants}
              className="inline-block"
              style={{ 
                marginRight: splitBy === 'word' ? '0.25em' : '0',
                whiteSpace: splitBy === 'line' ? 'pre' : 'normal'
              }}
            >
              {element}
              {splitBy === 'line' && index < textElements.length - 1 && <br />}
            </motion.span>
          ))}
        </Component>
      )}
    </motion.div>
  )
}