import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Primary text colors
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        
        // Background colors
        'background': 'var(--color-background)',
        'background-subtle': 'var(--color-background-subtle)',
        
        // Border colors
        'border': 'var(--color-border)',
        
        // Accent colors - Formless-inspired deep indigo and mint teal
        'accent': {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          text: 'var(--color-accent-text)',
          focus: 'var(--color-accent-focus)',
          // Add secondary accent for gradients
          secondary: 'hsl(158 64% 52%)', // Mint teal for gradients
        },
        
        // Overlay gradient colors for interactive elements
        'overlay': {
          blue: 'var(--overlay-blue)',
          green: 'var(--overlay-green)',
          accent: 'var(--overlay-accent)',
        },
        
        // Surface colors
        'surface': {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
        },
        
        // Semantic colors
        'error': 'var(--color-error)',
        'success': 'var(--color-success)',
        'neutral-warm': 'var(--color-neutral-warm)',
      },
      
      fontFamily: {
        // Unified SF Mono typography system
        heading: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
        body: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
        
        // All font families use SF Mono with appropriate fallbacks
        sans: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
        serif: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.5' }],
        'sm': ['1rem', { lineHeight: '1.5' }],
        'base': ['1.125rem', { lineHeight: '1.75' }],
        'lg': ['1.25rem', { lineHeight: '1.75' }],
        'xl': ['1.5rem', { lineHeight: '1.5' }],
        '2xl': ['1.875rem', { lineHeight: '1.4' }],
        '3xl': ['2.25rem', { lineHeight: '1.4' }],
        '4xl': ['2.75rem', { lineHeight: '1.3' }],
        '5xl': ['3.5rem', { lineHeight: '1.2' }],
      },
      
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '7.5rem',
      },
      
      borderRadius: {
        'sm': '0.75rem',   // 12px - aligns with tokens.css --radius-small
        'md': '1rem',      // 16px - aligns with tokens.css --radius-medium
        'lg': '1.25rem',   // 20px - aligns with tokens.css --radius-large
        'xl': '1.5rem',    // 24px - aligns with tokens.css --radius-xlarge
      },
      
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },
      
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config