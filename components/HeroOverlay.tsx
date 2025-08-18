'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Position {
  x: number
  y: number
}

export default function HeroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const shouldReduceMotion = useReducedMotion()
  
  // Track mouse/touch position
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  // Smooth position tracking with requestAnimationFrame
  const targetPosition = useRef<Position>({ x: 0, y: 0 })
  const currentPosition = useRef<Position>({ x: 0, y: 0 })
  
  // Lerp function for smooth animation
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }
  
  // Animation loop with performance optimization
  const animate = () => {
    if (shouldReduceMotion) return
    
    // Smooth interpolation - adjust factor for different smoothness
    const lerpFactor = 0.08 // Slightly slower for smoother motion
    const newX = lerp(
      currentPosition.current.x,
      targetPosition.current.x,
      lerpFactor
    )
    const newY = lerp(
      currentPosition.current.y,
      targetPosition.current.y,
      lerpFactor
    )
    
    // Only update if there's meaningful change (performance optimization)
    const threshold = 0.01
    if (
      Math.abs(newX - currentPosition.current.x) > threshold ||
      Math.abs(newY - currentPosition.current.y) > threshold
    ) {
      currentPosition.current.x = newX
      currentPosition.current.y = newY
      
      setMousePosition({
        x: newX,
        y: newY
      })
    }
    
    rafRef.current = requestAnimationFrame(animate)
  }
  
  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || shouldReduceMotion) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    targetPosition.current = { x, y }
  }
  
  // Handle touch movement (mobile support)
  const handleTouchMove = (e: TouchEvent) => {
    if (!containerRef.current || shouldReduceMotion) return
    
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100
    
    targetPosition.current = { x, y }
  }
  
  // Handle mouse enter/leave for visibility control
  const handleMouseEnter = () => {
    setIsHovering(true)
    if (!rafRef.current && !shouldReduceMotion) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }
  
  const handleMouseLeave = () => {
    setIsHovering(false)
    // Optionally keep animation running for smooth fade-out
    // Or center the gradients when not hovering
    targetPosition.current = { x: 50, y: 50 }
  }
  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    // Set initial position to center
    targetPosition.current = { x: 50, y: 50 }
    currentPosition.current = { x: 50, y: 50 }
    
    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('touchmove', handleTouchMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)
    
    // Start animation loop if not reducing motion
    if (!shouldReduceMotion) {
      rafRef.current = requestAnimationFrame(animate)
    }
    
    return () => {
      // Cleanup
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [shouldReduceMotion])
  
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
            filter: `blur(var(--overlay-blur-amount))`,
            opacity: 0.15,
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
      style={{
        // Ensure overlay is positioned correctly
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        pointerEvents: 'none', // Don't block interactions with content
      }}
    >
      {/* Container for mouse events */}
      <div
        className="absolute inset-0"
        style={{
          pointerEvents: 'auto',
          zIndex: 0,
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
          targetPosition.current = { x, y }
        }}
        onMouseEnter={() => {
          setIsHovering(true)
          if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(animate)
          }
        }}
        onMouseLeave={() => {
          setIsHovering(false)
          targetPosition.current = { x: 50, y: 50 }
        }}
      />
      
      {/* Blue gradient overlay */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, var(--overlay-blue), transparent 60%)`,
          filter: `blur(var(--overlay-blur-amount))`,
          opacity: isHovering ? `var(--overlay-opacity-hover)` : `var(--overlay-opacity-rest)`,
          transform: `translate(-50%, -50%)`,
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transition: 'opacity var(--duration-slow) var(--ease-out-expo)',
          willChange: 'transform, opacity',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Green gradient overlay - offset for depth */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, var(--overlay-green), transparent 65%)`,
          filter: `blur(calc(var(--overlay-blur-amount) * 0.75))`,
          opacity: isHovering 
            ? `calc(var(--overlay-opacity-hover) * 0.8)` 
            : `calc(var(--overlay-opacity-rest) * 0.8)`,
          transform: `translate(-50%, -50%)`,
          // Offset the green gradient slightly for a more dynamic effect
          left: `${mousePosition.x + 10}%`,
          top: `${mousePosition.y - 10}%`,
          transition: 'opacity var(--duration-slow) var(--ease-out-expo)',
          willChange: 'transform, opacity',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Additional subtle accent gradient for depth */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, var(--overlay-accent, var(--overlay-blue)), transparent 50%)`,
          filter: `blur(calc(var(--overlay-blur-amount) * 1.25))`,
          opacity: isHovering 
            ? `calc(var(--overlay-opacity-hover) * 0.5)` 
            : `calc(var(--overlay-opacity-rest) * 0.5)`,
          transform: `translate(-50%, -50%)`,
          left: `${mousePosition.x - 5}%`,
          top: `${mousePosition.y + 15}%`,
          transition: 'opacity var(--duration-deliberate) var(--ease-out-expo)',
          willChange: 'transform, opacity',
          mixBlendMode: 'color-dodge',
        }}
      />
    </div>
  )
}