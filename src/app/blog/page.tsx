import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import AnimatedSection, { StaggeredChildren } from '@/components/AnimatedSection'

export const metadata = {
  title: 'Conservation Blog | ShennaStudio',
  description: 'Read about our ocean conservation efforts supporting Sea Turtle Inc. and marine life protection in South Padre Island and the Rio Grande Valley.'
}

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  const featuredPosts = posts.filter(post => post.featured)
  const recentPosts = posts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-700 py-20 text-white relative overflow-hidden">
        {/* Animated background waves */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23ffffff%22 d=%22M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%22%3E%3C/path%3E%3C/svg%3E')] bg-cover bg-bottom animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection animation="fadeInDown" className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
              Conservation Blog
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Stories from the ocean: sea turtle rescue, marine conservation, and our mission to protect South Padre Island&apos;s coastal ecosystems
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeInUp">
              <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-12">
                Featured Stories
              </h2>
            </AnimatedSection>

            <StaggeredChildren className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="stagger-child bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-teal-100 group"
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-100">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        <span className="text-6xl animate-bounce">🌊</span>
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                        {post.category}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-8">
                    <div className="text-sm text-teal-600 font-medium mb-2">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
                    >
                      Read Full Story
                    </Link>
                  </div>
                </article>
              ))}
            </StaggeredChildren>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-12">
              {featuredPosts.length > 0 ? 'Recent Updates' : 'All Stories'}
            </h2>
          </AnimatedSection>

          {recentPosts.length > 0 ? (
            <StaggeredChildren className="grid grid-cols-1 md:grid-cols-2 gap-8" staggerDelay={150}>
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="stagger-child bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-200 group hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        <span className="text-5xl animate-pulse">🌊</span>
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                        {post.category}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold transition-colors group/link"
                    >
                      Read More
                      <span className="ml-1 group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </StaggeredChildren>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>No recent posts found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Conservation CTA */}
      <section className="bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-700 py-16 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/2 right-20 w-16 h-16 rounded-full bg-white animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-12 h-12 rounded-full bg-white animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection animation="fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Support Ocean Conservation
            </h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              Every ShennaStudio bracelet purchase donates 10% to Sea Turtle Inc. and marine conservation efforts in South Padre Island and the Rio Grande Valley.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-block bg-white text-teal-700 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-110 shadow-lg hover:shadow-xl"
              >
                Shop Ocean Collection
              </Link>
              <Link
                href="/conservation"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all hover:scale-105"
              >
                Learn More About Our Mission
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
