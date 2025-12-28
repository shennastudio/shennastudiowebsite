import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-teal-900 to-cyan-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/images/shenna-studio-logo.png"
                alt="Shenna's Studio"
                width={150}
                height={150}
                className="object-contain h-20 w-auto brightness-110"
              />
            </div>
            <p className="text-cyan-200 leading-relaxed">
              Handcrafted bracelets inspired by the ocean. Each piece supports marine life conservation in South Padre Island and Rio Grande Valley.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-coral-400">Ocean Collection</h3>
            <ul className="space-y-2 text-cyan-200">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Bracelets
                </Link>
              </li>
              <li>
                <Link href="/products?category=glass" className="hover:text-white transition-colors">
                  Glass Beads
                </Link>
              </li>
              <li>
                <Link href="/products?category=stone" className="hover:text-white transition-colors">
                  Stone Beads
                </Link>
              </li>
              <li>
                <Link href="/products?category=wooden" className="hover:text-white transition-colors">
                  Wooden Beads
                </Link>
              </li>
              <li>
                <Link href="/products?category=crystal" className="hover:text-white transition-colors">
                  Crystal Beads
                </Link>
              </li>
            </ul>
          </div>

          {/* Conservation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-coral-400">Ocean Conservation</h3>
            <ul className="space-y-2 text-cyan-200">
              <li>
                <Link href="/conservation" className="hover:text-white transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/conservation/partners" className="hover:text-white transition-colors">
                  Conservation Partners
                </Link>
              </li>
              <li>
                <Link href="/conservation/impact" className="hover:text-white transition-colors">
                  Our Impact
                </Link>
              </li>
              <li>
                <Link href="/conservation/spi" className="hover:text-white transition-colors">
                  South Padre Island
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-coral-400">Support</h3>
            <ul className="space-y-2 text-cyan-200">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Conservation Message */}
        <div className="mt-12 pt-8 border-t border-cyan-700">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-coral-400 mb-4">Follow Our Ocean Journey</h3>
              <div className="flex justify-center items-center gap-4 mb-6">
                <a
                  href="https://www.instagram.com/shennastudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all transform shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @shennastudio
                </a>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-xl font-bold text-coral-400">10% Donated to Marine Conservation</span>
            </div>
            <p className="text-cyan-200 mb-4">
              Every purchase supports marine life conservation in Rio Grande Valley and South Padre Island
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-cyan-300">
              <span>Sea Turtle Protection</span>
              <span>•</span>
              <span>Whale Conservation</span>
              <span>•</span>
              <span>Shark Research</span>
            </div>
          </div>
        </div>

        {/* Web Development Partner */}
        <div className="mt-8 pt-8 border-t border-cyan-700">
          <div className="bg-gradient-to-r from-cyan-800/40 to-blue-800/40 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-coral-400 mb-2">Website Developed By</h3>
              <a
                href="https://softwarepros.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xl font-bold text-white hover:text-coral-400 transition-colors mb-3"
              >
                SoftwarePros.org →
              </a>
              <p className="text-cyan-200 leading-relaxed max-w-3xl mx-auto">
                Fantastic team specializing in modern websites with beautiful admin panels and mobile applications
                development for various business types. Visit them and use their wonderful services for all your
                web and mobile development needs!
              </p>
            </div>
          </div>
        </div>

        {/* SEO-Optimized Copyright & Mission Statement */}
        <div className="mt-8 pt-8 border-t border-cyan-700">
          <div className="max-w-4xl mx-auto text-center mb-6">
            <p className="text-cyan-200 text-sm leading-relaxed">
              <strong className="text-white">ShennaStudio</strong> - Your trusted source for handcrafted ocean-inspired bracelets,
              jewelry, and apparel that make a difference. Shop eco-friendly beaded bracelets, artisan jewelry, and sustainable
              t-shirts while supporting marine conservation efforts in South Padre Island, Texas. Every purchase helps protect
              sea turtles, whales, dolphins, and ocean ecosystems in the Rio Grande Valley. Join our mission to preserve marine
              life through conscious shopping and environmental advocacy.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-cyan-300 text-sm gap-4">
            <p className="text-center md:text-left">
              © 2025 ShennaStudio™. All Rights Reserved. <br className="md:hidden" />
              Handcrafted in South Padre Island, Texas since March 2025.
            </p>
            <div className="flex items-center gap-4">
              <span>Protecting Oceans, One Bracelet at a Time</span>
              <span>•</span>
              <span>10% to Marine Conservation</span>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-cyan-400">
            <p>
              Keywords: Ocean bracelets, marine conservation jewelry, eco-friendly bracelets, handmade beaded jewelry,
              sea turtle protection, sustainable fashion, Texas artisan jewelry, coastal conservation, marine life advocacy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}