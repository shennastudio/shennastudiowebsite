'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function HeroOrb() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative h-[360px] w-[360px] sm:h-[420px] sm:w-[420px]">
      <div className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-tr from-cyan-500/30 via-violet-500/20 to-emerald-400/20" />
      <motion.div
        className="absolute inset-8 rounded-[40%] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 shadow-[0_20px_60px_rgba(3,7,18,0.6)] backdrop-blur"
        animate={
          prefersReducedMotion
            ? { }
            : { rotate: 360 }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 22, repeat: Infinity, ease: 'linear' }
        }
      />
      <motion.div
        className="absolute inset-14 rounded-[42%] border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-transparent"
        animate={
          prefersReducedMotion
            ? {}
            : { rotate: -360 }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 28, repeat: Infinity, ease: 'linear' }
        }
      />
      <div className="absolute inset-20 rounded-[45%] border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-transparent" />
      <div className="absolute inset-24 rounded-[48%] border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-transparent" />
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute -bottom-6 left-1/2 h-20 w-72 -translate-x-1/2 rounded-full bg-cyan-500/30 blur-3xl" />
    </div>
  );
}
