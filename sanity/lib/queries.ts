import { groq } from 'next-sanity'

// Reusable fragments
const seoFields = groq`
  seo {
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    noIndex,
    noFollow
  }
`

const imageFields = groq`
  _key,
  _type,
  alt,
  caption,
  attribution,
  "url": asset->url,
  "metadata": asset->metadata {
    dimensions,
    lqip,
    palette,
    blurhash
  }
`

const authorFields = groq`
  _id,
  name,
  slug,
  email,
  bio,
  role,
  avatar {
    ${imageFields}
  },
  socialLinks
`

// Project Queries
export const projectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**"))] | order(featured desc, order asc, publishedAt desc) {
    _id,
    title,
    slug,
    featured,
    client,
    projectType,
    status,
    summary,
    mainImage {
      ${imageFields}
    },
    techStack {
      frontend[]{name, icon},
      backend[]{name, icon},
      database[]{name, icon}
    },
    categories[]-> {
      _id,
      title,
      slug,
      color
    },
    tags,
    liveUrl,
    githubUrl,
    publishedAt
  }
`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true && !(_id in path("drafts.**"))] | order(order asc, publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    client,
    summary,
    mainImage {
      ${imageFields}
    },
    techStack {
      frontend[]{name},
      backend[]{name}
    },
    liveUrl,
    githubUrl
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))] [0] {
    _id,
    title,
    slug,
    featured,
    order,
    client,
    projectType,
    status,
    startDate,
    endDate,
    summary,
    description,
    role,
    responsibilities,
    mainImage {
      ${imageFields}
    },
    gallery {
      title,
      images[] {
        ${imageFields}
      },
      layout,
      columns,
      showCaptions,
      enableLightbox
    },
    techStack,
    features[] {
      title,
      description,
      icon,
      image {
        ${imageFields}
      },
      technical
    },
    challenges[] {
      title,
      description,
      impact,
      severity
    },
    solutions[] {
      title,
      description,
      approach,
      technologies,
      effectiveness
    },
    outcomes[] {
      title,
      description,
      metric,
      category,
      icon
    },
    metrics,
    caseStudy {
      overview,
      process,
      timeline,
      learnings,
      nextSteps
    },
    liveUrl,
    githubUrl,
    demoUrl,
    videoDemo,
    testimonial-> {
      name,
      role,
      company,
      testimonial,
      rating,
      image {
        ${imageFields}
      }
    },
    relatedProjects[]-> {
      _id,
      title,
      slug,
      summary,
      mainImage {
        ${imageFields}
      }
    },
    categories[]-> {
      _id,
      title,
      slug,
      color
    },
    tags,
    ${seoFields},
    publishedAt
  }
`

// Blog Article Queries
export const articlesQuery = groq`
  *[_type == "article" && status == "published" && !(_id in path("drafts.**"))] | order(featured desc, publishedAt desc) {
    _id,
    title,
    slug,
    featured,
    excerpt,
    mainImage {
      ${imageFields}
    },
    author-> {
      name,
      slug,
      avatar {
        ${imageFields}
      }
    },
    categories[]-> {
      _id,
      title,
      slug,
      color
    },
    tags,
    readingTime,
    difficulty,
    publishedAt
  }
`

export const featuredArticlesQuery = groq`
  *[_type == "article" && featured == true && status == "published" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      ${imageFields}
    },
    author-> {
      name,
      avatar {
        ${imageFields}
      }
    },
    readingTime,
    publishedAt
  }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug && !(_id in path("drafts.**"))] [0] {
    _id,
    title,
    slug,
    featured,
    excerpt,
    mainImage {
      ${imageFields}
    },
    content,
    author-> {
      ${authorFields}
    },
    coAuthors[]-> {
      ${authorFields}
    },
    categories[]-> {
      _id,
      title,
      slug,
      color,
      description
    },
    tags,
    readingTime,
    difficulty,
    series,
    relatedArticles[]-> {
      _id,
      title,
      slug,
      excerpt,
      mainImage {
        ${imageFields}
      },
      readingTime
    },
    relatedProjects[]-> {
      _id,
      title,
      slug,
      summary,
      mainImage {
        ${imageFields}
      }
    },
    resources,
    codeExamples,
    callToAction,
    enableComments,
    ${seoFields},
    publishedAt,
    updatedAt
  }
`

export const articlesByCategoryQuery = groq`
  *[_type == "article" && $categoryId in categories[]._ref && status == "published" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      ${imageFields}
    },
    author-> {
      name,
      avatar {
        ${imageFields}
      }
    },
    readingTime,
    publishedAt
  }
`

// Author Queries
export const authorsQuery = groq`
  *[_type == "author" && !(_id in path("drafts.**"))] | order(name asc) {
    ${authorFields}
  }
`

export const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug && !(_id in path("drafts.**"))] [0] {
    ${authorFields},
    "articles": *[_type == "article" && author._ref == ^._id && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage {
        ${imageFields}
      },
      readingTime,
      publishedAt
    }
  }
`

// Category Queries
export const categoriesQuery = groq`
  *[_type == "category" && !(_id in path("drafts.**"))] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color,
    icon {
      ${imageFields}
    },
    "count": count(*[_type in ["project", "article"] && ^._id in categories[]._ref])
  }
`

// Testimonial Queries
export const testimonialsQuery = groq`
  *[_type == "testimonial" && !(_id in path("drafts.**"))] | order(featured desc, date desc) {
    _id,
    name,
    role,
    company,
    companyUrl,
    testimonial,
    rating,
    image {
      ${imageFields}
    },
    featured,
    date,
    verified
  }
`

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true && !(_id in path("drafts.**"))] | order(date desc) [0...6] {
    _id,
    name,
    role,
    company,
    testimonial,
    rating,
    image {
      ${imageFields}
    }
  }
`

// Skills Queries
export const skillsQuery = groq`
  *[_type == "skill" && !(_id in path("drafts.**"))] | order(category asc, order asc, proficiency desc) {
    _id,
    name,
    category,
    proficiency,
    yearsOfExperience,
    icon {
      ${imageFields}
    },
    color,
    featured
  }
`

export const featuredSkillsQuery = groq`
  *[_type == "skill" && featured == true && !(_id in path("drafts.**"))] | order(proficiency desc) {
    _id,
    name,
    category,
    proficiency,
    icon {
      ${imageFields}
    },
    color
  }
`

// Experience Queries
export const experienceQuery = groq`
  *[_type == "experience" && !(_id in path("drafts.**"))] | order(current desc, startDate desc) {
    _id,
    position,
    company,
    companyUrl,
    companyLogo {
      ${imageFields}
    },
    location,
    employmentType,
    startDate,
    endDate,
    current,
    description,
    responsibilities,
    achievements,
    technologies,
    skills[]-> {
      _id,
      name,
      category
    }
  }
`

// Education Queries
export const educationQuery = groq`
  *[_type == "education" && !(_id in path("drafts.**"))] | order(endDate desc) {
    _id,
    degree,
    field,
    institution,
    institutionUrl,
    location,
    startDate,
    endDate,
    gpa,
    honors,
    relevantCourses,
    description
  }
`

// Certification Queries
export const certificationsQuery = groq`
  *[_type == "certification" && !(_id in path("drafts.**"))] | order(featured desc, issueDate desc) {
    _id,
    title,
    issuer,
    issuerUrl,
    credentialId,
    credentialUrl,
    issueDate,
    expiryDate,
    doesNotExpire,
    description,
    logo {
      ${imageFields}
    },
    skills[]-> {
      _id,
      name
    },
    featured
  }
`

// Site Settings Queries
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"] [0] {
    title,
    description,
    keywords,
    siteUrl,
    logo {
      ${imageFields}
    },
    favicon {
      ${imageFields}
    },
    ogImage {
      ${imageFields}
    },
    contactInfo,
    analytics,
    maintenanceMode,
    copyrightText
  }
`

// Navigation Queries
export const navigationQuery = groq`
  *[_type == "navigation" && navId.current == $navId] [0] {
    title,
    items[] {
      label,
      url,
      page-> {
        _type,
        slug
      },
      openInNewTab,
      children[] {
        label,
        url,
        page-> {
          _type,
          slug
        }
      }
    }
  }
`

// Social Media Queries
export const socialMediaQuery = groq`
  *[_type == "socialMedia" && !(_id in path("drafts.**"))] | order(order asc) {
    platform,
    url,
    username,
    icon {
      ${imageFields}
    },
    showInHeader,
    showInFooter
  }
`

// Search Query
export const searchQuery = groq`
  {
    "projects": *[_type == "project" && (
      title match $searchTerm + "*" ||
      summary match $searchTerm + "*" ||
      client match $searchTerm + "*" ||
      $searchTerm in tags
    )] | order(featured desc, publishedAt desc) [0...10] {
      _id,
      _type,
      title,
      slug,
      summary,
      mainImage {
        ${imageFields}
      }
    },
    "articles": *[_type == "article" && status == "published" && (
      title match $searchTerm + "*" ||
      excerpt match $searchTerm + "*" ||
      $searchTerm in tags
    )] | order(featured desc, publishedAt desc) [0...10] {
      _id,
      _type,
      title,
      slug,
      excerpt,
      mainImage {
        ${imageFields}
      }
    }
  }
`

// Sitemap Query
export const sitemapQuery = groq`
  {
    "projects": *[_type == "project" && !(_id in path("drafts.**"))] {
      "url": slug.current,
      "lastmod": _updatedAt
    },
    "articles": *[_type == "article" && status == "published" && !(_id in path("drafts.**"))] {
      "url": slug.current,
      "lastmod": _updatedAt
    },
    "categories": *[_type == "category" && !(_id in path("drafts.**"))] {
      "url": slug.current,
      "lastmod": _updatedAt
    },
    "authors": *[_type == "author" && !(_id in path("drafts.**"))] {
      "url": slug.current,
      "lastmod": _updatedAt
    }
  }
`