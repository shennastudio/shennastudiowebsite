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
import { SwimmingWhaleShark } from '@/components/admin/SwimmingWhaleShark';
import { OceanAnimation } from '@/components/admin/OceanAnimation';
import { BirthdaySurprise } from '@/components/admin/BirthdaySurprise';
import './ocean-animations.css';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-black dark:via-black dark:to-slate-950 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Ocean Animation Background */}
      <OceanAnimation />
      
      {/* Swimming Whale Shark */}
      <SwimmingWhaleShark />

      {/* 🎂 SECRET Birthday Surprise - Only shows on January 31st! */}
      <BirthdaySurprise />

      {/* Sidebar Component (Client) */}
      <AdminSidebar userName={session?.user?.name} />

      {/* Main Content Area */}
      <div className="lg:pl-72 transition-all duration-300 relative z-10">
        {/* Top Header Bar with glowing effect */}
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-black/80 backdrop-blur-xl pl-14 pr-3 sm:pl-6 sm:pr-6 shadow-sm glow-border">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-600 via-teal-500 to-pink-500 dark:from-cyan-400 dark:via-teal-300 dark:to-pink-400 bg-clip-text text-transparent truncate animate-gradient-shift">
                ShennaStudio Admin ✨
              </h2>
              <span className="hidden sm:inline-block px-2 py-1 text-[10px] font-semibold bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-cyan-900/30 text-pink-700 dark:text-pink-300 rounded-full border border-pink-200/50 dark:border-pink-800/50 animate-pulse-slow">
                💖 MAGICAL
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <ModeToggle />
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 sm:gap-2 border-pink-300 dark:border-pink-700 hover:border-pink-500 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 hover:from-pink-100 hover:to-purple-100 hover:text-pink-700 dark:hover:text-pink-300 transition-all duration-200 px-2 sm:px-3 animated-glow"
                >
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">View Store</span>
                </Button>
              </Link>
              {session && <UserNav user={session.user} />}
            </div>
          </div>
        </header>

        {/* Page Content with glass effect */}
        <main className="p-3 sm:p-6 lg:p-8 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
