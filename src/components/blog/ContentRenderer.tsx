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
    
    // Clean up the content first
    let cleanContent = content
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/([.!?])\s*([A-Z])/g, '$1</p><p>$2') // Split sentences into paragraphs
      .trim()
    
    // Split by periods and question marks to create paragraphs
    const sentences = cleanContent.split(/[.!?]/).filter(s => s.trim().length > 0)
    
    if (sentences.length === 0) return ''
    
    // Group sentences into paragraphs (3-5 sentences per paragraph)
    const paragraphs: string[] = []
    let currentParagraph = ''
    let sentenceCount = 0
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      
      // Check for heading patterns (short, specific keywords)
      if (trimmedSentence.length < 80 && 
          (trimmedSentence.toLowerCase().includes('about') ||
           trimmedSentence.toLowerCase().includes('how') ||
           trimmedSentence.toLowerCase().includes('why') ||
           trimmedSentence.toLowerCase().includes('join') ||
           trimmedSentence.toLowerCase().includes('five') ||
           trimmedSentence.toLowerCase().startsWith('the '))) {
        
        // Save current paragraph if it has content
        if (currentParagraph.trim()) {
          paragraphs.push(`<p class="text-gray-700 leading-relaxed mb-6">${currentParagraph.trim()}.</p>`)
        }
        
        // Add as heading
        paragraphs.push(`<h2 class="text-2xl font-semibold text-teal-700 mt-8 mb-4">${trimmedSentence}.</h2>`)
        currentParagraph = ''
        sentenceCount = 0
      } else {
        // Add to current paragraph
        currentParagraph += (currentParagraph ? ' ' : '') + trimmedSentence
        sentenceCount++
        
        // Create new paragraph after 3-4 sentences or if it gets long
        if (sentenceCount >= 4 || currentParagraph.length > 300) {
          paragraphs.push(`<p class="text-gray-700 leading-relaxed mb-6">${currentParagraph}.</p>`)
          currentParagraph = ''
          sentenceCount = 0
        }
      }
    }
    
    // Add any remaining content
    if (currentParagraph.trim()) {
      paragraphs.push(`<p class="text-gray-700 leading-relaxed mb-6">${currentParagraph}.</p>`)
    }
    
    return paragraphs.join('\n\n')
  }

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