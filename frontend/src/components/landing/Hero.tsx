import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

// Import local assets directly from src/assets/
import hero1 from '../../assets/hero1.jpeg';
import hero2 from '../../assets/hero2.jpg';
import hero3 from '../../assets/hero3.png';
import hero4 from '../../assets/hero4.jpg';

const bgImages = [hero1, hero2, hero3, hero4];

const typewriterWords = [
  'Fresh Raw Milk',
  'High-Yield In-Calf Cows',
  'Pure Cultured Mala',
  'Healthy Weaned Calves',
  'Precision Dairy SaaS',
];

export default function Hero() {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter effect state
  const [wordIdx, setWordIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typewriterWords[wordIdx];

    if (!isDeleting && subIdx === currentWord.length) {
      const pause = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(pause);
    }

    if (isDeleting && subIdx === 0) {
      setIsDeleting(false);
      setWordIdx((prev) => (prev + 1) % typewriterWords.length);
      return;
    }

    const speed = isDeleting ? 35 : 75;
    const typingTimeout = setTimeout(() => {
      setSubIdx((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(typingTimeout);
  }, [subIdx, isDeleting, wordIdx]);

  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      
      {/* 1. Background Carousel (Sharp local images without blurs or grid lines) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentBg}
            src={bgImages[currentBg]}
            alt="NaffBright Farm Background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Balanced contrast overlay: preserves photo clarity in light & dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/60 to-white/85 dark:from-slate-950/70 dark:via-slate-950/55 dark:to-slate-950/80 transition-colors duration-300" />
      </div>

      {/* 2. Symmetrically Centered Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full text-center flex flex-col items-center">
        
        {/* Market & Tech Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase shadow-sm backdrop-blur-xs"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Farm Operations & Verified Livestock Marketplace</span>
        </motion.div>

        {/* Main Headline with Smooth Height Preservation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]"
        >
          Your Source For <br />
          <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-baseline min-h-[1.2em]">
            {typewriterWords[wordIdx].substring(0, subIdx)}
            <span className="inline-block w-[3px] h-8 sm:h-12 lg:h-14 ml-1 bg-emerald-600 dark:bg-emerald-400 animate-pulse align-middle" />
          </span>
        </motion.h1>

        {/* Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-slate-800 dark:text-slate-200 max-w-2xl font-medium leading-relaxed"
        >
          Order fresh raw milk, pure cultured mala, and pedigree dairy heifers directly from verified genetics—or run your dairy business with our offline management console.
        </motion.p>

        {/* Call-to-Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
        >
          <motion.a
            href="#buy-a-cow"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </motion.a>

          <motion.a
            href="/dashboard"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-bold text-base shadow-md backdrop-blur-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Launch Management App</span>
          </motion.a>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold"
        >
          <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 px-3.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 backdrop-blur-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Tested High-Yield Genetics</span>
          </div>
          <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 px-3.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 backdrop-blur-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>100% Offline Logging</span>
          </div>
          <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 px-3.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 backdrop-blur-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Cold-Chain Milk & Mala Supply</span>
          </div>
        </motion.div>

      </div>

      {/* 3. Centered Carousel Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {bgImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentBg(idx)}
            aria-label={`Switch to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentBg === idx
                ? 'w-8 bg-emerald-600 dark:bg-emerald-400 shadow-xs'
                : 'w-2 bg-slate-500/40 hover:bg-slate-500/70'
            }`}
          />
        ))}
      </div>

    </section>
  );
}