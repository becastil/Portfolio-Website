import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'achievement',
  title: 'Achievement',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Achievement',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    
    defineField({
      name: 'metric',
      title: 'Metric/Impact',
      type: 'string',
      description: 'e.g., "Increased sales by 40%"',
    }),
    
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name or emoji',
    }),
  ],
})