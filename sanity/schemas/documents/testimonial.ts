import { defineType, defineField } from 'sanity'
import { CommentIcon } from '@sanity/icons'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  
  fields: [
    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'role',
      title: 'Role/Position',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    
    defineField({
      name: 'companyUrl',
      title: 'Company Website',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),
    
    defineField({
      name: 'testimonial',
      title: 'Testimonial Text',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().min(50).max(500),
    }),
    
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: {
        list: [
          { title: '5 Stars', value: 5 },
          { title: '4 Stars', value: 4 },
          { title: '3 Stars', value: 3 },
        ],
      },
      initialValue: 5,
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'image',
      title: 'Client Photo',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip'],
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    
    defineField({
      name: 'project',
      title: 'Related Project',
      type: 'reference',
      to: [{ type: 'project' }],
    }),
    
    defineField({
      name: 'featured',
      title: 'Featured Testimonial',
      type: 'boolean',
      description: 'Show on homepage',
      initialValue: false,
    }),
    
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    
    defineField({
      name: 'linkedin',
      title: 'LinkedIn Profile',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),
    
    defineField({
      name: 'verified',
      title: 'Verified',
      type: 'boolean',
      description: 'Is this testimonial verified?',
      initialValue: true,
    }),
  ],
  
  preview: {
    select: {
      title: 'name',
      subtitle: 'company',
      media: 'image',
      featured: 'featured',
      rating: 'rating',
    },
    prepare({ title, subtitle, media, featured, rating }) {
      const stars = '⭐'.repeat(rating || 5)
      return {
        title,
        subtitle: `${subtitle} • ${stars}${featured ? ' • Featured' : ''}`,
        media,
      }
    },
  },
  
  orderings: [
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'date', direction: 'desc' },
      ],
    },
    {
      title: 'Highest Rated',
      name: 'highestRated',
      by: [
        { field: 'rating', direction: 'desc' },
        { field: 'date', direction: 'desc' },
      ],
    },
  ],
})