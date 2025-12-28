'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, DollarSign, TrendingUp, Clock, Search, Filter, Truck, CheckCircle, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
  conservationDonation?: {
    amount: number;
    percentage: number;
  };
  trackingNumber?: string;
  carrier?: string;
}

interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-700';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-700';
    case 'DELIVERED':
      return 'bg-green-100 text-green-700';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<OrderSummary>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Bulk actions
  const [bulkAction, setBulkAction] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchQuery, dateFrom, dateTo, minAmount, maxAmount]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery) params.set('search', searchQuery);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      if (minAmount) params.set('minAmount', minAmount);
      if (maxAmount) params.set('maxAmount', maxAmount);

      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
        setSummary(data.summary);
      } else {
        toast.error(data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }

  function toggleOrderSelection(orderId: string) {
    const newSelection = new Set(selectedOrders);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedOrders(newSelection);
  }

  function toggleSelectAll() {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o.id)));
    }
  }

  async function handleBulkAction() {
    if (selectedOrders.size === 0) {
      toast.error('Please select at least one order');
      return;
    }

    if (!bulkAction) {
      toast.error('Please select an action');
      return;
    }

    if (bulkAction === 'mark_shipped' && !trackingNumber) {
      toast.error('Please enter a tracking number');
      return;
    }

    try {
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: Array.from(selectedOrders),
          action: bulkAction,
          trackingNumber: trackingNumber || undefined,
          carrier: carrier || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Updated ${data.updated} orders successfully`);
        if (data.failed > 0) {
          toast.error(`Failed to update ${data.failed} orders`);
        }
        setSelectedOrders(new Set());
        setBulkAction('');
        setTrackingNumber('');
        setCarrier('');
        fetchOrders();
      } else {
        toast.error(data.error || 'Failed to perform bulk action');
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Failed to perform bulk action');
    }
  }

  function clearFilters() {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setMinAmount('');
    setMaxAmount('');
    setStatusFilter('all');
  }

  const statusCounts = {
    all: summary.totalOrders,
    PENDING: orders.filter(o => o.status === 'PENDING').length,
    PROCESSING: orders.filter(o => o.status === 'PROCESSING').length,
    SHIPPED: orders.filter(o => o.status === 'SHIPPED').length,
    DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
    CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-gray-600 mt-1">Advanced filtering and bulk actions</p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Order #, email, or name..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium mb-1">Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium mb-1">Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Min Amount */}
              <div>
                <label className="block text-sm font-medium mb-1">Min Amount ($)</label>
                <input
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Max Amount */}
              <div>
                <label className="block text-sm font-medium mb-1">Max Amount ($)</label>
                <input
                  type="number"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="1000.00"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.averageOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-sm font-medium mb-2">
                  {selectedOrders.size} order{selectedOrders.size !== 1 ? 's' : ''} selected
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Action</label>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select action...</option>
                    <option value="mark_processing">Mark Processing</option>
                    <option value="mark_shipped">Mark Shipped</option>
                    <option value="mark_delivered">Mark Delivered</option>
                    <option value="cancel">Cancel Orders</option>
                  </select>
                </div>

                {bulkAction === 'mark_shipped' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tracking Number</label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="1Z999AA10123456784"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Carrier</label>
                      <select
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select carrier...</option>
                        <option value="USPS">USPS</option>
                        <option value="UPS">UPS</option>
                        <option value="FedEx">FedEx</option>
                        <option value="DHL">DHL</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleBulkAction} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Apply
                </Button>
                <Button onClick={() => setSelectedOrders(new Set())} variant="outline">
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Orders ({orders.length})</CardTitle>
            {orders.length > 0 && (
              <Button onClick={toggleSelectAll} variant="outline" size="sm">
                {selectedOrders.size === orders.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedOrders.size === orders.length}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="pb-3 font-semibold">Order #</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Items</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Tracking</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-4 font-mono text-sm">
                        #{order.orderNumber.slice(0, 8)}
                      </td>
                      <td className="py-4">
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-gray-600">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm">
                          {order.items.slice(0, 2).map((item: any, idx: number) => (
                            <div key={idx}>
                              {item.variant?.product?.name || 'Unknown'} x{item.quantity}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-gray-500">+{order.items.length - 2} more</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 font-medium">${order.total.toFixed(2)}</td>
                      <td className="py-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {order.trackingNumber ? (
                          <div className="text-sm">
                            <div className="font-mono">{order.trackingNumber}</div>
                            {order.carrier && (
                              <div className="text-gray-600">{order.carrier}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <Link href={`/admin/orders/${order.id}/invoice`}>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Invoice
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
