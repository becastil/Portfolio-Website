import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import BlogPost from '@/components/blog/BlogPost'
import { siteMetadata } from '@/lib/constants'

// Mock function - replace with actual Sanity query
async function getPost(slug: string) {
  // Simulate API call
  const mockPost = {
    _id: '1',
    title: 'Building Interactive Web Experiences with Framer Motion',
    slug: { current: slug },
    excerpt: 'Learn how to create smooth animations and transitions that enhance user experience without overwhelming your audience.',
    mainImage: {
      asset: { url: '/api/placeholder/1200/600' },
      alt: 'Framer Motion animation examples'
    },
    author: { 
      name: 'Ben Castillo', 
      slug: { current: 'ben-castillo' },
      bio: 'Full-stack developer passionate about creating exceptional user experiences.',
      image: { asset: { url: '/api/placeholder/100/100' } }
    },
    categories: [{ title: 'Frontend', slug: { current: 'frontend' } }],
    tags: ['React', 'Animation', 'UX', 'Framer Motion', 'JavaScript'],
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    readingTime: 8,
    featured: true,
    content: [
      {
        _type: 'block',
        _key: '1',
        style: 'normal',
        children: [{ _type: 'span', text: 'Welcome to the world of smooth, engaging web animations. In this comprehensive guide, we\'ll explore how to use Framer Motion to create interactive experiences that delight users without sacrificing performance.' }]
      }
    ],
    relatedArticles: [
      {
        _id: '2',
        title: 'CSS Animations vs JavaScript Animations',
        slug: { current: 'css-vs-js-animations' },
        excerpt: 'Understanding when to use CSS animations versus JavaScript animations.',
        mainImage: { asset: { url: '/api/placeholder/400/250' }, alt: 'Animation comparison' },
        publishedAt: '2024-01-10T10:00:00Z',
        readingTime: 6
      }
    ],
    series: {
      title: 'Modern Animation Techniques',
      order: 1,
      total: 3
    }
  }

  if (slug !== 'framer-motion-interactive-web') {
    return null
  }

  return mockPost
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | ${siteMetadata.title}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteMetadata.siteUrl}/blog/${post.slug.current}`,
      images: [
        {
          url: post.mainImage.asset.url,
          width: 1200,
          height: 630,
          alt: post.mainImage.alt,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.mainImage.asset.url],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
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
        <BlogPost post={post} />
      </Suspense>
    </main>
  )
}