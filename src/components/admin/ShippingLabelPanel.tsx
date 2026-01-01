'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  Truck,
  Printer,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { OrderDetail } from '@/types';

interface ShippingRate {
  id: string;
  provider: string;
  servicelevel: {
    name: string;
    token: string;
  };
  amount: string;
  currency: string;
  estimated_days: number | null;
  duration_terms: string;
}

interface ShippingLabel {
  id: string;
  carrier: string;
  service: string;
  trackingNumber: string;
  labelUrl: string | null;
  cost: number;
  status: string;
  createdAt: string;
}

interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  statusDetails: string;
}

interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  status: string;
  statusDetails: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  trackingUrl?: string;
}

interface ShippingLabelPanelProps {
  order: OrderDetail;
  onLabelPurchased?: () => void;
}

export function ShippingLabelPanel({ order, onLabelPurchased }: ShippingLabelPanelProps) {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [label, setLabel] = useState<ShippingLabel | null>(null);
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState(false);
  const [purchasingLabel, setPurchasingLabel] = useState(false);
  const [loadingTracking, setLoadingTracking] = useState(false);

  // Fetch existing label on mount
  useEffect(() => {
    fetchExistingLabel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.id]);

  // Fetch tracking when label exists
  useEffect(() => {
    if (order.trackingNumber && order.carrier) {
      fetchTracking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.trackingNumber, order.carrier]);

  async function fetchExistingLabel() {
    setLoadingLabel(true);
    try {
      const res = await fetch(`/api/shipping/labels?orderId=${order.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.label) {
          setLabel(data.label);
        }
      }
    } catch (error) {
      console.error('Failed to fetch label:', error);
    } finally {
      setLoadingLabel(false);
    }
  }

  async function fetchRates() {
    setLoadingRates(true);
    setRates([]);
    setSelectedRate(null);

    try {
      // Calculate total weight from items
      const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

      const res = await fetch('/api/shipping/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            name: order.customerName,
            line1: order.shippingAddress,
            city: order.shippingCity,
            state: order.shippingState,
            postalCode: order.shippingZip,
            country: order.shippingCountry,
          },
          items: order.items.map(item => ({ quantity: item.quantity })),
          totalQuantity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRates(data.rates || []);
        if (data.rates?.length > 0) {
          setSelectedRate(data.rates[0]);
        }
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to fetch rates');
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      toast.error('Failed to fetch shipping rates');
    } finally {
      setLoadingRates(false);
    }
  }

  async function purchaseLabel() {
    if (!selectedRate) {
      toast.error('Please select a shipping rate');
      return;
    }

    setPurchasingLabel(true);
    try {
      const res = await fetch('/api/shipping/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          rateId: selectedRate.id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Shipping label purchased successfully!');
        setLabel({
          id: data.label.id,
          carrier: data.label.carrier,
          service: data.label.service,
          trackingNumber: data.label.trackingNumber,
          labelUrl: data.label.labelUrl,
          cost: data.label.cost,
          status: 'created',
          createdAt: new Date().toISOString(),
        });
        setRates([]);
        setSelectedRate(null);
        onLabelPurchased?.();
      } else {
        toast.error(data.error || 'Failed to purchase label');
      }
    } catch (error) {
      console.error('Failed to purchase label:', error);
      toast.error('Failed to purchase shipping label');
    } finally {
      setPurchasingLabel(false);
    }
  }

  async function fetchTracking() {
    setLoadingTracking(true);
    try {
      const res = await fetch(`/api/shipping/tracking?orderId=${order.id}`);
      if (res.ok) {
        const data = await res.json();
        setTracking(data);
      }
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
    } finally {
      setLoadingTracking(false);
    }
  }

  function getTrackingStatusColor(status: string) {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return 'text-green-600 bg-green-100';
      case 'TRANSIT':
        return 'text-blue-600 bg-blue-100';
      case 'FAILURE':
      case 'RETURNED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // If label already purchased, show label info and tracking
  if (label || order.trackingNumber) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shipping Label
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Label Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Label Purchased</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Carrier:</span>
                <p className="font-medium">{label?.carrier || order.carrier}</p>
              </div>
              <div>
                <span className="text-gray-600">Service:</span>
                <p className="font-medium">{label?.service || 'Standard'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Tracking Number:</span>
                <p className="font-medium font-mono">{label?.trackingNumber || order.trackingNumber}</p>
              </div>
              {label?.cost && (
                <div>
                  <span className="text-gray-600">Cost:</span>
                  <p className="font-medium">${label.cost.toFixed(2)}</p>
                </div>
              )}
            </div>
            {label?.labelUrl && (
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(label.labelUrl!, '_blank')}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Label
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(label.labelUrl!, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            )}
          </div>

          {/* Tracking Info */}
          {(order.trackingNumber || label?.trackingNumber) && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Tracking Updates
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchTracking}
                  disabled={loadingTracking}
                >
                  <RefreshCw className={`h-4 w-4 ${loadingTracking ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {loadingTracking ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : tracking ? (
                <div className="space-y-3">
                  {/* Current Status */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getTrackingStatusColor(tracking.status)}`}>
                      {tracking.status}
                    </span>
                    <span className="text-sm text-gray-600">{tracking.statusDetails}</span>
                  </div>

                  {tracking.estimatedDelivery && (
                    <p className="text-sm text-gray-600">
                      Estimated delivery: <span className="font-medium">{tracking.estimatedDelivery}</span>
                    </p>
                  )}

                  {/* Tracking Events */}
                  {tracking.events.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                      {tracking.events.slice(0, 5).map((event, index) => (
                        <div key={index} className="text-sm border-l-2 border-gray-200 pl-3">
                          <p className="font-medium">{event.statusDetails || event.status}</p>
                          <p className="text-gray-500">
                            {event.location && `${event.location} • `}
                            {event.date} {event.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {tracking.trackingUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open(tracking.trackingUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Track on Carrier Site
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Click refresh to load tracking info</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show rate selection and purchase UI
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Create Shipping Label
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shipping Address */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Ship To:</h4>
          <p className="text-sm">{order.customerName}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress}</p>
          <p className="text-sm text-gray-600">
            {order.shippingCity}, {order.shippingState} {order.shippingZip}
          </p>
          <p className="text-sm text-gray-600">{order.shippingCountry}</p>
        </div>

        {/* Get Rates Button */}
        {rates.length === 0 && (
          <Button
            onClick={fetchRates}
            disabled={loadingRates}
            className="w-full"
          >
            {loadingRates ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting Rates...
              </>
            ) : (
              <>
                <Truck className="h-4 w-4 mr-2" />
                Get Shipping Rates
              </>
            )}
          </Button>
        )}

        {/* Rate Selection */}
        {rates.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Select Shipping Service:</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {rates.map((rate) => (
                <div
                  key={rate.id}
                  onClick={() => setSelectedRate(rate)}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedRate?.id === rate.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={selectedRate?.id === rate.id}
                      onChange={() => setSelectedRate(rate)}
                      className="text-blue-600"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {rate.provider} {rate.servicelevel.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {rate.estimated_days
                          ? `${rate.estimated_days} business day${rate.estimated_days > 1 ? 's' : ''}`
                          : rate.duration_terms || 'Delivery time varies'}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">${rate.amount}</span>
                </div>
              ))}
            </div>

            {/* Purchase Button */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={purchaseLabel}
                disabled={!selectedRate || purchasingLabel}
                className="flex-1"
              >
                {purchasingLabel ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Purchasing...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Purchase Label {selectedRate && `($${selectedRate.amount})`}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRates([]);
                  setSelectedRate(null);
                }}
              >
                Cancel
              </Button>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>
                Make sure the shipping address is correct before proceeding.
                Label purchases cannot be undone.
              </p>
            </div>
          </div>
        )}

        {loadingLabel && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Loading label info...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
