import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Great_Vibes } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import SEOSchemas from "@/components/SEOSchemas";
import { ThemeProvider } from "@/components/theme-provider";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import ScrollProgress from "@/components/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Shenna's Studio - Ocean-Themed Handcrafted Bracelets | Marine Conservation",
  description: 'Handcrafted ocean-inspired bracelets supporting marine life conservation in South Padre Island and Rio Grande Valley. 10% of every purchase protects sea turtles, whales, and ocean ecosystems.',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <SEOSchemas />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} antialiased min-h-screen flex flex-col bg-slate-950 text-slate-50`}
      >
        <ScrollProgress />
        <AnalyticsProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          storageKey="theme"
          disableTransitionOnChange
        >
          <SessionProvider>
            <CartProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
