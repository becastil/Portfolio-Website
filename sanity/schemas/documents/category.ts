import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    
    defineField({
      name: 'color',
      title: 'Category Color',
      type: 'color',
      options: {
        disableAlpha: true,
      },
    }),
    
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'Optional icon for this category',
      options: {
        hotspot: false,
      },
    }),
    
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'For nested categories',
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'icon',
    },
  },
})