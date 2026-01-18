export default function SEOSchemas() {
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shenna's Studio",
    "description": "Handcrafted ocean-inspired bracelets and jewelry supporting marine conservation in South Padre Island, Texas",
    "url": "https://shennastudio.com",
    "logo": "https://shennastudio.com/images/shenna-studio-logo.png",
    "foundingDate": "2025-03",
    "founder": {
      "@type": "Person",
      "name": "Shenna"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "South Padre Island",
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://facebook.com/shennastudio",
      "https://instagram.com/shennastudio"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "info@shennastudio.com"
    }
  };

  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Shenna's Studio",
    "image": "https://shennastudio.com/images/shenna-studio-logo.png",
    "description": "Artisan jewelry studio creating handcrafted ocean-inspired bracelets. 10% of proceeds support marine conservation efforts for sea turtles, whales, and ocean ecosystems in the Rio Grande Valley.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "South Padre Island",
      "addressRegion": "TX",
      "postalCode": "78597",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "26.0739",
      "longitude": "-97.1605"
    },
    "url": "https://shennastudio.com",
    "telephone": "+1-956-XXX-XXXX",
    "priceRange": "$15-$75",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "paymentAccepted": "Credit Card, Debit Card",
    "currenciesAccepted": "USD"
  };

  // Website Schema with Search Action
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shenna's Studio",
    "url": "https://shennastudio.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://shennastudio.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // E-commerce Site Schema
  const ecommerceSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Shenna's Studio Online Store",
    "description": "Shop handcrafted ocean-inspired bracelets, jewelry, and apparel. Every purchase supports marine conservation in South Padre Island and protects sea turtles, whales, and ocean life.",
    "url": "https://shennastudio.com",
    "image": "https://shennastudio.com/images/shenna-studio-logo.png",
    "brand": {
      "@type": "Brand",
      "name": "Shenna's Studio"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "15.00",
      "highPrice": "75.00",
      "offerCount": "50"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Ocean-Inspired Jewelry Collection",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Handcrafted Ocean Bracelets",
            "description": "Eco-friendly beaded bracelets supporting marine conservation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Marine Conservation Jewelry",
            "description": "Artisan jewelry with 10% proceeds donated to ocean protection"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Sustainable T-Shirts",
            "description": "Eco-friendly apparel supporting sea turtle and whale conservation"
          }
        }
      ]
    }
  };

  // Non-Profit Action Schema (for conservation)
  const nonprofitSchema = {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    "name": "Marine Conservation Donation",
    "description": "10% of every purchase is donated to marine life conservation efforts in the Rio Grande Valley and South Padre Island",
    "recipient": {
      "@type": "Organization",
      "name": "Shenna's Studio Marine Conservation Fund"
    },
    "cause": "Marine Life Protection and Ocean Ecosystem Preservation"
  };

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* E-commerce Store Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ecommerceSchema) }}
      />

      {/* Non-Profit Donation Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(nonprofitSchema) }}
      />
    </>
  );
}
