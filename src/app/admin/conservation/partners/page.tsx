import { useEffect, useState } from 'react';
import { Plus, ExternalLink, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Partner {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  contactEmail?: string;
  location?: string;
  focusAreas?: string[];
  totalDonations: number;
  totalPledged: number;
  totalDonated: number;
  _count: {
    donations: number;
  };
  createdAt: Date;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    contactEmail: '',
    location: '',
    focusAreas: [] as string[],
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/conservation/partners');

      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }

      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error('Name and description are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/conservation/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          focusAreas: formData.focusAreas.length > 0 ? formData.focusAreas : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create partner');
      }

      toast.success('Partner organization created');
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        logo: '',
        website: '',
        contactEmail: '',
        location: '',
        focusAreas: [],
      });
      fetchPartners();
    } catch (error) {
      console.error('Error creating partner:', error);
      toast.error('Failed to create partner organization');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partner Organizations</h1>
          <p className="text-gray-600 mt-1">
            Manage conservation partners receiving donations
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Partner'}
        </button>
      </div>

      {/* Add Partner Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">Add Partner Organization</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ocean Conservation Alliance"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Mission and focus of the organization..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="https://example.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="contact@example.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="South Padre Island, TX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="https://example.org/logo.png"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Add Partner
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Partners List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No partner organizations yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
          >
            Add your first partner organization
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-6">
                {partner.logo && (
                  <div className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{partner.name}</h3>
                      {partner.location && (
                        <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4" />
                          {partner.location}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink className="w-5 h-5 text-gray-600" />
                        </a>
                      )}
                      {partner.contactEmail && (
                        <a
                          href={`mailto:${partner.contactEmail}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Send email"
                        >
                          <Mail className="w-5 h-5 text-gray-600" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{partner.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="bg-teal-50 px-4 py-2 rounded-lg">
                      <p className="text-xs text-teal-600 font-medium">Total Donations</p>
                      <p className="text-lg font-bold text-teal-700">
                        ${partner.totalDonations.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-lg">
                      <p className="text-xs text-green-600 font-medium">Donated</p>
                      <p className="text-lg font-bold text-green-700">
                        ${partner.totalDonated.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                      <p className="text-xs text-yellow-600 font-medium">Pledged</p>
                      <p className="text-lg font-bold text-yellow-700">
                        ${partner.totalPledged.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">Donations</p>
                      <p className="text-lg font-bold text-gray-700">
                        {partner._count.donations}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
