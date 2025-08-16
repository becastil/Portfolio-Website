import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  fields: [
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string',
      description: 'Optional filename to display above code',
    }),
    
    defineField({
      name: 'code',
      title: 'Code',
      type: 'code',
      options: {
        language: 'javascript',
        languageAlternatives: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'JSX', value: 'jsx' },
          { title: 'TSX', value: 'tsx' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'SCSS', value: 'scss' },
          { title: 'Python', value: 'python' },
          { title: 'Java', value: 'java' },
          { title: 'C++', value: 'cpp' },
          { title: 'C#', value: 'csharp' },
          { title: 'Go', value: 'go' },
          { title: 'Rust', value: 'rust' },
          { title: 'SQL', value: 'sql' },
          { title: 'GraphQL', value: 'graphql' },
          { title: 'JSON', value: 'json' },
          { title: 'YAML', value: 'yaml' },
          { title: 'Markdown', value: 'markdown' },
          { title: 'Bash', value: 'bash' },
          { title: 'Docker', value: 'dockerfile' },
        ],
        withFilename: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'highlightedLines',
      title: 'Highlighted Lines',
      type: 'array',
      of: [{ type: 'number' }],
      description: 'Line numbers to highlight',
    }),
    
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption below code',
    }),
    
    defineField({
      name: 'showLineNumbers',
      title: 'Show Line Numbers',
      type: 'boolean',
      initialValue: true,
    }),
    
    defineField({
      name: 'copyButton',
      title: 'Show Copy Button',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})