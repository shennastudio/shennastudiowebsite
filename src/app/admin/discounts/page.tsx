'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, Plus, Copy, Clock, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Discount {
  id: string;
  code: string;
  type: string;
  value: number;
  description?: string;
  usageLimit?: number;
  usageCount: number;
  totalUsages: number;
  remainingUses?: number | null;
  startsAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export default function DiscountsPage() {
  const router = useRouter();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // active, expired, all

  useEffect(() => {
    fetchDiscounts();
  }, [filter]);

  async function fetchDiscounts() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/discounts?status=${filter}`);

      if (!response.ok) {
        throw new Error('Failed to fetch discounts');
      }

      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast.error('Failed to load discount codes');
    } finally {
      setLoading(false);
    }
  }

  async function deleteDiscount(id: string) {
    if (!confirm('Are you sure you want to delete this discount code?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/discounts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete discount');
      }

      toast.success('Discount code deleted');
      fetchDiscounts();
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast.error('Failed to delete discount code');
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/admin/discounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update discount');
      }

      toast.success(`Discount ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchDiscounts();
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error('Failed to update discount code');
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  }

  function getDiscountLabel(type: string, value: number) {
    switch (type) {
      case 'PERCENTAGE':
        return `${value}% off`;
      case 'FIXED_AMOUNT':
        return `$${value} off`;
      case 'FREE_SHIPPING':
        return 'Free Shipping';
      case 'BUY_X_GET_Y':
        return `Buy ${value} get 1 free`;
      default:
        return type;
    }
  }

  function isExpired(discount: Discount) {
    if (!discount.expiresAt) return false;
    return new Date(discount.expiresAt) < new Date();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discount Codes</h1>
          <p className="text-gray-600 mt-1">
            Create and manage promotional discount codes
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/discounts/new')}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Discount
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['active', 'expired', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Discounts List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      ) : discounts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No discount codes found</p>
          <button
            onClick={() => router.push('/admin/discounts/new')}
            className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
          >
            Create your first discount code
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {discounts.map((discount) => (
            <div
              key={discount.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <code className="text-lg font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">
                        {discount.code}
                      </code>
                      <button
                        onClick={() => copyCode(discount.code)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                      {getDiscountLabel(discount.type, discount.value)}
                    </span>

                    {discount.isActive && !isExpired(discount) ? (
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Active
                      </span>
                    ) : isExpired(discount) ? (
                      <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Expired
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        <X className="w-4 h-4" />
                        Inactive
                      </span>
                    )}
                  </div>

                  {discount.description && (
                    <p className="text-gray-600 mb-3">{discount.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {discount.usageLimit && (
                      <span>
                        Usage: {discount.totalUsages} / {discount.usageLimit}
                        {discount.remainingUses !== null && (
                          <span className="ml-1">
                            ({discount.remainingUses} remaining)
                          </span>
                        )}
                      </span>
                    )}
                    {!discount.usageLimit && (
                      <span>Usage: {discount.totalUsages} (Unlimited)</span>
                    )}
                    {discount.expiresAt && (
                      <span>
                        Expires: {format(new Date(discount.expiresAt), 'MMM dd, yyyy')}
                      </span>
                    )}
                    {!discount.expiresAt && <span>No expiry</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleActive(discount.id, discount.isActive)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      discount.isActive
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                    }`}
                  >
                    {discount.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/discounts/${discount.id}/edit`)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit discount"
                  >
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteDiscount(discount.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete discount"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
