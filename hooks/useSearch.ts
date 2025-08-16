import { useState, useCallback } from 'react'
import { BlogPostPreview } from '@/types'

interface SearchResult extends BlogPostPreview {
  score?: number
  matches?: Array<{
    key: string
    value: string
    indices: number[][]
  }>
}

interface SearchResponse {
  results: SearchResult[]
  query: string
  totalResults: number
  message: string
  error?: string
}

interface UseSearchReturn {
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  totalResults: number
  search: (query: string) => Promise<void>
  clearResults: () => void
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)

  const search = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([])
      setTotalResults(0)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=20`)
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data: SearchResponse = await response.json()
      
      if (data.error) {
        setError(data.error)
        setResults([])
        setTotalResults(0)
      } else {
        setResults(data.results)
        setTotalResults(data.totalResults)
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search. Please try again.')
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setTotalResults(0)
    setError(null)
  }, [])

  return {
    results,
    isLoading,
    error,
    totalResults,
    search,
    clearResults,
  }
}