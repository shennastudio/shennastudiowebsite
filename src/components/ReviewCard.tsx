'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  author: string;
  text: string;
  rating: number;
  location?: string;
  date?: string;
}

export function ReviewCard({ author, text, rating, location, date }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_50px_rgba(3,7,18,0.6)] backdrop-blur-xl transition-all hover:border-cyan-400/40 hover:shadow-[0_30px_80px_rgba(8,145,178,0.35)]"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -top-16 right-6 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-16 left-6 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
      </div>
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Star
              className={`w-5 h-5 ${
                i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'
              }`}
            />
          </motion.div>
        ))}
      </div>
      
      <p className="text-slate-300 mb-6 italic leading-relaxed">&quot;{text}&quot;</p>
      
      <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-4">
        <div>
          <h4 className="font-bold text-white">{author}</h4>
          {location && (
            <p className="text-sm text-cyan-300 font-medium">{location}</p>
          )}
        </div>
        {date && (
          <span className="text-xs text-slate-400">{date}</span>
        )}
      </div>
    </motion.div>
  );
}
