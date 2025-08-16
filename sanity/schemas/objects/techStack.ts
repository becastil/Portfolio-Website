import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'techStack',
  title: 'Technology Stack',
  type: 'object',
  fields: [
    defineField({
      name: 'frontend',
      title: 'Frontend',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Technology',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'version',
              title: 'Version',
              type: 'string',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                hotspot: false,
              },
            },
          ],
        },
      ],
    }),
    
    defineField({
      name: 'backend',
      title: 'Backend',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Technology',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'version',
              title: 'Version',
              type: 'string',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                hotspot: false,
              },
            },
          ],
        },
      ],
    }),
    
    defineField({
      name: 'database',
      title: 'Database',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Technology',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'version',
              title: 'Version',
              type: 'string',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                hotspot: false,
              },
            },
          ],
        },
      ],
    }),
    
    defineField({
      name: 'devops',
      title: 'DevOps & Infrastructure',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Technology',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'version',
              title: 'Version',
              type: 'string',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                hotspot: false,
              },
            },
          ],
        },
      ],
    }),
    
    defineField({
      name: 'tools',
      title: 'Tools & Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Tool/Service',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'purpose',
              title: 'Purpose',
              type: 'string',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                hotspot: false,
              },
            },
          ],
        },
      ],
    }),
  ],
})