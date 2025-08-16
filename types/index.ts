export interface Project {
  id: string
  title: string
  description: string
  category: 'web' | 'mobile' | 'data'
  technologies: string[]
  link?: string
  github?: string
  image?: string
}

export interface NavLink {
  href: string
  label: string
  ariaLabel?: string
}

export interface SocialLink {
  href: string
  label: string
  icon: string
  ariaLabel: string
}

export interface FormData {
  name: string
  email: string
  subject?: string
  message: string
}

export interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export type Theme = 'light' | 'dark'

export interface SiteMetadata {
  title: string
  description: string
  author: string
  siteUrl: string
  email: string
  social: {
    twitter: string
    github: string
    linkedin: string
  }
}

// Blog-related types
export interface BlogPostFrontmatter {
  title: string
  excerpt: string
  publishedAt: string
  updatedAt?: string
  featured?: boolean
  author: {
    name: string
    bio: string
    avatar: string
  }
  categories: string[]
  tags: string[]
  mainImage: {
    url: string
    alt: string
  }
  series?: {
    title: string
    order: number
    total: number
  }
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string
  content: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  tableOfContents: TableOfContentsItem[]
}

export interface BlogPostPreview extends Omit<BlogPost, 'content' | 'tableOfContents'> {}

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
}

export interface PaginatedBlogPosts {
  posts: BlogPostPreview[]
  totalPages: number
  totalPosts: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface BlogSearchResult {
  posts: BlogPostPreview[]
  query: string
  totalResults: number
}

export interface RSSFeedItem {
  title: string
  description: string
  url: string
  date: string
  author: string
  categories: string[]
  tags: string[]
}

export interface SitemapItem {
  url: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}