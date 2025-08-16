import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { media } from 'sanity-plugin-media'
import { codeInput } from '@sanity/code-input'
import { vercelDeployTool } from 'sanity-plugin-vercel-deploy'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'default',
  title: 'Portfolio CMS',
  projectId,
  dataset,
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Projects')
              .child(
                S.documentTypeList('project')
                  .title('Projects')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('Blog')
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.documentTypeListItem('article').title('Articles'),
                    S.documentTypeListItem('author').title('Authors'),
                    S.documentTypeListItem('category').title('Categories'),
                  ])
              ),
            S.listItem()
              .title('Resume')
              .child(
                S.list()
                  .title('Resume')
                  .items([
                    S.documentTypeListItem('experience').title('Work Experience'),
                    S.documentTypeListItem('education').title('Education'),
                    S.documentTypeListItem('skill').title('Skills'),
                    S.documentTypeListItem('certification').title('Certifications'),
                  ])
              ),
            S.listItem()
              .title('Testimonials')
              .child(S.documentTypeList('testimonial').title('Testimonials')),
            S.listItem()
              .title('Settings')
              .child(
                S.list()
                  .title('Settings')
                  .items([
                    S.documentTypeListItem('siteSettings').title('Site Settings'),
                    S.documentTypeListItem('navigation').title('Navigation'),
                    S.documentTypeListItem('socialMedia').title('Social Media'),
                  ])
              ),
          ]),
    }),
    visionTool(),
    media(),
    codeInput(),
    vercelDeployTool(),
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  document: {
    // Production URL preview
    productionUrl: async (prev, context) => {
      const { document } = context
      const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      
      if (document._type === 'project') {
        return `${url}/projects/${document.slug?.current}?preview=true`
      }
      if (document._type === 'article') {
        return `${url}/blog/${document.slug?.current}?preview=true`
      }
      
      return url
    },
  },
})