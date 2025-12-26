import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-teal-900 to-cyan-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-coral-400">🌊</span>
              <span className="text-2xl font-bold">ShennaStudio</span>
            </div>
            <p className="text-cyan-200 leading-relaxed">
              Handcrafted bracelets inspired by ocean. Each piece supports marine life conservation in South Padre Island and Rio Grande Valley.
            </p>
            <div className="flex space-x-4 text-2xl">
              <span>🐢</span>
              <span>🐋</span>
              <span>🦈</span>
            </div>
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
            <div className="flex justify-center items-center gap-4 mb-4">
              <span className="text-3xl">🐢</span>
              <span className="text-xl font-bold text-coral-400">10% Donated</span>
              <span className="text-3xl">🐋</span>
            </div>
            <p className="text-cyan-200 mb-4">
              Every purchase supports marine life conservation in Rio Grande Valley and South Padre Island
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-cyan-300">
              <div className="flex items-center gap-2">
                <span>🐢</span>
                <span>Sea Turtle Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🐋</span>
                <span>Whale Conservation</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🦈</span>
                <span>Shark Research</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-cyan-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-cyan-300 text-sm">
            <p>© 2024 ShennaStudio. Protecting oceans, one bracelet at a time.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span>Made with 🌊 in Texas</span>
              <span>•</span>
              <span>Supporting 🐢🐋🦈</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}