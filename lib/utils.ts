import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateForm(data: { name: string; email: string; subject?: string; message: string }) {
  const errors: Record<string, string> = {}

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters'
  } else if (!/^[a-zA-Z\s\-'\.]+$/.test(data.name.trim())) {
    errors.name = 'Name contains invalid characters'
  }

  // Email validation
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address'
  } else if (data.email.length > 254) {
    errors.email = 'Email address is too long'
  }

  // Subject validation (optional field)
  if (data.subject && data.subject.trim().length > 0) {
    if (data.subject.trim().length < 5) {
      errors.subject = 'Subject must be at least 5 characters'
    } else if (data.subject.trim().length > 200) {
      errors.subject = 'Subject must be less than 200 characters'
    }
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
  } else if (data.message.trim().length > 5000) {
    errors.message = 'Message must be less than 5000 characters'
  }

  return errors
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}