import { defineType, defineField } from 'sanity'
import { BriefcaseIcon } from '@sanity/icons'

export default defineType({
  name: 'experience',
  title: 'Work Experience',
  type: 'document',
  icon: BriefcaseIcon,
  
  fields: [
    defineField({
      name: 'position',
      title: 'Position/Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'companyUrl',
      title: 'Company Website',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),
    
    defineField({
      name: 'companyLogo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: false,
      },
    }),
    
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    
    defineField({
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Part-time', value: 'part-time' },
          { title: 'Contract', value: 'contract' },
          { title: 'Freelance', value: 'freelance' },
          { title: 'Internship', value: 'internship' },
          { title: 'Remote', value: 'remote' },
        ],
      },
    }),
    
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
      description: 'Leave empty if current position',
    }),
    
    defineField({
      name: 'current',
      title: 'Current Position',
      type: 'boolean',
      initialValue: false,
    }),
    
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),
    
    defineField({
      name: 'responsibilities',
      title: 'Key Responsibilities',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(10),
    }),
    
    defineField({
      name: 'achievements',
      title: 'Achievements',
      type: 'array',
      of: [{ type: 'achievement' }],
      validation: (Rule) => Rule.max(5),
    }),
    
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    
    defineField({
      name: 'skills',
      title: 'Skills Developed',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'skill' }],
        },
      ],
    }),
    
    defineField({
      name: 'projects',
      title: 'Related Projects',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
    }),
    
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in timeline (lower numbers first)',
      initialValue: 0,
    }),
  ],
  
  preview: {
    select: {
      title: 'position',
      company: 'company',
      startDate: 'startDate',
      endDate: 'endDate',
      current: 'current',
      media: 'companyLogo',
    },
    prepare({ title, company, startDate, endDate, current, media }) {
      const start = startDate ? new Date(startDate).getFullYear() : ''
      const end = current ? 'Present' : (endDate ? new Date(endDate).getFullYear() : '')
      return {
        title,
        subtitle: `${company} • ${start}-${end}`,
        media,
      }
    },
  },
  
  orderings: [
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})