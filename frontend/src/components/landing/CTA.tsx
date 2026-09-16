import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const WHATSAPP_PHONE = '254700000000';

export default function CTA() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    'Hello NaffBright Farm, I would like to learn more about your dairy products, available cows, or getting started with your farm app.'
  )}`;

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Card with Light and Dark Theme Support */}
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-950 p-8 sm:p-12 lg:p-16 text-center text-slate-900 dark:text-white shadow-xl dark:shadow-2xl border border-emerald-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
          
          {/* Subtle Ambient Glow Blobs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            {/* Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-400/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Start Growing With NaffBright Farm</span>
            </motion.div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-slate-950 dark:text-white transition-colors">
              Fresh Dairy at Your Door, <br />
              <span className="text-emerald-600 dark:text-emerald-400">
                Smarter Management for Your Herd.
              </span>
            </h2>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium transition-colors">
              Whether you want daily raw milk, thick cultured mala, healthy in-calf heifers, or an easy offline app to track your cow yields and vet dates — we are here to help.
            </p>

            {/* Dual Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-base shadow-lg shadow-emerald-600/25 dark:shadow-emerald-500/20 transition-all"
              >
                <span>Launch Farm App</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 font-bold text-base shadow-xs backdrop-blur-xs transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </motion.a>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-8 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                No Internet Required in Sheds
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                100% Vet-Certified Livestock
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Pure Milk, Zero Dilution
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}