import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import SEOSchemas from "@/components/SEOSchemas";
import { ThemeProvider } from "@/components/theme-provider";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import ScrollProgress from "@/components/ScrollProgress";

// Primary heading font - bold, masculine sans-serif
const robotoCondensed = Roboto_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Body font - clean, highly readable sans-serif
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "La Pesqueria Outfitters | Fishing Gear, Apparel & Hats - McAllen TX",
  description: 'Premium fishing gear, apparel, T-shirts and hats in McAllen, TX. Shop high-quality fishing shirts, performance hats, outdoor apparel, and coastal gear at 4400 N 23rd St Suite 135.',
  keywords: [
    // Primary keywords
    'fishing gear',
    'fishing apparel',
    'fishing hats',
    'fishing shirts',
    'fishing t-shirts',
    'fishing outfitters',
    'outdoor apparel',
    'angler gear',
    'coastal clothing',
    // Location keywords
    'fishing gear McAllen TX',
    'fishing apparel Texas',
    'fishing outfitters Rio Grande Valley',
    'McAllen fishing store',
    'South Texas fishing gear',
    // Style keywords
    'saltwater fishing gear',
    'offshore fishing apparel',
    'deep sea fishing hats',
    'sport fishing clothing',
    'performance fishing hats',
    'UV protection fishing gear',
    // Material keywords
    'performance poly shirts',
    'moisture wicking fishing shirts',
    'quick dry fishing apparel',
    'breathable fishing gear',
    // Gift keywords
    'fishing gifts',
    'gifts for fishermen',
    'angler gifts',
    'outdoor enthusiast gifts',
  ].join(', '),
  openGraph: {
    title: "La Pesqueria Outfitters | Fishing Gear & Apparel - McAllen TX",
    description: 'Premium fishing gear, apparel, T-shirts and hats. Visit us at 4400 N 23rd St Suite 135, McAllen, TX.',
    type: 'website',
    locale: 'en_US',
    siteName: "La Pesqueria Outfitters",
    images: [
      {
        url: '/images/lapescerialogo.png',
        width: 1200,
        height: 630,
        alt: "La Pesqueria Outfitters - Premium Fishing Gear & Apparel",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "La Pesqueria Outfitters | Fishing Gear & Apparel",
    description: 'Premium fishing gear, apparel and hats - McAllen, TX',
    images: ['/images/lapescerialogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://lapesqueria.com',
  },
  other: {
    'geo.position': '26.2466;-98.2461',
    'geo.placename': 'McAllen, TX',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Define Google Translate callback BEFORE the script loads
              window.googleTranslateElementInit = function() {
                if (typeof google !== 'undefined' && google.translate) {
                  new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,es,fr,de,it,pt,zh-CN,ja,ko,ar,ru',
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              };
            `,
          }}
        />
        <script
          async
          defer
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
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
          {/* eslint-disable-next-line @next/next/no-img-element -- tracking pixel in noscript doesn't benefit from Next.js Image optimization */}
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
        className={`${robotoCondensed.variable} ${inter.variable} antialiased min-h-screen flex flex-col bg-background text-foreground touch-manipulation selection:bg-accent/30 overflow-x-hidden w-full`}
      >
        {/* Hidden Google Translate element - required for the API to work */}
        <div id="google_translate_element" className="hidden" />
        <ScrollProgress />
        <AnalyticsProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
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
