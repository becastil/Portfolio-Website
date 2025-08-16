import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'timeline',
  title: 'Timeline',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Timeline Title',
      type: 'string',
    }),
    
    defineField({
      name: 'events',
      title: 'Timeline Events',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'date',
              title: 'Date',
              type: 'date',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Event Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            },
            {
              name: 'milestone',
              title: 'Is Milestone',
              type: 'boolean',
              description: 'Mark as important milestone',
              initialValue: false,
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name or emoji',
            },
            {
              name: 'color',
              title: 'Color',
              type: 'color',
            },
          ],
        },
      ],
    }),
  ],
})