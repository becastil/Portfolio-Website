'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Position {
  x: number
  y: number
}

// Performance constants
const LERP_FACTOR = 0.08 // Smooth interpolation factor
const UPDATE_THRESHOLD = 0.01 // Minimum change to trigger update
const GRADIENT_SIZE_LARGE = 600
const GRADIENT_SIZE_MEDIUM = 500
const GRADIENT_SIZE_SMALL = 400

export default function HeroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const shouldReduceMotion = useReducedMotion()
  
  // Track mouse/touch position
  const [mousePosition, setMousePosition] = useState<Position>({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  
  // Smooth position tracking with requestAnimationFrame
  const targetPosition = useRef<Position>({ x: 50, y: 50 })
  const currentPosition = useRef<Position>({ x: 50, y: 50 })
  
  // Performance tracking (development only)
  const lastFrameTime = useRef<number>(0)
  const frameCount = useRef<number>(0)
  
  // Lerp function for smooth animation
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }
  
  // Animation loop with performance optimization
  const animate = useCallback(() => {
    if (shouldReduceMotion) return
    
    // Performance tracking in development
    if (process.env.NODE_ENV === 'development') {
      frameCount.current++
      const now = performance.now()
      if (now - lastFrameTime.current >= 1000) {
        // Log FPS every second in development
        console.debug(`HeroOverlay FPS: ${frameCount.current}`)
        frameCount.current = 0
        lastFrameTime.current = now
      }
    }
    
    // Smooth interpolation
    const newX = lerp(
      currentPosition.current.x,
      targetPosition.current.x,
      LERP_FACTOR
    )
    const newY = lerp(
      currentPosition.current.y,
      targetPosition.current.y,
      LERP_FACTOR
    )
    
    // Only update if there's meaningful change (performance optimization)
    if (
      Math.abs(newX - currentPosition.current.x) > UPDATE_THRESHOLD ||
      Math.abs(newY - currentPosition.current.y) > UPDATE_THRESHOLD
    ) {
      currentPosition.current.x = newX
      currentPosition.current.y = newY
      
      setMousePosition({
        x: newX,
        y: newY
      })
    }
    
    rafRef.current = requestAnimationFrame(animate)
  }, [shouldReduceMotion])
  
  // Handle pointer movement (works for both mouse and touch)
  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || shouldReduceMotion) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    
    // Clamp values between 0 and 100
    targetPosition.current = { 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    }
  }, [shouldReduceMotion])
  
  // Handle mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY)
  }, [handlePointerMove])
  
  // Handle touch movement (mobile support)
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      handlePointerMove(touch.clientX, touch.clientY)
    }
  }, [handlePointerMove])
  
  // Handle mouse enter/leave for visibility control
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    if (!rafRef.current && !shouldReduceMotion) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [animate, shouldReduceMotion])
  
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    // Return to center when not hovering
    targetPosition.current = { x: 50, y: 50 }
  }, [])
  
  useEffect(() => {
    // Start animation loop if not reducing motion
    if (!shouldReduceMotion && !rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
      lastFrameTime.current = performance.now()
    }
    
    return () => {
      // Cleanup animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [shouldReduceMotion, animate])
  
  // Static fallback for reduced motion
  if (shouldReduceMotion) {
    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 30% 40%, var(--overlay-blue), transparent 40%),
              radial-gradient(circle at 70% 60%, var(--overlay-green), transparent 40%)
            `,
            filter: 'blur(var(--overlay-blur-amount))',
            opacity: 'var(--overlay-opacity-rest)',
          }}
        />
      </div>
    )
  }
  
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
      style={{
        // Ensure overlay is positioned correctly
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        // Use contain for performance
        contain: 'paint layout',
      }}
    >
      
      {/* Blue gradient overlay */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: `${GRADIENT_SIZE_LARGE}px`,
          height: `${GRADIENT_SIZE_LARGE}px`,
          background: 'radial-gradient(circle at center, var(--overlay-blue), transparent 60%)',
          filter: 'blur(var(--overlay-blur-amount))',
          opacity: isHovering ? 'var(--overlay-opacity-hover)' : 'var(--overlay-opacity-rest)',
          transform: 'translate(-50%, -50%)',
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transition: 'opacity var(--duration-slow) var(--ease-out-expo)',
          willChange: 'transform, opacity',
          mixBlendMode: 'var(--overlay-blend-mode-primary, screen)',
        }}
      />
      
      {/* Green gradient overlay - offset for depth */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: `${GRADIENT_SIZE_MEDIUM}px`,
          height: `${GRADIENT_SIZE_MEDIUM}px`,
          background: 'radial-gradient(circle at center, var(--overlay-green), transparent 65%)',
          filter: 'blur(calc(var(--overlay-blur-amount) * 0.75))',
          opacity: isHovering 
            ? 'calc(var(--overlay-opacity-hover) * 0.8)' 
            : 'calc(var(--overlay-opacity-rest) * 0.8)',
          transform: 'translate(-50%, -50%)',
          // Offset the green gradient slightly for a more dynamic effect
          left: `${mousePosition.x + 10}%`,
          top: `${mousePosition.y - 10}%`,
          transition: 'opacity var(--duration-slow) var(--ease-out-expo)',
          willChange: 'transform, opacity',
          mixBlendMode: 'var(--overlay-blend-mode-secondary, screen)',
        }}
      />
      
      {/* Additional subtle accent gradient for depth */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: `${GRADIENT_SIZE_SMALL}px`,
          height: `${GRADIENT_SIZE_SMALL}px`,
          background: 'radial-gradient(circle at center, var(--overlay-accent, var(--overlay-blue)), transparent 50%)',
          filter: 'blur(calc(var(--overlay-blur-amount) * 1.25))',
          opacity: isHovering 
            ? 'calc(var(--overlay-opacity-hover) * 0.5)' 
            : 'calc(var(--overlay-opacity-rest) * 0.5)',
          transform: 'translate(-50%, -50%)',
          left: `${mousePosition.x - 5}%`,
          top: `${mousePosition.y + 15}%`,
          transition: 'opacity var(--duration-deliberate) var(--ease-out-expo)',
          willChange: 'transform, opacity',
          mixBlendMode: 'var(--overlay-blend-mode-accent, color-dodge)',
        }}
      />
    </div>
  )
}