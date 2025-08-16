import { useEffect, useRef, useState } from 'react'

interface PerformanceMetrics {
  fps: number
  memory?: number
  loadTime: number
  renderTime: number
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    loadTime: 0,
    renderTime: 0,
  })
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const startTime = useRef(performance.now())

  useEffect(() => {
    let animationId: number

    const measureFPS = () => {
      const now = performance.now()
      frameCount.current++

      // Calculate FPS every second
      if (now - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current))
        
        setMetrics(prev => ({
          ...prev,
          fps,
          loadTime: now - startTime.current,
          renderTime: now,
          memory: (performance as any).memory?.usedJSHeapSize || undefined,
        }))

        // Consider performance low if FPS drops below 30
        setIsLowPerformance(fps < 30)

        frameCount.current = 0
        lastTime.current = now
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  const getOptimizedAnimationSettings = () => ({
    duration: isLowPerformance ? 0.2 : 0.6,
    ease: isLowPerformance ? 'linear' : [0.25, 0.46, 0.45, 0.94],
    stagger: isLowPerformance ? 0.02 : 0.1,
    reduce: isLowPerformance,
  })

  return {
    metrics,
    isLowPerformance,
    getOptimizedAnimationSettings,
  }
}