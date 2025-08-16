# Contact Form API Setup Guide

## Overview

A secure, production-ready contact form API endpoint has been implemented at `/app/api/contact/route.ts` with comprehensive security measures and proper error handling.

## Files Created/Modified

### Created Files:
- `/app/api/contact/route.ts` - Main API route with security features
- `.env.example` - Environment variables template
- `CONTACT_API_SETUP.md` - This setup guide

### Modified Files:
- `components/Contact.tsx` - Updated to use real API endpoint
- `lib/utils.ts` - Enhanced form validation to match API requirements
- `package.json` - Added required dependencies

## Security Features Implemented

### 1. Input Validation & Sanitization
- **Zod Schema Validation**: Comprehensive server-side validation
- **XSS Protection**: DOMPurify sanitization of all inputs
- **Input Length Limits**: Prevents buffer overflow attacks
- **Character Validation**: Regex patterns for name fields

### 2. Rate Limiting
- **IP-based Rate Limiting**: 5 requests per minute per IP
- **Sliding Window Algorithm**: Efficient memory usage
- **Automatic Cleanup**: Prevents memory leaks
- **Proper Headers**: Retry-After headers for client guidance

### 3. Spam Protection
- **Honeypot Field**: Hidden field to catch bots
- **Keyword Filtering**: Common spam phrase detection
- **Form Timing Validation**: Detects suspiciously fast submissions
- **Origin Validation**: CSRF protection through origin checking

### 4. Security Headers
- **Content Security**: X-Content-Type-Options, X-Frame-Options
- **XSS Protection**: X-XSS-Protection header
- **Referrer Policy**: Strict origin policy
- **Content-Type Validation**: Ensures JSON requests only

### 5. Error Handling
- **Structured Responses**: Consistent error format
- **Status Codes**: Proper HTTP status codes (400, 429, 500)
- **Security Logging**: Detailed security event tracking
- **Generic Error Messages**: Prevents information leakage

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required for production email sending
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email configuration
CONTACT_EMAIL_TO=your-email@example.com
CONTACT_EMAIL_FROM=contact@bencastillo.dev
```

### Getting Resend API Key:
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Create an API key in the dashboard
4. Add the key to your environment variables

## Development vs Production

### Development Mode:
- Without `RESEND_API_KEY`: Falls back to console logging
- All security features still active
- Detailed error logging to console

### Production Mode:
- Requires `RESEND_API_KEY` for email sending
- Generic error messages to users
- Structured security logging

## API Endpoint Details

### Endpoint: `POST /api/contact`

### Request Format:
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "subject": "Project Inquiry",
  "message": "Hello, I'd like to discuss...",
  "formTimestamp": "1692180000000",
  "website": ""
}
```

### Success Response (200):
```json
{
  "message": "Thank you for your message! I'll get back to you soon."
}
```

### Error Response (400):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name must be at least 2 characters"
    }
  ]
}
```

### Rate Limit Response (429):
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

## Validation Rules

### Name:
- 2-100 characters
- Letters, spaces, hyphens, apostrophes, periods only
- Required field

### Email:
- Valid email format
- Maximum 254 characters
- Normalized to lowercase
- Required field

### Subject:
- 5-200 characters (if provided)
- Optional field

### Message:
- 10-5000 characters
- Required field

## Client Integration

The Contact.tsx component has been updated to:
- Send real API requests instead of simulation
- Handle server-side validation errors
- Include honeypot field and form timing
- Provide user-friendly error messages
- Handle rate limiting responses

## Security Monitoring

The API logs the following security events:
- `contact_form_submitted` - Successful submissions
- `rate_limit_exceeded` - Rate limit violations
- `honeypot_triggered` - Bot detection
- `spam_keywords_detected` - Spam attempts
- `validation_failed` - Invalid data submissions
- `suspicious_timing` - Fast form submissions
- `invalid_origin` - CSRF attempts
- `unexpected_error` - System errors

## Testing the Implementation

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Test Valid Submission:**
   - Fill out the contact form normally
   - Check console for email output (development mode)

3. **Test Security Features:**
   - Submit form too quickly (should be rejected)
   - Submit multiple times rapidly (rate limiting)
   - Fill honeypot field via browser dev tools (should silently succeed)

4. **Test Validation:**
   - Submit with invalid email
   - Submit with empty required fields
   - Submit with overly long content

## Production Deployment

1. **Set Environment Variables:**
   - Add `RESEND_API_KEY` to your hosting platform
   - Configure `CONTACT_EMAIL_TO` and `CONTACT_EMAIL_FROM`

2. **Domain Configuration:**
   - Update allowed origins in the API route
   - Verify sending domain with Resend

3. **Monitoring:**
   - Set up log monitoring for security events
   - Monitor rate limiting patterns
   - Track successful/failed submissions

## Troubleshooting

### Common Issues:

1. **Email not sending:**
   - Check RESEND_API_KEY is set correctly
   - Verify domain is confirmed with Resend
   - Check console logs for error details

2. **CORS errors:**
   - Update allowed origins in API route
   - Ensure proper domain configuration

3. **Rate limiting too strict:**
   - Adjust RATE_LIMIT_MAX_REQUESTS constant
   - Modify RATE_LIMIT_WINDOW for longer periods

4. **Form validation differences:**
   - Ensure client and server validation match
   - Check lib/utils.ts validateForm function

## Security Best Practices Implemented

- ✅ Input validation and sanitization
- ✅ Rate limiting to prevent abuse
- ✅ CSRF protection via origin validation  
- ✅ XSS prevention through output encoding
- ✅ Honeypot spam protection
- ✅ Content filtering for spam detection
- ✅ Secure error handling
- ✅ Comprehensive security logging
- ✅ Proper HTTP security headers
- ✅ Environment variable configuration
- ✅ Graceful fallbacks for development

The implementation follows security best practices and is ready for production use with proper environment configuration.