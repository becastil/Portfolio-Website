import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'keywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: false,
      },
    }),
    
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      options: {
        hotspot: false,
      },
    }),
    
    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
      description: 'Default Open Graph image for social sharing',
      options: {
        hotspot: false,
      },
    }),
    
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'contactInfo',
    }),
    
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [
        {
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
        },
        {
          name: 'googleTagManagerId',
          title: 'Google Tag Manager ID',
          type: 'string',
        },
        {
          name: 'facebookPixelId',
          title: 'Facebook Pixel ID',
          type: 'string',
        },
      ],
    }),
    
    defineField({
      name: 'maintenanceMode',
      title: 'Maintenance Mode',
      type: 'boolean',
      initialValue: false,
    }),
    
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      initialValue: `© ${new Date().getFullYear()} All rights reserved.`,
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      subtitle: 'siteUrl',
      media: 'logo',
    },
  },
})