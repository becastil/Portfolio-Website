import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
})

// Preview client for draft content
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_READ_TOKEN,
})

// Get the correct client based on preview mode
export function getClient(preview = false) {
  return preview ? previewClient : client
}

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Helper to generate image URLs with transformations
export function getImageUrl(
  source: SanityImageSource,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  }
) {
  let imageBuilder = builder.image(source)
  
  if (options?.width) imageBuilder = imageBuilder.width(options.width)
  if (options?.height) imageBuilder = imageBuilder.height(options.height)
  if (options?.quality) imageBuilder = imageBuilder.quality(options.quality)
  if (options?.format) imageBuilder = imageBuilder.format(options.format)
  if (options?.fit) imageBuilder = imageBuilder.fit(options.fit)
  
  return imageBuilder.auto('format').url()
}

// Generate responsive image srcset
export function getResponsiveImageSrcSet(
  source: SanityImageSource,
  sizes: number[] = [640, 768, 1024, 1280, 1536]
) {
  return sizes
    .map((size) => `${getImageUrl(source, { width: size })} ${size}w`)
    .join(', ')
}

// Get blur data URL for image placeholders
export function getBlurDataUrl(source: any) {
  if (source?.asset?.metadata?.lqip) {
    return source.asset.metadata.lqip
  }
  return undefined
}