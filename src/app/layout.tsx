import type { Metadata, Viewport } from "next";
import { Playfair_Display, Quicksand, Great_Vibes, Cormorant_Garamond, Festive } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import SEOSchemas from "@/components/SEOSchemas";
import { ThemeProvider } from "@/components/theme-provider";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import ScrollProgress from "@/components/ScrollProgress";
import GoogleAdSense from "@/components/providers/GoogleAdSense";

// Primary heading font - elegant and feminine
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Body font - clean and friendly
const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Script font for decorative elements
const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

// Secondary serif for elegant accents
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Festive font for handwritten style
const festive = Festive({
  variable: "--font-festive",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Shenna's Studio | Custom Made Bracelets Brownsville TX - Handcrafted Ocean Jewelry",
  description: 'Custom made bracelets & handcrafted ocean-inspired jewelry in Brownsville, TX. Shop unique beaded bracelets, sea turtle jewelry, whale bracelets & sustainable accessories. 10% of every purchase supports marine conservation in South Padre Island & Rio Grande Valley.',
  keywords: [
    // High-volume primary keywords
    'custom made bracelets',
    'handmade bracelets',
    'beaded bracelets',
    'custom bracelets',
    'handcrafted jewelry',
    'ocean jewelry',
    'beach bracelets',
    'sea turtle jewelry',
    'whale bracelet',
    'boho bracelets',
    'bohemian jewelry',
    'friendship bracelets',
    'personalized bracelets',
    'unique bracelets',
    'artisan jewelry',
    // Location-specific keywords
    'custom bracelets Brownsville TX',
    'handmade jewelry Texas',
    'Brownsville jewelry store',
    'South Padre Island jewelry',
    'Rio Grande Valley bracelets',
    'Texas artisan bracelets',
    // Conservation keywords
    'ocean conservation jewelry',
    'marine conservation bracelets',
    'sea turtle conservation',
    'eco-friendly jewelry',
    'sustainable bracelets',
    'charity bracelets',
    // Style keywords
    'shell bracelets',
    'coral jewelry',
    'wave bracelet',
    'surf jewelry',
    'coastal jewelry',
    'nautical bracelets',
    'tropical jewelry',
    'mermaid bracelet',
    // Gift keywords
    'bracelet gift',
    'unique gift for her',
    'ocean lover gift',
    'beach lover gift',
    'meaningful jewelry',
  ].join(', '),
  openGraph: {
    title: "Shenna's Studio | Custom Made Bracelets & Ocean Jewelry Brownsville TX",
    description: 'Shop unique handcrafted ocean-inspired bracelets. Sea turtle, whale & beach jewelry supporting marine conservation.',
    type: 'website',
    locale: 'en_US',
    siteName: "Shenna's Studio",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Shenna's Studio Ocean Jewelry Collection",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shenna's Studio | Custom Made Bracelets",
    description: 'Handcrafted ocean jewelry supporting marine conservation',
    images: ['/images/og-image.jpg'],
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
    canonical: 'https://shennastudio.com',
  },
  other: {
    'geo.position': '25.9018;-97.4975',
    'geo.placename': 'Brownsville, TX',
    'geo.region': 'US-TX',
    'google-site-verification': 'YXZ1OQCD7RZo8w2wNd7IwUpAw9m9JfbTZ8gMsJl7_20',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="Shenna's Studio Blog" href="/blog/feed.xml" />
        <GoogleAdSense />
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
              pintrk('load', '${process.env.NEXT_PUBLIC_PINTEREST_TAG_ID || ''}');
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
            src={`https://ct.pinterest.com/v1/?tid=${process.env.NEXT_PUBLIC_PINTEREST_TAG_ID || ''}&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${playfairDisplay.variable} ${quicksand.variable} ${greatVibes.variable} ${cormorant.variable} ${festive.variable} antialiased min-h-screen flex flex-col bg-background text-foreground touch-manipulation selection:bg-primary/30 overflow-x-hidden w-full`}
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
