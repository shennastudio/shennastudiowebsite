'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/admin/UserNav';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  Store,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navSections = [
    {
      title: 'Overview',
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
      ]
    },
    {
      title: 'Catalog',
      items: [
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
        { href: '/admin/categories', label: 'Categories', icon: Boxes },
      ]
    },
    {
      title: 'Sales',
      items: [
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/customers', label: 'Customers', icon: Users },
        { href: '/admin/payments', label: 'Payments', icon: CreditCard },
        { href: '/admin/discounts', label: 'Discounts', icon: Ticket },
      ]
    },
    {
      title: 'Marketing',
      items: [
        { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
        { href: '/admin/email-logs', label: 'Email Logs', icon: Mail },
      ]
    },
    {
      title: 'Impact',
      items: [
        { href: '/admin/conservation', label: 'Conservation', icon: Heart },
      ]
    },
    {
      title: 'System',
      items: [
        { href: '/admin/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Toaster position="top-right" />

      {/* Professional Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-72 transform bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-700/50 px-6">
            <Link href="/admin" className="flex items-center gap-3 group">
              <Image
                src="/images/shenna-studio-logo.png"
                alt="ShennaStudio"
                width={120}
                height={120}
                className="h-8 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                priority
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                          active
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 transition-transform ${active ? '' : 'group-hover:scale-110'}`} />
                        <span>{item.label}</span>
                        {active && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                        {!active && (
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-slate-700/50 p-4">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30">
              <Heart className="h-5 w-5 text-teal-400 animate-pulse" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">Conservation Impact</p>
                <p className="text-[10px] text-slate-400">10% to ocean protection</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl px-6 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-cyan-900 bg-clip-text text-transparent">
                ShennaStudio Admin
              </h2>
              <span className="hidden sm:inline-block px-2 py-1 text-[10px] font-semibold bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 rounded-full border border-cyan-200/50">
                PRO
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-300 hover:border-cyan-500 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:text-cyan-700 transition-all duration-200"
                >
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">View Store</span>
                </Button>
              </Link>
              <UserNav user={{ name: 'Admin', email: 'admin@example.com', role: 'ADMIN' }} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8 min-h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/20 via-white to-slate-50/30">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}
    </div>
  );
}
