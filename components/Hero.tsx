'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="section pt-32 pb-28 text-center" aria-labelledby="hero-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 id="hero-heading" className="text-5xl md:text-5xl font-bold text-text-primary mb-6">
            Ben Castillo
          </h1>
          <p className="text-xl text-text-secondary max-w-[60ch] mx-auto mb-8 leading-relaxed">
            Full-stack developer passionate about creating elegant solutions to complex problems. 
            Specializing in modern web technologies and cloud architecture.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#projects"
              className="btn-primary inline-flex items-center gap-2"
            >
              View Projects
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#contact"
              className="btn-secondary"
            >
              Get In Touch
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}