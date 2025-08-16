# Ben Castillo Portfolio - Next.js 14

A modern, performant portfolio website built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Next.js 14 App Router** - Latest React Server Components architecture
- **TypeScript** - Full type safety across the application
- **Tailwind CSS** - Utility-first CSS with custom design tokens
- **Framer Motion** - Smooth animations and transitions
- **Static Export** - Optimized for GitHub Pages deployment
- **Dark Mode** - System-aware theme switching
- **Accessibility** - WCAG compliant with semantic HTML
- **Performance** - Optimized bundle sizes and lazy loading

## Tech Stack

- Next.js 14.2.5
- React 18.3
- TypeScript 5.5
- Tailwind CSS 3.4
- Framer Motion 11.3

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Build and export static files
npm run export
```

### Development

The development server runs at `http://localhost:3000`

```bash
npm run dev
```

### Production Build

```bash
# Build and optimize
npm run build

# Export static files to /out directory
npm run export

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles and Tailwind
├── components/            # React components
│   ├── Navigation.tsx     # Header navigation
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section
│   ├── Projects.tsx      # Projects grid with filtering
│   ├── Contact.tsx       # Contact form
│   └── Footer.tsx        # Footer with social links
├── lib/                   # Utilities and constants
│   ├── constants.ts      # Site data and configuration
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
└── public/               # Static assets
```

## Deployment

### GitHub Pages

The site is configured for GitHub Pages deployment with a custom domain.

1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Site will be available at `https://bencastillo.dev`

### Manual Deployment

```bash
# Build and export
npm run build
npm run export

# The /out directory contains the static site
# Upload to any static hosting service
```

## Performance

- Lighthouse Score: 95+ Performance
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total Bundle Size: < 200KB gzipped

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use this code for your own portfolio!

## Contact

Ben Castillo - ben@bencastillo.dev