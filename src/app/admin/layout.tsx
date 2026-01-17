import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/admin/UserNav';
import { Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ModeToggle } from '@/components/ModeToggle';
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
    <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] relative overflow-hidden transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-[var(--background-elevated)] !text-[var(--text-primary)] !border !border-[var(--border-color)]',
        }}
      />

      <AdminSidebar userName={session?.user?.name} />

      <div className="lg:pl-72 transition-all duration-300 relative z-10">
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b border-[var(--border-color)] bg-[var(--background-elevated)]/80 backdrop-blur-xl pl-14 sm:pl-6 pr-3 sm:pr-6 shadow-sm transition-colors duration-300">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30">
                  <Zap className="w-4 h-4 text-cyan-500" />
                </div>
                <h2 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent truncate">
                  ShennaStudio Admin
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <ModeToggle />
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 sm:gap-2 px-2 sm:px-3 border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--text-primary)] transition-all duration-200"
                >
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">View Store</span>
                </Button>
              </Link>
              {session && <UserNav user={session.user} />}
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-6 lg:p-8 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-[var(--background-primary)] transition-colors duration-300">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
