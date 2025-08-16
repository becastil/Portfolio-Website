import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'object',
  fields: [
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'blockContent',
      description: 'Detailed case study overview',
    }),
    
    defineField({
      name: 'process',
      title: 'Process',
      type: 'object',
      fields: [
        {
          name: 'research',
          title: 'Research & Discovery',
          type: 'blockContent',
        },
        {
          name: 'planning',
          title: 'Planning & Strategy',
          type: 'blockContent',
        },
        {
          name: 'design',
          title: 'Design',
          type: 'blockContent',
        },
        {
          name: 'development',
          title: 'Development',
          type: 'blockContent',
        },
        {
          name: 'testing',
          title: 'Testing & QA',
          type: 'blockContent',
        },
        {
          name: 'deployment',
          title: 'Deployment',
          type: 'blockContent',
        },
      ],
    }),
    
    defineField({
      name: 'timeline',
      title: 'Project Timeline',
      type: 'timeline',
    }),
    
    defineField({
      name: 'learnings',
      title: 'Key Learnings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Learning',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            },
          ],
        },
      ],
    }),
    
    defineField({
      name: 'nextSteps',
      title: 'Future Improvements',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})