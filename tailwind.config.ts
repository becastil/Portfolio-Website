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
        // Primary text colors - Enhanced
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        
        // Background colors - Enhanced
        'background': 'var(--color-background)',
        'background-subtle': 'var(--color-background-subtle)',
        
        // Border colors - Enhanced
        'border': 'var(--color-border)',
        
        // Accent colors - Formless-inspired deep indigo and mint teal
        'accent': {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          text: 'var(--color-accent-text)',
          focus: 'var(--color-accent-focus)',
          secondary: 'var(--gradient-secondary)', // Mint teal from tokens
          ink: 'var(--accent-ink)',
        },
        
        // Enhanced overlay gradient colors
        'overlay': {
          blue: 'var(--overlay-blue)',
          green: 'var(--overlay-green)',
          purple: 'var(--overlay-purple)',
          violet: 'var(--overlay-violet)',
          accent: 'var(--overlay-accent)',
        },
        
        // Surface colors - Enhanced
        'surface': {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
        },
        
        // Semantic colors - Enhanced
        'error': 'var(--color-error)',
        'success': 'var(--color-success)',
        'neutral-warm': 'var(--color-neutral-warm)',
        
        // Formless monochrome system integration
        'bg': 'var(--bg)',
        'text': 'var(--text)',
        'muted': 'var(--muted)',
        'panel': 'var(--panel)',
        'panel-2': 'var(--panel-2)',
        
        // Gradient system integration
        'gradient': {
          primary: 'var(--gradient-primary)',
          secondary: 'var(--gradient-secondary)',
          tertiary: 'var(--gradient-tertiary)',
        },
      },
      
      fontFamily: {
        // Unified SF Mono typography system - Enhanced with token integration
        heading: 'var(--font-family-heading)',
        body: 'var(--font-family-body)',
        base: 'var(--font-family-base)',
        sans: 'var(--font-family-base)',
        serif: 'var(--font-family-base)',
        mono: 'var(--font-family-mono)',
      },
      
      fontWeight: {
        // Font weight tokens integration
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      
      lineHeight: {
        // Line height tokens integration
        tight: 'var(--line-height-tight)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
      },
      
      fontSize: {
        // Enhanced typography scale using tokens
        'xs': ['var(--font-size-xs)', { lineHeight: 'var(--line-height-normal)' }],
        'sm': ['var(--font-size-sm)', { lineHeight: 'var(--line-height-normal)' }],
        'base': ['var(--font-size-base)', { lineHeight: 'var(--line-height-normal)' }],
        'lg': ['var(--font-size-lg)', { lineHeight: 'var(--line-height-normal)' }],
        'xl': ['var(--font-size-xl)', { lineHeight: 'var(--line-height-tight)' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-tight)' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-tight)' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-tight)' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: 'var(--line-height-tight)' }],
      },
      
      spacing: {
        // Enhanced spacing scale using tokens
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
        '24': 'var(--space-24)',
        '28': 'var(--space-28)',
        '32': 'var(--space-32)',
        
        // Container and layout tokens
        'container-padding': 'var(--container-padding)',
        'section-padding': 'var(--section-padding)',
      },
      
      borderRadius: {
        // Border radius tokens integration
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      
      boxShadow: {
        // Enhanced shadow system using tokens
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'hover-primary': 'var(--shadow-hover-primary)',
        'hover-secondary': 'var(--shadow-hover-secondary)',
        'active': 'var(--shadow-active)',
      },
      
      transitionDuration: {
        // Animation duration tokens integration
        'instant': 'var(--duration-instant)',
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
        'deliberate': 'var(--duration-deliberate)',
      },
      
      transitionTimingFunction: {
        // Enhanced easing curves from tokens
        'out-expo': 'var(--ease-out-expo)',
        'out-quart': 'var(--ease-out-quart)',
        'in-out-quart': 'var(--ease-in-out-quart)',
        'spring': 'var(--ease-spring)',
        'formless': 'var(--ease-formless)',
      },
      
      opacity: {
        // Overlay opacity tokens integration
        'overlay-rest': 'var(--overlay-opacity-rest)',
        'overlay-hover': 'var(--overlay-opacity-hover)',
      },
      
      backdropBlur: {
        // Blur tokens integration
        'overlay': 'var(--overlay-blur-amount)',
      },
      
      zIndex: {
        // Z-index scale from tokens
        'dropdown': 'var(--z-dropdown)',
        'sticky': 'var(--z-sticky)',
        'fixed': 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'tooltip': 'var(--z-tooltip)',
        'toast': 'var(--z-toast)',
      },
      
      minWidth: {
        // Touch target standards
        'touch': 'var(--touch-target-min)',
        'touch-comfortable': 'var(--touch-target-comfortable)',
      },
      
      minHeight: {
        // Touch target standards
        'touch': 'var(--touch-target-min)',
        'touch-comfortable': 'var(--touch-target-comfortable)',
      },
      
      maxWidth: {
        // Container max width
        'container': 'var(--container-max-width)',
      },
      
      screens: {
        // Enhanced breakpoint system using tokens
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      
      animation: {
        // Enhanced animations with token integration
        'fade-in': 'fadeIn var(--duration-slow) var(--ease-out-expo)',
        'fade-up': 'fadeUp var(--duration-slow) var(--ease-out-quart)',
        'scale-in': 'scaleIn var(--duration-normal) var(--ease-spring)',
        'slide-up': 'slideUp var(--duration-normal) var(--ease-formless)',
        'bounce-gentle': 'bounceGentle var(--duration-slow) var(--ease-spring)',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '50%': { transform: 'scale(1.02)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config