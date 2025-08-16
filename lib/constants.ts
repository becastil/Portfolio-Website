import { Project, NavLink, SocialLink, SiteMetadata } from '@/types'

export const siteMetadata: SiteMetadata = {
  title: 'Ben Castillo - Full-Stack Developer',
  description: 'Full-stack developer passionate about creating elegant solutions to complex problems. Specializing in modern web technologies and cloud architecture.',
  author: 'Ben Castillo',
  siteUrl: 'https://bencastillo.dev',
  email: 'ben@bencastillo.dev',
  social: {
    twitter: 'bencastillo_dev',
    github: 'bencastillo',
    linkedin: 'bencastillo',
  },
}

export const navLinks: NavLink[] = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export const socialLinks: SocialLink[] = [
  {
    href: `mailto:${siteMetadata.email}`,
    label: 'Email',
    icon: 'mail',
    ariaLabel: 'Email Ben Castillo',
  },
  {
    href: `https://linkedin.com/in/${siteMetadata.social.linkedin}`,
    label: 'LinkedIn',
    icon: 'linkedin',
    ariaLabel: 'LinkedIn profile (opens in new tab)',
  },
  {
    href: `https://github.com/${siteMetadata.social.github}`,
    label: 'GitHub',
    icon: 'github',
    ariaLabel: 'GitHub profile (opens in new tab)',
  },
  {
    href: `https://twitter.com/${siteMetadata.social.twitter}`,
    label: 'Twitter',
    icon: 'twitter',
    ariaLabel: 'Twitter profile (opens in new tab)',
  },
]

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack web application built with React and Node.js, featuring user authentication, payment processing, and admin dashboard.',
    category: 'web',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'React Native mobile application with Firebase backend for real-time collaboration and offline functionality.',
    category: 'mobile',
    technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
  },
  {
    id: '3',
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard using D3.js and Python Flask to visualize complex datasets with real-time updates.',
    category: 'data',
    technologies: ['D3.js', 'Python', 'Flask', 'PostgreSQL'],
  },
  {
    id: '4',
    title: 'Machine Learning Model',
    description: 'TensorFlow-based image classification model with 95% accuracy, deployed using Docker and cloud infrastructure.',
    category: 'data',
    technologies: ['Python', 'TensorFlow', 'Docker', 'AWS'],
  },
  {
    id: '5',
    title: 'API Development',
    description: 'RESTful API built with Express.js and MongoDB, featuring authentication, rate limiting, and comprehensive documentation.',
    category: 'web',
    technologies: ['Express.js', 'MongoDB', 'JWT', 'Swagger'],
  },
  {
    id: '6',
    title: 'Open Source Contribution',
    description: 'Major feature contribution to a popular JavaScript library, improving performance by 40% and adding TypeScript support.',
    category: 'web',
    technologies: ['JavaScript', 'TypeScript', 'Open Source', 'Performance'],
  },
]