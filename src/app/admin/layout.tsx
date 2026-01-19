import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/admin/UserNav';
import { Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
// ModeToggle is available for theme switching in the header component
import { Store, Zap } from 'lucide-react';
import { headers } from 'next/headers';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  const isLoginPage = pathname.includes('/admin/login');

  if (isLoginPage) {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-slate-900 !text-white !border !border-slate-800',
        }}
      />

      <AdminSidebar userName={session?.user?.name} />

      <div className="lg:pl-72 transition-all duration-300 relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl px-4 sm:px-6 pt-safe-top shadow-sm transition-colors duration-300">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                Admin
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                   className="gap-2 px-3 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200"
                >
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">Store</span>
                </Button>
              </Link>
              {session && <UserNav user={session.user} />}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950 pb-safe-bottom">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
