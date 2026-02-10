'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import SearchBar from '@/components/SearchBar'
import MiniCart from '@/components/MiniCart'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageSelector } from '@/components/LanguageSelector'
import { SocialMediaButtons } from '@/components/SocialMediaButtons'

interface SiteSettings {
  siteName: string;
  logo: string | null;
}

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { state: cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Shenna's Studio",
    logo: '/images/shenna-studio-logo.png',
  });

  useEffect(() => {
    // Fetch site settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.logo) {
          setSettings({
            siteName: data.siteName || "Shenna's Studio",
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

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Apparel', href: '/tshirts' },
    { name: 'Conservation', href: '/conservation' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-[0_12px_35px_rgba(3,7,18,0.65)]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-cyan-200 flex items-center gap-3 hover:text-cyan-300 transition-colors">
              {settings.logo ? (
                <Image
                  src={settings.logo}
                  alt={settings.siteName}
                  width={400}
                  height={400}
                  className="object-contain h-16 w-auto drop-shadow-[0_8px_20px_rgba(34,211,238,0.2)]"
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
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 xl:space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative py-2 text-slate-200 hover:text-cyan-300 transition-colors font-semibold tracking-wide group",
                  pathname === link.href && "text-cyan-300"
                )}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-violet-400"
                  />
                )}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Search Bar */}
            <SearchBar />

            {/* Social Media Share Buttons */}
            <SocialMediaButtons />

            {/* Cart with MiniCart on hover */}
            <div
              className="relative"
              onMouseEnter={() => setShowMiniCart(true)}
              onMouseLeave={() => setShowMiniCart(false)}
            >
              <Link href="/cart" className="text-slate-200 hover:text-cyan-300 transition-colors relative block p-2">
                <ShoppingCart className="w-6 h-6" />
                {cart.items.length > 0 && (
                  <span className="absolute top-0 right-0 bg-cyan-500 text-slate-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </Link>
              {showMiniCart && cart.items.length > 0 && <MiniCart />}
            </div>

            {/* User Actions */}
            {session && session.user.role === 'CUSTOMER' ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/account"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg transition-colors font-semibold text-sm block shadow-[0_8px_24px_rgba(34,211,238,0.35)]"
                >
                  My Account
                </Link>
              </motion.div>
            ) : session && session.user.role === 'ADMIN' ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/admin"
                  className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm block shadow-[0_8px_24px_rgba(139,92,246,0.35)]"
                >
                  Admin
                </Link>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-slate-200 hover:text-cyan-300 font-semibold text-sm"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg transition-colors font-semibold text-sm block shadow-[0_8px_24px_rgba(34,211,238,0.35)]"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Language Selector - Far Right */}
            <LanguageSelector />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Cart Icon */}
            <Link href="/cart" className="text-slate-200 hover:text-cyan-300 transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyan-500 text-slate-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-200 hover:text-cyan-300 focus:outline-none p-2"
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
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 overflow-hidden bg-slate-950/95"
            >
              <nav className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "block px-4 py-2 text-slate-200 hover:bg-white/5 hover:text-cyan-300 transition-colors font-medium rounded",
                      pathname === link.href && "text-cyan-300 bg-white/5"
                    )}
                    onClick={closeMobileMenu}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  className="block px-4 py-2 text-slate-200 hover:bg-white/5 hover:text-cyan-300 transition-colors font-medium rounded"
                  onClick={closeMobileMenu}
                >
                  Cart {cart.items.length > 0 && `(${cart.items.length})`}
                </Link>

                {/* Mobile Language Selector */}
                <div className="pt-2 px-4">
                  <LanguageSelector />
                </div>

                {/* Mobile User Actions */}
                <div className="pt-4 px-4 space-y-2 border-t border-white/10 mt-4">
                  {session && session.user.role === 'CUSTOMER' ? (
                    <Link
                      href="/account"
                      className="block w-full text-center bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-3 rounded-lg transition-colors font-semibold"
                      onClick={closeMobileMenu}
                    >
                      My Account
                    </Link>
                  ) : session && session.user.role === 'ADMIN' ? (
                    <Link
                      href="/admin"
                      className="block w-full text-center bg-violet-600 hover:bg-violet-500 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                      onClick={closeMobileMenu}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block w-full text-center border-2 border-cyan-400 text-cyan-300 hover:bg-white/5 px-4 py-3 rounded-lg transition-colors font-semibold"
                        onClick={closeMobileMenu}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full text-center bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-3 rounded-lg transition-colors font-semibold"
                        onClick={closeMobileMenu}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
