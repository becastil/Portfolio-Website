import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
    }),
    
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
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
              name: 'link',
              type: 'url',
              title: 'Link URL',
              description: 'Optional link when image is clicked',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(20),
    }),
    
    defineField({
      name: 'layout',
      title: 'Gallery Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Masonry', value: 'masonry' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'Slider', value: 'slider' },
        ],
      },
      initialValue: 'grid',
    }),
    
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      description: 'Number of columns for grid layout',
      validation: (Rule) => Rule.min(1).max(6),
      initialValue: 3,
    }),
    
    defineField({
      name: 'showCaptions',
      title: 'Show Captions',
      type: 'boolean',
      initialValue: true,
    }),
    
    defineField({
      name: 'enableLightbox',
      title: 'Enable Lightbox',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})