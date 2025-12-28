'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, MapPin, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    quantity: number;
    price: number;
    variant: {
      name: string;
      product: {
        name: string;
        images: Array<{
          url: string;
          alt: string | null;
        }>;
      };
    };
  }>;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  async function fetchOrders() {
    try {
      const response = await fetch('/api/customer/orders');
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-teal-600">{orders.length}</p>
                </div>
                <Package className="w-10 h-10 text-teal-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-teal-600">${totalSpent.toFixed(2)}</p>
                </div>
                <DollarSign className="w-10 h-10 text-teal-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {new Date(session.user.createdAt || Date.now()).getFullYear()}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-teal-500 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            <Link
              href="/"
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Continue Shopping →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No orders yet</p>
              <Link
                href="/products"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="flex gap-4 overflow-x-auto">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex-shrink-0">
                        {item.variant.product.images[0]?.url ? (
                          <Image
                            src={item.variant.product.images[0].url}
                            alt={item.variant.product.images[0].alt || item.variant.product.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <p className="text-gray-600">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                    </p>
                    <p className="text-teal-600 font-semibold">View Details →</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {orders.length > 5 && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Showing {recentOrders.length} of {orders.length} orders
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
