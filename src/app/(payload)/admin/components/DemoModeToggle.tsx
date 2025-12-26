'use client'

import { useState } from 'react'

/**
 * Demo Mode Toggle Component
 *
 * Provides admin UI for managing demo data in the Payload admin panel.
 * Allows seeding demo products and clearing them for production.
 */
export default function DemoModeToggle() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSeedDemo = async () => {
    if (!confirm('This will create 6 demo products with ocean-themed bracelets. Continue?')) {
      return
    }

    setIsSeeding(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/seed-demo', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Demo products created successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to seed demo products' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsSeeding(false)
    }
  }

  const handleClearDemo = async () => {
    if (!confirm('⚠️ This will DELETE all demo products and the demo category. This action cannot be undone. Continue?')) {
      return
    }

    if (!confirm('Are you ABSOLUTELY SURE? This will remove all demo data permanently.')) {
      return
    }

    setIsClearing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/clear-demo', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Demo data cleared successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to clear demo data' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🌊</span>
        <h3 className="text-lg font-semibold text-gray-900">Demo Mode</h3>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Manage demo products for testing and preview. Demo products are tagged and can be easily removed when you're ready for production.
      </p>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleSeedDemo}
          disabled={isSeeding || isClearing}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
            isSeeding || isClearing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          {isSeeding ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Demo Products...
            </span>
          ) : (
            '🎨 Create Demo Products'
          )}
        </button>

        <button
          onClick={handleClearDemo}
          disabled={isSeeding || isClearing}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors border-2 ${
            isSeeding || isClearing
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-red-600 text-red-600 hover:bg-red-50'
          }`}
        >
          {isClearing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Clearing Demo Data...
            </span>
          ) : (
            '🗑️ Clear All Demo Data (Production Mode)'
          )}
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">What's included in demo data?</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>6 ocean-themed bracelet products</li>
          <li>Multiple variants per product (sizes, colors, materials)</li>
          <li>Working product images from Unsplash</li>
          <li>Realistic pricing and stock levels</li>
          <li>Conservation donation information</li>
        </ul>
      </div>
    </div>
  )
}
