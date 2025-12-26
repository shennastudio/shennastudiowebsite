import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import LogoutButton from '@/components/customer/LogoutButton';

async function getCustomerData(userId: string) {
  const [user, orders, rewards] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    }),
    prisma.customerReward.findUnique({
      where: { userId },
      include: {
        achievements: {
          include: {
            achievement: true,
          },
        },
        pointTransactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    }),
  ]);

  return { user, orders, rewards };
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'CUSTOMER') {
    redirect('/login');
  }

  const { user, orders, rewards } = await getCustomerData(session.user.id);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'bg-amber-700 text-amber-100';
      case 'Silver': return 'bg-gray-400 text-gray-900';
      case 'Gold': return 'bg-yellow-500 text-yellow-900';
      case 'Platinum': return 'bg-purple-600 text-purple-100';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-cyan-100 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rewards Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Rewards</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTierColor(rewards?.currentTier || 'Bronze')}`}>
                  {rewards?.currentTier || 'Bronze'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg">
                  <div className="text-4xl font-bold text-teal-600">{rewards?.points || 0}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{rewards?.totalOrders || 0}</div>
                    <div className="text-xs text-gray-600">Orders</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">${(rewards?.totalSpent || 0).toFixed(2)}</div>
                    <div className="text-xs text-gray-600">Spent</div>
                  </div>
                </div>

                <Link
                  href="/account/rewards"
                  className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition-colors"
                >
                  🎁 View All Rewards
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link href="/account/orders" className="block text-teal-600 hover:text-teal-700">
                  📦 Order History
                </Link>
                <Link href="/account/rewards" className="block text-teal-600 hover:text-teal-700">
                  🏆 Rewards & Achievements
                </Link>
                <Link href="/products" className="block text-teal-600 hover:text-teal-700">
                  🌊 Shop Products
                </Link>
                <Link href="/conservation" className="block text-teal-600 hover:text-teal-700">
                  🐢 Conservation Impact
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌊</div>
                  <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
                  <Link
                    href="/products"
                    className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.variant.product.name} x {item.quantity}
                            </span>
                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="font-semibold">Total: ${order.total.toFixed(2)}</span>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="text-teal-600 hover:text-teal-700 text-sm font-semibold"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}

                  {orders.length > 0 && (
                    <Link
                      href="/account/orders"
                      className="block text-center text-teal-600 hover:text-teal-700 font-semibold mt-4"
                    >
                      View All Orders →
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Recent Points */}
            {rewards && rewards.pointTransactions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Recent Point Activity</h2>
                <div className="space-y-3">
                  {rewards.pointTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-lg font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
