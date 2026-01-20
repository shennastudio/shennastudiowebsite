import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Heart,
  Star,
  Mail,
  Truck,
  Users2,
  MessageSquare,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { LowStockWidget } from '@/components/admin/LowStockWidget';

async function getDashboardData() {
  const [
    totalRevenue,
    ordersCount,
    customersCount,
    productsCount,
    recentOrders,
    topProducts,
    conservationTotal
  ] = await Promise.all([
    // Total Revenue
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['DELIVERED', 'SHIPPED'] } }
    }),
    // Orders Count
    prisma.order.count(),
    // Customers Count
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    // Products Count
    prisma.product.count(),
    // Recent Orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        }
      }
    }),
    // Top Products
    prisma.orderItem.groupBy({
      by: ['variantId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    }),
    // Conservation Total
    prisma.conservationDonation.aggregate({
      _sum: { amount: true }
    })
  ]);

  // Get product details for top products
  const variantIds = topProducts.map(item => item.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true }
  });

  const topProductsWithDetails = topProducts.map(item => {
    const variant = variants.find(v => v.id === item.variantId);
    return {
      name: variant?.product.name || 'Unknown',
      quantity: item._sum.quantity || 0
    };
  });

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    ordersCount,
    customersCount,
    productsCount,
    recentOrders,
    topProducts: topProductsWithDetails,
    conservationTotal: conservationTotal._sum.amount || 0
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
    redirect('/admin/login');
  }

  const data = await getDashboardData();

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${data.totalRevenue.toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-slate-900/50 dark:bg-slate-900/80',
      iconBg: 'bg-gradient-to-br from-emerald-500/20 to-green-500/20'
    },
    {
      title: 'Total Orders',
      value: data.ordersCount.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-slate-900/50 dark:bg-slate-900/80',
      iconBg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'Customers',
      value: data.customersCount.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-slate-900/50 dark:bg-slate-900/80',
      iconBg: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20'
    },
    {
      title: 'Products',
      value: data.productsCount.toString(),
      change: '+2.1%',
      trend: 'up',
      icon: Package,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-slate-900/50 dark:bg-slate-900/80',
      iconBg: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
    },
    {
      title: 'Conservation Impact',
      value: `$${data.conservationTotal.toFixed(2)}`,
      change: 'Donated',
      trend: 'neutral',
      icon: Heart,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-slate-900/50 dark:bg-slate-900/80',
      iconBg: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black">
          <span className="font-[family-name:var(--font-great-vibes)] bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Shenna
          </span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-300 dark:to-white bg-clip-text text-transparent ml-3">
            Dashboard
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base lg:text-lg">Welcome back! Here&apos;s what&apos;s happening with your ocean conservation store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Star;

          return (
            <Card
              key={index}
              className={`group relative overflow-hidden border-slate-800 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-900/80 backdrop-blur-sm`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6 relative z-10">
                <CardTitle className="text-xs sm:text-sm font-semibold text-slate-300">{stat.title}</CardTitle>
                <div className={`p-1.5 sm:p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 ${stat.iconBg}`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`} fill="currentColor" />
                </div>
              </CardHeader>

              <CardContent className="relative z-10 p-3 sm:p-6 pt-0 sm:pt-0">
                <div className={`text-lg sm:text-2xl lg:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs flex-wrap">
                  {stat.trend !== 'neutral' && (
                    <TrendIcon className={`h-3 w-3 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                  )}
                  <span className={`font-semibold ${stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
                    {stat.change}
                  </span>
                  {stat.trend !== 'neutral' && (
                    <span className="text-slate-500 hidden sm:inline">from last month</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-slate-800 shadow-xl hover:shadow-2xl transition-shadow bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-800 bg-slate-950/50 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-slate-200">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                Recent Orders
              </CardTitle>
              <Link
                href="/admin/orders"
                className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
              >
                View All
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {data.recentOrders.map((order, idx) => (
                <div
                  key={order.id}
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-cyan-700/50 transition-all duration-200"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-slate-100 text-sm sm:text-base">#{order.orderNumber}</p>
                      <span className={`px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 truncate">{order.user?.name || 'Guest'}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base sm:text-xl font-bold text-cyan-400">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500">{order.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-slate-800 shadow-xl hover:shadow-2xl transition-shadow bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-800 bg-slate-950/50 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-slate-200">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                Top Selling Products
              </CardTitle>
              <Link
                href="/admin/products"
                className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
              >
                View All
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {data.topProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-amber-700/50 transition-all duration-200"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br shrink-0 font-bold text-xs sm:text-sm text-slate-200 border border-slate-700`}>
                      #{idx + 1}
                    </div>
                    <p className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors text-xs sm:text-sm truncate">
                      {product.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-base sm:text-lg font-bold text-amber-400">
                        {product.quantity}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500">sold</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts Widget */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <LowStockWidget threshold={10} limit={5} />
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-800 shadow-xl bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg text-slate-200">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-5">
            <Link
              href="/admin/products/new"
              className="group flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-cyan-700/50 transition-all duration-200"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors text-xs sm:text-sm">Add Product</p>
                <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Create new listing</p>
              </div>
            </Link>

            <Link
              href="/admin/shipping"
              className="group flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-indigo-700/50 transition-all duration-200"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors text-xs sm:text-sm">Shipping</p>
                <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Manage labels</p>
              </div>
            </Link>

            <Link
              href="/admin/email"
              className="group flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-purple-700/50 transition-all duration-200"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-slate-100 group-hover:text-purple-400 transition-colors text-xs sm:text-sm">Send Email</p>
                <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Compose message</p>
              </div>
            </Link>

            <Link
              href="/admin/calendar"
              className="group flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-pink-700/50 transition-all duration-200"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-slate-100 group-hover:text-pink-400 transition-colors text-xs sm:text-sm">Calendar</p>
                <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">View events</p>
              </div>
            </Link>

            <Link
              href="/admin/conservation"
              className="group flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-teal-700/50 transition-all duration-200"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-slate-100 group-hover:text-teal-400 transition-colors text-xs sm:text-sm">Conservation</p>
                <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Track impact</p>
              </div>
            </Link>

            <Link
              href="/admin/customers/segments"
              className="group flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-violet-700/50 transition-all duration-200"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Users2 className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-slate-100 group-hover:text-violet-400 transition-colors text-xs sm:text-sm">Segmentation</p>
                <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Customer tags</p>
              </div>
            </Link>

            <Link
              href="/admin/reviews/automation"
              className="group flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-pink-700/50 transition-all duration-200"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-slate-100 group-hover:text-pink-400 transition-colors text-xs sm:text-sm">Reviews</p>
                <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Automation</p>
              </div>
            </Link>

            <Link
              href="/admin/abandoned-carts"
              className="group flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-orange-700/50 transition-all duration-200"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-slate-100 group-hover:text-orange-400 transition-colors text-xs sm:text-sm">Abandoned</p>
                <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Cart recovery</p>
              </div>
            </Link>

            <Link
              href="/admin/analytics"
              className="group flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:shadow-lg hover:border-cyan-700/50 transition-all duration-200"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors text-xs sm:text-sm">Analytics</p>
                <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Sales & stats</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
