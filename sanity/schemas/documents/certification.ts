import { defineType, defineField } from 'sanity'
import { CertificateIcon } from '@sanity/icons'

export default defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  icon: CertificateIcon,
  
  fields: [
    defineField({
      name: 'title',
      title: 'Certification Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'issuer',
      title: 'Issuing Organization',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'issuerUrl',
      title: 'Issuer Website',
      type: 'url',
    }),
    
    defineField({
      name: 'credentialId',
      title: 'Credential ID',
      type: 'string',
    }),
    
    defineField({
      name: 'credentialUrl',
      title: 'Credential URL',
      type: 'url',
      description: 'Link to verify certification',
    }),
    
    defineField({
      name: 'issueDate',
      title: 'Issue Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'date',
      description: 'Leave empty if no expiry',
    }),
    
    defineField({
      name: 'doesNotExpire',
      title: 'Does Not Expire',
      type: 'boolean',
      initialValue: false,
    }),
    
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    
    defineField({
      name: 'logo',
      title: 'Certification Logo/Badge',
      type: 'image',
      options: {
        hotspot: false,
      },
    }),
    
    defineField({
      name: 'skills',
      title: 'Related Skills',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'skill' }],
        },
      ],
    }),
    
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      issuer: 'issuer',
      issueDate: 'issueDate',
      media: 'logo',
    },
    prepare({ title, issuer, issueDate, media }) {
      const year = issueDate ? new Date(issueDate).getFullYear() : ''
      return {
        title,
        subtitle: `${issuer} • ${year}`,
        media,
      }
    },
  },
})