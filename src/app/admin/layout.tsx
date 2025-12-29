import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/admin/UserNav';
import { Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Store } from 'lucide-react';
import { headers } from 'next/headers';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Check if we're on the login page
  const isLoginPage = pathname.includes('/admin/login');

  // If it's the login page, just render children without sidebar/header
  if (isLoginPage) {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Toaster position="top-right" />

      {/* Sidebar Component (Client) */}
      <AdminSidebar userName={session?.user?.name} />

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl pl-14 pr-3 sm:pl-6 sm:pr-6 shadow-sm">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-slate-900 to-cyan-900 bg-clip-text text-transparent truncate">
                ShennaStudio Admin
              </h2>
              <span className="hidden sm:inline-block px-2 py-1 text-[10px] font-semibold bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 rounded-full border border-cyan-200/50">
                PRO
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 sm:gap-2 border-slate-300 hover:border-cyan-500 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:text-cyan-700 transition-all duration-200 px-2 sm:px-3"
                >
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">View Store</span>
                </Button>
              </Link>
              {session && <UserNav user={session.user} />}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-6 lg:p-8 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/20 via-white to-slate-50/30">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
