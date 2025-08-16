import { useCallback } from 'react'

export function useScrollToSection() {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.querySelector(sectionId)
    if (element) {
      const offset = 80 // Account for fixed header height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  return scrollToSection
}