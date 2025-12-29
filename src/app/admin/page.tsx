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
  Mail
} from 'lucide-react';
import Link from 'next/link';

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
      bgColor: 'from-emerald-50 to-green-50',
      iconBg: 'from-emerald-100 to-green-100'
    },
    {
      title: 'Total Orders',
      value: data.ordersCount.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      iconBg: 'from-blue-100 to-cyan-100'
    },
    {
      title: 'Customers',
      value: data.customersCount.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'from-violet-50 to-purple-50',
      iconBg: 'from-violet-100 to-purple-100'
    },
    {
      title: 'Products',
      value: data.productsCount.toString(),
      change: '+2.1%',
      trend: 'up',
      icon: Package,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      iconBg: 'from-amber-100 to-orange-100'
    },
    {
      title: 'Conservation Impact',
      value: `$${data.conservationTotal.toFixed(2)}`,
      change: 'Donated',
      trend: 'neutral',
      icon: Heart,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'from-teal-50 to-cyan-50',
      iconBg: 'from-teal-100 to-cyan-100'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-900 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-slate-600 text-lg">Welcome back! Here&apos;s what&apos;s happening with your ocean conservation store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Star;

          return (
            <Card
              key={index}
              className={`group relative overflow-hidden border-slate-200/60 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br ${stat.bgColor}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-slate-700">{stat.title}</CardTitle>
                <div className={`p-2.5 bg-gradient-to-br ${stat.iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`} fill="currentColor" />
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trend !== 'neutral' && (
                    <TrendIcon className={`h-3 w-3 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  )}
                  <span className={`font-semibold ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-slate-600'}`}>
                    {stat.change}
                  </span>
                  {stat.trend !== 'neutral' && (
                    <span className="text-slate-500">from last month</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-slate-200/60 shadow-xl hover:shadow-2xl transition-shadow">
          <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-cyan-600" />
                Recent Orders
              </CardTitle>
              <Link
                href="/admin/orders"
                className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 group"
              >
                View All
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.recentOrders.map((order, idx) => (
                <div
                  key={order.id}
                  className="group flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200/60 hover:shadow-lg hover:border-cyan-300/50 transition-all duration-200"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-900">#{order.orderNumber}</p>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">{order.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-slate-200/60 shadow-xl hover:shadow-2xl transition-shadow">
          <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                Top Selling Products
              </CardTitle>
              <Link
                href="/admin/products"
                className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 group"
              >
                View All
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.topProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200/60 hover:shadow-lg hover:border-amber-300/50 transition-all duration-200"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${
                      idx === 0 ? 'from-amber-100 to-yellow-100' :
                      idx === 1 ? 'from-slate-100 to-gray-100' :
                      idx === 2 ? 'from-orange-100 to-amber-100' :
                      'from-slate-50 to-white'
                    } font-bold text-sm`}>
                      #{idx + 1}
                    </div>
                    <p className="font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors">
                      {product.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-lg font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {product.quantity}
                      </p>
                      <p className="text-xs text-slate-500">sold</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-200/60 shadow-xl bg-gradient-to-br from-cyan-50/50 to-teal-50/50">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link
              href="/admin/products/new"
              className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-lg hover:border-cyan-300/50 transition-all duration-200"
            >
              <div className="p-3 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-cyan-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors">Add Product</p>
                <p className="text-xs text-slate-500">Create new listing</p>
              </div>
            </Link>

            <Link
              href="/admin/email"
              className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-lg hover:border-purple-300/50 transition-all duration-200"
            >
              <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">Send Email</p>
                <p className="text-xs text-slate-500">Compose message</p>
              </div>
            </Link>

            <Link
              href="/admin/calendar"
              className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-lg hover:border-pink-300/50 transition-all duration-200"
            >
              <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5 text-pink-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-pink-700 transition-colors">Calendar</p>
                <p className="text-xs text-slate-500">View events</p>
              </div>
            </Link>

            <Link
              href="/admin/conservation"
              className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-lg hover:border-teal-300/50 transition-all duration-200"
            >
              <div className="p-3 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">Conservation</p>
                <p className="text-xs text-slate-500">Track impact</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
