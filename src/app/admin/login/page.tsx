'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Waves, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Ocean Sharks Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=1200&q=80"
          alt="Sharks swimming in the ocean"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/40 via-blue-600/30 to-teal-600/40" />

        {/* Branding on Image */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="flex items-center gap-3 mb-6">
            <Waves className="h-12 w-12" />
            <h1 className="text-5xl font-bold">ShennaStudio</h1>
          </div>
          <p className="text-2xl font-light mb-2">Ocean-Inspired Bracelets</p>
          <p className="text-lg text-cyan-100 max-w-md">
            Every piece supports marine conservation and ocean life protection
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Waves className="h-10 w-10 text-cyan-600" />
              <h1 className="text-3xl font-bold text-gray-900">ShennaStudio</h1>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-full">
                <Lock className="h-8 w-8 text-cyan-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Admin Portal
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage your ocean bracelet store
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="admin@shennastudio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Sign In to Admin Panel
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-cyan-900 mb-2">Default Test Credentials:</p>
              <div className="space-y-1">
                <p className="text-xs text-cyan-800">
                  <span className="font-medium">Email:</span>{' '}
                  <code className="bg-white px-2 py-1 rounded text-cyan-900">admin@shennastudio.com</code>
                </p>
                <p className="text-xs text-cyan-800">
                  <span className="font-medium">Password:</span>{' '}
                  <code className="bg-white px-2 py-1 rounded text-cyan-900">admin123</code>
                </p>
              </div>
            </div>
          </div>

          {/* Back to Store Link */}
          <div className="text-center">
            <a
              href="/"
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
            >
              ← Back to Store
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
