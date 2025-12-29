import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'

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
      <section className="bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-700 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conservation Blog
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Stories from the ocean: sea turtle rescue, marine conservation, and our mission to protect South Padre Island&apos;s coastal ecosystems
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-12">
              Featured Stories
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-teal-100 group"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-200">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        <span className="text-4xl">🌊</span>
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="text-sm text-gray-500 mb-2">
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
                      className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
                    >
                      Read Full Story
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-12">
            {featuredPosts.length > 0 ? 'Recent Updates' : 'All Stories'}
          </h2>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-200 group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        <span className="text-4xl">🌊</span>
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
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
                      className="inline-block text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>No recent posts found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Conservation CTA */}
      <section className="bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Support Ocean Conservation
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Every ShennaStudio bracelet purchase donates 10% to Sea Turtle Inc. and marine conservation efforts in South Padre Island and the Rio Grande Valley.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-block bg-white text-teal-700 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Shop Ocean Collection
            </Link>
            <Link
              href="/conservation"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all"
            >
              Learn More About Our Mission
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
