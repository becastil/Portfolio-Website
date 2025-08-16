import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'Loom', value: 'loom' },
          { title: 'Custom URL', value: 'custom' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      description: 'Video ID for YouTube/Vimeo (extracted from URL)',
    }),
    
    defineField({
      name: 'thumbnail',
      title: 'Custom Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9', value: '16:9' },
          { title: '4:3', value: '4:3' },
          { title: '1:1', value: '1:1' },
          { title: '9:16', value: '9:16' },
        ],
      },
      initialValue: '16:9',
    }),
    
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: false,
    }),
    
    defineField({
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      initialValue: false,
    }),
    
    defineField({
      name: 'muted',
      title: 'Muted',
      type: 'boolean',
      initialValue: false,
    }),
    
    defineField({
      name: 'controls',
      title: 'Show Controls',
      type: 'boolean',
      initialValue: true,
    }),
    
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
})