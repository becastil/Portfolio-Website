import { NextResponse } from 'next/server'
import { generateRSSFeedData } from '@/lib/blog'
import { siteMetadata } from '@/lib/constants'

export async function GET() {
  try {
    const feedData = await generateRSSFeedData()
    const siteUrl = siteMetadata.siteUrl

    const jsonFeed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: `${siteMetadata.title} - Blog`,
      description: 'Latest thoughts on web development, design, and technology trends.',
      home_page_url: siteUrl,
      feed_url: `${siteUrl}/api/feed`,
      language: 'en-US',
      author: {
        name: siteMetadata.author,
        url: siteUrl,
        avatar: `${siteUrl}/api/placeholder/200/200`
      },
      items: feedData.map(post => ({
        id: post.url,
        url: post.url,
        title: post.title,
        content_html: `<p>${post.description}</p><p><a href="${post.url}">Read the full article on ${siteMetadata.title}</a></p>`,
        content_text: post.description,
        summary: post.description,
        date_published: post.date,
        author: {
          name: post.author
        },
        tags: [...post.categories, ...post.tags]
      }))
    }

    return NextResponse.json(jsonFeed, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating JSON feed:', error)
    return NextResponse.json({ error: 'Error generating feed' }, { status: 500 })
  }
}