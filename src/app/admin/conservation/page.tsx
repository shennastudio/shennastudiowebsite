'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, DollarSign, TrendingUp, Users, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface ConservationData {
  period: string;
  summary: {
    totalPledged: number;
    totalDonated: number;
    totalDonations: number;
    totalOrders: number;
    averageDonation: number;
  };
  donationsByRegion: { [key: string]: { pledged: number; donated: number; total: number; count: number } };
  trendData: Array<{ date: string; amount: number; count: number }>;
  partners: Array<{
    id: string;
    name: string;
    description: string;
    logo?: string;
    website?: string;
    totalDonations: number;
    donationCount: number;
  }>;
  recentDonations: Array<{
    id: string;
    amount: number;
    status: string;
    region?: string;
    createdAt: Date;
    partner?: {
      name: string;
    };
  }>;
}

export default function ConservationPage() {
  const router = useRouter();
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ConservationData | null>(null);

  useEffect(() => {
    fetchConservationData();
  }, [period]);

  async function fetchConservationData() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/conservation/impact?period=${period}`);

      if (!response.ok) {
        throw new Error('Failed to fetch conservation data');
      }

      const conservationData = await response.json();
      setData(conservationData);
    } catch (error) {
      console.error('Error fetching conservation data:', error);
      toast.error('Failed to load conservation impact data');
    } finally {
      setLoading(false);
    }
  }

  const COLORS = ['#0d9488', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
        <div className="bg-gray-100 rounded-lg h-96 animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load conservation data</p>
      </div>
    );
  }

  const regionData = Object.entries(data.donationsByRegion).map(([region, stats]) => ({
    name: region,
    value: stats.total,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conservation Impact</h1>
          <p className="text-gray-600 mt-1">
            Track donations and partnerships for marine conservation🐙🐚🐡
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/conservation/partners')}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Users className="w-4 h-4" />
          Manage Partners
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {['today', 'week', 'month', 'year', 'all'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === p
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">
                ${data.summary.totalDonations.toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-teal-50 text-teal-600">
              <Heart className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Donated</p>
              <p className="text-2xl font-bold text-green-600">
                ${data.summary.totalDonated.toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Pledged</p>
              <p className="text-2xl font-bold text-yellow-600">
                ${data.summary.totalPledged.toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Average Donation</p>
              <p className="text-2xl font-bold text-gray-900">
                ${data.summary.averageDonation.toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
              <Heart className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Trend (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number | string | undefined) => {
                  if (value === undefined) return '$0.00';
                  const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                  return `$${numValue.toFixed(2)}`;
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#0d9488"
                strokeWidth={2}
                dot={{ fill: '#0d9488', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Donations"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donations by Region */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donations by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number | string | undefined) => {
                if (value === undefined) return '$0.00';
                const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                return `$${numValue.toFixed(2)}`;
              }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Partners & Recent Donations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partner Organizations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Partner Organizations</h3>
            <button
              onClick={() => router.push('/admin/conservation/partners')}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {data.partners.length > 0 ? (
              data.partners.slice(0, 5).map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{partner.name}</p>
                    <p className="text-sm text-gray-500">{partner.donationCount} donations</p>
                  </div>
                  <p className="font-semibold text-teal-600">
                    ${partner.totalDonations.toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No partner organizations yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
          <div className="space-y-3">
            {data.recentDonations.length > 0 ? (
              data.recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {donation.partner?.name || donation.region || 'General Fund'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(donation.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${donation.amount.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        donation.status === 'DONATED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No donations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
