'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Package, TrendingUp, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchReport();
  }, [dateFrom, dateTo]);

  async function fetchReport() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);

      const response = await fetch(`/api/admin/reports/financial?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setReport(data);
      } else {
        toast.error(data.error || 'Failed to fetch report');
      }
    } catch (error) {
      console.error('Fetch report error:', error);
      toast.error('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    if (!report) return;

    const csv = [
      ['Financial Report'],
      [''],
      ['Period', `${dateFrom || 'All time'} to ${dateTo || 'Now'}`],
      [''],
      ['Summary'],
      ['Total Orders', report.summary.totalOrders],
      ['Total Revenue', `$${report.summary.totalRevenue.toFixed(2)}`],
      ['Subtotal', `$${report.summary.totalSubtotal.toFixed(2)}`],
      ['Shipping', `$${report.summary.totalShipping.toFixed(2)}`],
      ['Tax', `$${report.summary.totalTax.toFixed(2)}`],
      ['Conservation Donations', `$${report.summary.totalDonations.toFixed(2)}`],
      ['Net Revenue', `$${report.summary.netRevenue.toFixed(2)}`],
      [''],
      ['Top Products'],
      ['Product', 'Quantity Sold', 'Revenue'],
      ...report.topProducts.map((p: any) => [
        p.name,
        p.quantity,
        `$${p.revenue.toFixed(2)}`,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${Date.now()}.csv`;
    a.click();
    toast.success('Report exported to CSV');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading report...</p>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-gray-600 mt-1">View revenue, costs, and profitability</p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Date Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.summary.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${report.summary.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${report.summary.totalDonations.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${report.summary.netRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${report.summary.totalSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">${report.summary.totalShipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">${report.summary.totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-bold">Total Revenue</span>
              <span className="font-bold">${report.summary.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Conservation Donations</span>
              <span className="font-semibold">-${report.summary.totalDonations.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-bold">Net Revenue</span>
              <span className="font-bold">${report.summary.netRevenue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.topProducts.map((product: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.quantity} sold</p>
                  </div>
                  <span className="font-semibold">${product.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
