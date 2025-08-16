import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactInfo',
  title: 'Contact Information',
  type: 'object',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
    }),
    
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        {
          name: 'street',
          title: 'Street',
          type: 'string',
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
        },
        {
          name: 'state',
          title: 'State/Province',
          type: 'string',
        },
        {
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
        },
      ],
    }),
    
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'object',
      fields: [
        {
          name: 'status',
          title: 'Status',
          type: 'string',
          options: {
            list: [
              { title: 'Available', value: 'available' },
              { title: 'Busy', value: 'busy' },
              { title: 'Not Available', value: 'unavailable' },
            ],
          },
        },
        {
          name: 'message',
          title: 'Availability Message',
          type: 'string',
          description: 'e.g., "Available for freelance work"',
        },
      ],
    }),
    
    defineField({
      name: 'preferredContact',
      title: 'Preferred Contact Method',
      type: 'string',
      options: {
        list: [
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'phone' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Contact Form', value: 'form' },
        ],
      },
    }),
    
    defineField({
      name: 'responseTime',
      title: 'Typical Response Time',
      type: 'string',
      description: 'e.g., "Within 24 hours"',
    }),
  ],
})