import { defineType, defineField } from 'sanity'
import { SparklesIcon } from '@sanity/icons'

export default defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  icon: SparklesIcon,
  
  fields: [
    defineField({
      name: 'name',
      title: 'Skill Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Frontend', value: 'frontend' },
          { title: 'Backend', value: 'backend' },
          { title: 'Database', value: 'database' },
          { title: 'DevOps', value: 'devops' },
          { title: 'Mobile', value: 'mobile' },
          { title: 'Cloud', value: 'cloud' },
          { title: 'Tools', value: 'tools' },
          { title: 'Soft Skills', value: 'soft' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'proficiency',
      title: 'Proficiency Level',
      type: 'number',
      description: 'Skill level from 1-100',
      validation: (Rule) => Rule.required().min(1).max(100),
      initialValue: 50,
    }),
    
    defineField({
      name: 'yearsOfExperience',
      title: 'Years of Experience',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    
    defineField({
      name: 'icon',
      title: 'Skill Icon',
      type: 'image',
      description: 'Icon or logo for this skill',
      options: {
        hotspot: false,
      },
    }),
    
    defineField({
      name: 'color',
      title: 'Brand Color',
      type: 'color',
      options: {
        disableAlpha: true,
      },
    }),
    
    defineField({
      name: 'featured',
      title: 'Featured Skill',
      type: 'boolean',
      description: 'Show this skill prominently',
      initialValue: false,
    }),
    
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order within category',
      initialValue: 0,
    }),
    
    defineField({
      name: 'certifications',
      title: 'Related Certifications',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'certification' }],
        },
      ],
    }),
    
    defineField({
      name: 'projects',
      title: 'Projects Using This Skill',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
    }),
  ],
  
  preview: {
    select: {
      title: 'name',
      category: 'category',
      proficiency: 'proficiency',
      media: 'icon',
      featured: 'featured',
    },
    prepare({ title, category, proficiency, media, featured }) {
      return {
        title,
        subtitle: `${category} • ${proficiency}%${featured ? ' • ⭐' : ''}`,
        media,
      }
    },
  },
  
  orderings: [
    {
      title: 'By Category',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'By Proficiency',
      name: 'proficiencyDesc',
      by: [{ field: 'proficiency', direction: 'desc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'proficiency', direction: 'desc' },
      ],
    },
  ],
})