'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useAccessibility, useAriaLiveRegion } from '@/hooks/useAccessibility'

interface Position {
  x: number
  y: number
}

interface Velocity {
  x: number
  y: number
  magnitude: number
}

// Performance constants
const LERP_FACTOR = 0.08 // Smooth interpolation factor
const UPDATE_THRESHOLD = 0.01 // Minimum change to trigger update
const GRADIENT_SIZE_LARGE = 600
const GRADIENT_SIZE_MEDIUM = 500
const GRADIENT_SIZE_SMALL = 400
const FPS_TARGET = 60
const FRAME_DURATION = 1000 / FPS_TARGET
const VELOCITY_DECAY = 0.95 // Momentum decay factor
const MAX_VELOCITY = 100 // Maximum velocity magnitude

export default function HeroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const shouldReduceMotion = useReducedMotion()
  
  // Use advanced accessibility hook
  const {
    announceToScreenReader,
    prefersReducedMotion,
    prefersHighContrast
  } = useAccessibility()
  
  const { announce } = useAriaLiveRegion()
  
  // State management
  const [mousePosition, setMousePosition] = useState<Position>({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isKeyboardControlled, setIsKeyboardControlled] = useState(false)
  
  // Position tracking with velocity
  const targetPosition = useRef<Position>({ x: 50, y: 50 })
  const currentPosition = useRef<Position>({ x: 50, y: 50 })
  const velocity = useRef<Velocity>({ x: 0, y: 0, magnitude: 0 })
  const lastUpdateTime = useRef<number>(0)
  
  // Performance tracking
  const lastFrameTime = useRef<number>(0)
  const frameCount = useRef<number>(0)
  const viewportBounds = useRef<DOMRect | null>(null)
  
  // Touch tracking for mobile
  const lastTouchPosition = useRef<Position | null>(null)
  const touchVelocity = useRef<Velocity>({ x: 0, y: 0, magnitude: 0 })
  
  // Determine if we should reduce motion
  const shouldReduceMotionValue = shouldReduceMotion || prefersReducedMotion()
  const isHighContrast = prefersHighContrast()
  
  // Calculate dynamic gradient size based on viewport
  const getResponsiveGradientSize = useCallback((baseSize: number) => {
    if (typeof window === 'undefined') return baseSize
    
    const vw = window.innerWidth
    if (vw < 640) return baseSize * 0.7 // Mobile
    if (vw < 1024) return baseSize * 0.85 // Tablet
    return baseSize // Desktop
  }, [])
  
  // Lerp function with velocity-aware factor
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }
  
  // Calculate velocity from position changes
  const calculateVelocity = useCallback((oldPos: Position, newPos: Position, deltaTime: number) => {
    if (deltaTime === 0) return { x: 0, y: 0, magnitude: 0 }
    
    const vx = (newPos.x - oldPos.x) / deltaTime * 1000
    const vy = (newPos.y - oldPos.y) / deltaTime * 1000
    const magnitude = Math.sqrt(vx * vx + vy * vy)
    
    return {
      x: Math.min(Math.max(vx, -MAX_VELOCITY), MAX_VELOCITY),
      y: Math.min(Math.max(vy, -MAX_VELOCITY), MAX_VELOCITY),
      magnitude: Math.min(magnitude, MAX_VELOCITY)
    }
  }, [])
  
  // Get dynamic color based on position (bilinear interpolation)
  const getPositionBasedColor = useCallback((x: number, y: number, layer: number) => {
    // Define corner colors for each layer
    const layerColors = [
      { // Primary layer - blue to purple
        topLeft: { h: 245, s: 84, l: 60 },     // Blue
        topRight: { h: 280, s: 65, l: 60 },    // Purple
        bottomLeft: { h: 220, s: 70, l: 55 },  // Deep blue
        bottomRight: { h: 260, s: 75, l: 65 }  // Light purple
      },
      { // Secondary layer - green to teal
        topLeft: { h: 158, s: 64, l: 52 },     // Green
        topRight: { h: 180, s: 60, l: 50 },    // Cyan
        bottomLeft: { h: 140, s: 55, l: 48 },  // Darker green
        bottomRight: { h: 170, s: 70, l: 55 }  // Teal
      },
      { // Accent layer - violet variations
        topLeft: { h: 280, s: 65, l: 60 },     // Violet
        topRight: { h: 300, s: 60, l: 65 },    // Magenta
        bottomLeft: { h: 260, s: 70, l: 55 },  // Blue-violet
        bottomRight: { h: 290, s: 55, l: 60 }  // Purple-magenta
      }
    ]
    
    const colors = layerColors[layer % 3]
    
    // Bilinear interpolation
    const xRatio = x / 100
    const yRatio = y / 100
    
    const topColor = {
      h: lerp(colors.topLeft.h, colors.topRight.h, xRatio),
      s: lerp(colors.topLeft.s, colors.topRight.s, xRatio),
      l: lerp(colors.topLeft.l, colors.topRight.l, xRatio)
    }
    
    const bottomColor = {
      h: lerp(colors.bottomLeft.h, colors.bottomRight.h, xRatio),
      s: lerp(colors.bottomLeft.s, colors.bottomRight.s, xRatio),
      l: lerp(colors.bottomLeft.l, colors.bottomRight.l, xRatio)
    }
    
    const finalColor = {
      h: lerp(topColor.h, bottomColor.h, yRatio),
      s: lerp(topColor.s, bottomColor.s, yRatio),
      l: lerp(topColor.l, bottomColor.l, yRatio)
    }
    
    return `hsl(${finalColor.h}, ${finalColor.s}%, ${finalColor.l}%)`
  }, [])
  
  // Get dynamic blend mode based on velocity
  const getVelocityBasedBlendMode = useCallback((velocity: number) => {
    if (velocity < 20) return 'normal'
    if (velocity < 50) return 'screen'
    return 'color-dodge'
  }, [])
  
  // Animation loop with FPS limiting and performance optimization
  const animate = useCallback((timestamp: number) => {
    if (shouldReduceMotionValue || isPaused) return
    
    // FPS limiting
    const deltaTime = timestamp - lastFrameTime.current
    if (deltaTime < FRAME_DURATION) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }
    
    // Performance tracking in development
    if (process.env.NODE_ENV === 'development') {
      frameCount.current++
      const now = performance.now()
      if (now - lastUpdateTime.current >= 1000) {
        console.debug(`HeroOverlay FPS: ${frameCount.current}`)
        frameCount.current = 0
        lastUpdateTime.current = now
      }
    }
    
    // Apply momentum/velocity decay for touch gestures
    if (touchVelocity.current.magnitude > 0.1) {
      targetPosition.current.x += touchVelocity.current.x * 0.1
      targetPosition.current.y += touchVelocity.current.y * 0.1
      
      // Clamp to bounds
      targetPosition.current.x = Math.max(0, Math.min(100, targetPosition.current.x))
      targetPosition.current.y = Math.max(0, Math.min(100, targetPosition.current.y))
      
      // Apply decay
      touchVelocity.current.x *= VELOCITY_DECAY
      touchVelocity.current.y *= VELOCITY_DECAY
      touchVelocity.current.magnitude = Math.sqrt(
        touchVelocity.current.x ** 2 + touchVelocity.current.y ** 2
      )
    }
    
    // Calculate velocity for dynamic effects
    const currentVelocity = calculateVelocity(
      currentPosition.current,
      targetPosition.current,
      deltaTime
    )
    velocity.current = currentVelocity
    
    // Adaptive lerp factor based on velocity
    const adaptiveLerpFactor = Math.min(
      LERP_FACTOR * (1 + currentVelocity.magnitude * 0.001),
      0.2
    )
    
    // Smooth interpolation
    const newX = lerp(
      currentPosition.current.x,
      targetPosition.current.x,
      adaptiveLerpFactor
    )
    const newY = lerp(
      currentPosition.current.y,
      targetPosition.current.y,
      adaptiveLerpFactor
    )
    
    // Only update if there's meaningful change
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
    
    lastFrameTime.current = timestamp
    rafRef.current = requestAnimationFrame(animate)
  }, [shouldReduceMotionValue, isPaused, calculateVelocity])
  
  // Update viewport bounds (cached for performance)
  const updateViewportBounds = useCallback(() => {
    if (containerRef.current) {
      viewportBounds.current = containerRef.current.getBoundingClientRect()
    }
  }, [])
  
  // Handle pointer movement (works for both mouse and touch)
  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || shouldReduceMotionValue || isPaused) return
    
    const rect = viewportBounds.current || containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    
    // Clamp values between 0 and 100
    targetPosition.current = { 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    }
    
    // Clear keyboard control when mouse/touch is used
    if (isKeyboardControlled) {
      setIsKeyboardControlled(false)
    }
  }, [shouldReduceMotionValue, isPaused, isKeyboardControlled])
  
  // Handle mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY)
  }, [handlePointerMove])
  
  // Handle touch movement with velocity tracking
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      
      // Calculate touch velocity
      if (lastTouchPosition.current) {
        const deltaTime = 16 // Approximate frame time
        const vx = (touch.clientX - lastTouchPosition.current.x) / deltaTime
        const vy = (touch.clientY - lastTouchPosition.current.y) / deltaTime
        
        touchVelocity.current = {
          x: vx,
          y: vy,
          magnitude: Math.sqrt(vx * vx + vy * vy)
        }
      }
      
      lastTouchPosition.current = { x: touch.clientX, y: touch.clientY }
      handlePointerMove(touch.clientX, touch.clientY)
    }
  }, [handlePointerMove])
  
  // Handle touch end for momentum
  const handleTouchEnd = useCallback(() => {
    lastTouchPosition.current = null
    // Velocity will decay automatically in animation loop
  }, [])
  
  // Handle keyboard controls for accessibility
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (shouldReduceMotionValue) return
    
    let didMove = false
    const step = e.shiftKey ? 10 : 5 // Larger steps with shift
    
    switch(e.key) {
      case ' ':
      case 'Space':
        e.preventDefault()
        setIsPaused(prev => {
          const newState = !prev
          announceToScreenReader(
            newState ? 'Gradient animation paused' : 'Gradient animation resumed'
          )
          return newState
        })
        break
        
      case 'ArrowUp':
        e.preventDefault()
        targetPosition.current.y = Math.max(0, targetPosition.current.y - step)
        didMove = true
        break
        
      case 'ArrowDown':
        e.preventDefault()
        targetPosition.current.y = Math.min(100, targetPosition.current.y + step)
        didMove = true
        break
        
      case 'ArrowLeft':
        e.preventDefault()
        targetPosition.current.x = Math.max(0, targetPosition.current.x - step)
        didMove = true
        break
        
      case 'ArrowRight':
        e.preventDefault()
        targetPosition.current.x = Math.min(100, targetPosition.current.x + step)
        didMove = true
        break
        
      case 'Home':
        e.preventDefault()
        targetPosition.current = { x: 0, y: 0 }
        didMove = true
        break
        
      case 'End':
        e.preventDefault()
        targetPosition.current = { x: 100, y: 100 }
        didMove = true
        break
        
      case 'c':
      case 'C':
        e.preventDefault()
        targetPosition.current = { x: 50, y: 50 }
        didMove = true
        announceToScreenReader('Gradient centered')
        break
    }
    
    if (didMove) {
      setIsKeyboardControlled(true)
      announce(`Gradient position: ${Math.round(targetPosition.current.x)}%, ${Math.round(targetPosition.current.y)}%`)
    }
  }, [shouldReduceMotionValue, announceToScreenReader, announce])
  
  // Handle mouse enter/leave for visibility control
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    updateViewportBounds()
    
    if (!rafRef.current && !shouldReduceMotionValue && !isPaused) {
      lastFrameTime.current = performance.now()
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [animate, shouldReduceMotionValue, isPaused, updateViewportBounds])
  
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    // Return to center when not hovering (unless keyboard controlled)
    if (!isKeyboardControlled) {
      targetPosition.current = { x: 50, y: 50 }
    }
    // Reset touch velocity
    touchVelocity.current = { x: 0, y: 0, magnitude: 0 }
  }, [isKeyboardControlled])
  
  // Setup event listeners and animation loop
  useEffect(() => {
    // Add keyboard listener
    window.addEventListener('keydown', handleKeyDown)
    
    // Add resize listener with passive flag
    const handleResize = () => {
      updateViewportBounds()
    }
    window.addEventListener('resize', handleResize, { passive: true })
    
    // Initial bounds calculation
    updateViewportBounds()
    
    // Start animation loop if not reducing motion
    if (!shouldReduceMotionValue && !rafRef.current && !isPaused) {
      lastFrameTime.current = performance.now()
      rafRef.current = requestAnimationFrame(animate)
    }
    
    return () => {
      // Cleanup
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [shouldReduceMotionValue, animate, isPaused, handleKeyDown, updateViewportBounds])
  
  // Calculate dynamic opacity based on velocity
  const dynamicOpacity = useMemo(() => {
    const baseOpacity = isHovering 
      ? 'var(--overlay-opacity-hover)' 
      : 'var(--overlay-opacity-rest)'
    
    // Increase opacity with velocity (capped at 2x)
    const velocityMultiplier = Math.min(1 + velocity.current.magnitude * 0.01, 2)
    
    if (isHighContrast) {
      // Higher opacity for high contrast mode
      return `calc(${baseOpacity} * 1.5 * ${velocityMultiplier})`
    }
    
    return `calc(${baseOpacity} * ${velocityMultiplier})`
  }, [isHovering, isHighContrast, velocity.current.magnitude])
  
  // Static fallback for reduced motion
  if (shouldReduceMotionValue) {
    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
        role="presentation"
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
            opacity: isHighContrast ? 'calc(var(--overlay-opacity-rest) * 1.5)' : 'var(--overlay-opacity-rest)',
          }}
        />
      </div>
    )
  }
  
  // Calculate responsive gradient sizes
  const gradientSizes = {
    large: getResponsiveGradientSize(GRADIENT_SIZE_LARGE),
    medium: getResponsiveGradientSize(GRADIENT_SIZE_MEDIUM),
    small: getResponsiveGradientSize(GRADIENT_SIZE_SMALL)
  }
  
  // Parallax layer configurations
  const parallaxLayers = [
    { size: gradientSizes.large, speed: 1, offset: { x: 0, y: 0 }, opacity: 1 },
    { size: gradientSizes.medium, speed: 0.7, offset: { x: 10, y: -10 }, opacity: 0.8 },
    { size: gradientSizes.small, speed: 0.5, offset: { x: -5, y: 15 }, opacity: 0.5 }
  ]
  
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      role="presentation"
      aria-label="Interactive gradient overlay"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleMouseEnter}
      onTouchEnd={(e) => {
        handleTouchEnd()
        handleMouseLeave()
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        // Enhanced containment for performance
        contain: 'paint layout style',
        // Prevent scrolling on touch devices during interaction
        touchAction: isHovering ? 'none' : 'auto',
      }}
    >
      {/* Render parallax layers */}
      {parallaxLayers.map((layer, index) => {
        // Calculate parallax position
        const layerX = mousePosition.x * layer.speed + layer.offset.x
        const layerY = mousePosition.y * layer.speed + layer.offset.y
        
        // Get position-based color for this layer
        const gradientColor = getPositionBasedColor(layerX, layerY, index)
        
        // Get velocity-based blend mode
        const blendMode = getVelocityBasedBlendMode(velocity.current.magnitude)
        
        return (
          <div
            key={index}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${layer.size}px`,
              height: `${layer.size}px`,
              background: `radial-gradient(circle at center, ${gradientColor}, transparent ${60 + index * 5}%)`,
              filter: `blur(calc(var(--overlay-blur-amount) * ${1 + index * 0.25}))`,
              opacity: `calc(${dynamicOpacity} * ${layer.opacity})`,
              transform: 'translate(-50%, -50%)',
              left: `${layerX}%`,
              top: `${layerY}%`,
              transition: 'opacity var(--duration-slow) var(--ease-out-expo)',
              willChange: 'transform, opacity, filter',
              mixBlendMode: index === 0 
                ? `var(--overlay-blend-mode-primary, ${blendMode})`
                : index === 1 
                  ? `var(--overlay-blend-mode-secondary, screen)`
                  : `var(--overlay-blend-mode-accent, color-dodge)`,
            }}
          />
        )
      })}
      
      {/* Keyboard control indicator */}
      {isKeyboardControlled && (
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/50 text-white text-sm"
          aria-live="polite"
        >
          Keyboard control active
        </div>
      )}
      
      {/* Debug overlay in development */}
      {process.env.NODE_ENV === 'development' && (
        <div
          className="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-black/50 text-white text-xs font-mono"
          style={{ fontSize: '10px', lineHeight: '1.2' }}
        >
          <div>Pos: {Math.round(mousePosition.x)}, {Math.round(mousePosition.y)}</div>
          <div>Vel: {Math.round(velocity.current.magnitude)}</div>
          <div>Blend: {getVelocityBasedBlendMode(velocity.current.magnitude)}</div>
          <div>Paused: {isPaused ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  )
}