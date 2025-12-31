'use client';

import { useEffect, useState, useCallback } from 'react';
import { Package, AlertTriangle, TrendingUp, DollarSign, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Image from 'next/image';

interface InventoryData {
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: Array<{
        url: string;
        alt: string | null;
      }>;
    };
  }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    quantity: number;
    notes: string | null;
    createdAt: Date;
    variant: {
      name: string;
      sku: string;
      product: {
        name: string;
      };
    };
    user: {
      name: string | null;
      email: string;
    } | null;
  }>;
  summary: {
    totalVariants: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalStock: number;
    stockValue: number;
  };
}

export default function InventoryPage() {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InventoryData | null>(null);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'RESTOCK' | 'ADJUSTMENT'>('RESTOCK');
  const [adjustmentQty, setAdjustmentQty] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/inventory?filter=${filter}`);

      if (!response.ok) throw new Error('Failed to fetch inventory');

      const inventoryData = await response.json();
      setData(inventoryData);
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  async function handleAdjustment(variantId: string) {
    if (adjustmentQty === 0) {
      toast.error('Quantity cannot be zero');
      return;
    }

    try {
      const response = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          type: adjustmentType,
          quantity: adjustmentQty,
          reason: adjustmentReason || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Adjustment failed');
      }

      toast.success('Stock adjusted successfully');
      setAdjusting(null);
      setAdjustmentQty(0);
      setAdjustmentReason('');
      fetchInventory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to adjust stock');
    }
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-slate-700 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Inventory Management</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Track stock levels, adjust inventory, and view transaction history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Variants</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.summary.totalVariants}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.summary.totalStock}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">units</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{data.summary.lowStockCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">≤ 10 units</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Stock Value</p>
              <p className="text-2xl font-bold text-teal-600">
                ${data.summary.stockValue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'low_stock', 'out_of_stock'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-teal-600 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            {f === 'all' ? 'All' : f === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="p-4 border-b dark:border-slate-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Stock Levels</h2>
            </div>
            <div className="divide-y dark:divide-slate-700 max-h-[600px] overflow-y-auto">
              {data.variants.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">No variants found</div>
              ) : (
                data.variants.map((variant) => (
                  <div key={variant.id} className="p-4">
                    <div className="flex items-start gap-4">
                      {variant.product.images.length > 0 && variant.product.images[0]?.url && (
                        <Image
                          src={variant.product.images[0].url}
                          alt={variant.product.images[0].alt || variant.product.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {variant.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {variant.name} • SKU: {variant.sku}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              variant.stock === 0
                                ? 'bg-red-100 text-red-700'
                                : variant.stock <= 10
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {variant.stock} in stock
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ${variant.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAdjusting(variant.id);
                          setAdjustmentQty(0);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>

                    {/* Adjustment Form */}
                    {adjusting === variant.id && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Type
                            </label>
                            <select
                              value={adjustmentType}
                              onChange={(e) => setAdjustmentType(e.target.value as 'RESTOCK' | 'ADJUSTMENT')}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                            >
                              <option value="RESTOCK">Add Stock</option>
                              <option value="ADJUSTMENT">Set Stock</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              value={adjustmentQty}
                              onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Reason (Optional)
                          </label>
                          <input
                            type="text"
                            value={adjustmentReason}
                            onChange={(e) => setAdjustmentReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                            placeholder="e.g., Damaged items, new shipment"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAdjustment(variant.id)}
                            className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700"
                          >
                            Apply
                          </button>
                          <button
                            onClick={() => setAdjusting(null)}
                            className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 sticky top-6">
            <div className="p-4 border-b dark:border-slate-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <div className="divide-y dark:divide-slate-700 max-h-[600px] overflow-y-auto">
              {data.recentTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">No activity yet</div>
              ) : (
                data.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'RESTOCK'
                            ? 'bg-green-100 text-green-700'
                            : transaction.type === 'SALE'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {transaction.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(transaction.createdAt), 'MMM dd, HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.variant.product.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {transaction.variant.name} • {transaction.variant.sku}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {transaction.type === 'RESTOCK' ? '+' : '-'}
                      {transaction.quantity} units
                    </p>
                    {transaction.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{transaction.notes}</p>
                    )}
                    {transaction.user && (
                      <p className="text-xs text-gray-400 mt-2">
                        By {transaction.user.name || transaction.user.email}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
