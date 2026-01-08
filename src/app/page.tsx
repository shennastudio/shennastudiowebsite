'use client'

import { TestimonialSection } from '@/components/TestimonialSection'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { ArrowRight, Waves, Anchor, ShieldCheck } from 'lucide-react'
import { SplitText } from '@/components/SplitText'
import ShimmerButton from '@/components/magicui/ShimmerButton'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import ParallaxBanner from '@/components/ParallaxBanner'
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner'
import InstagramFeed from '@/components/InstagramFeed'
import { fetchFeaturedProducts } from './actions'

// Note: Removed force-dynamic to allow client-side features, but we fetch data.
// In a real app, you might use a wrapper for the client parts or separate server/client components.

export default function Home() {
// ... (previous logic)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    fetchFeaturedProducts(6).then(setFeaturedProducts);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Ocean Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 z-10" />
          <Image
            src="/images/aboutpageparallax.jpg"
            alt="Ocean background"
            fill
            className="object-cover opacity-60"
            priority
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <div className="flex flex-col items-center">
            <SplitText 
              text="ShennaStudio Ocean Collection"
              className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter justify-center text-center leading-tight"
            />
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl md:text-2xl text-cyan-100 mb-10 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Handcrafted bracelets inspired by the beauty of South Padre Island. 
              <span className="block mt-2 font-medium text-teal-300">Each purchase protects marine life.</span>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/products">
                <ShimmerButton className="shadow-2xl">
                  <span className="group flex items-center gap-2 whitespace-pre-wrap text-center text-sm font-bold leading-none tracking-tighter text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                    Shop Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </ShimmerButton>
              </Link>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/conservation"
                  className="inline-block border-2 border-white/30 backdrop-blur-sm text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-all"
                >
                Our Mission
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
            >
              Ocean Treasures
            </motion.h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Handpicked bracelets inspired by sea turtles, whales, and marine life
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🌊</div>
              <p className="text-slate-500 text-lg">Loading ocean treasures...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((productDisplay, index) => (
              <motion.div
                key={productDisplay.product?.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group transition-all hover:shadow-2xl hover:shadow-teal-500/10"
              >
                <div className="relative h-80 overflow-hidden">
                  {productDisplay.displayImages?.[0] ? (
                    <Image
                      src={productDisplay.displayImages[0]}
                      alt={productDisplay.product?.name || 'Product'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                        <Waves className="w-10 h-10 text-teal-500" />
                      </div>
                    </div>
                  )}
                  {productDisplay.product?.featured && (
                    <div className="absolute top-6 right-6 bg-teal-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                    {productDisplay.product?.name || 'Product'}
                  </h3>
                  <p className="text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                    {productDisplay.product?.description || 'Ocean-inspired bracelet'}
                  </p>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl font-black text-slate-900">
                      ${productDisplay.displayPrice}
                    </span>
                    <span className={cn(
                      "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                      productDisplay.displayStock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-red-600"
                    )}>
                      {productDisplay.displayStock > 0 ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                  <Link
                    href={`/products/${productDisplay.product?.slug || 'ocean-wave-bracelet'}`}
                    className="block w-full text-center bg-slate-900 text-white py-4 rounded-2xl font-bold transition-all hover:bg-teal-600 hover:shadow-xl hover:shadow-teal-500/20 active:scale-95"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          )}

          <div className="text-center mt-20">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-teal-600 font-bold text-lg hover:gap-4 transition-all"
            >
              View All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Subscription Banner */}
      <SubscriptionBanner />

      {/* Mission Parallax Banner */}
      <ParallaxBanner 
        src="/images/plug.jpg" 
        alt="Support Our Mission" 
        text="Support Our Mission" 
      />

      {/* Ocean Features Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Why Choose ShennaStudio?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Sea Turtle Conservation", 
                desc: "Each purchase directly supports sea turtle protection programs in South Padre Island nesting grounds.",
                icon: ShieldCheck,
                color: "text-emerald-500",
                bg: "bg-emerald-50"
              },
              { 
                title: "Ocean-Quality Materials", 
                desc: "Premium, sustainably sourced materials that honor marine life and coastal ecosystems.",
                icon: Anchor,
                color: "text-blue-500",
                bg: "bg-blue-50"
              },
              { 
                title: "Shark Research Support", 
                desc: "10% of every sale funds important shark research and ocean conservation efforts.",
                icon: Waves,
                color: "text-cyan-500",
                bg: "bg-cyan-50"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="text-center bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl transition-all"
              >
                <div className={cn("w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-8", feature.bg)}>
                  <feature.icon className={cn("w-10 h-10", feature.color)} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* Instagram Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Follow Us on Instagram
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
              Join our ocean-loving community! See behind-the-scenes bracelet making and conservation updates.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.instagram.com/shennastudio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @shennastudio
            </motion.a>
          </div>

          <InstagramFeed username="shennastudio" />
        </div>
      </section>

      {/* Ocean Conservation CTA Section */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
              Protect Ocean Life with Every Bracelet
            </h2>
            <p className="text-xl text-cyan-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Each purchase directly supports sea turtle conservation, whale protection, and marine ecosystem restoration in Rio Grande Valley and South Padre Island.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/products"
                  className="inline-block bg-teal-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20"
                >
                  Shop Ocean Collection
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/conservation"
                  className="inline-block border-2 border-white/30 backdrop-blur-sm text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-all"
                >
                 Learn Our Mission
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Conservation Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Donated to Conservation", val: "10%", color: "text-teal-400" },
              { label: "Rio Grande Valley Focus", val: "RGV", color: "text-blue-400" },
              { label: "South Padre Island", val: "SPI", color: "text-cyan-400" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10"
              >
                <div className={cn("text-4xl font-black mb-2", stat.color)}>{stat.val}</div>
                <div className="text-white font-medium tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Turtle Parallax Banner */}
      <ParallaxBanner 
        src="/images/turtleparallax.jpg" 
        alt="Sea Turtle Swimming" 
        text="Protect Our Turtles" 
      />
    </div>
  );
}