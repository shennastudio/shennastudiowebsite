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
import { SaleBanner } from '@/components/SaleBanner'
import { fetchFeaturedProducts } from './actions'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<{
    product: {
      id: string;
      name: string;
      description: string | null;
      slug: string;
      basePrice: number;
      featured: boolean;
    };
    displayPrice: number;
    displayStock: number;
    displayImages: string[];
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    let isMounted = true;
    
    fetchFeaturedProducts(6).then((products) => {
      if (isMounted) {
        setFeaturedProducts(products);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sale Banner */}
      <SaleBanner />
      
      {/* Mission-First Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-900">
        {/* Animated Ocean Waves Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-0 right-0 h-full bg-gradient-to-b from-cyan-900/20 to-transparent" />
          {/* Wave decorations */}
          <svg className="absolute bottom-0 left-0 right-0 h-64 text-cyan-900/20" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="0.4" d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,186.7C672,213,768,235,864,224C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
          <svg className="absolute bottom-0 left-0 right-0 h-48 text-cyan-800/30" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="0.3" d="M0,64L48,80C96,96,192,128,288,144C384,160,480,160,576,176C672,192,768,224,864,218.7C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Headline */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
              Wear the Ocean. <span className="block text-cyan-300">Protect the Ocean.</span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-cyan-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light" style={{ fontFamily: 'Georgia, serif' }}>
              Hand-crafted bracelets that fund real ocean conservation.
              <span className="block mt-3 text-cyan-400">At least 10% of every purchase supports ocean nonprofits in South Padre Island & beyond.</span>
            </p>
            
            {/* CTA Button */}
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-12 py-5 rounded-full font-bold text-lg tracking-wide hover:from-cyan-500 hover:to-teal-500 transition-all shadow-2xl shadow-cyan-500/25"
              >
                Shop Bracelets That Give Back
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Ocean Hero Section - Original */}
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
              text="Shenna's Studio Ocean Collection"
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
      <section className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
            >
              Ocean Treasures
            </motion.h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Handpicked bracelets inspired by sea turtles, whales, and marine life
            </p>
          </div>

          {isLoading && featuredProducts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800 rounded-3xl shadow-sm border border-slate-700 overflow-hidden animate-pulse">
                  <div className="h-80 bg-slate-700" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-600 rounded w-full" />
                    <div className="h-4 bg-slate-600 rounded w-2/3" />
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-slate-700 rounded w-20" />
                      <div className="h-6 bg-slate-600 rounded w-16" />
                    </div>
                    <div className="h-12 bg-slate-700 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🌊</div>
              <p className="text-slate-400 text-lg">No featured products yet</p>
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
                className="bg-slate-800 rounded-3xl shadow-sm border border-slate-700 overflow-hidden group transition-all hover:shadow-2xl hover:shadow-teal-500/10"
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
                    <div className="w-full h-full flex items-center justify-center bg-slate-700">
                      <div className="w-20 h-20 bg-teal-900/50 rounded-full flex items-center justify-center">
                        <Waves className="w-10 h-10 text-teal-400" />
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
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                    {productDisplay.product?.name || 'Product'}
                  </h3>
                  <p className="text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                    {productDisplay.product?.description || 'Ocean-inspired bracelet'}
                  </p>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl font-black text-white">
                      ${productDisplay.displayPrice}
                    </span>
                    <span className={cn(
                      "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                      productDisplay.displayStock > 0 ? "bg-emerald-900/50 text-emerald-400" : "bg-rose-900/50 text-red-400"
                    )}>
                      {productDisplay.displayStock > 0 ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                  <Link
                    href={`/products/${productDisplay.product?.slug || 'ocean-wave-bracelet'}`}
                    className="block w-full text-center bg-teal-600 text-white py-4 rounded-2xl font-bold transition-all hover:bg-teal-500 hover:shadow-xl hover:shadow-teal-500/20 active:scale-95"
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
              className="inline-flex items-center gap-2 text-teal-400 font-bold text-lg hover:gap-4 transition-all"
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
      <section className="bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Why Choose Shenna&apos;s Studio?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sea Turtle Conservation",
                desc: "Each purchase directly supports sea turtle protection programs in South Padre Island nesting grounds.",
                icon: ShieldCheck,
                color: "text-emerald-400",
                bg: "bg-emerald-900/30"
              },
              {
                title: "Ocean-Quality Materials",
                desc: "Premium, sustainably sourced materials that honor marine life and coastal ecosystems.",
                icon: Anchor,
                color: "text-blue-400",
                bg: "bg-blue-900/30"
              },
              {
                title: "Shark Research Support",
                desc: "10% of every sale funds important shark research and ocean conservation efforts.",
                icon: Waves,
                color: "text-cyan-400",
                bg: "bg-cyan-900/30"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="text-center bg-slate-900 p-10 rounded-3xl shadow-sm border border-slate-800 hover:shadow-2xl transition-all"
              >
                <div className={cn("w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-8", feature.bg)}>
                  <feature.icon className={cn("w-10 h-10", feature.color)} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

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