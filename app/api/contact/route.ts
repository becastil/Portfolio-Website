import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Initialize DOMPurify for server-side usage
const window = new JSDOM('').window
const purify = DOMPurify(window as unknown as Window & typeof globalThis)

// Initialize Resend with API key from environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

/**
 * Zod validation schema for contact form data
 * Implements comprehensive validation with security considerations
 */
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .toLowerCase()
    .trim(),
  
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
  
  // Honeypot field - should be empty for legitimate submissions
  website: z.string().max(0, 'Spam detected').optional(),
  
  // Time-based validation (optional timestamp when form was loaded)
  formTimestamp: z.string().optional(),
})

/**
 * Rate limiting configuration
 * Uses in-memory storage for simplicity - consider Redis for production scaling
 */
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 5

/**
 * Extracts client IP address from various headers
 * Handles common proxy configurations and CDN setups
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }
  
  // Fallback to a default identifier
  return 'unknown'
}

/**
 * Implements sliding window rate limiting
 * Returns true if rate limit is exceeded
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  
  if (!entry || now > entry.resetTime) {
    // Reset or create new entry
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }
  
  entry.count++
  return false
}

/**
 * Cleans up expired rate limit entries
 * Should be called periodically to prevent memory leaks
 */
function cleanupRateLimit(): void {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}

/**
 * Spam detection using keyword filtering
 * Basic content analysis for common spam patterns
 */
const SPAM_KEYWORDS = [
  'viagra', 'casino', 'lottery', 'winner', 'congratulations',
  'bitcoin', 'cryptocurrency', 'investment opportunity', 'make money fast',
  'click here', 'urgent', 'limited time', 'act now', 'free money',
  'nigerian prince', 'inheritance', 'tax refund', 'IRS'
]

function containsSpamKeywords(text: string): boolean {
  const lowerText = text.toLowerCase()
  return SPAM_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()))
}

/**
 * Validates form timing to detect bot submissions
 * Forms filled too quickly are likely automated
 */
function validateFormTiming(timestamp?: string): boolean {
  if (!timestamp) return true // Skip validation if no timestamp provided
  
  try {
    const formLoadTime = parseInt(timestamp, 10)
    const submissionTime = Date.now()
    const timeDiff = submissionTime - formLoadTime
    
    // Form filled in less than 3 seconds is suspicious
    return timeDiff >= 3000
  } catch {
    return true // Allow submission if timestamp is invalid
  }
}

/**
 * Sanitizes input data to prevent XSS attacks
 * Uses DOMPurify to clean HTML content
 */
function sanitizeInput(input: string): string {
  return purify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  }).trim()
}

/**
 * Sends email using Resend service
 * Falls back to console logging for development
 */
async function sendContactEmail(data: {
  name: string
  email: string
  subject?: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  const emailSubject = data.subject || 'New Contact Form Submission'
  const emailContent = `
    New contact form submission from your portfolio website:
    
    Name: ${data.name}
    Email: ${data.email}
    Subject: ${emailSubject}
    
    Message:
    ${data.message}
    
    ---
    Sent at: ${new Date().toISOString()}
    IP Address: [Logged separately for privacy]
  `.trim()

  // Production email sending with Resend
  if (resend && process.env.CONTACT_EMAIL_TO) {
    try {
      await resend.emails.send({
        from: process.env.CONTACT_EMAIL_FROM || 'contact@bencastillo.dev',
        to: process.env.CONTACT_EMAIL_TO,
        subject: `Portfolio Contact: ${emailSubject}`,
        text: emailContent,
        replyTo: data.email,
      })
      
      return { success: true }
    } catch (error) {
      console.error('Failed to send email via Resend:', error)
      return { success: false, error: 'Email service temporarily unavailable' }
    }
  }
  
  // Development fallback - log to console
  console.log('=== CONTACT FORM SUBMISSION ===')
  console.log('From:', data.name, '<' + data.email + '>')
  console.log('Subject:', emailSubject)
  console.log('Message:', data.message)
  console.log('Timestamp:', new Date().toISOString())
  console.log('================================')
  
  return { success: true }
}

/**
 * Structured logging for security and monitoring
 */
function logSecurityEvent(
  event: string, 
  ip: string, 
  details?: Record<string, unknown>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip,
    userAgent: details?.userAgent || 'unknown',
    ...details,
  }
  
  console.log('SECURITY_EVENT:', JSON.stringify(logEntry))
}

/**
 * Main POST handler for contact form submissions
 * Implements comprehensive security measures and validation
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Security headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    })

    // Extract client information
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const origin = request.headers.get('origin')
    const contentType = request.headers.get('content-type')

    // Validate Content-Type
    if (!contentType?.includes('application/json')) {
      logSecurityEvent('invalid_content_type', clientIP, { contentType, userAgent })
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400, headers }
      )
    }

    // Origin validation for CSRF protection (optional - adjust based on your deployment)
    const allowedOrigins = [
      'https://bencastillo.dev',
      'https://www.bencastillo.dev',
      'http://localhost:3000', // Development
    ]
    
    if (origin && !allowedOrigins.includes(origin)) {
      logSecurityEvent('invalid_origin', clientIP, { origin, userAgent })
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403, headers }
      )
    }

    // Rate limiting check
    if (isRateLimited(clientIP)) {
      logSecurityEvent('rate_limit_exceeded', clientIP, { userAgent })
      
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000),
        },
        { 
          status: 429, 
          headers: {
            ...headers,
            'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
          }
        }
      )
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch (error) {
      logSecurityEvent('invalid_json', clientIP, { userAgent })
      return NextResponse.json(
        { error: 'Invalid JSON data' },
        { status: 400, headers }
      )
    }

    // Zod validation
    const validationResult = contactFormSchema.safeParse(body)
    if (!validationResult.success) {
      logSecurityEvent('validation_failed', clientIP, { 
        errors: validationResult.error.issues,
        userAgent 
      })
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400, headers }
      )
    }

    const data = validationResult.data

    // Honeypot check
    if (data.website && data.website.length > 0) {
      logSecurityEvent('honeypot_triggered', clientIP, { 
        honeypotValue: data.website,
        userAgent 
      })
      
      // Return success to avoid revealing the honeypot
      return NextResponse.json(
        { message: 'Thank you for your message!' },
        { status: 200, headers }
      )
    }

    // Form timing validation
    if (!validateFormTiming(data.formTimestamp)) {
      logSecurityEvent('suspicious_timing', clientIP, { 
        timestamp: data.formTimestamp,
        userAgent 
      })
      
      return NextResponse.json(
        { error: 'Form submitted too quickly. Please try again.' },
        { status: 400, headers }
      )
    }

    // Spam keyword detection
    const textToCheck = `${data.name} ${data.email} ${data.subject || ''} ${data.message}`
    if (containsSpamKeywords(textToCheck)) {
      logSecurityEvent('spam_keywords_detected', clientIP, { userAgent })
      
      return NextResponse.json(
        { error: 'Message flagged as potential spam. Please revise your content.' },
        { status: 400, headers }
      )
    }

    // Sanitize input data
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      subject: data.subject ? sanitizeInput(data.subject) : undefined,
      message: sanitizeInput(data.message),
    }

    // Send email
    const emailResult = await sendContactEmail(sanitizedData)
    
    if (!emailResult.success) {
      logSecurityEvent('email_send_failed', clientIP, { 
        error: emailResult.error,
        userAgent 
      })
      
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500, headers }
      )
    }

    // Log successful submission
    const processingTime = Date.now() - startTime
    logSecurityEvent('contact_form_submitted', clientIP, {
      userAgent,
      processingTime,
      name: sanitizedData.name,
      email: sanitizedData.email,
      hasSubject: !!sanitizedData.subject,
      messageLength: sanitizedData.message.length,
    })

    // Cleanup expired rate limit entries periodically
    if (Math.random() < 0.1) { // 10% chance to run cleanup
      cleanupRateLimit()
    }

    return NextResponse.json(
      { message: 'Thank you for your message! I\'ll get back to you soon.' },
      { status: 200, headers }
    )

  } catch (error) {
    // Log unexpected errors
    console.error('Unexpected error in contact API:', error)
    logSecurityEvent('unexpected_error', getClientIP(request), {
      error: error instanceof Error ? error.message : 'Unknown error',
      userAgent: request.headers.get('user-agent') || 'unknown',
    })

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        }
      }
    )
  }
}

/**
 * Handle non-POST requests
 * Returns 405 Method Not Allowed for security
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: {
        'Allow': 'POST',
        'Content-Type': 'application/json',
      }
    }
  )
}

// Export the same handler for other HTTP methods
export { GET as PUT, GET as DELETE, GET as PATCH }