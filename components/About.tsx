'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="section bg-background" aria-labelledby="about-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-[70ch] mx-auto text-center"
        >
          <h2 id="about-heading" className="text-4xl font-bold text-text-primary mb-8">
            About
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-text-secondary leading-relaxed">
              I&apos;m a full-stack developer with a passion for building scalable web applications 
              and exploring emerging technologies. My journey spans from crafting pixel-perfect 
              user interfaces to architecting robust backend systems.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              I believe in writing clean, maintainable code and creating solutions that make 
              a real impact. Whether it&apos;s optimizing performance, improving user experience, 
              or solving complex technical challenges, I approach each project with curiosity 
              and dedication.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="pt-8"
            >
              <h3 className="text-2xl font-semibold text-text-primary mb-6">
                Technical Skills
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  'TypeScript', 'React', 'Next.js', 'Node.js',
                  'Python', 'PostgreSQL', 'MongoDB', 'AWS',
                  'Docker', 'GraphQL', 'Redis', 'CI/CD'
                ].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="tech-tag text-center"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}