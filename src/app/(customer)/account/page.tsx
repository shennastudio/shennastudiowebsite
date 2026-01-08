import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section with Animation */}
        <div className="mb-4 sm:mb-8 group">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-700 via-teal-700 to-blue-700 bg-clip-text text-transparent animate-gradient">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-slate-600 text-sm sm:text-lg">Here&apos;s your ocean conservation journey</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-slate-500">Member since {new Date(user?.createdAt || '').getFullYear()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Rewards Card - Enhanced */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="group bg-gradient-to-br from-white to-cyan-50/50 rounded-xl sm:rounded-2xl shadow-xl shadow-cyan-200/30 border border-cyan-200/60 p-4 sm:p-6 hover:shadow-2xl hover:shadow-cyan-300/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Your Rewards</h2>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${getTierColor(rewards?.currentTier || 'Bronze')} animate-pulse`}>
                    {rewards?.currentTier || 'Bronze'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <div className="text-5xl font-black text-white drop-shadow-lg">{rewards?.points || 0}</div>
                    <div className="text-sm text-cyan-100 font-semibold mt-1">Reward Points</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200/60 shadow-md hover:shadow-lg transition-all">
                      <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">{rewards?.totalOrders || 0}</div>
                      <div className="text-xs text-slate-600 font-medium mt-1">Orders</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200/60 shadow-md hover:shadow-lg transition-all">
                      <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">${(rewards?.totalSpent || 0).toFixed(2)}</div>
                      <div className="text-xs text-slate-600 font-medium mt-1">Spent</div>
                    </div>
                  </div>

                  <Link
                    href="/account/rewards"
                    className="block w-full text-center bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <span className="flex items-center justify-center gap-2">
                      View All Rewards
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links - Enhanced */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse"></span>
                Quick Links
              </h2>
              <div className="space-y-2">
                {[
                  { href: '/account/orders', label: 'Order History', icon: '📦', color: 'from-blue-500 to-cyan-500' },
                  { href: '/account/rewards', label: 'Rewards & Achievements', icon: '🏆', color: 'from-amber-500 to-yellow-500' },
                  { href: '/products', label: 'Shop Products', icon: '🌊', color: 'from-teal-500 to-emerald-500' },
                  { href: '/conservation', label: 'Conservation Impact', icon: '🐢', color: 'from-green-500 to-teal-500' },
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 transition-all duration-200 border border-transparent hover:border-cyan-200/50"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-200">{link.icon}</span>
                    <span className="text-slate-700 group-hover:text-cyan-700 font-medium transition-colors">{link.label}</span>
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders - Enhanced */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Recent Orders</h2>
                {orders.length > 0 && (
                  <Link
                    href="/account/orders"
                    className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 group"
                  >
                    View All
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Orders Yet</h3>
                  <p className="text-slate-600 mb-6">Start your ocean conservation journey today!</p>
                  <Link
                    href="/products"
                    className="inline-block bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="group border border-slate-200/60 rounded-2xl p-5 hover:shadow-lg hover:border-cyan-300/50 transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-slate-900 text-lg">#{order.orderNumber}</p>
                          <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                            📅 {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 p-3 bg-white rounded-xl border border-slate-200/40">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-slate-700 font-medium">
                              {item.variant.product.name} <span className="text-slate-500">×{item.quantity}</span>
                            </span>
                            <span className="font-bold text-cyan-700">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-200/60">
                        <div>
                          <span className="text-sm text-slate-600">Total</span>
                          <p className="text-2xl font-black bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent">${order.total.toFixed(2)}</p>
                        </div>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="group/btn bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                          View Details
                          <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Points - Enhanced */}
            {rewards && rewards.pointTransactions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6 hover:shadow-2xl transition-shadow">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Point Activity</h2>
                <div className="space-y-3">
                  {rewards.pointTransactions.map((transaction) => (
                    <div key={transaction.id} className="group flex justify-between items-center p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200/60 hover:shadow-md hover:border-cyan-300/50 transition-all duration-200">
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors">{transaction.description}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          📅 {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`text-2xl font-black px-4 py-2 rounded-xl ${
                        transaction.points > 0
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                      }`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </div>
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
