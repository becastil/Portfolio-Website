'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { validateForm } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { FormData, FormErrors } from '@/types'

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formTimestamp] = useState(() => Date.now().toString())

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formTimestamp,
          website: '', // Honeypot field
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait before trying again.')
        } else if (data.details) {
          // Handle validation errors from server
          const serverErrors: FormErrors = {}
          data.details.forEach((detail: { field: string; message: string }) => {
            if (detail.field in formData) {
              serverErrors[detail.field as keyof FormErrors] = detail.message
            }
          })
          setErrors(serverErrors)
          return
        } else {
          throw new Error(data.error || 'Failed to send message')
        }
      }
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      setSubmitStatus('error')
      console.error('Form submission error:', error)
      
      // Set a user-friendly error message
      if (error instanceof Error) {
        setErrors({ message: error.message })
      } else {
        setErrors({ message: 'Something went wrong. Please try again later.' })
      }
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
        setErrors({})
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <section id="contact" className="section bg-background" aria-labelledby="contact-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-[600px] mx-auto"
        >
          <h2 id="contact-heading" className="text-4xl font-bold text-text-primary text-center mb-12">
            Get In Touch
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
            {/* Honeypot field - hidden from users */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="website">Website (leave blank)</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            
            <div>
              <label htmlFor="name" className="form-label">
                Name <span aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange('name')}
                className={cn(
                  'form-input',
                  errors.name && 'border-error focus:ring-error/10'
                )}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                required
              />
              {errors.name && (
                <span id="name-error" role="alert" className="text-error text-sm mt-1 block">
                  {errors.name}
                </span>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">
                Email <span aria-label="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange('email')}
                className={cn(
                  'form-input',
                  errors.email && 'border-error focus:ring-error/10'
                )}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                required
              />
              {errors.email && (
                <span id="email-error" role="alert" className="text-error text-sm mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>
            
            <div>
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange('subject')}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="form-label">
                Message <span aria-label="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange('message')}
                className={cn(
                  'form-input resize-y min-h-[120px]',
                  errors.message && 'border-error focus:ring-error/10'
                )}
                placeholder="Tell me about your project or just say hello!"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                required
              />
              {errors.message && (
                <span id="message-error" role="alert" className="text-error text-sm mt-1 block">
                  {errors.message}
                </span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'btn-primary w-full',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
            
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-success text-center font-medium"
              >
                Thank you for your message! I&apos;ll get back to you soon.
              </motion.div>
            )}
            
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-error text-center font-medium"
              >
                Something went wrong. Please try again later.
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}