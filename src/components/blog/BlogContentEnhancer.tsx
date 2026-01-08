'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface BlogContentEnhancerProps {
  children: React.ReactNode
  title: string
  featuredImage?: string
  category?: string | null | undefined
}

export function BlogContentEnhancer({ 
  children, 
  title, 
  featuredImage, 
  category 
}: BlogContentEnhancerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-700">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23ffffff%22 d=%22M0,160L48,192l408,128l0,128L0,192L0,320L1440,320L1440,0L0,0L0,192L408,320l-96,64l192,128l0,128L0,192L0,320l96,128L0,128L0,192L-96,64L-192,0L0,0L0,192L-408,320z%22/%3E%3C/svg%3E')] bg-cover bg-center opacity-30 animate-pulse-slow"></div>
          </div>
          
          {/* Animated Waves */}
          <div className="absolute bottom-0 left-0 right-0 h-32">
            <svg className="w-full h-20 animate-bounce" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                fill="rgba(255,255,255,0.3)" 
                d="M0,160L48,192l408,128l0,128L0,192L0,320L1440,320L1440,0L0,0L0,192L408,320l-96,64l192,128l0,128L0,192L0,320l96,128L0,128L0,192L-96,64L-192,0L0,0L0,192L408,320z"
              />
            </svg>
          </div>
        </div>

        {/* Featured Image with Ken Burns Effect */}
        <div className="relative h-full">
          {featuredImage && (
            <>
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-1000"
                priority
              />
            </>
          )}
          
          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center gap-4 mb-4 justify-center">
                {category && (
                  <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    {category}
                  </span>
                )}
                <span className="text-white text-sm">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric', 
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Content Section */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-32">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg">
          
          {/* Decorative Top Border */}
          <div className="h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 animate-pulse"></div>
          
          <div className="p-8 lg:p-12">
            {/* Enhanced Content with Interactive Elements */}
            <div 
              className={`prose prose-lg max-w-none transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {children}
            </div>
            
            {/* Interactive Sidebar */}
            <div className="mt-8 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
              <h3 className="text-xl font-bold text-teal-700 mb-4">🌊 Interactive Ocean Explorer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 mb-2">📚 Quick Navigation</h4>
                  <nav className="space-y-2">
                    <Link href="#conservation" className="block text-teal-600 hover:text-teal-800 transition-colors p-2 rounded hover:bg-teal-100">
                      🐢 Conservation Focus
                    </Link>
                    <Link href="#research" className="block text-teal-600 hover:text-teal-800 transition-colors p-2 rounded hover:bg-teal-100">
                      🔬 Research & Science
                    </Link>
                    <Link href="#impact" className="block text-teal-600 hover:text-teal-800 transition-colors p-2 rounded hover:bg-teal-100">
                      💡 Impact Stories
                    </Link>
                  </nav>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 Conservation Meter</h4>
                  <div className="bg-white rounded-lg p-4 shadow-inner">
                    <div className="text-sm text-gray-600 mb-2">Your Support Impact</div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-2000 ease-out"
                        style={{ width: '75%' }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">75% funded through ShennaStudio</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 mb-2">📊 Related Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Marine Conservation', 'Ocean Research', 'Wildlife Protection', 'Climate Action'].map((topic) => (
                      <span 
                        key={topic}
                        className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-300 hover:border-teal-400 hover:text-teal-700 transition-all cursor-pointer hover:shadow-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-8 p-6 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🌊 Join the Ocean Movement</h3>
              <p className="text-lg mb-6">Your support helps protect marine life and ocean ecosystems</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/products" 
                  className="bg-white text-teal-700 px-8 py-3 rounded-full font-bold hover:bg-gray-100 hover:text-teal-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  🛍️ Shop Ocean Collection
                </Link>
                <Link 
                  href="/conservation" 
                  className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-teal-700 transition-all"
                >
                  🌿 Learn About Our Mission
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Enhanced Footer */}
      <div className="bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-700 py-16 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-8 animate-pulse">Support Ocean Conservation</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Every ShennaStudio bracelet donation supports sea turtles, whales, and marine ecosystems
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="text-6xl mb-2 animate-bounce">🐢</div>
                <div className="font-semibold">Sea Turtle Protection</div>
                <div className="text-sm opacity-80">Rescue & Rehabilitation</div>
              </div>
              <div className="space-y-4">
                <div className="text-6xl mb-2 animate-bounce delay-200">🐋</div>
                <div className="font-semibold">Whale Conservation</div>
                <div className="text-sm opacity-80">Research & Protection</div>
              </div>
              <div className="space-y-4">
                <div className="text-6xl mb-2 animate-bounce delay-400">🦈</div>
                <div className="font-semibold">Ocean Research</div>
                <div className="text-sm opacity-80">Science & Education</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}