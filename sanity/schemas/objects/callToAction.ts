import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 2,
    }),
    
    defineField({
      name: 'primaryButton',
      title: 'Primary Button',
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
        {
          name: 'openInNewTab',
          title: 'Open in New Tab',
          type: 'boolean',
          initialValue: false,
        },
      ],
    }),
    
    defineField({
      name: 'secondaryButton',
      title: 'Secondary Button',
      type: 'object',
      fields: [
        {
          name: 'label',
          title: 'Label',
          type: 'string',
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
        {
          name: 'openInNewTab',
          title: 'Open in New Tab',
          type: 'boolean',
          initialValue: false,
        },
      ],
    }),
    
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Centered', value: 'centered' },
          { title: 'Card', value: 'card' },
          { title: 'Banner', value: 'banner' },
        ],
      },
      initialValue: 'default',
    }),
    
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
    }),
  ],
})