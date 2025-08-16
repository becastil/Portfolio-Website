'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Link as LinkIcon,
  Check,
  Mail
} from 'lucide-react'
import { StaggerContainer } from '@/components/animations'

interface ShareButtonsProps {
  url: string
  title: string
  description: string
  className?: string
}

export default function ShareButtons({ 
  url, 
  title, 
  description, 
  className = '' 
}: ShareButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    text: description,
    url
  }

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-blue-500',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-600',
      url: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-gray-600',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
    },
  ]

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleSocialShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Share Button */}
      <motion.button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        Share Article
      </motion.button>

      {/* Expanded Share Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-max">
              <StaggerContainer 
                staggerChildren={0.05}
                className="flex items-center gap-2"
              >
                {/* Social Share Buttons */}
                {socialLinks.map((social) => (
                  <motion.button
                    key={social.name}
                    onClick={() => handleSocialShare(social.url)}
                    className={`
                      p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                      hover:text-white transition-all duration-200 group relative overflow-hidden
                      ${social.color}
                    `}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    title={`Share on ${social.name}`}
                  >
                    <social.icon className="w-5 h-5 relative z-10" />
                    
                    {/* Hover Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-current to-current opacity-0 group-hover:opacity-20"
                      initial={false}
                      whileHover={{ scale: 1.2 }}
                    />
                  </motion.button>
                ))}

                {/* Copy Link Button */}
                <motion.button
                  onClick={copyToClipboard}
                  className={`
                    p-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                    ${copied 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy link"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="link"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -180 }}
                      >
                        <LinkIcon className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </StaggerContainer>

              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2"
              >
                Choose your platform
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Success Message */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap"
          >
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}