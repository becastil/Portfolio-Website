export interface Project {
  id: string
  title: string
  description: string
  category: 'web' | 'mobile' | 'data'
  technologies: string[]
  link?: string
  github?: string
  image?: string
}

export interface NavLink {
  href: string
  label: string
  ariaLabel?: string
}

export interface SocialLink {
  href: string
  label: string
  icon: string
  ariaLabel: string
}

export interface FormData {
  name: string
  email: string
  subject?: string
  message: string
}

export interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export type Theme = 'light' | 'dark'

export interface SiteMetadata {
  title: string
  description: string
  author: string
  siteUrl: string
  email: string
  social: {
    twitter: string
    github: string
    linkedin: string
  }
}