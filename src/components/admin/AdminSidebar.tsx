'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  FileText
} from 'lucide-react';

interface AdminSidebarProps {
  userName?: string | null;
}

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navSections = [
    {
      title: 'Overview',
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: 'from-cyan-400 to-blue-500' },
        { href: '/admin/reports', label: 'Reports', icon: BarChart3, color: 'from-violet-400 to-purple-500' },
        { href: '/admin/calendar', label: 'Calendar', icon: Calendar, color: 'from-pink-400 to-rose-500' },
      ]
    },
    {
      title: 'Catalog',
      items: [
        { href: '/admin/products', label: 'Products', icon: Package, color: 'from-emerald-400 to-green-500' },
        { href: '/admin/inventory', label: 'Inventory', icon: Boxes, color: 'from-amber-400 to-orange-500' },
        { href: '/admin/categories', label: 'Categories', icon: Boxes, color: 'from-lime-400 to-green-500' },
      ]
    },
    {
      title: 'Sales',
      items: [
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, color: 'from-blue-400 to-cyan-500' },
        { href: '/admin/customers', label: 'Customers', icon: Users, color: 'from-teal-400 to-cyan-500' },
        { href: '/admin/payments', label: 'Payments', icon: CreditCard, color: 'from-indigo-400 to-blue-500' },
        { href: '/admin/discounts', label: 'Discounts', icon: Ticket, color: 'from-fuchsia-400 to-pink-500' },
      ]
    },
    {
      title: 'Marketing',
      items: [
        { href: '/admin/blog', label: 'Blog Posts', icon: FileText, color: 'from-purple-400 to-pink-500' },
        { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare, color: 'from-sky-400 to-blue-500' },
        { href: '/admin/email', label: 'Email Client', icon: Mail, color: 'from-cyan-400 to-teal-500' },
        { href: '/admin/email-logs', label: 'Email Logs', icon: Mail, color: 'from-slate-400 to-gray-500' },
      ]
    },
    {
      title: 'Impact',
      items: [
        { href: '/admin/conservation', label: 'Conservation', icon: Heart, color: 'from-teal-400 to-emerald-500' },
      ]
    },
    {
      title: 'System',
      items: [
        { href: '/admin/settings', label: 'Settings', icon: Settings, color: 'from-gray-400 to-slate-500' },
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Professional Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-72 transform bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-700/50 px-6">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative h-12 w-32">
                <Image
                  src="/images/shenna-studio-logo.png"
                  alt="ShennaStudio"
                  fill
                  className="object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                  priority
                />
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar Navigation with Neon Ocean Colors */}
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
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-cyan-500/30`
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 transition-transform ${active ? '' : 'group-hover:scale-110'}`} />
                        <span>{item.label}</span>
                        {active && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                        {!active && (
                          <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}
