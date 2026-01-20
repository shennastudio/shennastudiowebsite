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
  title: "Shenna's Studio | Custom Bracelets Brownsville TX - Ocean-Inspired Handcrafted Jewelry",
  description: 'Custom handcrafted bracelets in Brownsville, TX. Shop ocean-inspired jewelry, artisan bracelets, and sustainable apparel. 10% of every purchase supports marine conservation in South Padre Island. Visit our store at 2436 Pablo Kisel Blvd.',
  keywords: 'custom bracelets Brownsville TX, handmade bracelets Texas, ocean jewelry Brownsville, artisan bracelets Rio Grande Valley, marine conservation jewelry, sea turtle bracelets, handcrafted jewelry South Padre Island, sustainable fashion Brownsville TX',
  openGraph: {
    title: "Shenna's Studio | Custom Bracelets Brownsville TX",
    description: 'Custom handcrafted bracelets in Brownsville, TX. Ocean-inspired jewelry supporting marine conservation.',
    type: 'website',
    locale: 'en_US',
  },
  other: {
    'geo.position': '25.9018;-97.4975',
    'geo.placename': 'Brownsville, TX',
    'geo.region': 'US-TX',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#F9FBFC',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SEOSchemas />
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,es,fr,de,it,pt,zh,ja,ko,ar,ru',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `,
          }}
        />
        {/* Pinterest Tag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(e){if(!window.pintrk){window.pintrk=function(){
              window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
              n=window.pintrk;n.queue=[],n.version="3.0";n.baseURL="https://s.pinimg.com/";n.loaded=!1;
              e.attachEvent?e.attachEvent("onload",n.loaded):e.addEventListener("load",n.loaded,false)}(document,window,"script");
              pintrk('load', 'YOUR_PINTEREST_TAG_ID_HERE');
              pintrk('pageview');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://ct.pinterest.com/v1/?tid=YOUR_PINTEREST_TAG_ID_HERE&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} antialiased min-h-screen flex flex-col bg-background text-foreground touch-manipulation selection:bg-primary/30 overflow-x-hidden w-full`}
      >
        <ScrollProgress />
        <AnalyticsProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
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
