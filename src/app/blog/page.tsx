import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Conservation Blog | ShennaStudio',
  description: 'Read about our ocean conservation efforts supporting Sea Turtle Inc. and marine life protection in South Padre Island and the Rio Grande Valley.'
}

const blogPosts = [
  {
    id: 1,
    title: 'Protecting Sea Turtles: Our Partnership with Sea Turtle Inc.',
    slug: 'sea-turtle-inc-partnership',
    date: '2025-01-20',
    excerpt: 'Learn how ShennaStudio supports Sea Turtle Inc., a world-renowned sea turtle rescue and rehabilitation center in South Padre Island, Texas.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    category: 'Conservation',
    featured: true,
    content: `
      <h2>About Sea Turtle Inc.</h2>
      <p>Sea Turtle Inc. is a non-profit organization dedicated to the rescue, rehabilitation, and release of injured and endangered sea turtles. Located in South Padre Island, Texas, this incredible facility has been protecting sea turtles for over 45 years.</p>

      <h3>Our Impact Together</h3>
      <p>Through your bracelet purchases, ShennaStudio proudly donates 10% of every sale to support Sea Turtle Inc.'s vital conservation work. Your support helps fund:</p>
      <ul>
        <li>Emergency rescue operations for stranded and injured sea turtles</li>
        <li>Medical treatment and rehabilitation for sick turtles</li>
        <li>Educational programs teaching visitors about marine conservation</li>
        <li>Research initiatives to protect nesting sites along the Texas coast</li>
        <li>Release programs returning healthy turtles to the Gulf of Mexico</li>
      </ul>

      <h3>The Importance of Sea Turtles</h3>
      <p>Sea turtles are essential to healthy ocean ecosystems. They maintain seagrass beds, transport nutrients between ecosystems, and support biodiversity. However, all species of sea turtles found in Texas waters are threatened or endangered.</p>

      <h3>How You Can Help</h3>
      <p>Every ShennaStudio bracelet purchase directly supports sea turtle conservation. Additionally, you can:</p>
      <ul>
        <li>Visit Sea Turtle Inc. in South Padre Island</li>
        <li>Reduce plastic use to protect ocean habitats</li>
        <li>Support beach cleanup initiatives in the Rio Grande Valley</li>
        <li>Spread awareness about marine conservation</li>
      </ul>

      <p>Together, we're making a difference for these magnificent creatures and the oceans they call home.</p>
    `
  },
  {
    id: 2,
    title: 'Rio Grande Valley Marine Conservation: Why It Matters',
    slug: 'rgv-marine-conservation',
    date: '2025-01-15',
    excerpt: 'Discover why the Rio Grande Valley coastline is critical for marine biodiversity and how we are protecting it through conservation partnerships.',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
    category: 'Conservation',
    featured: true,
    content: `
      <h2>The Rio Grande Valley Coastline</h2>
      <p>The Rio Grande Valley coastline, including South Padre Island, is one of the most ecologically important marine habitats in North America. This unique ecosystem supports diverse marine life and serves as a crucial nesting ground for endangered sea turtles.</p>

      <h3>Key Species We Protect</h3>
      <p>The RGV waters are home to five species of sea turtles, all protected under the Endangered Species Act:</p>
      <ul>
        <li><strong>Kemp's Ridley Sea Turtle</strong> - The world's most endangered sea turtle</li>
        <li><strong>Green Sea Turtle</strong> - Essential for maintaining healthy seagrass ecosystems</li>
        <li><strong>Loggerhead Sea Turtle</strong> - Named for their large heads and powerful jaws</li>
        <li><strong>Hawksbill Sea Turtle</strong> - Critical for coral reef health</li>
        <li><strong>Leatherback Sea Turtle</strong> - The largest of all sea turtles</li>
      </ul>

      <h3>Threats to Our Marine Ecosystems</h3>
      <p>The Gulf coast faces numerous environmental challenges:</p>
      <ul>
        <li>Plastic pollution and marine debris</li>
        <li>Coastal development impacting nesting sites</li>
        <li>Climate change affecting water temperatures</li>
        <li>Accidental capture in fishing gear</li>
        <li>Light pollution disorienting hatchlings</li>
      </ul>

      <h3>Conservation Success Stories</h3>
      <p>Thanks to dedicated conservation efforts in South Padre Island, we're seeing positive results:</p>
      <ul>
        <li>Increased sea turtle nesting activity along the Texas coast</li>
        <li>Successful rehabilitation and release programs</li>
        <li>Growing public awareness and education</li>
        <li>Stronger protection laws for nesting beaches</li>
      </ul>

      <p>Your support through ShennaStudio purchases helps these conservation programs continue their vital work protecting our oceans for future generations.</p>
    `
  },
  {
    id: 3,
    title: 'From Ocean to Bracelet: Sustainable Craftsmanship',
    slug: 'sustainable-craftsmanship',
    date: '2025-01-10',
    excerpt: 'Explore how ShennaStudio creates beautiful ocean-inspired jewelry while maintaining our commitment to environmental sustainability.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
    category: 'Sustainability',
    featured: false,
    content: `
      <h2>Sustainable Materials, Ocean-Inspired Designs</h2>
      <p>At ShennaStudio, every bracelet is handcrafted with care for both beauty and environmental responsibility. We believe that protecting the oceans starts with how we create our products.</p>

      <h3>Our Sustainable Practices</h3>
      <ul>
        <li>Using ethically sourced beads and materials</li>
        <li>Minimizing waste in our production process</li>
        <li>Plastic-free, recyclable packaging</li>
        <li>Supporting local artisans in the Rio Grande Valley</li>
        <li>Donating 10% of profits to ocean conservation</li>
      </ul>

      <h3>The Inspiration Behind Our Designs</h3>
      <p>Each ShennaStudio bracelet draws inspiration from the stunning marine life and coastal beauty of South Padre Island. Our color palettes reflect the blues and greens of the Gulf waters, while our patterns echo the movement of waves and the elegance of sea creatures.</p>

      <p>When you wear a ShennaStudio bracelet, you're not just wearing jewelry - you're wearing a piece of ocean conservation and supporting sustainable craftsmanship.</p>
    `
  },
  {
    id: 4,
    title: 'South Padre Island: A Sea Turtle Sanctuary',
    slug: 'south-padre-island-sanctuary',
    date: '2025-01-05',
    excerpt: 'Why South Padre Island is one of the most important sea turtle nesting and conservation areas in the United States.',
    image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&h=600&fit=crop',
    category: 'Conservation',
    featured: false,
    content: `
      <h2>South Padre Island: A Critical Habitat</h2>
      <p>South Padre Island, located at the southern tip of Texas, is a vital nesting ground for endangered sea turtles. The island's pristine beaches and protected areas provide safe havens for these ancient mariners to lay their eggs and continue their species.</p>

      <h3>Nesting Season</h3>
      <p>From April through July, female sea turtles return to the beaches where they were born to lay their own eggs. This remarkable phenomenon, called natal homing, demonstrates the deep connection these creatures have to South Padre Island.</p>

      <h3>Conservation Efforts</h3>
      <p>Local conservation groups, including Sea Turtle Inc., work tirelessly to protect nesting sites:</p>
      <ul>
        <li>Beach patrols during nesting season</li>
        <li>Nest monitoring and protection</li>
        <li>Hatchling release programs</li>
        <li>Public education about responsible beach use</li>
        <li>Rescue and rehabilitation of injured turtles</li>
      </ul>

      <h3>How Your Purchase Helps</h3>
      <p>Every ShennaStudio bracelet sold contributes to protecting these nesting beaches and supporting the rehabilitation of injured sea turtles. Together, we're ensuring that future generations can witness the magic of sea turtle nesting on South Padre Island.</p>
    `
  }
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const recentPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-700 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <span className="text-5xl">🐢</span>
              <h1 className="text-4xl md:text-6xl font-bold">
                Conservation Blog
              </h1>
              <span className="text-5xl">🌊</span>
            </div>
            <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Stories from the ocean: sea turtle rescue, marine conservation, and our mission to protect South Padre Island&apos;s coastal ecosystems
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <span className="text-3xl">⭐</span>
            <h2 className="text-3xl md:text-4xl font-bold text-teal-700">
              Featured Stories
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-teal-100 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
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

      {/* Recent Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <span className="text-3xl">📰</span>
            <h2 className="text-3xl md:text-4xl font-bold text-teal-700">
              Recent Updates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-200 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(post.date).toLocaleDateString('en-US', {
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
        </div>
      </section>

      {/* Conservation CTA */}
      <section className="bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-4xl">🐢</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Support Ocean Conservation
            </h2>
            <span className="text-4xl">🌊</span>
          </div>
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
