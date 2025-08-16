import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import { rehype } from 'rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import readingTime from 'reading-time'

const postsDirectory = path.join(process.cwd(), 'content/posts')

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

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
}

export interface BlogPostPreview extends Omit<BlogPost, 'content' | 'tableOfContents'> {}

// Cache for processed posts
let postsCache: BlogPost[] | null = null
let previewsCache: BlogPostPreview[] | null = null

/**
 * Get all blog post slugs
 */
export function getBlogPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  return fs.readdirSync(postsDirectory)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''))
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // Validate frontmatter
    const frontmatter = validateFrontmatter(data)
    
    // Process markdown content
    const processedContent = await processMarkdown(content)
    
    // Calculate reading time
    const readingTimeStats = readingTime(content)
    
    // Extract table of contents
    const tableOfContents = extractTableOfContents(content)
    
    return {
      slug,
      ...frontmatter,
      content: processedContent,
      readingTime: readingTimeStats,
      tableOfContents
    }
  } catch (error) {
    console.error(`Error processing blog post ${slug}:`, error)
    return null
  }
}

/**
 * Get all blog posts with full content
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (postsCache) {
    return postsCache
  }

  const slugs = getBlogPostSlugs()
  const posts: BlogPost[] = []
  
  for (const slug of slugs) {
    const post = await getBlogPostBySlug(slug)
    if (post) {
      posts.push(post)
    }
  }
  
  // Sort by publishedAt date (newest first)
  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  
  postsCache = posts
  return posts
}

/**
 * Get blog post previews (without full content)
 */
export async function getBlogPostPreviews(): Promise<BlogPostPreview[]> {
  if (previewsCache) {
    return previewsCache
  }

  const posts = await getAllBlogPosts()
  const previews = posts.map(({ content: _content, tableOfContents: _tableOfContents, ...preview }) => preview)
  
  previewsCache = previews
  return previews
}

/**
 * Get featured blog posts
 */
export async function getFeaturedBlogPosts(): Promise<BlogPostPreview[]> {
  const previews = await getBlogPostPreviews()
  return previews.filter(post => post.featured)
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPostPreview[]> {
  const previews = await getBlogPostPreviews()
  return previews.filter(post => 
    post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  )
}

/**
 * Get blog posts by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPostPreview[]> {
  const previews = await getBlogPostPreviews()
  return previews.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  )
}

/**
 * Get related blog posts based on tags and categories
 */
export async function getRelatedBlogPosts(
  currentSlug: string, 
  limit: number = 3
): Promise<BlogPostPreview[]> {
  const allPosts = await getBlogPostPreviews()
  const currentPost = allPosts.find(post => post.slug === currentSlug)
  
  if (!currentPost) {
    return []
  }
  
  // Calculate similarity scores
  const postsWithScores = allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => ({
      post,
      score: calculateSimilarityScore(currentPost, post)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
  
  return postsWithScores.map(({ post }) => post)
}

/**
 * Search blog posts
 */
export async function searchBlogPosts(query: string): Promise<BlogPostPreview[]> {
  if (!query.trim()) {
    return []
  }
  
  const posts = await getBlogPostPreviews()
  const searchTerm = query.toLowerCase()
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    post.categories.some(category => category.toLowerCase().includes(searchTerm))
  )
}

/**
 * Get unique categories
 */
export async function getBlogCategories(): Promise<string[]> {
  const posts = await getBlogPostPreviews()
  const categories = new Set<string>()
  
  posts.forEach(post => {
    post.categories.forEach(category => categories.add(category))
  })
  
  return Array.from(categories).sort()
}

/**
 * Get unique tags
 */
export async function getBlogTags(): Promise<string[]> {
  const posts = await getBlogPostPreviews()
  const tags = new Set<string>()
  
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag))
  })
  
  return Array.from(tags).sort()
}

/**
 * Get paginated blog posts
 */
export async function getPaginatedBlogPosts(
  page: number = 1, 
  pageSize: number = 9
): Promise<{
  posts: BlogPostPreview[]
  totalPages: number
  totalPosts: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}> {
  const allPosts = await getBlogPostPreviews()
  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  
  const posts = allPosts.slice(startIndex, endIndex)
  
  return {
    posts,
    totalPages,
    totalPosts,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  }
}

/**
 * Process markdown content to HTML
 */
async function processMarkdown(content: string): Promise<string> {
  const processed = await remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml)
    .process(content)
  
  // Additional processing with rehype for syntax highlighting and links
  const rehypeProcessed = await rehype()
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['anchor-link']
      }
    })
    .use(rehypeHighlight)
    .process(processed.toString())
  
  return rehypeProcessed.toString()
}

/**
 * Extract table of contents from markdown content
 */
function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const toc: TableOfContentsItem[] = []
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = slugify(title)
    
    toc.push({ id, title, level })
  }
  
  return toc
}

/**
 * Calculate similarity score between two posts
 */
function calculateSimilarityScore(post1: BlogPostPreview, post2: BlogPostPreview): number {
  let score = 0
  
  // Tag similarity (higher weight)
  const commonTags = post1.tags.filter(tag => post2.tags.includes(tag))
  score += commonTags.length * 3
  
  // Category similarity
  const commonCategories = post1.categories.filter(cat => post2.categories.includes(cat))
  score += commonCategories.length * 2
  
  // Series similarity (highest weight)
  if (post1.series && post2.series && post1.series.title === post2.series.title) {
    score += 5
  }
  
  return score
}

/**
 * Validate and normalize frontmatter data
 */
function validateFrontmatter(data: Record<string, unknown>): BlogPostFrontmatter {
  const required = ['title', 'excerpt', 'publishedAt', 'author', 'categories', 'tags', 'mainImage']
  
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`Missing required frontmatter field: ${field}`)
    }
  }
  
  // Normalize arrays
  const categories = Array.isArray(data.categories) ? data.categories : [data.categories]
  const tags = Array.isArray(data.tags) ? data.tags : [data.tags]
  
  return {
    title: data.title,
    excerpt: data.excerpt,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    featured: Boolean(data.featured),
    author: {
      name: data.author.name || 'Unknown Author',
      bio: data.author.bio || '',
      avatar: data.author.avatar || '/api/placeholder/100/100'
    },
    categories,
    tags,
    mainImage: {
      url: data.mainImage.url || '/api/placeholder/1200/600',
      alt: data.mainImage.alt || data.title
    },
    series: data.series ? {
      title: data.series.title,
      order: Number(data.series.order),
      total: Number(data.series.total)
    } : undefined
  }
}

/**
 * Create URL-friendly slug from text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Clear caches (useful for development)
 */
export function clearBlogCache(): void {
  postsCache = null
  previewsCache = null
}

/**
 * Generate RSS feed data
 */
export async function generateRSSFeedData() {
  const posts = await getBlogPostPreviews()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bencastillo.dev'
  
  return posts.slice(0, 20).map(post => ({
    title: post.title,
    description: post.excerpt,
    url: `${baseUrl}/blog/${post.slug}`,
    date: post.publishedAt,
    author: post.author.name,
    categories: post.categories,
    tags: post.tags
  }))
}

/**
 * Generate sitemap data for blog posts
 */
export async function generateBlogSitemapData() {
  const posts = await getBlogPostPreviews()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bencastillo.dev'
  
  return posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.9 : 0.7
  }))
}