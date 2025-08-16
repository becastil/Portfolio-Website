import { Metadata } from 'next'
import AnimationDemo from '@/components/blog/AnimationDemo'

export const metadata: Metadata = {
  title: 'Animation Demo | Blog',
  description: 'Showcase of all blog animations and interactive features.',
}

export default function AnimationDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AnimationDemo />
    </main>
  )
}