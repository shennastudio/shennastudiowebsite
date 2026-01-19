import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "South Padre Island Conservation | Shenna's Studio",
  description: 'Focused conservation efforts protecting South Padre Island marine ecosystems, sea turtles, and coastal habitats.',
}

const spiProjects = [
  {
    title: 'Sea Turtle Nesting Protection',
    description: 'Protecting endangered sea turtle nesting sites along South Padre Island beaches through daily monitoring, nest relocation, and hatchling release programs.',
    impact: 'Protected 87 nesting sites, resulting in 2,500+ successful hatchling releases in 2023.',
    season: 'March - October',
    partners: ['Sea Turtle Inc.', 'U.S. Fish & Wildlife Service'],
    image: '🥚'
  },
  {
    title: 'Beach Cleanup Initiative',
    description: 'Weekly beach cleanup programs removing plastic debris and marine pollution that threaten sea turtles, birds, and marine mammals.',
    impact: 'Removed over 15,000 pounds of trash from SPI beaches, creating safer habitats for marine life.',
    frequency: 'Every Saturday morning',
    volunteers: '2,500+ volunteer hours annually',
    image: '🏖️'
  },
  {
    title: 'Dune Restoration Project',
    description: 'Restoring natural sand dunes that protect inland ecosystems and provide critical nesting habitat for shorebirds and sea turtles.',
    impact: 'Restored 45 acres of dune habitat, planting 20,000 native dune grasses and coastal plants.',
    ongoing: 'Year-round monitoring and maintenance',
    image: '🌱'
  },
  {
    title: 'Marine Wildlife Monitoring',
    description: 'Scientific monitoring programs tracking marine wildlife populations, migration patterns, and health indicators in Gulf waters.',
    impact: 'Established comprehensive baseline data for 47 marine species, informing conservation strategies.',
    methods: 'Aerial surveys, boat patrols, satellite tracking',
    image: '🔭'
  }
]

const challenges = [
  {
    challenge: 'Coastal Development',
    description: 'Rapid tourism and residential development threatening fragile coastal habitats and nesting sites.',
    solution: 'Working with developers and officials to implement wildlife-friendly development practices.',
    status: 'In Progress'
  },
  {
    challenge: 'Plastic Pollution',
    description: 'Increasing plastic debris washing ashore, endangering marine life through ingestion and entanglement.',
    solution: 'Enhanced cleanup programs and community education on plastic reduction.',
    status: 'Active'
  },
  {
    challenge: 'Climate Change Impacts',
    description: 'Rising sea levels and changing weather patterns affecting nesting sites and coastal ecosystems.',
    solution: 'Adaptive conservation strategies and habitat restoration to increase resilience.',
    status: 'Long-term Planning'
  },
  {
    challenge: 'Tourism Pressure',
    description: 'High visitor numbers can disturb wildlife and damage sensitive coastal areas.',
    solution: 'Education programs and responsible tourism guidelines for visitors.',
    status: 'Implemented'
  }
]

export default function SPIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-600 via-blue-600 to-teal-700 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            South Padre Island Conservation
          </h1>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            Our home and our mission. Protecting the unique marine ecosystems 
            of the Texas Gulf Coast.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Protecting Our Local Treasures</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  South Padre Island is home to some of the most diverse marine life in the Gulf of Mexico.
                  From the critically endangered Kemp&apos;s Ridley sea turtles to the migratory birds
                  that depend on our dunes, our ecosystem is as beautiful as it is fragile.
                </p>
                <p>
                  Shenna&apos;s Studio was founded on these shores, and we believe it&apos;s our responsibility
                  to ensure they remain vibrant for generations to come. Through your support,
                  we fund local initiatives that make a direct difference on our beaches and in our waters.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-50 p-6 rounded-2xl text-center">
                <div className="text-4xl mb-2">🌊🪼</div>
                <div className="font-bold text-teal-700">Sea Turtles</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl text-center">
                <div className="text-4xl mb-2">🐬</div>
                <div className="font-bold text-blue-700">Dolphins</div>
              </div>
              <div className="bg-cyan-50 p-6 rounded-2xl text-center">
                <div className="text-4xl mb-2">🐙</div>
                <div className="font-bold text-cyan-700">Whales</div>
              </div>
              <div className="bg-teal-50 p-6 rounded-2xl text-center">
                <div className="text-4xl mb-2">🐦</div>
                <div className="font-bold text-teal-700">Shorebirds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Timeline */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our SPI Initiatives</h2>
          <div className="space-y-8">
            {spiProjects.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-8 border-l-8 border-teal-500 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="text-6xl flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-xl w-24 h-24">
                    {project.image}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                    <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 mb-4">
                      <span className="font-bold text-teal-700">2023 Impact: </span>
                      <span className="text-teal-900">{project.impact}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {project.partners && (
                        <span className="flex items-center gap-1">
                          🤝 Partners: {project.partners.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Addressing Local Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {challenges.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{item.challenge}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${ 
                    item.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 
                    item.status === 'Implemented' ? 'bg-blue-100 text-blue-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="font-bold text-teal-600 text-sm">Action: </span>
                  <span className="text-gray-700 text-sm">{item.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Support Our Local SPI Mission</h2>
          <p className="text-xl text-teal-50 mb-10">
            Whether you&apos;re a local resident or visitor, there are many ways to help
            protect South Padre Island&apos;s precious ecosystems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-teal-600 px-10 py-4 rounded-full font-bold hover:bg-teal-50 transition-all shadow-lg"
            >
              Shop Local Collection
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-teal-600 transition-all"
            >
              🤝 Volunteer with Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
