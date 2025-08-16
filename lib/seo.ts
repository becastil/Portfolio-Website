import { BlogPost, BlogPostPreview } from '@/types'
import { siteMetadata } from '@/lib/constants'

/**
 * Generate JSON-LD structured data for blog posts
 */
export function generateBlogPostStructuredData(post: BlogPost | BlogPostPreview) {
  const baseUrl = siteMetadata.siteUrl

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [post.mainImage.url],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      description: post.author.bio,
      image: post.author.avatar,
    },
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.title,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/api/placeholder/200/200`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`
    },
    url: `${baseUrl}/blog/${post.slug}`,
    keywords: post.tags.join(', '),
    articleSection: post.categories,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'Blog',
      name: `${siteMetadata.title} Blog`,
      url: `${baseUrl}/blog`
    },
    ...(post.series && {
      isPartOf: {
        '@type': 'CreativeWorkSeries',
        name: post.series.title,
        position: post.series.order
      }
    }),
    ...('readingTime' in post && {
      timeRequired: `PT${post.readingTime.minutes}M`
    })
  }
}

/**
 * Generate JSON-LD structured data for blog listing page
 */
export function generateBlogListingStructuredData(posts: BlogPostPreview[]) {
  const baseUrl = siteMetadata.siteUrl

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteMetadata.title} Blog`,
    description: 'Thoughts on web development, design, and technology trends.',
    url: `${baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.title,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/api/placeholder/200/200`
      }
    },
    blogPost: posts.slice(0, 10).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.author.name
      },
      image: post.mainImage.url
    }))
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  const baseUrl = siteMetadata.siteUrl

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  }
}

/**
 * Generate website structured data
 */
export function generateWebsiteStructuredData() {
  const baseUrl = siteMetadata.siteUrl

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetadata.title,
    description: siteMetadata.description,
    url: baseUrl,
    publisher: {
      '@type': 'Person',
      name: siteMetadata.author,
      email: siteMetadata.email,
      sameAs: [
        siteMetadata.social.twitter,
        siteMetadata.social.github,
        siteMetadata.social.linkedin
      ]
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/api/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

/**
 * Generate person structured data for author
 */
export function generatePersonStructuredData() {
  const baseUrl = siteMetadata.siteUrl

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteMetadata.author,
    description: 'Full-stack developer passionate about creating exceptional user experiences.',
    email: siteMetadata.email,
    url: baseUrl,
    image: `${baseUrl}/api/placeholder/200/200`,
    sameAs: [
      siteMetadata.social.twitter,
      siteMetadata.social.github,
      siteMetadata.social.linkedin
    ],
    jobTitle: 'Full-Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Independent'
    },
    knowsAbout: [
      'Web Development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'UI/UX Design',
      'Frontend Development',
      'Backend Development'
    ]
  }
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * Generate Open Graph metadata
 */
export function generateOpenGraphMetadata(
  title: string,
  description: string,
  url: string,
  image?: string,
  type: 'website' | 'article' = 'website',
  additionalMeta?: Record<string, string>
) {
  const baseUrl = siteMetadata.siteUrl
  const defaultImage = `${baseUrl}/api/placeholder/1200/630`

  return {
    title,
    description,
    url: `${baseUrl}${url}`,
    siteName: siteMetadata.title,
    images: [
      {
        url: image || defaultImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    locale: 'en_US',
    type,
    ...additionalMeta,
  }
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterMetadata(
  title: string,
  description: string,
  image?: string,
  card: 'summary' | 'summary_large_image' = 'summary_large_image'
) {
  const baseUrl = siteMetadata.siteUrl
  const defaultImage = `${baseUrl}/api/placeholder/1200/630`

  return {
    card,
    title,
    description,
    images: [image || defaultImage],
    creator: siteMetadata.social.twitter,
    site: siteMetadata.social.twitter,
  }
}

/**
 * Helper to inject structured data into page head
 */
export function createStructuredDataScript(data: any) {
  return {
    __html: JSON.stringify(data)
  }
}