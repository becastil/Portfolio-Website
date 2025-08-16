import { NextResponse } from 'next/server'
import { generateRSSFeedData } from '@/lib/blog'
import { siteMetadata } from '@/lib/constants'

export async function GET() {
  try {
    const feedData = await generateRSSFeedData()
    const siteUrl = siteMetadata.siteUrl
    const currentDate = new Date().toISOString()

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title><![CDATA[${siteMetadata.title} - Blog]]></title>
    <description><![CDATA[Latest thoughts on web development, design, and technology trends.]]></description>
    <link>${siteUrl}/blog</link>
    <language>en-US</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${siteUrl}/rss" rel="self" type="application/rss+xml"/>
    <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
    <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
    <generator>Next.js RSS Generator</generator>
    <image>
      <url>${siteUrl}/api/placeholder/200/200</url>
      <title>${siteMetadata.title}</title>
      <link>${siteUrl}</link>
      <width>200</width>
      <height>200</height>
    </image>
    ${feedData.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${post.url}</link>
      <guid isPermaLink="true">${post.url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${siteMetadata.email} (${post.author})</author>
      ${post.categories.map(category => `<category><![CDATA[${category}]]></category>`).join('')}
      <content:encoded><![CDATA[
        <p>${post.description}</p>
        <p><a href="${post.url}">Read the full article on ${siteMetadata.title}</a></p>
      ]]></content:encoded>
    </item>`).join('')}
  </channel>
</rss>`.trim()

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}