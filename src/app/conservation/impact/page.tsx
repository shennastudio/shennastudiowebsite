import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Conservation Impact | ShennaStudio',
  description: 'See the real impact of our conservation efforts in Rio Grande Valley and South Padre Island marine life protection.',
}

const stats = [
  {
    number: '$52,750',
    label: 'Total Donated',
    description: 'Contributed to marine conservation since 2022'
  },
  {
    number: '1,250+',
    label: 'Sea Turtles Protected',
    description: 'Supported rescue and rehabilitation programs'
  },
  {
    number: '450 acres',
    label: 'Coastal Habitat Restored',
    description: 'Through partner restoration projects'
  },
  {
    number: '3,500',
    label: 'Students Educated',
    description: 'Marine conservation education programs'
  }
]

const projects = [
  {
    title: 'Sea Turtle Rescue & Rehabilitation',
    organization: 'Sea Turtle Inc.',
    location: 'South Padre Island',
    impact: 'Supported the rescue and rehabilitation of 325 endangered sea turtles, including 87 Kemp\'s Ridley sea turtles - the most critically endangered sea turtle species.',
    funds: '$18,500',
    timeline: '2022-2025',
    image: '🌊🪼'
  },
  {
    title: 'Coastal Dune Restoration',
    organization: 'Coastal Conservation Association Texas',
    location: 'Port Mansfield',
    impact: 'Helped restore 12 acres of critical coastal dune habitat, protecting nesting sites for sea turtles and shorebirds while preventing coastal erosion.',
    funds: '$12,000',
    timeline: '2023-2025',
    image: '🏖️'
  },
  {
    title: 'Marine Education Program',
    organization: 'Texas Master Naturalist - RGV Chapter',
    location: 'Brownsville ISD',
    impact: 'Funded marine conservation education for 2,500+ students, creating the next generation of ocean stewards in the Rio Grande Valley.',
    funds: '$8,250',
    timeline: '2023-2025',
    image: '🎓'
  },
  {
    title: 'Bird Habitat Preservation',
    organization: 'Laguna Atascosa National Wildlife Refuge',
    location: 'Los Fresnos',
    impact: 'Protected critical wetland habitats serving as stopover points for 200+ migratory bird species and home to coastal marine life.',
    funds: '$14,000',
    timeline: '2022-2025',
    image: '🦩'
  }
]

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-700 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Conservation Impact
          </h1>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            Every bracelet purchased contributes directly to protecting marine life 
            in the Rio Grande Valley and South Padre Island.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-16 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Featured Conservation Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-cyan-50 flex items-center justify-center text-6xl p-8">
                  {project.image}
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      <p className="text-teal-600 font-medium">{project.organization}</p>
                    </div>
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {project.funds}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {project.impact}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">📍 {project.location}</span>
                    <span className="flex items-center gap-1">📅 {project.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of ocean lovers who are protecting marine life one bracelet at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-block bg-teal-600 text-white px-10 py-4 rounded-full font-bold hover:bg-teal-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Shop All Bracelets
            </Link>
            <Link
              href="/conservation/partners"
              className="inline-block border-2 border-teal-600 text-teal-600 px-10 py-4 rounded-full font-bold hover:bg-teal-50 transition-all"
            >
              🤝 Meet Our Partners
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
