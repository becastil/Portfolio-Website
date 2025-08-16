import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'outcome',
  title: 'Outcome',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Outcome',
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
      name: 'metric',
      title: 'Metric/KPI',
      type: 'string',
      description: 'Quantifiable result (e.g., "50% improvement")',
    }),
    
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Performance', value: 'performance' },
          { title: 'User Experience', value: 'ux' },
          { title: 'Business', value: 'business' },
          { title: 'Technical', value: 'technical' },
          { title: 'Process', value: 'process' },
        ],
      },
    }),
    
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name or emoji',
    }),
  ],
})