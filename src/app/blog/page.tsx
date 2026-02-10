import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import AnimatedSection, { StaggeredChildren } from '@/components/AnimatedSection'

export const metadata = {
  title: "Conservation Blog | Shenna's Studio",
  description: 'Read about our ocean conservation efforts supporting Sea Turtle Inc. and marine life protection in South Padre Island and the Rio Grande Valley.'
}

export const revalidate = 3600 // Revalidate every hour

async function getBlogPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })
  } catch {
    // Return empty array if table doesn't exist yet (new database)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  const featuredPosts = posts.filter(post => post.featured)
  const recentPosts = posts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-teal-500/10 to-transparent" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fadeInDown" className="text-center max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-cyan-200 text-sm font-semibold mb-6 backdrop-blur-sm border border-white/10">
              Shenna&apos;s Studio Journal
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-800 via-blue-700 to-cyan-700 tracking-tight">
              Stories from the Ocean
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Exploring sea turtle rescue, marine conservation, and the handcrafted artistry behind every piece.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="relative z-10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeInUp" className="mb-12">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
                <h2 className="text-2xl font-bold text-slate-100 uppercase tracking-wider">Featured Stories</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
              </div>
            </AnimatedSection>

            <StaggeredChildren className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group relative h-[500px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
                >
                  <div className="absolute inset-0">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                        <span className="text-6xl">🌊</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>

                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
                    <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                      {post.category && (
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sm font-medium border border-white/20 mb-4">
                          {post.category}
                        </span>
                      )}
                      
                      <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                        <Link href={`/blog/${post.slug}`} className="hover:underline decoration-teal-400 decoration-2 underline-offset-4">
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-slate-200 mb-6 line-clamp-2 md:line-clamp-3 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                        <time>
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                        <span>•</span>
                        <Link href={`/blog/${post.slug}`} className="text-white hover:text-teal-300 transition-colors flex items-center gap-2">
                          Read Story <span className="text-xl">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </StaggeredChildren>
          </div>
        </section>
      )}

      {/* Recent Posts Grid */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" className="mb-12">
             <h2 className="text-3xl font-bold text-white mb-2">
               {featuredPosts.length > 0 ? 'Recent Updates' : 'All Stories'}
             </h2>
             <div className="h-1 w-20 bg-teal-400 rounded-full" />
          </AnimatedSection>

          {recentPosts.length > 0 ? (
            <StaggeredChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={100}>
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl">
                        🌊
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-xs font-bold text-cyan-200 shadow-sm border border-white/10">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                      <time>
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text group-hover:text-cyan-300 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-slate-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-cyan-300 font-semibold text-sm hover:text-cyan-200 transition-colors group/link"
                    >
                      Read more 
                      <svg className="w-4 h-4 ml-1 transform transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </StaggeredChildren>
          ) : (
             <div className="col-span-full text-center py-20 bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-dashed border-white/10">
               <span className="text-4xl mb-4 block">📝</span>
               <h3 className="text-lg font-medium text-white">No recent stories yet</h3>
               <p className="text-slate-400">Check back soon for new updates from the studio.</p>
             </div>
          )}
        </div>
      </section>

      {/* Conservation CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-blue-900 to-slate-900" />
        <div className="absolute inset-0 opacity-20 bg-[url('/noise.png')] mix-blend-overlay" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fadeInUp">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Wear Your Impact
            </h2>
            <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Every bracelet purchased directly supports our conservation partners at Sea Turtle Inc. and local marine life protection efforts.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="/products"
                className="bg-white text-teal-900 px-8 py-4 rounded-full font-bold hover:bg-teal-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Shop Ocean Collection
              </Link>
              <Link
                href="/conservation"
                className="group flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Our Mission 
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
