'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

export default function Hero() {
  const shouldReduceMotion = useReducedMotion()
  const [isHoveringPrimary, setIsHoveringPrimary] = useState(false)
  const [isHoveringSecondary, setIsHoveringSecondary] = useState(false)

  // Sophisticated stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 24,
      filter: 'blur(4px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        ease: [0.2, 0.6, 0, 1], // Formless-inspired easing
      }
    }
  }

  // Button hover animation with depth
  const buttonHoverVariants = {
    rest: {
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 1, 0.5, 1]
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.19, 1, 0.22, 1]
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: 'linear'
      }
    }
  }

  // Arrow animation for primary button
  const arrowVariants = {
    rest: { x: 0 },
    hover: { 
      x: 4,
      transition: {
        duration: 0.3,
        ease: [0.2, 0.6, 0, 1]
      }
    }
  }

  return (
    <section 
      className="relative bg-[var(--bg)] text-[var(--text)] py-24 sm:py-32 overflow-hidden" 
      aria-labelledby="hero-heading"
    >
      {/* Subtle background gradient for depth */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, var(--accent), transparent 60%)'
        }}
      />
      
      <div className="mx-auto max-w-[66ch] px-4 sm:px-6 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Main heading with sophisticated entrance */}
          <motion.h1 
            id="hero-heading" 
            variants={itemVariants}
            className="text-[clamp(2.6rem,3.8vw,4.2rem)] leading-tight tracking-[-0.01em] font-bold"
            style={{
              willChange: shouldReduceMotion ? 'auto' : 'transform, opacity, filter'
            }}
          >
            Ben Castillo
          </motion.h1>
          
          {/* Description with subtle fade-in */}
          <motion.p 
            variants={itemVariants}
            className="mt-4 text-[17px] leading-relaxed text-[var(--muted)]"
            style={{
              willChange: shouldReduceMotion ? 'auto' : 'transform, opacity, filter'
            }}
          >
            Full-stack developer passionate about creating elegant solutions to complex problems. 
            Specializing in modern web technologies and cloud architecture.
          </motion.p>
          
          {/* CTA buttons with enhanced interactions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-8"
            style={{
              willChange: shouldReduceMotion ? 'auto' : 'transform, opacity'
            }}
          >
            {/* Primary CTA with sophisticated hover state */}
            <motion.a
              href="#projects"
              className="relative inline-flex items-center rounded-xl bg-[var(--accent)] text-[var(--accent-ink)] px-6 py-3 overflow-hidden group"
              variants={buttonHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setIsHoveringPrimary(true)}
              onHoverEnd={() => setIsHoveringPrimary(false)}
              style={{
                boxShadow: isHoveringPrimary && !shouldReduceMotion
                  ? 'var(--shadow-hover-primary)' 
                  : 'var(--shadow-sm)',
                transition: 'box-shadow var(--duration-normal) var(--ease-out-expo)',
                willChange: shouldReduceMotion ? 'auto' : 'transform'
              }}
            >
              {/* Subtle gradient overlay on hover */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                animate={{
                  opacity: isHoveringPrimary && !shouldReduceMotion ? 0.1 : 0,
                  x: isHoveringPrimary && !shouldReduceMotion ? ['-100%', '100%'] : '-100%'
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  x: { duration: 1.2, ease: 'linear' }
                }}
                style={{ mixBlendMode: 'overlay' }}
              />
              
              <span className="relative z-10 font-medium">View Projects</span>
              
              <motion.svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="ml-2 relative z-10"
                variants={arrowVariants}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </motion.svg>
            </motion.a>
            
            {/* Secondary CTA with border animation */}
            <motion.a
              href="#contact"
              className="relative inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--text)] px-6 py-3 overflow-hidden group"
              variants={buttonHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setIsHoveringSecondary(true)}
              onHoverEnd={() => setIsHoveringSecondary(false)}
              style={{
                boxShadow: isHoveringSecondary && !shouldReduceMotion
                  ? 'var(--shadow-hover-secondary)' 
                  : '0 0 0 0 transparent',
                backgroundColor: isHoveringSecondary && !shouldReduceMotion
                  ? 'var(--panel-2)'
                  : 'var(--panel)',
                transition: 'all var(--duration-normal) var(--ease-formless)',
                willChange: shouldReduceMotion ? 'auto' : 'transform, box-shadow, background-color'
              }}
            >
              {/* Animated border effect */}
              <motion.span
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(90deg, var(--accent), transparent)',
                  opacity: 0,
                  transition: 'opacity var(--duration-normal) ease-out'
                }}
                animate={{
                  opacity: isHoveringSecondary && !shouldReduceMotion ? 0.1 : 0
                }}
              />
              
              <span className="relative z-10 font-medium">Get In Touch</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Optional: Subtle parallax decorative element */}
      <motion.div
        className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, var(--accent), transparent)',
          filter: 'blur(40px)'
        }}
        animate={{
          y: shouldReduceMotion ? 0 : [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </section>
  )
}