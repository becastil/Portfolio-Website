# Sanity CMS Setup Guide

## Overview
This portfolio website is configured with a comprehensive Sanity CMS schema that provides a powerful content management system for all portfolio content.

## Quick Start

### 1. Install Dependencies
```bash
npm install @sanity/client @sanity/image-url @sanity/vision sanity groq next-sanity
npm install --save-dev @sanity/types sanity-typegen
```

### 2. Create Sanity Project
```bash
# If you don't have a Sanity project yet
npm create sanity@latest -- --project-id <projectId> --dataset production
```

### 3. Configure Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your Sanity project details:
```bash
cp .env.local.example .env.local
```

### 4. Deploy Sanity Studio
```bash
# Deploy to Sanity's hosted studio
npx sanity deploy

# Or run locally
npx sanity dev
```

### 5. Generate TypeScript Types
```bash
npx sanity typegen generate
```

## Content Models

### Documents
- **Projects**: Portfolio projects with case studies, metrics, and galleries
- **Articles**: Blog posts with rich text, code blocks, and SEO
- **Authors**: Content creators with profiles and social links
- **Categories**: Taxonomies for organizing content
- **Testimonials**: Client feedback and reviews
- **Skills**: Technical competencies with proficiency levels
- **Experience**: Work history and achievements
- **Education**: Academic background
- **Certifications**: Professional certifications
- **Site Settings**: Global site configuration
- **Navigation**: Menu structures
- **Social Media**: Social platform links

### Key Features

#### Rich Content Editing
- Block content with custom components
- Code blocks with syntax highlighting
- Image galleries with multiple layouts
- Video embeds (YouTube, Vimeo, etc.)
- Tables, alerts, and callouts

#### SEO Optimization
- Meta titles and descriptions
- Open Graph images
- Structured data (JSON-LD)
- Canonical URLs
- XML sitemap generation

#### Image Optimization
- Automatic format conversion (WebP)
- Responsive image generation
- Blur-up placeholders (LQIP)
- Hotspot cropping
- CDN delivery

#### Content Relationships
- Related projects and articles
- Author associations
- Category hierarchies
- Skill-project mappings
- Testimonial-project links

## GROQ Queries

### Fetching Projects
```typescript
import { getProjects, getProjectBySlug } from '@/sanity/lib/fetch'

// Get all projects
const projects = await getProjects()

// Get single project
const project = await getProjectBySlug('my-project')
```

### Fetching Articles
```typescript
import { getArticles, getArticleBySlug } from '@/sanity/lib/fetch'

// Get all articles
const articles = await getArticles()

// Get single article
const article = await getArticleBySlug('my-article')
```

## Image Handling

```typescript
import { urlFor, getImageUrl, getResponsiveImageSrcSet } from '@/sanity/lib/client'

// Basic image URL
const imageUrl = urlFor(image).url()

// Optimized image with transformations
const optimizedUrl = getImageUrl(image, {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp'
})

// Responsive srcset
const srcSet = getResponsiveImageSrcSet(image)
```

## Preview Mode

Enable draft preview in your Next.js app:

```typescript
// app/api/preview/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  draftMode().enable()
  redirect('/')
}
```

## Content Migration

### Import Existing Content
```javascript
// scripts/import-content.js
import { client } from './sanity/lib/client'

const documents = [
  {
    _type: 'project',
    title: 'My Project',
    slug: { current: 'my-project' },
    // ... other fields
  }
]

documents.forEach(doc => {
  client.create(doc).then(res => {
    console.log(`Created ${res._id}`)
  })
})
```

## Best Practices

### 1. Content Structure
- Use meaningful slugs for SEO
- Fill in alt text for all images
- Add meta descriptions for better search visibility
- Tag content appropriately for filtering

### 2. Performance
- Enable CDN in production
- Use responsive images
- Implement pagination for large datasets
- Cache queries with appropriate TTL

### 3. Security
- Keep API tokens secure
- Use read-only tokens for public queries
- Implement proper CORS settings
- Validate and sanitize user input

### 4. Maintenance
- Regular content audits
- Update dependencies monthly
- Monitor build times
- Clean up unused assets

## Studio Customization

### Add Custom Input Components
```typescript
// sanity/components/CustomInput.tsx
import { StringInputProps } from 'sanity'

export function CustomStringInput(props: StringInputProps) {
  return (
    <div>
      {/* Custom input implementation */}
    </div>
  )
}
```

### Add Desk Structure
```typescript
// sanity.config.ts
structureTool({
  structure: (S) =>
    S.list()
      .title('Content')
      .items([
        // Custom desk structure
      ])
})
```

## Deployment

### Vercel Deployment
```json
// vercel.json
{
  "env": {
    "NEXT_PUBLIC_SANITY_PROJECT_ID": "@sanity_project_id",
    "NEXT_PUBLIC_SANITY_DATASET": "@sanity_dataset"
  }
}
```

### GitHub Actions
```yaml
# .github/workflows/sanity.yml
name: Deploy Sanity
on:
  push:
    branches: [main]
    paths:
      - 'sanity/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npx sanity deploy
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Add your domain to Sanity project settings
2. **Missing Types**: Run `npx sanity typegen generate`
3. **Stale Content**: Clear CDN cache or disable in development
4. **Build Errors**: Check environment variables are set

### Debug Mode
```typescript
// Enable debug logging
client.config({
  ...config,
  useCdn: false,
  withCredentials: true,
  ignoreBrowserTokenWarning: true
})
```

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Cheat Sheet](https://www.sanity.io/docs/groq)
- [Next.js + Sanity Guide](https://github.com/sanity-io/next-sanity)
- [Image URL Builder](https://www.sanity.io/docs/image-url)

## Support

For issues or questions:
1. Check the [Sanity Community](https://slack.sanity.io/)
2. Review [GitHub Issues](https://github.com/sanity-io/sanity/issues)
3. Contact support@sanity.io for enterprise support