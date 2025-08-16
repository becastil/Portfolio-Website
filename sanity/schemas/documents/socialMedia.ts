import { defineType, defineField } from 'sanity'
import { ShareIcon } from '@sanity/icons'

export default defineType({
  name: 'socialMedia',
  title: 'Social Media',
  type: 'document',
  icon: ShareIcon,
  
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'GitHub', value: 'github' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Twitter/X', value: 'twitter' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Discord', value: 'discord' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'Dribbble', value: 'dribbble' },
          { title: 'Behance', value: 'behance' },
          { title: 'Medium', value: 'medium' },
          { title: 'Dev.to', value: 'devto' },
          { title: 'Stack Overflow', value: 'stackoverflow' },
          { title: 'CodePen', value: 'codepen' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'url',
      title: 'Profile URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'username',
      title: 'Username/Handle',
      type: 'string',
    }),
    
    defineField({
      name: 'icon',
      title: 'Custom Icon',
      type: 'image',
      description: 'Custom icon if platform is "Other"',
      options: {
        hotspot: false,
      },
    }),
    
    defineField({
      name: 'showInHeader',
      title: 'Show in Header',
      type: 'boolean',
      initialValue: true,
    }),
    
    defineField({
      name: 'showInFooter',
      title: 'Show in Footer',
      type: 'boolean',
      initialValue: true,
    }),
    
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  
  preview: {
    select: {
      title: 'platform',
      subtitle: 'username',
      url: 'url',
    },
    prepare({ title, subtitle, url }) {
      return {
        title,
        subtitle: subtitle || url,
      }
    },
  },
  
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})