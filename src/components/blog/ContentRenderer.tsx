'use client'

import { useEffect } from 'react'

interface ContentRendererProps {
  content: string
}

export function ContentRenderer({ content }: ContentRendererProps) {
  // Function to format plain text content into proper HTML paragraphs
  function formatBlogContent(content: string): string {
    if (!content) return ''
    
    // Check if content is already HTML (contains HTML tags)
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return content
    }
    
    // Convert plain text to proper HTML with paragraphs and line breaks
    return content
      .split('\n\n') // Split by double newlines to identify paragraphs
      .filter(paragraph => paragraph.trim()) // Remove empty paragraphs
      .map(paragraph => {
        // Check if it's a heading (starts with #)
        if (paragraph.trim().startsWith('#')) {
          const match = paragraph.match(/^(#{1,6})\s+(.+)$/)
          if (match) {
            const level = match[1].length
            const text = match[2].trim()
            return `<h${Math.min(level, 6)}>${text}</h${Math.min(level, 6)}>`
          }
        }
        
        // Check if it's a list item (starts with - or * or number)
        if (paragraph.trim().match(/^[-*]\s+/) || paragraph.trim().match(/^\d+\.\s+/)) {
          const lines = paragraph.trim().split('\n')
          const listItems = lines.map(line => {
            const cleanLine = line.replace(/^[-*]\s+|^\d+\.\s+/, '').trim()
            return `<li>${cleanLine}</li>`
          })
          
          const isOrdered = lines.some(line => line.trim().match(/^\d+\.\s+/))
          const listTag = isOrdered ? 'ol' : 'ul'
          return `<${listTag}>${listItems.join('')}</${listTag}>`
        }
        
        // Regular paragraph
        return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
      })
      .join('\n\n')
  }

  // Apply syntax highlighting to code blocks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Import and apply highlight.js if needed
      import('highlight.js').then((hljs) => {
        hljs.default.highlightAll()
      })
    }
  }, [content])

  const formattedContent = formatBlogContent(content)
  
  return (
    <div 
      className="prose prose-lg max-w-none
        prose-headings:text-teal-700
        prose-h1:text-4xl prose-h1:font-bold prose-h1:mt-12 prose-h1:mb-6 prose-h1:first:mt-0
        prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
        prose-h4:text-xl prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-4
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:underline-offset-4
        prose-ul:my-6 prose-ul:space-y-2 prose-ul:list-disc
        prose-ol:my-6 prose-ol:space-y-2 prose-ol:list-decimal
        prose-li:text-gray-700 prose-li:leading-relaxed
        prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-6 prose-blockquote:italic
        prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6
        prose-hr:border-gray-300 prose-hr:my-8
        prose-strong:text-teal-700 prose-strong:font-semibold
        prose-em:italic prose-em:text-gray-700
        prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
        prose-table:overflow-x-auto prose-table:my-6
        prose-thead:bg-gray-50
        prose-tbody:bg-white prose-tbody:divide-y prose-tbody:divide-gray-200
        prose-tr:border-b prose-tr:border-gray-200
        prose-th:px-6 prose-th:py-3 prose-th:text-left prose-th:text-xs prose-th:font-medium prose-th:text-gray-500 prose-th:uppercase prose-th:tracking-wider
        prose-td:px-6 prose-td:py-4 prose-td:whitespace-nowrap prose-td:text-sm prose-td:text-gray-700"
      dangerouslySetInnerHTML={{ 
        __html: formattedContent 
      }} 
    />
  )
}