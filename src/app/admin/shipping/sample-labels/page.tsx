'use client';

import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { USPSLabel, UPSLabel, FedExLabel } from '@/components/admin/ShippingLabel';
import { Printer, Download, Package, Truck, Package as PackageIcon } from 'lucide-react';

// Sample test data for label printing
const SAMPLE_ORDERS = [
  {
    id: '1',
    orderNumber: 'SHENA-001',
    customerName: 'Maria Garcia',
    shippingAddress: '1428 Ocean Drive',
    shippingAddress2: 'Apt 4B',
    shippingCity: 'South Padre Island',
    shippingState: 'TX',
    shippingZip: '78597',
    shippingCountry: 'US',
    customerPhone: '(555) 123-4567',
  },
  {
    id: '2',
    orderNumber: 'SHENA-002',
    customerName: 'James Thompson',
    shippingAddress: '2567 Coastal Highway',
    shippingAddress2: 'Suite 200',
    shippingCity: 'Galveston',
    shippingState: 'TX',
    shippingZip: '77550',
    shippingCountry: 'US',
    customerPhone: '(555) 234-5678',
  },
  {
    id: '3',
    orderNumber: 'SHENA-003',
    customerName: 'Sarah Williams',
    shippingAddress: '8901 Seashell Lane',
    shippingCity: 'Corpus Christi',
    shippingState: 'TX',
    shippingZip: '78401',
    shippingCountry: 'US',
  },
];

export default function SampleLabelsPage() {
  const [selectedCarrier, setSelectedCarrier] = useState<'USPS' | 'UPS' | 'FedEx'>('USPS');
  const [selectedOrder, setSelectedOrder] = useState(SAMPLE_ORDERS[0]);
  const labelRef = useRef<HTMLDivElement>(null);

  // Generate sample tracking numbers
  const generateTracking = (carrier: string) => {
    if (carrier === 'USPS') {
      return '9400' + Math.floor(Math.random() * 10000000000000000).toString().padStart(16, '0');
    } else if (carrier === 'FedEx') {
      return '7489' + Math.floor(Math.random() * 100000000000).toString().padStart(12, '0');
    } else {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return '1Z' + Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
  };

  const trackingNumber = generateTracking(selectedCarrier);

  const handlePrint = useReactToPrint({
    contentRef: labelRef,
    documentTitle: `${selectedCarrier}-Label-${selectedOrder.orderNumber}`,
    pageStyle: `
      @page {
        size: 4in 6in;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @page {
          size: 4in 6in;
          margin: 0;
        }
      }
    `,
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sample Shipping Labels</h1>
          <p className="text-gray-600">
            Generate and print sample 4x6 shipping labels for testing your bluetooth printer.
            These labels are sized for thermal printers.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Carrier Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Carrier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(['USPS', 'UPS', 'FedEx'] as const).map((carrier) => (
                <Button
                  key={carrier}
                  variant={selectedCarrier === carrier ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCarrier(carrier)}
                >
                  {carrier === 'USPS' && '📮'}
                  {carrier === 'UPS' && '📦'}
                  {carrier === 'FedEx' && '✈️'}
                  <span className="ml-2">{carrier}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Order Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PackageIcon className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SAMPLE_ORDERS.map((order) => (
                <Button
                  key={order.id}
                  variant={selectedOrder.id === order.id ? 'default' : 'outline'}
                  className="w-full justify-start text-sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  <span className="truncate">{order.customerName}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {order.shippingCity}
                  </span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Print Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Print Label
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <p><strong>Carrier:</strong> {selectedCarrier}</p>
                <p><strong>Tracking:</strong></p>
                <p className="font-mono text-xs break-all">{trackingNumber}</p>
              </div>
              <Button
                onClick={() => handlePrint?.()}
                className="w-full"
                variant="default"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print 4x6 Label
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Create SVG data URL for download
                  const svgContent = document.getElementById('label-svg-container')?.innerHTML;
                  if (svgContent) {
                    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedCarrier}-label-${selectedOrder.orderNumber}.svg`;
                    a.click();
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Label Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Label Preview (4x6 inches)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center bg-gray-200 p-8 rounded-lg">
              {/* Hidden reference for printing */}
              <div ref={labelRef} style={{ display: 'none' }}>
                {selectedCarrier === 'USPS' && (
                  <USPSLabel
                    order={selectedOrder}
                    trackingNumber={trackingNumber}
                    service="Priority Mail"
                    weight="0.5"
                  />
                )}
                {selectedCarrier === 'UPS' && (
                  <UPSLabel
                    order={selectedOrder}
                    trackingNumber={trackingNumber}
                    service="Ground"
                    weight="0.5"
                  />
                )}
                {selectedCarrier === 'FedEx' && (
                  <FedExLabel
                    order={selectedOrder}
                    trackingNumber={trackingNumber}
                    service="Ground"
                    weight="0.5"
                  />
                )}
              </div>

              {/* Visible preview (scaled) */}
              <div
                style={{
                  transform: 'scale(0.5)',
                  transformOrigin: 'top center',
                }}
              >
                {selectedCarrier === 'USPS' && (
                  <USPSLabel
                    order={selectedOrder}
                    trackingNumber={trackingNumber}
                    service="Priority Mail"
                    weight="0.5"
                  />
                )}
                {selectedCarrier === 'UPS' && (
                  <UPSLabel
                    order={selectedOrder}
                    trackingNumber={trackingNumber}
                    service="Ground"
                    weight="0.5"
                  />
                )}
                {selectedCarrier === 'FedEx' && (
                  <FedExLabel
                    order={selectedOrder}
                    trackingNumber={trackingNumber}
                    service="Ground"
                    weight="0.5"
                  />
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                Preview shown at 50% scale. Actual print size: 4&quot; x 6&quot;
              </p>
              <p className="mt-1">
                Configure your printer to use 4x6 inch label size with no margins.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bluetooth Printer Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bluetooth Printer Setup Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">For iOS/Android Mobile Printing:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Ensure Bluetooth is enabled on your device</li>
                  <li>Pair with the printer before printing</li>
                  <li>Select the printer in your app&apos;s print dialog</li>
                  <li>Set paper size to 4x6&quot; or &quot;4x6 Label&quot;</li>
                  <li>Disable &quot;Scale to Fit&quot; for exact sizing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Common Printer Settings:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Paper Type: Thermal (Direct Thermal)</li>
                  <li>Print Density: Medium-High</li>
                  <li>Print Speed: Medium</li>
                  <li>Mode: Label / Receipt</li>
                  <li>Gap / Black Mark: Depends on label type</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
