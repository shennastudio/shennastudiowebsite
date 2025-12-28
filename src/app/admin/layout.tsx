import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserNav } from '@/components/admin/UserNav';
import { Toaster } from 'react-hot-toast';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Ticket,
  MessageSquare,
  Mail,
  CreditCard,
  BarChart3,
  Heart,
  Settings,
  Store
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/discounts', label: 'Discounts', icon: Ticket },
    { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/admin/email-logs', label: 'Emails', icon: Mail },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { href: '/admin/conservation', label: 'Conservation', icon: Heart },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Modern Light Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/images/shenna-studio-logo.png"
                alt="ShennaStudio Admin"
                width={140}
                height={140}
                className="object-contain h-10 w-auto"
                priority
              />
              <span className="hidden sm:inline text-sm font-semibold text-gray-600">Admin</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 6).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Store className="w-4 h-4" />
                View Store
              </Button>
            </Link>
            {session && <UserNav user={session.user} />}
          </div>
        </div>
      </header>

      {/* Secondary Navigation Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {navItems.slice(6).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-[calc(100vh-10rem)]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 ShennaStudio Admin Panel • Ocean Conservation Platform
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-600" />
                10% to Conservation
              </span>
              <span>•</span>
              <Link href="/admin/conservation" className="hover:text-teal-600 transition-colors">
                View Impact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
