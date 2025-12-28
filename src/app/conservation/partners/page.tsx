import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Conservation Partners | ShennaStudio',
  description: 'Meet our conservation partners in Rio Grande Valley and South Padre Island working to protect marine life.',
}

const partners = [
  {
    name: 'Sea Turtle Inc.',
    location: 'South Padre Island, TX',
    description: 'Dedicated to the conservation and rehabilitation of sea turtles and their marine habitats. They rescue, rehabilitate, and release endangered sea turtles back into the wild.',
    focus: 'Sea turtle rescue and rehabilitation',
    website: 'seaturtleinc.com',
    logo: '🌊🪼'
  },
  {
    name: 'Rio Grande Valley Birding Festival',
    location: 'Harlingen, TX',
    description: 'Annual festival that promotes bird conservation and habitat preservation in the Rio Grande Valley, supporting both coastal and inland bird species.',
    focus: 'Bird habitat preservation',
    website: 'rgvbirdingfestival.org',
    logo: '🦅'
  },
  {
    name: 'Gladys Porter Zoo Conservation',
    location: 'Brownsville, TX',
    description: 'Leading conservation efforts for endangered species through breeding programs, habitat restoration, and community education programs.',
    focus: 'Endangered species protection',
    website: 'gpz.org',
    logo: '🦁'
  },
  {
    name: 'Coastal Conservation Association Texas',
    location: 'Statewide (RGV Chapter)',
    description: 'Working to protect marine resources and ensure healthy coastal ecosystems through habitat restoration and sustainable fishing practices.',
    focus: 'Coastal ecosystem protection',
    website: 'ccatexas.org',
    logo: '🌊'
  },
  {
    name: 'Laguna Atascosa National Wildlife Refuge',
    location: 'Los Fresnos, TX',
    description: 'Protecting critical coastal habitats including wetlands, prairies, and shorelines that support diverse marine and bird species.',
    focus: 'Wetland and coastal habitat preservation',
    website: 'fws.gov/refuge/laguna_atascosa',
    logo: '🦩'
  },
  {
    name: 'Texas Master Naturalist - Rio Grande Valley Chapter',
    location: 'Rio Grande Valley, TX',
    description: 'Trained volunteers dedicated to education, outreach, and service to help manage natural resources and natural areas in the region.',
    focus: 'Environmental education and volunteer work',
    website: 'rgvmn.org',
    logo: '🌱'
  }
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-teal-600 to-cyan-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Conservation Partners
          </h1>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            We collaborate with leading organizations in the Rio Grande Valley 
            to protect our oceans and coastal ecosystems.
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl bg-cyan-50 w-16 h-16 rounded-xl flex items-center justify-center">
                    {partner.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{partner.name}</h3>
                    <p className="text-sm text-teal-600 font-medium">{partner.location}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                  {partner.description}
                </p>
                
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-900">Focus:</span>
                    <span className="text-gray-600">{partner.focus}</span>
                  </div>
                  <a
                    href={`https://${partner.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-teal-600 font-bold hover:text-teal-700 transition-colors"
                  >
                    Visit Website ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner with Us */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-4 bg-teal-50 rounded-full text-teal-600 mb-6">
            <span className="text-3xl">🤝</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Become a Conservation Partner
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Are you a marine conservation organization working in South Texas?
            We&apos;d love to learn about your work and explore collaboration opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-teal-600 text-white px-10 py-4 rounded-full font-bold hover:bg-teal-700 transition-all transform hover:scale-105"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
