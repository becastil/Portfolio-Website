import { defineType, defineField } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  
  fields: [
    defineField({
      name: 'title',
      title: 'Navigation Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'navId',
      title: 'Navigation ID',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'items',
      title: 'Navigation Items',
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
              name: 'url',
              title: 'URL',
              type: 'string',
              description: 'External URL or internal path (e.g., /about)',
            },
            {
              name: 'page',
              title: 'Internal Page',
              type: 'reference',
              to: [
                { type: 'project' },
                { type: 'article' },
              ],
            },
            {
              name: 'openInNewTab',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'children',
              title: 'Sub-items',
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
                      name: 'url',
                      title: 'URL',
                      type: 'string',
                    },
                    {
                      name: 'page',
                      title: 'Internal Page',
                      type: 'reference',
                      to: [
                        { type: 'project' },
                        { type: 'article' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({ title, items }) {
      return {
        title,
        subtitle: `${items?.length || 0} items`,
      }
    },
  },
})