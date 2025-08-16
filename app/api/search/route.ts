import { NextRequest, NextResponse } from 'next/server'
import Fuse from 'fuse.js'
import { getBlogPostPreviews } from '@/lib/blog'
import { BlogPostPreview } from '@/types'

// Fuse.js configuration for blog search  
const fuseOptions = {
  keys: [
    {
      name: 'title',
      weight: 0.4,
    },
    {
      name: 'excerpt',
      weight: 0.3,
    },
    {
      name: 'tags',
      weight: 0.2,
    },
    {
      name: 'categories',
      weight: 0.1,
    },
  ],
  threshold: 0.3, // Lower = more strict matching
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        results: [],
        query: query || '',
        totalResults: 0,
        message: 'Query must be at least 2 characters long'
      })
    }

    // Get all blog posts
    const posts = await getBlogPostPreviews()
    
    if (posts.length === 0) {
      return NextResponse.json({
        results: [],
        query,
        totalResults: 0,
        message: 'No blog posts available'
      })
    }

    // Initialize Fuse with blog posts
    const fuse = new Fuse(posts, fuseOptions)
    
    // Perform search
    const searchResults = fuse.search(query.trim())
    
    // Format results
    const results = searchResults
      .slice(0, limit)
      .map(result => ({
        ...result.item,
        score: result.score,
        matches: result.matches?.map(match => ({
          key: match.key,
          value: match.value,
          indices: match.indices
        }))
      }))

    return NextResponse.json({
      results,
      query,
      totalResults: searchResults.length,
      message: searchResults.length > 0 
        ? `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`
        : 'No results found'
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({
      results: [],
      query: '',
      totalResults: 0,
      error: 'Search functionality temporarily unavailable'
    }, { status: 500 })
  }
}