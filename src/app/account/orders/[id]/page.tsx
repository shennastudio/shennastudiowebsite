'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Truck, MapPin, Calendar, DollarSign, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderDetails {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  status: string;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    variant: {
      name: string;
      product: {
        name: string;
        conservationPercentage: number;
        images: Array<{
          url: string;
          alt: string | null;
        }>;
      };
    };
  }>;
  conservationDonation: {
    amount: number;
    percentage: number;
    organization: string | null;
    region: string | null;
    status: string;
    partner: {
      name: string;
      website: string | null;
    } | null;
  } | null;
}

export default function OrderDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      fetchOrder();
    }
  }, [session, params.id]);

  async function fetchOrder() {
    try {
      const response = await fetch(`/api/customer/orders/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        toast.error(data.error || 'Failed to fetch order');
        router.push('/account');
      }
    } catch (error) {
      console.error('Fetch order error:', error);
      toast.error('Failed to fetch order');
      router.push('/account');
    } finally {
      setLoading(false);
    }
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

  function getTrackingUrl() {
    if (!order?.trackingNumber || !order?.carrier) return null;

    const carriers: Record<string, string> = {
      USPS: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`,
      FedEx: `https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`,
      UPS: `https://www.ups.com/track?tracknum=${order.trackingNumber}`,
    };

    return carriers[order.carrier] || null;
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!session || !order) {
    return null;
  }

  const trackingUrl = getTrackingUrl();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          {/* Shipping Status */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Shipping Status</h3>
                <p className="text-sm text-gray-600">
                  {order.status === 'DELIVERED'
                    ? `Delivered on ${new Date(order.deliveredAt!).toLocaleDateString()}`
                    : order.status === 'SHIPPED'
                    ? `Shipped on ${new Date(order.shippedAt!).toLocaleDateString()}`
                    : order.status === 'PROCESSING'
                    ? 'Processing your order'
                    : 'Awaiting confirmation'}
                </p>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-4 pt-4 border-t border-teal-200">
                <p className="text-sm text-gray-600 mb-2">
                  Carrier: <span className="font-semibold">{order.carrier}</span>
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Tracking Number: <span className="font-mono font-semibold">{order.trackingNumber}</span>
                </p>
                {trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Track Package →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                {item.variant.product.images[0]?.url ? (
                  <Image
                    src={item.variant.product.images[0].url}
                    alt={item.variant.product.images[0].alt || item.variant.product.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.variant.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{item.variant.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ${(item.price * item.quantity).toFixed(2)} total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-gray-700">
              <p className="font-semibold">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingCity}, {order.shippingState} {order.shippingZip}
              </p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conservation Impact */}
        {order.conservationDonation && (
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-md p-8 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Conservation Impact</h2>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-semibold text-green-600">
                  ${order.conservationDonation.amount.toFixed(2)}
                </span>{' '}
                ({order.conservationDonation.percentage}%) from this order supports{' '}
                <span className="font-semibold">
                  {order.conservationDonation.organization || 'marine conservation'}
                </span>
                {order.conservationDonation.region && (
                  <> in {order.conservationDonation.region}</>
                )}
              </p>
              {order.conservationDonation.partner && (
                <p className="text-sm text-gray-600">
                  Partner: {order.conservationDonation.partner.name}
                  {order.conservationDonation.partner.website && (
                    <>
                      {' '}
                      •{' '}
                      <a
                        href={order.conservationDonation.partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline"
                      >
                        Learn More
                      </a>
                    </>
                  )}
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-green-200">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    order.conservationDonation.status === 'DONATED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.conservationDonation.status === 'DONATED'
                    ? '✓ Donation Completed'
                    : 'Donation Pending'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Print Receipt Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.print()}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
