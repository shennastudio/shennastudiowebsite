'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('newsletter-popup-seen')
    const lastShown = localStorage.getItem('newsletter-popup-last-shown')

    // Show popup if:
    // 1. Never seen before, OR
    // 2. Last shown more than 7 days ago and user didn't subscribe
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

    if (!hasSeenPopup || (lastShown && parseInt(lastShown) < sevenDaysAgo)) {
      // Show popup after 2 seconds for better UX
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('newsletter-popup-last-shown', Date.now().toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('🎉 Welcome aboard! Check your email for exclusive ocean deals.')
        setIsSuccess(true)
        setEmail('')
        setName('')

        // Mark as subscribed permanently
        localStorage.setItem('newsletter-popup-seen', 'true')

        // Close popup after 3 seconds
        setTimeout(() => {
          setIsOpen(false)
        }, 3000)
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.')
        setIsSuccess(false)
      }
    } catch {
      setMessage('Failed to subscribe. Please try again later.')
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
        <div
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 md:p-8 pointer-events-auto transform transition-all animate-in fade-in zoom-in duration-300 my-4 max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close popup"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="text-center">
            {/* Sea Turtle Image */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-teal-100 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&q=80"
                  alt="Kemp's Ridley sea turtle swimming underwater"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 128px"
                />
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-bold text-teal-700 mb-2 sm:mb-3">
              Join Our Ocean Family!
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Get <strong className="text-teal-600">10% off</strong> your first order + exclusive access to new ocean-inspired designs and Kemp&apos;s Ridley sea turtle conservation updates from South Padre Island! 🌊
            </p>

            {/* Success/Error Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg ${
                isSuccess
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your email address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Subscribing...' : '🌊 Get My 10% Off'}
              </button>
            </form>

            {/* Benefits */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div>
                  <span className="block text-xl sm:text-2xl mb-1">🎁</span>
                  <span className="leading-tight">Exclusive Deals</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl mb-1">🌊🪼</span>
                  <span className="leading-tight">Sea Turtle Updates</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl mb-1">✨</span>
                  <span className="leading-tight">New Arrivals</span>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <p className="text-xs text-gray-500 mt-3 sm:mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>

            {/* Skip Link - Made more prominent and always visible */}
            <button
              onClick={handleClose}
              className="text-sm sm:text-base text-gray-500 hover:text-gray-700 underline mt-3 sm:mt-4 transition-colors font-medium min-h-[44px] flex items-center justify-center"
              type="button"
            >
              No thanks, I&apos;ll browse first
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
