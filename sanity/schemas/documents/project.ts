import { defineType, defineField } from 'sanity'
import { FolderIcon } from '@sanity/icons'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: FolderIcon,
  
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
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
      title: 'Featured Project',
      type: 'boolean',
      description: 'Show this project on the homepage',
      initialValue: false,
    }),
    
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which projects appear (lower numbers first)',
      initialValue: 0,
    }),
    
    defineField({
      name: 'client',
      title: 'Client/Company',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Web Application', value: 'web-app' },
          { title: 'Mobile Application', value: 'mobile-app' },
          { title: 'E-commerce', value: 'ecommerce' },
          { title: 'SaaS Platform', value: 'saas' },
          { title: 'API/Backend', value: 'api' },
          { title: 'Open Source', value: 'open-source' },
          { title: 'Design System', value: 'design-system' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'status',
      title: 'Project Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Development', value: 'in-development' },
          { title: 'Live', value: 'live' },
          { title: 'Completed', value: 'completed' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'completed',
    }),
    
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    }),
    
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    }),
    
    defineField({
      name: 'summary',
      title: 'Brief Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
      description: 'A brief description for project cards (max 300 chars)',
    }),
    
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'blockContent',
      description: 'Detailed project description with rich text',
    }),
    
    defineField({
      name: 'role',
      title: 'Your Role',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    
    defineField({
      name: 'responsibilities',
      title: 'Key Responsibilities',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(10),
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
      ],
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'gallery',
      title: 'Project Gallery',
      type: 'imageGallery',
    }),
    
    defineField({
      name: 'techStack',
      title: 'Technology Stack',
      type: 'techStack',
    }),
    
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'feature' }],
      validation: (Rule) => Rule.max(10),
    }),
    
    defineField({
      name: 'challenges',
      title: 'Challenges',
      type: 'array',
      of: [{ type: 'challenge' }],
      validation: (Rule) => Rule.max(5),
    }),
    
    defineField({
      name: 'solutions',
      title: 'Solutions',
      type: 'array',
      of: [{ type: 'solution' }],
      validation: (Rule) => Rule.max(5),
    }),
    
    defineField({
      name: 'outcomes',
      title: 'Outcomes & Results',
      type: 'array',
      of: [{ type: 'outcome' }],
      validation: (Rule) => Rule.max(5),
    }),
    
    defineField({
      name: 'metrics',
      title: 'Project Metrics',
      type: 'projectMetrics',
    }),
    
    defineField({
      name: 'caseStudy',
      title: 'Case Study',
      type: 'caseStudy',
    }),
    
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),
    
    defineField({
      name: 'githubUrl',
      title: 'GitHub Repository',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),
    
    defineField({
      name: 'demoUrl',
      title: 'Demo URL',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),
    
    defineField({
      name: 'videoDemo',
      title: 'Video Demo',
      type: 'videoEmbed',
    }),
    
    defineField({
      name: 'testimonial',
      title: 'Client Testimonial',
      type: 'reference',
      to: [{ type: 'testimonial' }],
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
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
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
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      client: 'client',
      media: 'mainImage',
      featured: 'featured',
      status: 'status',
    },
    prepare({ title, client, media, featured, status }) {
      return {
        title,
        subtitle: `${client ? client + ' • ' : ''}${status}${featured ? ' • ⭐ Featured' : ''}`,
        media,
      }
    },
  },
  
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
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
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
})