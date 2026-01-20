export default function SEOSchemas() {
  // Organization Schema with Brownsville address
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shenna's Studio",
    "description": "Custom handcrafted bracelets and ocean-inspired jewelry in Brownsville, TX. 10% supports marine conservation in South Padre Island and Rio Grande Valley.",
    "url": "https://shennastudio.com",
    "logo": "https://shennastudio.com/images/shenna-studio-logo.png",
    "foundingDate": "2025-03",
    "founder": {
      "@type": "Person",
      "name": "Shenna"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2436 Pablo Kisel Blvd",
      "addressLocality": "Brownsville",
      "addressRegion": "TX",
      "postalCode": "78520",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Brownsville, TX and surrounding areas including South Padre Island, Rio Grande Valley"
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

  // Local Business Schema with Brownsville address
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Shenna's Studio - Custom Bracelets Brownsville TX",
    "image": "https://shennastudio.com/images/shenna-studio-logo.png",
    "description": "Premier custom bracelet shop in Brownsville, TX. Handcrafted ocean-inspired jewelry, artisan bracelets, and marine conservation jewelry. 10% of all purchases support sea turtle and ocean conservation.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2436 Pablo Kisel Blvd",
      "addressLocality": "Brownsville",
      "addressRegion": "TX",
      "postalCode": "78520",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.9018",
      "longitude": "-97.4975"
    },
    "url": "https://shennastudio.com",
    "telephone": "+1-956-XXX-XXXX",
    "priceRange": "$$",
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
      "opens": "09:00",
      "closes": "18:00"
    },
    "paymentAccepted": "Credit Card, Debit Card, Cash, Apple Pay, Cash App",
    "currenciesAccepted": "USD",
    "areaServed": {
      "@type": "Place",
      "name": "Brownsville, TX, South Padre Island, McAllen, Harlingen, Rio Grande Valley"
    }
  };

  // Website Schema with Search Action
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shenna's Studio - Custom Bracelets Brownsville TX",
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
    "name": "Shenna's Studio - Custom Bracelets & Ocean Jewelry",
    "description": "Shop custom handcrafted bracelets in Brownsville, TX. Ocean-inspired jewelry, artisan bracelets, and sustainable t-shirts. Every purchase donates 10% to marine conservation.",
    "url": "https://shennastudio.com",
    "image": "https://shennastudio.com/images/shenna-studio-logo.png",
    "brand": {
      "@type": "Brand",
      "name": "Shenna's Studio"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2436 Pablo Kisel Blvd",
      "addressLocality": "Brownsville",
      "addressRegion": "TX",
      "postalCode": "78520",
      "addressCountry": "US"
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
      "name": "Custom Bracelets Collection",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Handcrafted Ocean Bracelets",
            "description": "Eco-friendly beaded bracelets supporting marine conservation",
            "brand": {
              "@type": "Brand",
              "name": "Shenna's Studio"
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "USD",
              "lowPrice": "15.00",
              "highPrice": "45.00",
              "availability": "https://schema.org/InStock",
              "offerCount": "20"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "47",
              "bestRating": "5",
              "worstRating": "1"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Marine Conservation Jewelry",
            "description": "Artisan jewelry with 10% proceeds donated to ocean protection",
            "brand": {
              "@type": "Brand",
              "name": "Shenna's Studio"
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "USD",
              "lowPrice": "20.00",
              "highPrice": "75.00",
              "availability": "https://schema.org/InStock",
              "offerCount": "25"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "32",
              "bestRating": "5",
              "worstRating": "1"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Sustainable T-Shirts",
            "description": "Eco-friendly apparel supporting sea turtle and whale conservation",
            "brand": {
              "@type": "Brand",
              "name": "Shenna's Studio"
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "USD",
              "lowPrice": "25.00",
              "highPrice": "45.00",
              "availability": "https://schema.org/InStock",
              "offerCount": "15"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "reviewCount": "18",
              "bestRating": "5",
              "worstRating": "1"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Sea Turtle Bracelet Collection",
            "description": "Handcrafted sea turtle inspired bracelets from South Padre Island",
            "brand": {
              "@type": "Brand",
              "name": "Shenna's Studio"
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "USD",
              "lowPrice": "18.00",
              "highPrice": "55.00",
              "availability": "https://schema.org/InStock",
              "offerCount": "12"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "24",
              "bestRating": "5",
              "worstRating": "1"
            }
          }
        }
      ]
    }
  };

  // Non-Profit Action Schema (for conservation)
  const nonprofitSchema = {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    "name": "Marine Conservation Donation - Brownsville TX",
    "description": "10% of every custom bracelet purchase in Brownsville, TX is donated to marine life conservation efforts in South Padre Island and the Rio Grande Valley",
    "recipient": {
      "@type": "Organization",
      "name": "Shenna's Studio Marine Conservation Fund"
    },
    "cause": "Marine Life Protection, Sea Turtle Conservation, and Ocean Ecosystem Preservation in South Padre Island and Rio Grande Valley"
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
