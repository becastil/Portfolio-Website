import type { Metadata } from 'next'
import './globals.css'
import { siteMetadata } from '@/lib/constants'
import MotionProvider from '@/components/providers/MotionProvider'
import PageTransition from '@/components/providers/PageTransition'

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.author}`,
  },
  description: siteMetadata.description,
  keywords: [
    'Ben Castillo',
    'Full Stack Developer',
    'Web Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'JavaScript',
    'Portfolio',
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer'
  ],
  authors: [{ name: siteMetadata.author, url: siteMetadata.siteUrl }],
  creator: siteMetadata.author,
  publisher: siteMetadata.author,
  metadataBase: new URL(siteMetadata.siteUrl),
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${siteMetadata.siteUrl}/api/placeholder/1200/630`,
        width: 1200,
        height: 630,
        alt: siteMetadata.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    creator: `@${siteMetadata.social.twitter}`,
    images: [`${siteMetadata.siteUrl}/api/placeholder/1200/630`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/rss`,
    },
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* SF Mono uses system fonts - no preloading needed */}
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/tokens.css" as="style" />
        
        {/* Critical CSS inlined above the fold */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            :root{--color-text-primary:#000000;--color-text-secondary:#666666;--color-background:#FFFFFF;--color-surface:#F8F8F8;--color-accent:#CC7A5C;--color-accent-hover:#D88A6C}
            [data-theme="dark"]{--color-text-primary:#FFFFFF;--color-text-secondary:#CCCCCC;--color-background:#0D0D0D;--color-surface:#1A1A1A;--color-accent:#CC7A5C;--color-accent-hover:#D88A6C}
            html{scroll-behavior:smooth;overflow-x:hidden}
            body{font-family:'SF Mono',Monaco,'Cascadia Code','Roboto Mono',Consolas,monospace;background:var(--color-background);color:var(--color-text-primary);margin:0;padding:0}
            .container{max-width:1200px;margin:0 auto;padding:0 1rem}
            .section{padding:5rem 0}
            .skip-link{position:absolute;top:0;left:0;background:var(--color-accent);color:white;padding:1rem;z-index:50;transform:translateY(-100%);transition:transform 0.3s}
            .skip-link:focus{transform:translateY(0)}
            @media(max-width:768px){.container{padding:0 1rem}.section{padding:3rem 0}}
          `
        }} />
        
        {/* Prevent layout shift */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent layout shift during hydration */
            .loading-shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
            @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            @media (prefers-reduced-motion: reduce) { .loading-shimmer { animation: none; } }
          `
        }} />
      </head>
      <body className="font-mono antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <MotionProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </MotionProvider>
      </body>
    </html>
  )
}