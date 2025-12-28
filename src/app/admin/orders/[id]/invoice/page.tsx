'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceTemplate } from '@/components/admin/InvoiceTemplate';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  async function fetchOrder() {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}/invoice`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        toast.error(data.error || 'Failed to fetch order');
      }
    } catch (error) {
      console.error('Fetch order error:', error);
      toast.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${order?.orderNumber || 'Unknown'}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const handleDownloadPDF = async () => {
    // For now, use print and "Save as PDF"
    // In the future, can integrate jspdf for direct PDF generation
    handlePrint();
    toast.success('Use "Save as PDF" in the print dialog to download');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Order not found</p>
        <Button onClick={() => router.push('/admin/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <Button onClick={() => router.push('/admin/orders')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>

        {/* Invoice Preview */}
        <Card>
          <CardContent className="p-0">
            <InvoiceTemplate ref={invoiceRef} order={order} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
