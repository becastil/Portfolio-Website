import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import BlogPost from '@/components/blog/BlogPost'
import { siteMetadata } from '@/lib/constants'
import { getBlogPostBySlug, getBlogPostSlugs, getRelatedBlogPosts } from '@/lib/blog'
import { 
  generateBlogPostStructuredData, 
  generateBreadcrumbStructuredData,
  generateOpenGraphMetadata,
  generateTwitterMetadata,
  createStructuredDataScript
} from '@/lib/seo'

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getBlogPostSlugs()
  
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  // Enhanced metadata with better SEO
  const openGraph = generateOpenGraphMetadata(
    post.title,
    post.excerpt,
    `/blog/${post.slug}`,
    post.mainImage.url,
    'article',
    {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: post.author.name,
      section: post.categories[0] || 'Technology',
      tags: post.tags.join(', '),
    }
  )

  const twitter = generateTwitterMetadata(
    post.title,
    post.excerpt,
    post.mainImage.url
  )

  return {
    title: `${post.title} | ${siteMetadata.title}`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author.name }],
    creator: post.author.name,
    publisher: siteMetadata.author,
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
      canonical: `${siteMetadata.siteUrl}/blog/${post.slug}`,
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = await getRelatedBlogPosts(params.slug, 3)

  // Generate structured data
  const blogPostStructuredData = generateBlogPostStructuredData(post)
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` }
  ])

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={createStructuredDataScript([
          blogPostStructuredData,
          breadcrumbStructuredData
        ])}
      />
      
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Suspense 
        fallback={
          <div className="container mx-auto px-4 py-16">
            <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <BlogPost post={post} relatedPosts={relatedPosts} />
      </Suspense>
    </main>
    </>
  )
}