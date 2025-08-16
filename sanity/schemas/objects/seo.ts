import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: (Rule) => Rule.max(60),
      description: 'Recommended: 50-60 characters',
    }),
    
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
      description: 'Recommended: 150-160 characters',
    }),
    
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'The canonical URL for this page',
    }),
    
    defineField({
      name: 'ogTitle',
      title: 'Open Graph Title',
      type: 'string',
      description: 'Title for social media sharing',
    }),
    
    defineField({
      name: 'ogDescription',
      title: 'Open Graph Description',
      type: 'text',
      rows: 3,
      description: 'Description for social media sharing',
    }),
    
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Recommended size: 1200x630px',
      options: {
        hotspot: false,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    
    defineField({
      name: 'twitterCard',
      title: 'Twitter Card Type',
      type: 'string',
      options: {
        list: [
          { title: 'Summary', value: 'summary' },
          { title: 'Summary Large Image', value: 'summary_large_image' },
          { title: 'App', value: 'app' },
          { title: 'Player', value: 'player' },
        ],
      },
      initialValue: 'summary_large_image',
    }),
    
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent search engines from indexing this page',
      initialValue: false,
    }),
    
    defineField({
      name: 'noFollow',
      title: 'No Follow',
      type: 'boolean',
      description: 'Prevent search engines from following links on this page',
      initialValue: false,
    }),
    
    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD)',
      type: 'code',
      options: {
        language: 'json',
        languageAlternatives: [
          { title: 'JSON', value: 'json' },
        ],
      },
    }),
  ],
})