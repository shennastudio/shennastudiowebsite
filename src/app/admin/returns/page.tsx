'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Truck,
  DollarSign,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface ReturnItem {
  id: string;
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  condition?: string;
  restockable: boolean;
}

interface Return {
  id: string;
  returnNumber: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  reason: string;
  reasonDetails?: string;
  status: string;
  refundAmount?: number;
  refundMethod?: string;
  returnTrackingNumber?: string;
  createdAt: string;
  order: {
    orderNumber: string;
    total: number;
    createdAt: string;
  };
  items: ReturnItem[];
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  received: number;
  refunded: number;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  RECEIVED: 'bg-purple-100 text-purple-800',
  INSPECTING: 'bg-indigo-100 text-indigo-800',
  REFUND_PENDING: 'bg-orange-100 text-orange-800',
  REFUNDED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

const REASON_LABELS: Record<string, string> = {
  DEFECTIVE: 'Defective Product',
  WRONG_ITEM: 'Wrong Item Received',
  NOT_AS_DESCRIBED: 'Not as Described',
  CHANGED_MIND: 'Changed Mind',
  SIZE_ISSUE: 'Size Issue',
  QUALITY_ISSUE: 'Quality Issue',
  ARRIVED_LATE: 'Arrived Late',
  OTHER: 'Other',
};

export default function ReturnsPage() {
  const router = useRouter();
  const [returns, setReturns] = useState<Return[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, received: 0, refunded: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadReturns = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/returns?${params}`);
      if (!response.ok) throw new Error('Failed to load returns');

      const data = await response.json();
      setReturns(data.returns);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Load returns error:', error);
      toast.error('Failed to load returns');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const updateReturnStatus = async (returnId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/returns/${returnId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update return');

      toast.success(`Return ${newStatus.toLowerCase().replace('_', ' ')}`);
      loadReturns();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Update return error:', error);
      toast.error('Failed to update return status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
          <h1 className="text-2xl font-bold text-gray-900">Returns & Refunds</h1>
          <p className="text-gray-500 mt-1">Manage return requests and process refunds</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-600 uppercase">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 uppercase">Approved</p>
                <p className="text-2xl font-bold text-blue-700">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 uppercase">Received</p>
                <p className="text-2xl font-bold text-purple-700">{stats.received}</p>
              </div>
              <Truck className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 uppercase">Refunded</p>
                <p className="text-2xl font-bold text-green-700">{stats.refunded}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
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
                placeholder="Search by return #, order #, customer..."
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
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="RECEIVED">Received</option>
                <option value="INSPECTING">Inspecting</option>
                <option value="REFUND_PENDING">Refund Pending</option>
                <option value="REFUNDED">Refunded</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <Button variant="outline" onClick={() => loadReturns()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Returns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Return Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : returns.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No returns found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Return #</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.map((returnItem) => (
                    <tr key={returnItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{returnItem.returnNumber.slice(0, 8)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => router.push(`/admin/orders/${returnItem.orderId}`)}
                          className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                        >
                          #{returnItem.order.orderNumber.slice(0, 8)}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-sm">{returnItem.customerName}</p>
                          <p className="text-xs text-gray-500">{returnItem.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{REASON_LABELS[returnItem.reason] || returnItem.reason}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{formatCurrency(returnItem.refundAmount || 0)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[returnItem.status]}`}>
                          {returnItem.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(returnItem.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReturn(returnItem);
                            setShowDetailModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
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

      {/* Return Detail Modal */}
      {showDetailModal && selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Return #{selectedReturn.returnNumber.slice(0, 8)}</h2>
                  <p className="text-gray-500 text-sm">Order #{selectedReturn.order.orderNumber.slice(0, 8)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[selectedReturn.status]}`}>
                  {selectedReturn.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{selectedReturn.customerName}</p>
                  <p className="text-gray-600">{selectedReturn.customerEmail}</p>
                </div>
              </div>

              {/* Return Reason */}
              <div>
                <h3 className="font-semibold mb-2">Return Reason</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{REASON_LABELS[selectedReturn.reason]}</p>
                  {selectedReturn.reasonDetails && (
                    <p className="text-gray-600 mt-2">{selectedReturn.reasonDetails}</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-2">Return Items</h3>
                <div className="space-y-2">
                  {selectedReturn.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        {item.variantName && <p className="text-sm text-gray-500">{item.variantName}</p>}
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.unitPrice * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refund Amount */}
              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-teal-800">Total Refund Amount</span>
                  <span className="text-xl font-bold text-teal-700">
                    {formatCurrency(selectedReturn.refundAmount || 0)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {selectedReturn.status === 'PENDING' && (
                  <>
                    <Button
                      onClick={() => updateReturnStatus(selectedReturn.id, 'APPROVED')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Return
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateReturnStatus(selectedReturn.id, 'REJECTED')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Return
                    </Button>
                  </>
                )}
                {selectedReturn.status === 'APPROVED' && (
                  <Button
                    onClick={() => updateReturnStatus(selectedReturn.id, 'RECEIVED')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Mark as Received
                  </Button>
                )}
                {selectedReturn.status === 'RECEIVED' && (
                  <Button
                    onClick={() => updateReturnStatus(selectedReturn.id, 'INSPECTING')}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Start Inspection
                  </Button>
                )}
                {(selectedReturn.status === 'INSPECTING' || selectedReturn.status === 'REFUND_PENDING') && (
                  <Button
                    onClick={() => updateReturnStatus(selectedReturn.id, 'REFUNDED')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Process Refund
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
