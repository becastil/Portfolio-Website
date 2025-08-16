import dynamic from 'next/dynamic'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import { generateWebsiteStructuredData, generatePersonStructuredData } from '@/lib/seo'

// Lazy load non-critical components
const About = dynamic(() => import('@/components/About'), {
  loading: () => <div className="section bg-background" aria-hidden="true"><div className="container h-32 animate-pulse bg-surface rounded-lg"></div></div>
})

const Projects = dynamic(() => import('@/components/Projects'), {
  loading: () => <div className="section bg-surface" aria-hidden="true"><div className="container h-32 animate-pulse bg-background rounded-lg"></div></div>
})

const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <div className="section bg-background" aria-hidden="true"><div className="container h-32 animate-pulse bg-surface rounded-lg"></div></div>
})

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-16 bg-surface" aria-hidden="true"></div>
})

export default function HomePage() {
  const websiteData = generateWebsiteStructuredData()
  const personData = generatePersonStructuredData()

  return (
    <>
      {/* Structured Data */}
      <Script 
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <Script 
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
      />
      
      <Navigation />
      <main id="main-content" role="main">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}