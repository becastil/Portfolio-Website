# Advanced Blog System with Framer Motion

A sophisticated blog system built with Next.js 14, TypeScript, and Framer Motion, featuring advanced animations, performance optimizations, and full accessibility support.

## 🚀 Features

### Core Functionality
- **Blog Index**: Search, filtering, and sorting with animated cards
- **Individual Posts**: Rich post pages with reading progress and table of contents
- **Interactive Elements**: Share buttons, related posts, and author bios
- **Responsive Design**: Mobile-first approach with optimized layouts

### Advanced Animations
- **Text Reveal**: Character and word-based text animations
- **Scroll-Triggered**: Elements animate as they enter viewport
- **Page Transitions**: Smooth navigation between pages
- **Parallax Effects**: Hero sections with depth and movement
- **Interactive Hover**: Sophisticated hover and click animations
- **Staggered Lists**: Sequential animations for list items

### Performance Optimizations
- **GPU Acceleration**: Transform-based animations for 60fps performance
- **Lazy Loading**: Animations only load when needed
- **Reduced Motion**: Respects user accessibility preferences
- **Performance Monitoring**: Real-time FPS tracking and adaptation
- **Memory Management**: Optimized component lifecycle

### Accessibility Features
- **WCAG 2.2 AA Compliant**: Full screen reader support
- **Keyboard Navigation**: Complete keyboard accessibility
- **Focus Management**: Proper focus indicators and traps
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Automatic animation reduction when preferred

## 📁 File Structure

```
components/
├── animations/
│   ├── AnimatedSection.tsx      # Scroll-triggered section animations
│   ├── FadeIn.tsx              # Fade in animation with options
│   ├── SlideIn.tsx             # Slide animations (up/down/left/right)
│   ├── ScaleIn.tsx             # Scale animations with bounce
│   ├── TextReveal.tsx          # Character/word text reveals
│   ├── StaggerContainer.tsx    # Staggered list animations
│   ├── ParallaxWrapper.tsx     # Parallax scroll effects
│   ├── MotionWrapper.tsx       # Optimized motion wrapper
│   ├── LazyMotion.tsx          # Lazy loading for animations
│   ├── OptimizedAnimations.tsx # Performance-optimized variants
│   └── index.ts                # Animation component exports
├── blog/
│   ├── BlogIndex.tsx           # Main blog listing page
│   ├── BlogPost.tsx            # Individual blog post
│   ├── BlogCard.tsx            # Blog post card component
│   ├── BlogFilters.tsx         # Search and filter controls
│   ├── ReadingProgress.tsx     # Reading progress indicator
│   ├── TableOfContents.tsx     # Sticky table of contents
│   ├── ShareButtons.tsx        # Social sharing buttons
│   ├── RelatedPosts.tsx        # Related articles section
│   ├── AnimationDemo.tsx       # Animation showcase page
│   └── index.ts                # Blog component exports
├── providers/
│   ├── MotionProvider.tsx      # Framer Motion configuration
│   └── PageTransition.tsx      # Page transition wrapper
└── ...

app/
├── blog/
│   ├── page.tsx                # Blog index route
│   ├── [slug]/page.tsx         # Dynamic blog post routes
│   ├── demo/page.tsx           # Animation demo page
│   └── blog.css                # Blog-specific styles
└── layout.tsx                  # Root layout with providers

hooks/
├── useDebounce.ts              # Search debouncing
├── usePerformanceMonitor.ts    # Performance tracking
└── ...

lib/
├── blog-config.ts              # Blog configuration
└── ...
```

## 🛠️ Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install framer-motion
   # Already installed in your project
   ```

2. **Configure Motion Provider**:
   The layout already includes the motion provider and page transitions.

3. **Use Components**:
   ```tsx
   import { FadeIn, SlideIn, TextReveal } from '@/components/animations'
   
   function MyComponent() {
     return (
       <FadeIn>
         <TextReveal as="h1">Animated Heading</TextReveal>
         <SlideIn direction="up">
           <p>Content that slides up</p>
         </SlideIn>
       </FadeIn>
     )
   }
   ```

## 🎨 Animation Components

### Basic Animations

```tsx
// Fade in animation
<FadeIn delay={0.2} duration={0.6}>
  <div>Content</div>
</FadeIn>

// Slide animations
<SlideIn direction="up" distance={100}>
  <div>Slides up from below</div>
</SlideIn>

// Scale animation
<ScaleIn scale={0.3} bounce={true}>
  <div>Scales up with bounce</div>
</ScaleIn>
```

### Advanced Animations

```tsx
// Text reveal
<TextReveal 
  as="h1" 
  splitBy="word" 
  staggerChildren={0.05}
>
  Text reveals word by word
</TextReveal>

// Staggered container
<StaggerContainer staggerChildren={0.1}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</StaggerContainer>

// Parallax wrapper
<ParallaxWrapper offset={50} speed={0.3}>
  <div>Parallax content</div>
</ParallaxWrapper>
```

### Performance Optimized

```tsx
// Optimized animations
<OptimizedFadeIn respectReducedMotion>
  <div>GPU-accelerated fade</div>
</OptimizedFadeIn>

<OptimizedSlideUp enableGPUAcceleration>
  <div>Optimized slide animation</div>
</OptimizedSlideUp>
```

## ⚙️ Configuration

### Blog Config (`lib/blog-config.ts`)

```typescript
export const blogConfig = {
  animations: {
    staggerDelay: 0.1,
    defaultDuration: 0.6,
    pageTransition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  optimization: {
    lazyLoadAnimations: true,
    gpuAcceleration: true,
    respectReducedMotion: true,
  },
}
```

### Performance Monitoring

```tsx
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

function MyComponent() {
  const { metrics, isLowPerformance, getOptimizedAnimationSettings } = usePerformanceMonitor()
  const settings = getOptimizedAnimationSettings()
  
  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ duration: settings.duration }}
    >
      FPS: {metrics.fps}
    </motion.div>
  )
}
```

## 🚀 Performance Best Practices

1. **Use GPU Acceleration**: Enable `enableGPUAcceleration` for transform-heavy animations
2. **Lazy Load**: Use `LazyMotion` for animations below the fold
3. **Respect Reduced Motion**: Always set `respectReducedMotion={true}`
4. **Monitor Performance**: Use `usePerformanceMonitor` to adapt to device capabilities
5. **Optimize Transitions**: Use optimized easings and reasonable durations

## 🎯 Accessibility Features

- **Screen Readers**: All animations preserve content accessibility
- **Keyboard Navigation**: Full keyboard support for interactive elements
- **Reduced Motion**: Automatic detection and respect for user preferences
- **Focus Management**: Proper focus indicators and logical tab order
- **High Contrast**: Support for high contrast display modes

## 🧪 Testing

Visit `/blog/demo` to see all animations in action:
- Text reveal animations
- Scroll-triggered effects
- Interactive hover states
- Performance optimizations
- Accessibility features

## 📊 Performance Metrics

The system includes real-time performance monitoring:
- **FPS Tracking**: Maintains 60fps target
- **Memory Usage**: Monitors JavaScript heap size
- **Load Times**: Tracks page load performance
- **Adaptation**: Automatically reduces animations on low-performance devices

## 🔧 Customization

### Custom Animation Variants

```tsx
const customVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateY: -90 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotateY: 0,
    transition: { type: "spring", stiffness: 100 }
  }
}

<motion.div variants={customVariants}>
  Custom animation
</motion.div>
```

### Extending Components

```tsx
import { FadeIn } from '@/components/animations'

const CustomFadeIn = ({ children, ...props }) => (
  <FadeIn blur={true} scale={true} {...props}>
    {children}
  </FadeIn>
)
```

## 🎉 Ready to Use

The blog system is fully configured and ready to use. All components include:
- TypeScript support
- Performance optimizations
- Accessibility features
- Responsive design
- Error boundaries
- Loading states

Start building amazing animated blog experiences! 🚀