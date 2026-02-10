'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Waves, ShieldCheck, Sparkles, Anchor, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { TestimonialSection } from '@/components/TestimonialSection'
import ParallaxBanner from '@/components/ParallaxBanner'
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner'
import { SaleBanner } from '@/components/SaleBanner'
import { fetchFeaturedProducts } from './actions'
import MotionSection from '@/components/animations/MotionSection'
import { fadeUp, heroHeadline, heroSubhead, staggerContainer, staggerItem } from '@/components/animations/motion'
import HeroScene from '@/components/landing/HeroScene'
import HeroOrb from '@/components/landing/HeroOrb'

const bentoFeatures = [
  {
    title: 'Ocean Impact Ledger',
    description: 'Track how every purchase funds sea turtle rescue, reef restoration, and research partners across Texas Gulf Coast.',
    icon: ShieldCheck,
    className: 'md:col-span-4 md:row-span-2',
    accent: 'from-cyan-500/20 via-transparent to-transparent',
  },
  {
    title: 'Handcrafted in Brownsville',
    description: 'Every bracelet is made-to-order with ocean-safe materials and artisan-level detail.',
    icon: Sparkles,
    className: 'md:col-span-2',
    accent: 'from-violet-500/20 via-transparent to-transparent',
  },
  {
    title: 'Adaptive Sizing',
    description: 'Comfort-fit designs with adjustable sizing to match your everyday look.',
    icon: Anchor,
    className: 'md:col-span-2',
    accent: 'from-emerald-400/20 via-transparent to-transparent',
  },
  {
    title: 'Fast Shipping',
    description: 'Priority-ready fulfillment with premium packaging and conservation notes inside.',
    icon: Zap,
    className: 'md:col-span-3',
    accent: 'from-cyan-400/20 via-transparent to-transparent',
  },
  {
    title: 'Ocean Stories',
    description: 'Exclusive content, rescue updates, and local conservation spotlights.',
    icon: Waves,
    className: 'md:col-span-3',
    accent: 'from-blue-500/20 via-transparent to-transparent',
  },
]

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<{
    product: {
      id: string
      name: string
      description: string | null
      slug: string
      basePrice: number
      featured: boolean
    }
    displayPrice: number
    displayStock: number
    displayImages: string[]
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetchFeaturedProducts(6)
      .then((products) => {
        if (isMounted) {
          setFeaturedProducts(products)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen text-white ocean-bg">
      <SaleBanner />

      <section className="relative overflow-hidden pt-24 pb-20">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950" />
        <div className="absolute inset-0 grid-lines opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={staggerContainer(0.18, 0.1)}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.span
                variants={staggerItem}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-cyan-300 shadow-[0_10px_30px_rgba(3,7,18,0.4)]"
              >
                <Sparkles className="h-4 w-4" />
                Ocean-inspired limited drops
              </motion.span>
              <motion.h1
                variants={heroHeadline}
                className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight"
              >
                Wear the Ocean.
                <span className="block neon-text">Protect the Ocean.</span>
              </motion.h1>
              <motion.p variants={heroSubhead} className="text-lg md:text-xl text-slate-300 max-w-xl">
                Handcrafted bracelets that fund real conservation work. Every piece is made with intention and ships
                with an impact story from South Padre Island and the Rio Grande Valley.
              </motion.p>
              <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-900 shadow-[0_16px_40px_rgba(34,211,238,0.35)] transition-all hover:bg-cyan-400"
                >
                  Shop Bracelets
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/conservation"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
                >
                  Our Mission
                </Link>
              </motion.div>
              <motion.div
                variants={staggerItem}
                className="grid grid-cols-2 gap-4 sm:max-w-md"
              >
                {[
                  { label: 'Donated to Conservation', value: '10%' },
                  { label: 'Local Impact', value: 'RGV' },
                  { label: 'Handcrafted', value: '100%' },
                  { label: 'Eco Packaging', value: 'Plastic-Free' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="glass-panel rounded-2xl p-4 text-center"
                  >
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs uppercase tracking-widest text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <div className="relative flex items-center justify-center">
              <div className="absolute -top-10 right-0 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
              <HeroOrb />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -bottom-8 right-2 md:right-12 w-48 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-[0_20px_50px_rgba(3,7,18,0.6)] backdrop-blur-xl"
              >
                <div className="relative h-24 w-full overflow-hidden rounded-xl mb-3">
                  <Image
                    src="/images/shennawhale.jpg"
                    alt="Ocean bracelet inspiration"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Studio Drop</p>
                <p className="text-sm font-semibold text-white">Whale Song Collection</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="absolute inset-0 grid-dots opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionSection className="mb-12 text-center" variants={fadeUp}>
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80 mb-4">Why Shenna&apos;s Studio</p>
            <h2 className="text-3xl md:text-5xl font-bold">A modern ocean-first experience</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mt-4">
              Asymmetric bento layouts meet glassmorphism UI to spotlight craftsmanship and conservation impact.
            </p>
          </MotionSection>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-6 gap-6"
            variants={staggerContainer(0.12, 0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {bentoFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className={cn('relative bento-card hover-glow p-8', feature.className)}
              >
                <div className="bento-glow" />
                <div className={cn('absolute inset-0 bg-gradient-to-br', feature.accent)} />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-11 w-11 rounded-2xl border border-white/10 bg-slate-900/70 flex items-center justify-center text-cyan-300">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  <div className="mt-auto pt-6 text-sm text-cyan-300/80">Explore →</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionSection className="text-center mb-12" variants={fadeUp}>
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80 mb-4">Featured Treasures</p>
            <h2 className="text-3xl md:text-5xl font-bold">Ocean-ready favorites</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mt-4">
              Handpicked ocean-inspired bracelets with real conservation impact.
            </p>
          </MotionSection>

          {isLoading && featuredProducts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bento-card p-6 animate-pulse">
                  <div className="h-64 bg-slate-800 rounded-2xl" />
                  <div className="mt-6 space-y-3">
                    <div className="h-6 bg-slate-800 rounded" />
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-10 bg-slate-800 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-5xl mb-4">🌊</div>
              <p className="text-slate-400 text-lg">No featured products yet</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer(0.12, 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {featuredProducts.map((productDisplay, index) => (
                <motion.div
                  key={productDisplay.product?.id || index}
                  variants={staggerItem}
                  whileHover={{ y: -8 }}
                  className="group relative bento-card hover-glow overflow-hidden"
                >
                  <div className="bento-glow" />
                  <div className="relative z-10">
                    <div className="relative h-64 overflow-hidden">
                      {productDisplay.displayImages?.[0] ? (
                        <Image
                          src={productDisplay.displayImages[0]}
                          alt={productDisplay.product?.name || 'Product'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900">
                          <div className="w-20 h-20 bg-teal-900/50 rounded-full flex items-center justify-center">
                            <Waves className="w-10 h-10 text-teal-400" />
                          </div>
                        </div>
                      )}
                      {productDisplay.product?.featured && (
                        <div className="absolute top-6 right-6 bg-cyan-500 text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3">
                        {productDisplay.product?.name || 'Product'}
                      </h3>
                      <p className="text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                        {productDisplay.product?.description || 'Ocean-inspired bracelet'}
                      </p>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-2xl font-black text-white">
                          ${productDisplay.displayPrice}
                        </span>
                        <span
                          className={cn(
                            'text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider',
                            productDisplay.displayStock > 0
                              ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                              : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          )}
                        >
                          {productDisplay.displayStock > 0 ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>
                      <Link
                        href={`/products/${productDisplay.product?.slug || 'ocean-wave-bracelet'}`}
                        className="block w-full text-center bg-cyan-500 text-slate-900 py-3 rounded-2xl font-semibold transition-all hover:bg-cyan-400"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-cyan-300 font-semibold text-lg hover:gap-4 transition-all"
            >
              View All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <SubscriptionBanner />

      <ParallaxBanner src="/images/plug.jpg" alt="Support Our Mission" text="Support Our Mission" />

      <TestimonialSection />

      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 opacity-30 grid-dots" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionSection variants={fadeUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Protect Ocean Life with Every Bracelet
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-3xl mx-auto">
              Shop handcrafted pieces that directly support sea turtle conservation, whale protection, and marine
              ecosystem restoration in the Rio Grande Valley.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-cyan-500 text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-cyan-400 transition-all"
              >
                Shop Ocean Collection
              </Link>
              <Link
                href="/conservation"
                className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Learn Our Mission
              </Link>
            </div>
          </MotionSection>
        </div>
      </section>

      <ParallaxBanner src="/images/turtleparallax.jpg" alt="Sea Turtle Swimming" text="Protect Our Turtles" />
    </div>
  )
}
