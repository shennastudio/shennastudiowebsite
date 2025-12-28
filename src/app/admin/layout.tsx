import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserNav } from '@/components/admin/UserNav';
import { Toaster } from 'react-hot-toast';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button
} from '@heroui/react';
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
    <div className="min-h-screen bg-background dark">
      <Toaster position="top-right" />

      {/* Modern Dark Admin Header */}
      <Navbar
        isBordered
        maxWidth="full"
        className="dark bg-gray-900 border-b border-gray-800"
        classNames={{
          wrapper: "px-4 sm:px-6 lg:px-8",
        }}
      >
        <NavbarBrand>
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/images/shenna-studio-logo.png"
              alt="ShennaStudio Admin"
              width={140}
              height={140}
              className="object-contain h-10 w-auto brightness-110"
              priority
            />
            <span className="hidden sm:inline text-sm font-semibold text-gray-400">Admin</span>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden lg:flex gap-1" justify="center">
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <NavbarItem key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Link href="/">
              <Button
                size="sm"
                variant="bordered"
                startContent={<Store className="w-4 h-4" />}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                View Store
              </Button>
            </Link>
          </NavbarItem>
          {session && (
            <NavbarItem>
              <UserNav user={session.user} />
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>

      {/* Secondary Navigation Bar */}
      <div className="border-b border-gray-800 bg-gray-900/50 dark">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {navItems.slice(6).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content with Dark Theme */}
      <main className="max-w-full px-4 sm:px-6 lg:px-8 py-8 dark bg-gray-950 min-h-[calc(100vh-8rem)]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 dark py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 ShennaStudio Admin Panel • Ocean Conservation Platform
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-500" />
                10% to Conservation
              </span>
              <span>•</span>
              <Link href="/admin/conservation" className="hover:text-teal-400 transition-colors">
                View Impact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
