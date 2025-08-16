import { defineType, defineField } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export default defineType({
  name: 'article',
  title: 'Blog Article',
  type: 'document',
  icon: DocumentTextIcon,
  
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      description: 'Show this article as featured',
      initialValue: false,
    }),
    
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'coAuthors',
      title: 'Co-Authors',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'author' }],
        },
      ],
    }),
    
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
      description: 'Brief description for article cards and SEO',
    }),
    
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
        {
          name: 'attribution',
          type: 'string',
          title: 'Attribution/Credit',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes',
      validation: (Rule) => Rule.positive().integer(),
    }),
    
    defineField({
      name: 'difficulty',
      title: 'Difficulty Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
          { title: 'Expert', value: 'expert' },
        ],
      },
    }),
    
    defineField({
      name: 'series',
      title: 'Article Series',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Series Title',
          type: 'string',
        },
        {
          name: 'order',
          title: 'Order in Series',
          type: 'number',
        },
        {
          name: 'total',
          title: 'Total Articles in Series',
          type: 'number',
        },
      ],
    }),
    
    defineField({
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'article' }],
        },
      ],
      validation: (Rule) => Rule.max(5).unique(),
    }),
    
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
      validation: (Rule) => Rule.max(3).unique(),
    }),
    
    defineField({
      name: 'resources',
      title: 'External Resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Resource Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'type',
              title: 'Resource Type',
              type: 'string',
              options: {
                list: [
                  'Documentation',
                  'GitHub Repo',
                  'Tutorial',
                  'Video',
                  'Book',
                  'Tool',
                  'Other',
                ],
              },
            },
          ],
        },
      ],
    }),
    
    defineField({
      name: 'codeExamples',
      title: 'Code Repository',
      type: 'url',
      description: 'Link to GitHub repo with code examples',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),
    
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      type: 'callToAction',
    }),
    
    defineField({
      name: 'enableComments',
      title: 'Enable Comments',
      type: 'boolean',
      initialValue: true,
    }),
    
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
    }),
    
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'review' },
          { title: 'Scheduled', value: 'scheduled' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      status: 'status',
      featured: 'featured',
      publishedAt: 'publishedAt',
    },
    prepare({ title, author, media, status, featured, publishedAt }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Unpublished'
      return {
        title,
        subtitle: `${author} • ${date} • ${status}${featured ? ' • ⭐' : ''}`,
        media,
      }
    },
  },
  
  orderings: [
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
    {
      title: 'Alphabetical',
      name: 'alphabetical',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})