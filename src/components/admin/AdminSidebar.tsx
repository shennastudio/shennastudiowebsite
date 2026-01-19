'use client';

import Link from 'next/link';
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
  Menu,
  X,
  ChevronRight,
  Calendar,
  FileText,
  Sparkles,
  RotateCcw,
  Truck,
  UserCog,
  TrendingUp,
  Send,
  ShoppingBag,
  Search,
  LineChart,
  Headphones,
  Repeat,
  Ruler,
  Megaphone,
  Shirt,
  Zap,
} from 'lucide-react';

interface AdminSidebarProps {
  userName?: string | null;
}

export function AdminSidebar({}: AdminSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navSections = [
    {
      title: 'Overview',
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: 'from-cyan-500 to-cyan-400' },
        { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp, color: 'from-emerald-500 to-teal-400' },
        { href: '/admin/reports', label: 'Reports', icon: BarChart3, color: 'from-violet-500 to-purple-400' },
        { href: '/admin/calendar', label: 'Calendar', icon: Calendar, color: 'from-pink-500 to-rose-400' },
      ]
    },
    {
      title: 'Catalog',
      items: [
        { href: '/admin/products', label: 'Products', icon: Package, color: 'from-emerald-500 to-green-400' },
        { href: '/admin/inventory', label: 'Inventory', icon: Boxes, color: 'from-amber-500 to-orange-400' },
        { href: '/admin/inventory/tshirts', label: 'T-Shirts', icon: Shirt, color: 'from-purple-500 to-pink-400' },
        { href: '/admin/inventory-forecast', label: 'Forecasting', icon: LineChart, color: 'from-cyan-500 to-blue-400' },
        { href: '/admin/categories', label: 'Categories', icon: Boxes, color: 'from-lime-500 to-green-400' },
      ]
    },
    {
      title: 'Sales',
      items: [
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, color: 'from-blue-500 to-cyan-400' },
        { href: '/admin/customers', label: 'Customers', icon: Users, color: 'from-teal-500 to-cyan-400' },
        { href: '/admin/subscriptions', label: 'Subscriptions', icon: Repeat, color: 'from-violet-500 to-purple-400' },
        { href: '/admin/abandoned-carts', label: 'Abandoned Carts', icon: ShoppingBag, color: 'from-orange-500 to-amber-400' },
        { href: '/admin/payments', label: 'Payments', icon: CreditCard, color: 'from-indigo-500 to-blue-400' },
        { href: '/admin/discounts', label: 'Discounts', icon: Ticket, color: 'from-fuchsia-500 to-pink-400' },
        { href: '/admin/returns', label: 'Returns', icon: RotateCcw, color: 'from-orange-500 to-red-400' },
        { href: '/admin/shipping', label: 'Shipping', icon: Truck, color: 'from-purple-500 to-violet-400' },
      ]
    },
    {
      title: 'Marketing',
      items: [
        { href: '/admin/marketing', label: 'Marketing Hub', icon: Megaphone, color: 'from-purple-500 to-pink-400' },
        { href: '/admin/email-campaigns', label: 'Campaigns', icon: Send, color: 'from-rose-500 to-pink-400' },
        { href: '/admin/seo', label: 'SEO', icon: Search, color: 'from-green-500 to-emerald-400' },
        { href: '/admin/blog', label: 'Blog Posts', icon: FileText, color: 'from-purple-500 to-pink-400' },
        { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare, color: 'from-sky-500 to-blue-400' },
        { href: '/admin/email', label: 'Email Client', icon: Mail, color: 'from-cyan-500 to-teal-400' },
        { href: '/admin/email-logs', label: 'Email Logs', icon: Mail, color: 'from-slate-500 to-gray-400' },
      ]
    },
    {
      title: 'Impact',
      items: [
        { href: '/admin/conservation', label: 'Conservation', icon: Heart, color: 'from-teal-500 to-emerald-400' },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { href: '/admin/ai-features', label: 'AI Tools', icon: Sparkles, color: 'from-amber-500 to-yellow-400' },
      ]
    },
    {
      title: 'Support',
      items: [
        { href: '/admin/support-tickets', label: 'Tickets', icon: Headphones, color: 'from-indigo-500 to-purple-400' },
      ]
    },
    {
      title: 'System',
      items: [
        { href: '/admin/staff', label: 'Staff', icon: UserCog, color: 'from-blue-500 to-indigo-400' },
        { href: '/admin/bracelet-sizes', label: 'Bracelet Sizes', icon: Ruler, color: 'from-amber-500 to-orange-400' },
        { href: '/admin/settings', label: 'Settings', icon: Settings, color: 'from-slate-500 to-gray-400' },
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
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[var(--background-elevated)] text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors shadow-lg border border-[var(--border-color)]"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className={`fixed left-0 top-0 z-40 h-screen w-72 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col bg-[var(--background-secondary)] border-r border-[var(--border-color)] h-full">
          <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--border-color)]">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/30">
                <Zap className="h-5 w-5 text-cyan-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--text-primary)]">Shenna's Studio</span>
                <span className="text-xs text-[var(--text-muted)]">Admin Panel</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 mb-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                          active
                            ? 'text-white'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)]'
                        }`}
                      >
                        {active && (
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-100`} />
                        )}
                        {!active && (
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200`} />
                        )}
                        <div className="relative z-10 flex items-center gap-3">
                          <Icon className={`h-4 w-4 transition-transform ${active ? '' : 'group-hover:scale-110'}`} />
                          <span>{item.label}</span>
                        </div>
                        {active && (
                          <ChevronRight className="ml-auto h-4 w-4 relative z-10" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
              <div className="relative">
                <Heart className="h-4 w-4 text-teal-500" />
                <div className="absolute inset-0 Heart h-4 w-4 text-teal-500 animate-ping opacity-50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--text-primary)]">Conservation Impact</p>
                <p className="text-[10px] text-[var(--text-muted)]">10% to ocean protection</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}
    </>
  );
}
