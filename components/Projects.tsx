'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

const categories = [
  { value: 'all', label: 'All Projects' },
  { value: 'web', label: 'Web Applications' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'data', label: 'Data Projects' },
]

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory)

  return (
    <section id="projects" className="section bg-surface content-auto" aria-labelledby="projects-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="layout-stable"
        >
          <h2 id="projects-heading" className="text-4xl font-bold text-text-primary text-center mb-12">
            Projects
          </h2>
          
          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-12" role="group" aria-label="Filter projects by category">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                aria-pressed={selectedCategory === category.value}
                className={cn(
                  'px-6 py-3 rounded-xl font-medium transition-all duration-300',
                  'border-2 border-accent touch-target',
                  selectedCategory === category.value
                    ? 'bg-accent text-white'
                    : 'bg-background text-accent-text hover:bg-accent hover:text-white'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.2, 
        ease: [0.2, 0.6, 0, 1] 
      }}
      className="group rounded-xl border border-[var(--border)] bg-[var(--panel)]
                 shadow-sm transition-shadow duration-200 ease-[cubic-bezier(.2,.6,0,1)]
                 hover:shadow-lg focus-within:shadow-lg"
      aria-labelledby={`project-${project.id}-title`}
    >
      {/* Placeholder image area with gradient */}
      <div className="overflow-hidden rounded-t-xl">
        <div className="aspect-[16/9] w-full bg-gradient-to-br from-[var(--panel2)] to-[var(--border)]
                       flex items-center justify-center transition duration-200 ease-[cubic-bezier(.2,.6,0,1)]
                       group-hover:brightness-105">
          <div className="text-[var(--muted)] text-sm font-medium opacity-60">
            {project.category.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <h3 id={`project-${project.id}-title`} className="text-[1.15rem] font-medium text-[var(--text)] tracking-[-0.005em]">
          <span className="underline-offset-4 decoration-transparent group-hover:underline decoration-[var(--border)] transition">
            {project.title}
          </span>
        </h3>
        
        <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--muted)]">
          {project.description}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech}
              className="inline-flex items-center rounded-full border border-[var(--border)]
                         bg-[var(--panel)] px-2.5 py-1 text-[12px] text-[var(--muted)]
                         transition-colors duration-200 group-hover:bg-[var(--panel2)]">
              {tech}
            </span>
          ))}
        </div>

        {(project.link || project.github) && (
          <div className="flex gap-4 mt-6 pt-4 border-t border-[var(--border)]">
            {project.link && (
              <a
                href={project.link}
                className="text-sm font-medium text-[var(--accent)] hover:opacity-80 transition-opacity
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                aria-label={`View ${project.title} live`}
              >
                View Live →
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                className="text-sm font-medium text-[var(--accent)] hover:opacity-80 transition-opacity
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                aria-label={`View ${project.title} on GitHub`}
              >
                GitHub →
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}