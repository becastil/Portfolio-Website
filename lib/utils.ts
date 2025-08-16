import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateForm(data: { name: string; email: string; message: string }) {
  const errors: Record<string, string> = {}

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
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