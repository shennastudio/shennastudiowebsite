'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 pointer-events-auto transform transition-all animate-in fade-in zoom-in duration-300"
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
            {/* Ocean Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full p-4">
                <span className="text-5xl">🌊</span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-3xl font-bold text-teal-700 mb-3">
              Join Our Ocean Family!
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Get <strong className="text-teal-600">10% off</strong> your first order + exclusive access to new ocean-inspired designs and conservation updates from South Padre Island! 🐢
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your email address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Subscribing...' : '🌊 Get My 10% Off'}
              </button>
            </form>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="block text-2xl mb-1">🎁</span>
                  <span>Exclusive Deals</span>
                </div>
                <div>
                  <span className="block text-2xl mb-1">🐢</span>
                  <span>Conservation News</span>
                </div>
                <div>
                  <span className="block text-2xl mb-1">✨</span>
                  <span>New Arrivals</span>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <p className="text-xs text-gray-500 mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>

            {/* Skip Link */}
            <button
              onClick={handleClose}
              className="text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors"
            >
              No thanks, I&apos;ll browse first
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
