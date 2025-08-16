import { Metadata } from 'next'
import { Suspense } from 'react'
import BlogIndex from '@/components/blog/BlogIndex'
import { siteMetadata } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Blog | ${siteMetadata.title}`,
  description: 'Thoughts on web development, design, and technology trends.',
  openGraph: {
    title: `Blog | ${siteMetadata.title}`,
    description: 'Thoughts on web development, design, and technology trends.',
    url: `${siteMetadata.siteUrl}/blog`,
  },
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Suspense 
        fallback={
          <div className="container mx-auto px-4 py-16">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <BlogIndex />
      </Suspense>
    </main>
  )
}