import { defineType, defineField } from 'sanity'
import { BookIcon } from '@sanity/icons'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  icon: BookIcon,
  
  fields: [
    defineField({
      name: 'degree',
      title: 'Degree/Certificate',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'field',
      title: 'Field of Study',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'institutionUrl',
      title: 'Institution Website',
      type: 'url',
    }),
    
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
    }),
    
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
    }),
    
    defineField({
      name: 'gpa',
      title: 'GPA',
      type: 'string',
    }),
    
    defineField({
      name: 'honors',
      title: 'Honors & Awards',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    
    defineField({
      name: 'relevantCourses',
      title: 'Relevant Courses',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  
  preview: {
    select: {
      title: 'degree',
      subtitle: 'institution',
      field: 'field',
      endDate: 'endDate',
    },
    prepare({ title, subtitle, field, endDate }) {
      const year = endDate ? new Date(endDate).getFullYear() : 'Present'
      return {
        title,
        subtitle: `${subtitle} • ${field} • ${year}`,
      }
    },
  },
})