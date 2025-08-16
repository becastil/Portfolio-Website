import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'challenge',
  title: 'Challenge',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Challenge',
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
      name: 'impact',
      title: 'Impact',
      type: 'string',
      description: 'How this challenge affected the project',
    }),
    
    defineField({
      name: 'severity',
      title: 'Severity',
      type: 'string',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
          { title: 'Critical', value: 'critical' },
        ],
      },
    }),
  ],
})