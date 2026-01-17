import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/admin/UserNav';
import { Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ModeToggle } from '@/components/ModeToggle';
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
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden admin-dark">
      <Toaster position="top-right" />

      {/* Sidebar Component (Client) */}
      <AdminSidebar userName={session?.user?.name} />

      {/* Main Content Area */}
      <div className="lg:pl-72 transition-all duration-300 relative z-10">
        {/* Top Header Bar with glowing effect */}
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b border-slate-800 bg-slate-950/80 dark:bg-black/80 backdrop-blur-xl pl-14 sm:pl-6 pr-3 sm:pr-6 shadow-sm">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-sm sm:text-lg font-bold text-white truncate">
                ShennaStudio Admin
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <ModeToggle />
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 sm:gap-2 px-2 sm:px-3 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
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
        <main className="p-3 sm:p-6 lg:p-8 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-slate-950">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
