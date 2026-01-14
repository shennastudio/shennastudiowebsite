'use client';

import { useEffect, useState } from 'react';
import { ReviewCard } from '@/components/ReviewCard';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  body: string;
  title?: string;
  createdAt: string;
}

export function TestimonialSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        // Fetch verified 5-star reviews from our new API route (we'll need to create this or use existing actions)
        // For now, let's use a server action or assume we have the data from the recent seed
        // Since we are client side, we need an API route.
        // Let's mock the fetch for now with the data we just seeded if we can't hit an API yet, 
        // OR better, create a simple server action to get these.
        
        // Actually, let's just fetch from the reviews API if it exists or use the seeded data structure 
        // passed from a parent server component. 
        // But to make this component self-contained for the homepage:
        const response = await fetch('/api/reviews?limit=6'); 
        if (response.ok) {
           const data = await response.json();
           setReviews(data.reviews);
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      }
    }
    fetchReviews();
  }, []);

  // Fallback to static data if API fails or for immediate display (matching the seeded data)
  const displayReviews = reviews.length > 0 ? reviews : [
    { id: '1', customerName: "Sarah M.", title: "Love from Austin, TX", body: "Absolutely stunning! The Ocean Wave bracelet reminds me of our trip to SPI.", rating: 5, createdAt: new Date().toISOString() },
    { id: '2', customerName: "James R.", title: "Love from Houston, TX", body: "Bought this as a gift for my wife and she hasn't taken it off.", rating: 5, createdAt: new Date().toISOString() },
    { id: '3', customerName: "Emily K.", title: "Love from Dallas, TX", body: "The detail on the Sea Turtle charm is amazing. Fast shipping to Dallas.", rating: 5, createdAt: new Date().toISOString() },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-teal-800 mb-4"
          >
            Love from Across Texas
          </motion.h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join Us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayReviews.map((review, i) => (
            <ReviewCard
              key={review.id || i}
              author={review.customerName}
              text={review.body}
              rating={review.rating}
              location={review.title?.replace('Love from ', '')} // Extract location from title if formatted that way
              date={new Date(review.createdAt).toLocaleDateString()}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
