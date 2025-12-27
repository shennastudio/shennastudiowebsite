'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterPopup from '@/components/NewsletterPopup';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide header/footer on admin routes, login/register pages
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const shouldHideHeaderFooter = isAdminRoute || isAuthRoute;

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!shouldHideHeaderFooter && <Footer />}
      {!shouldHideHeaderFooter && <NewsletterPopup />}
    </>
  );
}
