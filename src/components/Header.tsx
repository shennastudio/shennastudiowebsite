'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

interface SiteSettings {
  siteName: string;
  logo: string | null;
}

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'ShennaStudio',
    logo: null,
  });

  useEffect(() => {
    // Fetch site settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            siteName: data.siteName || 'ShennaStudio',
            logo: data.logo,
          });
        }
      })
      .catch(err => console.error('Failed to load site settings:', err));
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-teal-600 flex items-center gap-2">
              {settings.logo ? (
                <>
                  <Image
                    src={settings.logo}
                    alt={settings.siteName}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <span>{settings.siteName}</span>
                </>
              ) : (
                <>🌊 {settings.siteName}</>
              )}
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-teal-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-teal-600 transition-colors">
              Ocean Collection
            </Link>
            <Link href="/conservation" className="text-gray-700 hover:text-teal-600 transition-colors">
              Conservation
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-teal-600 transition-colors">
              Our Mission
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-teal-600 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="text-gray-700 hover:text-teal-600 transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
            <Link href="/conservation" className="text-gray-700 hover:text-teal-600 transition-colors">
              🐢
            </Link>
            {session && session.user.role === 'CUSTOMER' ? (
              <Link
                href="/account"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                My Account
              </Link>
            ) : session && session.user.role === 'ADMIN' ? (
              <Link
                href="/admin"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                Admin
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-teal-600 hover:text-teal-700 font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-pink-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-700 hover:text-teal-600 transition-colors py-2">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-teal-600 transition-colors py-2">
                Ocean Collection
              </Link>
              <Link href="/conservation" className="text-gray-700 hover:text-teal-600 transition-colors py-2">
                Conservation 🐢
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-teal-600 transition-colors py-2">
                Our Mission
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-teal-600 transition-colors py-2">
                Contact
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-teal-600 transition-colors py-2">
                Cart
              </Link>

              <div className="pt-4 border-t space-y-2">
                {session && session.user.role === 'CUSTOMER' ? (
                  <Link
                    href="/account"
                    className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                  >
                    My Account
                  </Link>
                ) : session && session.user.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                  >
                    Admin
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block w-full text-center text-teal-600 hover:text-teal-700 font-semibold py-2"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}