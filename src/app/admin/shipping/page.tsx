'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Search,
  Filter,
  Truck,
  Printer,
  CheckCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface ShippingLabel {
  id: string;
  orderId?: string;
  carrier: string;
  service: string;
  trackingNumber?: string;
  labelUrl?: string;
  cost: number;
  weight?: number;
  status: string;
  createdAt: string;
  printedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  order?: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZip: string;
    status: string;
  };
}

interface Stats {
  total: number;
  created: number;
  printed: number;
  shipped: number;
  delivered: number;
  ordersReady: number;
}

const STATUS_COLORS: Record<string, string> = {
  created: 'bg-gray-100 text-gray-800',
  printed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  void: 'bg-red-100 text-red-800',
};

const CARRIER_ICONS: Record<string, string> = {
  USPS: '📮',
  FedEx: '📦',
  UPS: '🟤',
  DHL: '🟡',
};

export default function ShippingPage() {
  const [labels, setLabels] = useState<ShippingLabel[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, created: 0, printed: 0, shipped: 0, delivered: 0, ordersReady: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadLabels = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/shipping?${params}`);
      if (!response.ok) throw new Error('Failed to load shipping labels');

      const data = await response.json();
      setLabels(data.labels);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Load labels error:', error);
      toast.error('Failed to load shipping labels');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    loadLabels();
  }, [loadLabels]);

  const updateLabelStatus = async (labelId: string, newStatus: string, trackingNumber?: string) => {
    try {
      const response = await fetch(`/api/admin/shipping/${labelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, trackingNumber }),
      });

      if (!response.ok) throw new Error('Failed to update label');

      toast.success(`Label marked as ${newStatus}`);
      loadLabels();
    } catch (error) {
      console.error('Update label error:', error);
      toast.error('Failed to update label status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping Management</h1>
          <p className="text-gray-500 mt-1">Create and manage shipping labels</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600 uppercase">Ready to Ship</p>
                <p className="text-2xl font-bold text-orange-700">{stats.ordersReady}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Created</p>
                <p className="text-2xl font-bold text-gray-700">{stats.created}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 uppercase">Printed</p>
                <p className="text-2xl font-bold text-blue-700">{stats.printed}</p>
              </div>
              <Printer className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 uppercase">Shipped</p>
                <p className="text-2xl font-bold text-purple-700">{stats.shipped}</p>
              </div>
              <Truck className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 uppercase">Delivered</p>
                <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-teal-600 uppercase">Total Labels</p>
                <p className="text-2xl font-bold text-teal-700">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tracking #, order #, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="created">Created</option>
                <option value="printed">Printed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="void">Void</option>
              </select>
            </div>
            <Button variant="outline" onClick={() => loadLabels()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Labels Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Labels</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : labels.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No shipping labels found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Carrier</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Tracking</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Destination</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Cost</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((label) => (
                    <tr key={label.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {label.order ? (
                          <div>
                            <p className="font-medium text-sm">#{label.order.orderNumber.slice(0, 8)}</p>
                            <p className="text-xs text-gray-500">{label.order.customerName}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No order</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{CARRIER_ICONS[label.carrier] || '📦'}</span>
                          <div>
                            <p className="font-medium text-sm">{label.carrier}</p>
                            <p className="text-xs text-gray-500">{label.service}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {label.trackingNumber ? (
                          <span className="font-mono text-sm">{label.trackingNumber}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {label.order ? (
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm">{label.order.shippingCity}, {label.order.shippingState}</p>
                              <p className="text-xs text-gray-500">{label.order.shippingZip}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{formatCurrency(label.cost)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[label.status]}`}>
                          {label.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(label.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-1">
                          {label.labelUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(label.labelUrl, '_blank')}
                              title="View Label"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                          {label.status === 'created' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateLabelStatus(label.id, 'printed')}
                              title="Mark as Printed"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          )}
                          {label.status === 'printed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateLabelStatus(label.id, 'shipped')}
                              title="Mark as Shipped"
                            >
                              <Truck className="w-4 h-4" />
                            </Button>
                          )}
                          {label.status === 'shipped' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateLabelStatus(label.id, 'delivered')}
                              title="Mark as Delivered"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
