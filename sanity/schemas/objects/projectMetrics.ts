import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'projectMetrics',
  title: 'Project Metrics',
  type: 'object',
  fields: [
    defineField({
      name: 'performanceImprovement',
      title: 'Performance Improvement',
      type: 'string',
      description: 'e.g., "50% faster load time"',
    }),
    
    defineField({
      name: 'userGrowth',
      title: 'User Growth',
      type: 'string',
      description: 'e.g., "10K+ active users"',
    }),
    
    defineField({
      name: 'revenueImpact',
      title: 'Revenue Impact',
      type: 'string',
      description: 'e.g., "$1M+ in additional revenue"',
    }),
    
    defineField({
      name: 'efficiency',
      title: 'Efficiency Gains',
      type: 'string',
      description: 'e.g., "30% reduction in operational costs"',
    }),
    
    defineField({
      name: 'codeQuality',
      title: 'Code Quality Metrics',
      type: 'object',
      fields: [
        {
          name: 'coverage',
          title: 'Test Coverage',
          type: 'number',
          description: 'Percentage of code covered by tests',
          validation: (Rule) => Rule.min(0).max(100),
        },
        {
          name: 'maintainabilityIndex',
          title: 'Maintainability Index',
          type: 'string',
        },
        {
          name: 'technicalDebt',
          title: 'Technical Debt',
          type: 'string',
        },
      ],
    }),
    
    defineField({
      name: 'teamSize',
      title: 'Team Size',
      type: 'number',
      description: 'Number of team members',
    }),
    
    defineField({
      name: 'duration',
      title: 'Project Duration',
      type: 'string',
      description: 'e.g., "6 months"',
    }),
    
    defineField({
      name: 'budget',
      title: 'Budget',
      type: 'string',
      description: 'Project budget (optional)',
    }),
    
    defineField({
      name: 'customMetrics',
      title: 'Custom Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name or emoji',
            },
          ],
        },
      ],
    }),
    
    defineField({
      name: 'lighthouse',
      title: 'Lighthouse Scores',
      type: 'object',
      fields: [
        {
          name: 'performance',
          title: 'Performance',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(100),
        },
        {
          name: 'accessibility',
          title: 'Accessibility',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(100),
        },
        {
          name: 'bestPractices',
          title: 'Best Practices',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(100),
        },
        {
          name: 'seo',
          title: 'SEO',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(100),
        },
      ],
    }),
  ],
})