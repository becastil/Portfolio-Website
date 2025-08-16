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
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="card group cursor-pointer hover:-translate-y-1"
      aria-labelledby={`project-${project.id}-title`}
    >
      <h3 id={`project-${project.id}-title`} className="text-xl font-semibold text-text-primary mb-3">
        {project.title}
      </h3>
      <p className="text-text-secondary mb-4 leading-relaxed">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.technologies.map(tech => (
          <span key={tech} className="tech-tag">
            {tech}
          </span>
        ))}
      </div>
      {(project.link || project.github) && (
        <div className="flex gap-4 mt-6 pt-4 border-t border-border">
          {project.link && (
            <a
              href={project.link}
              className="text-sm font-medium text-accent-text hover:text-accent-hover transition-colors"
              aria-label={`View ${project.title} live`}
            >
              View Live →
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              className="text-sm font-medium text-accent-text hover:text-accent-hover transition-colors"
              aria-label={`View ${project.title} on GitHub`}
            >
              GitHub →
            </a>
          )}
        </div>
      )}
    </motion.article>
  )
}