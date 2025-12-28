'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import SearchBar from '@/components/SearchBar'
import MiniCart from '@/components/MiniCart'
import { ShoppingCart, Menu, X } from 'lucide-react'

interface SiteSettings {
  siteName: string;
  logo: string | null;
}

export default function Header() {
  const { data: session } = useSession();
  const { state: cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'ShennaStudio',
    logo: '/images/shenna-studio-logo.png',
  });

  useEffect(() => {
    // Fetch site settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.logo) {
          setSettings({
            siteName: data.siteName || 'ShennaStudio',
            logo: data.logo,
          });
        }
        // Keep default logo if API doesn't provide one
      })
      .catch(err => {
        console.error('Failed to load site settings, using default logo:', err);
        // Keep the default logo on error
      });
  }, []);

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-teal-600 flex items-center gap-2 hover:text-teal-700 transition-colors">
              {settings.logo ? (
                <Image
                  src={settings.logo}
                  alt={settings.siteName}
                  width={300}
                  height={300}
                  className="object-contain h-20 w-auto"
                  priority
                />
              ) : (
                <>
                  <span className="text-3xl">🌊</span>
                  <span className="hidden sm:inline">{settings.siteName}</span>
                </>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              Products
            </Link>
            <Link href="/conservation" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              Conservation
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Search Bar */}
            <SearchBar />

            {/* Cart with MiniCart on hover */}
            <div
              className="relative"
              onMouseEnter={() => setShowMiniCart(true)}
              onMouseLeave={() => setShowMiniCart(false)}
            >
              <Link href="/cart" className="text-gray-700 hover:text-teal-600 transition-colors relative block p-2">
                <ShoppingCart className="w-6 h-6" />
                {cart.items.length > 0 && (
                  <span className="absolute top-0 right-0 bg-teal-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </Link>
              {showMiniCart && cart.items.length > 0 && <MiniCart />}
            </div>

            {/* User Actions */}
            {session && session.user.role === 'CUSTOMER' ? (
              <Link
                href="/account"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
              >
                My Account
              </Link>
            ) : session && session.user.role === 'ADMIN' ? (
              <Link
                href="/admin"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
              >
                Admin
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-teal-600 hover:text-teal-700 font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Cart Icon */}
            <Link href="/cart" className="text-gray-700 hover:text-teal-600 transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-teal-600 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="py-4 space-y-1">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors font-medium rounded"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors font-medium rounded"
                onClick={closeMobileMenu}
              >
                Products
              </Link>
              <Link
                href="/conservation"
                className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors font-medium rounded"
                onClick={closeMobileMenu}
              >
                Conservation 🪼
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors font-medium rounded"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors font-medium rounded"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              <Link
                href="/cart"
                className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors font-medium rounded"
                onClick={closeMobileMenu}
              >
                Cart {cart.items.length > 0 && `(${cart.items.length})`}
              </Link>

              {/* Mobile User Actions */}
              <div className="pt-4 px-4 space-y-2 border-t mt-4">
                {session && session.user.role === 'CUSTOMER' ? (
                  <Link
                    href="/account"
                    className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                    onClick={closeMobileMenu}
                  >
                    My Account
                  </Link>
                ) : session && session.user.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                    onClick={closeMobileMenu}
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block w-full text-center border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-4 py-3 rounded-lg transition-colors font-semibold"
                      onClick={closeMobileMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                      onClick={closeMobileMenu}
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
