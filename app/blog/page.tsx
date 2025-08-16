import { Metadata } from 'next'
import { Suspense } from 'react'
import BlogIndex from '@/components/blog/BlogIndex'
import BlogPagination from '@/components/blog/BlogPagination'
import { siteMetadata } from '@/lib/constants'
import { getPaginatedBlogPosts, getBlogCategories, getBlogTags } from '@/lib/blog'
import { 
  generateBlogListingStructuredData,
  generateWebsiteStructuredData,
  generateOpenGraphMetadata,
  generateTwitterMetadata,
  createStructuredDataScript
} from '@/lib/seo'

interface BlogPageProps {
  searchParams: {
    page?: string
  }
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const currentPage = Number(searchParams.page) || 1
  const pageTitle = currentPage > 1 
    ? `Blog - Page ${currentPage} | ${siteMetadata.title}`
    : `Blog | ${siteMetadata.title}`
  
  const description = 'Thoughts on web development, design, and technology trends. Explore tutorials, insights, and best practices for modern web development.'
  
  const openGraph = generateOpenGraphMetadata(
    pageTitle,
    description,
    currentPage > 1 ? `/blog?page=${currentPage}` : '/blog'
  )

  const twitter = generateTwitterMetadata(pageTitle, description)

  return {
    title: pageTitle,
    description,
    keywords: 'web development, react, nextjs, typescript, javascript, frontend, backend, tutorials, programming',
    openGraph,
    twitter,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: currentPage > 1 
        ? `${siteMetadata.siteUrl}/blog?page=${currentPage}`
        : `${siteMetadata.siteUrl}/blog`,
      types: {
        'application/rss+xml': [
          {
            title: `${siteMetadata.title} RSS Feed`,
            url: `${siteMetadata.siteUrl}/rss`,
          },
        ],
      },
    },
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams.page) || 1
  const pageSize = 9
  
  const [paginatedData, categories, tags] = await Promise.all([
    getPaginatedBlogPosts(currentPage, pageSize),
    getBlogCategories(),
    getBlogTags()
  ])

  // Generate structured data for the blog listing
  const blogListingStructuredData = generateBlogListingStructuredData(paginatedData.posts)
  const websiteStructuredData = generateWebsiteStructuredData()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={createStructuredDataScript([
          blogListingStructuredData,
          ...(currentPage === 1 ? [websiteStructuredData] : [])
        ])}
      />
      
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
        <div>
          <BlogIndex 
            initialPosts={paginatedData.posts} 
            categories={categories} 
            tags={tags} 
          />
          <div className="container mx-auto px-4 pb-16 max-w-7xl">
            <BlogPagination
              currentPage={paginatedData.currentPage}
              totalPages={paginatedData.totalPages}
              totalPosts={paginatedData.totalPosts}
            />
          </div>
        </div>
      </Suspense>
    </main>
    </>
  )
}