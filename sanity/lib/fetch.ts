import { cache } from 'react'
import { getClient } from './client'
import * as queries from './queries'
import { QueryParams } from 'next-sanity'

// Cache configuration
const revalidate = process.env.NODE_ENV === 'production' ? 3600 : 0 // 1 hour in production, no cache in dev

// Generic fetch function with caching
export const sanityFetch = cache(async <T = any>(
  query: string,
  params: QueryParams = {},
  preview = false
): Promise<T> => {
  const client = getClient(preview)
  return client.fetch<T>(query, params)
})

// Project fetchers
export async function getProjects(preview = false) {
  return sanityFetch(queries.projectsQuery, {}, preview)
}

export async function getFeaturedProjects(preview = false) {
  return sanityFetch(queries.featuredProjectsQuery, {}, preview)
}

export async function getProjectBySlug(slug: string, preview = false) {
  return sanityFetch(queries.projectBySlugQuery, { slug }, preview)
}

// Article fetchers
export async function getArticles(preview = false) {
  return sanityFetch(queries.articlesQuery, {}, preview)
}

export async function getFeaturedArticles(preview = false) {
  return sanityFetch(queries.featuredArticlesQuery, {}, preview)
}

export async function getArticleBySlug(slug: string, preview = false) {
  return sanityFetch(queries.articleBySlugQuery, { slug }, preview)
}

export async function getArticlesByCategory(categoryId: string, preview = false) {
  return sanityFetch(queries.articlesByCategoryQuery, { categoryId }, preview)
}

// Author fetchers
export async function getAuthors(preview = false) {
  return sanityFetch(queries.authorsQuery, {}, preview)
}

export async function getAuthorBySlug(slug: string, preview = false) {
  return sanityFetch(queries.authorBySlugQuery, { slug }, preview)
}

// Category fetchers
export async function getCategories(preview = false) {
  return sanityFetch(queries.categoriesQuery, {}, preview)
}

// Testimonial fetchers
export async function getTestimonials(preview = false) {
  return sanityFetch(queries.testimonialsQuery, {}, preview)
}

export async function getFeaturedTestimonials(preview = false) {
  return sanityFetch(queries.featuredTestimonialsQuery, {}, preview)
}

// Skills fetchers
export async function getSkills(preview = false) {
  return sanityFetch(queries.skillsQuery, {}, preview)
}

export async function getFeaturedSkills(preview = false) {
  return sanityFetch(queries.featuredSkillsQuery, {}, preview)
}

// Experience fetchers
export async function getExperience(preview = false) {
  return sanityFetch(queries.experienceQuery, {}, preview)
}

// Education fetchers
export async function getEducation(preview = false) {
  return sanityFetch(queries.educationQuery, {}, preview)
}

// Certification fetchers
export async function getCertifications(preview = false) {
  return sanityFetch(queries.certificationsQuery, {}, preview)
}

// Settings fetchers
export async function getSiteSettings(preview = false) {
  return sanityFetch(queries.siteSettingsQuery, {}, preview)
}

export async function getNavigation(navId: string, preview = false) {
  return sanityFetch(queries.navigationQuery, { navId }, preview)
}

export async function getSocialMedia(preview = false) {
  return sanityFetch(queries.socialMediaQuery, {}, preview)
}

// Search fetcher
export async function search(searchTerm: string, preview = false) {
  return sanityFetch(queries.searchQuery, { searchTerm }, preview)
}

// Sitemap fetcher
export async function getSitemapData(preview = false) {
  return sanityFetch(queries.sitemapQuery, {}, preview)
}

// Helper to get all paths for static generation
export async function getAllProjectPaths() {
  const projects = await getProjects()
  return projects.map((project: any) => ({
    params: { slug: project.slug.current },
  }))
}

export async function getAllArticlePaths() {
  const articles = await getArticles()
  return articles.map((article: any) => ({
    params: { slug: article.slug.current },
  }))
}

export async function getAllAuthorPaths() {
  const authors = await getAuthors()
  return authors.map((author: any) => ({
    params: { slug: author.slug.current },
  }))
}

// Pagination helper
export async function getPaginatedData<T>(
  query: string,
  page: number = 1,
  pageSize: number = 10,
  params: QueryParams = {},
  preview = false
): Promise<{ data: T[]; total: number; hasMore: boolean }> {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  const paginatedQuery = `{
    "data": ${query} [${start}...${end}],
    "total": count(${query})
  }`
  
  const result = await sanityFetch<{ data: T[]; total: number }>(
    paginatedQuery,
    params,
    preview
  )
  
  return {
    ...result,
    hasMore: end < result.total,
  }
}