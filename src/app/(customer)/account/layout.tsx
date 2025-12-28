import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Package,
  Heart,
  Trophy,
  User,
  ShoppingBag,
  Gift,
  Home
} from 'lucide-react';
import LogoutButton from '@/components/customer/LogoutButton';

export default async function CustomerAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'CUSTOMER') {
    redirect('/login');
  }

  const navItems = [
    { href: '/account', label: 'Overview', icon: User },
    { href: '/account/orders', label: 'My Orders', icon: Package },
    { href: '/account/rewards', label: 'Rewards', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Ocean-Themed Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <User className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-bold">My Account</h1>
              </div>
              <p className="text-cyan-100 text-lg">Welcome back, {session.user.name}!</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/products">
                <Button
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold border-0"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-white/40 hover:bg-white/20 text-white font-semibold"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Ocean Conservation Footer Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-700 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Thank You for Supporting Ocean Conservation!</h3>
                <p className="text-cyan-100 text-sm">
                  10% of every purchase protects sea turtles, whales, and marine ecosystems
                </p>
              </div>
            </div>
            <Link href="/conservation">
              <Button
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold border-0"
              >
                View Our Impact
                <Gift className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
