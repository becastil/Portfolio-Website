import { defineType, defineArrayMember } from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'H5', value: 'h5' },
        { title: 'H6', value: 'h6' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
        { title: 'Checklist', value: 'checklist' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
          { title: 'Code', value: 'code' },
          { title: 'Highlight', value: 'highlight' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) => Rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: false,
              },
            ],
          },
          {
            title: 'Internal Link',
            name: 'internalLink',
            type: 'object',
            fields: [
              {
                title: 'Reference',
                name: 'reference',
                type: 'reference',
                to: [
                  { type: 'project' },
                  { type: 'article' },
                ],
              },
            ],
          },
          {
            title: 'Footnote',
            name: 'footnote',
            type: 'object',
            fields: [
              {
                title: 'Text',
                name: 'text',
                type: 'text',
                rows: 3,
              },
            ],
          },
        ],
      },
    }),
    
    defineArrayMember({
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
        {
          name: 'attribution',
          type: 'string',
          title: 'Attribution',
        },
        {
          name: 'size',
          title: 'Display Size',
          type: 'string',
          options: {
            list: [
              { title: 'Small', value: 'small' },
              { title: 'Medium', value: 'medium' },
              { title: 'Large', value: 'large' },
              { title: 'Full Width', value: 'full' },
            ],
          },
          initialValue: 'medium',
        },
        {
          name: 'alignment',
          title: 'Alignment',
          type: 'string',
          options: {
            list: [
              { title: 'Left', value: 'left' },
              { title: 'Center', value: 'center' },
              { title: 'Right', value: 'right' },
            ],
          },
          initialValue: 'center',
        },
      ],
    }),
    
    defineArrayMember({
      type: 'codeBlock',
    }),
    
    defineArrayMember({
      type: 'videoEmbed',
    }),
    
    defineArrayMember({
      type: 'callToAction',
    }),
    
    defineArrayMember({
      name: 'table',
      title: 'Table',
      type: 'object',
      fields: [
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
        {
          name: 'table',
          title: 'Table',
          type: 'table',
        },
      ],
    }),
    
    defineArrayMember({
      name: 'alert',
      title: 'Alert/Callout',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Success', value: 'success' },
              { title: 'Warning', value: 'warning' },
              { title: 'Error', value: 'error' },
              { title: 'Tip', value: 'tip' },
              { title: 'Note', value: 'note' },
            ],
          },
          initialValue: 'info',
        },
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    
    defineArrayMember({
      name: 'divider',
      title: 'Divider',
      type: 'object',
      fields: [
        {
          name: 'style',
          title: 'Style',
          type: 'string',
          options: {
            list: [
              { title: 'Line', value: 'line' },
              { title: 'Dots', value: 'dots' },
              { title: 'Wave', value: 'wave' },
            ],
          },
          initialValue: 'line',
        },
      ],
    }),
  ],
})