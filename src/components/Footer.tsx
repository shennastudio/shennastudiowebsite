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

        {/* Conservation Message */}
        <div className="mt-12 pt-8 border-t border-cyan-700">
          <div className="text-center">
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