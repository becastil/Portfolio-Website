import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'solution',
  title: 'Solution',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Solution',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'approach',
      title: 'Approach',
      type: 'text',
      rows: 2,
      description: 'Technical approach taken',
    }),
    
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    
    defineField({
      name: 'effectiveness',
      title: 'Effectiveness',
      type: 'string',
      description: 'How effective was this solution',
    }),
  ],
})