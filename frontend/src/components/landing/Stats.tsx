import { motion } from 'framer-motion';
import { Milk, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      value: '100% Fresh',
      label: 'Raw Milk & Cultured Mala',
      sub: 'Natural, pure whole milk and thick cultured mala delivered directly from healthy cows.',
    },
    {
      value: 'Verified',
      label: 'Pedigree Cows & Calves',
      sub: 'High-yield Holstein-Friesian, Ayrshire, and Jersey lines with complete health and dam history.',
    },
    {
      value: 'Zero Signal',
      label: 'Works Without Internet',
      sub: 'Farm staff record milk yields and feed usage in remote cow sheds without worrying about network.',
    },
    {
      value: 'Automated',
      label: 'Breeding & Vet Tracking',
      sub: 'Never miss an AI cycle, heat check, or vaccination date with automatic smart alerts.',
    },
  ];

  return (
    <section id="stats" className="py-16 lg:py-24 bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Proven Operations & Quality Products
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for Serious Dairy Farming.
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Whether you are buying pedigree livestock, ordering pure farm produce, or running your dairy shed with precision.
          </p>
        </div>

        {/* 12-Column Responsive Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: 2x2 Metric Cards (7 Cols) */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all"
              >
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {stat.label}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed font-normal">
                  {stat.sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right Side: Live Shift Preview Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950 rounded-2xl p-6 shadow-2xl border border-slate-800 text-slate-100 relative overflow-hidden">
              
              {/* Card Window Topbar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-slate-400 font-mono tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Shed Console
                </span>
              </div>

              {/* Metrics Stack */}
              <div className="space-y-3.5">
                
                {/* Metric 1: Milk Yield */}
                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                      <Milk className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Today's Total Milk Yield</p>
                      <p className="text-2xl font-black text-white">482.5 L</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    +14.2% Avg
                  </span>
                </div>

                {/* Metric 2: Herd Stage */}
                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Milking Herd Distribution</p>
                    <p className="text-xl font-bold text-white">34 Active / 4 Dry In-Calf</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    38 Total Cows
                  </span>
                </div>

                {/* Metric 3: Value-Addition (Mala) */}
                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Cultured Mala Batch</p>
                      <p className="text-sm font-bold text-white">120 Liters Fermenting (Shift A)</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">Ready 6 AM</span>
                </div>

                {/* Metric 4: Automated Vet Alert */}
                <div className="bg-amber-950/30 rounded-xl p-4 border border-amber-600/30 flex items-start gap-3">
                  <div className="text-amber-400 mt-0.5 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-300">Automated Herd Alert</p>
                    <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
                      Tag <strong className="text-white">#042 (Bella)</strong> dropped yield by 2.5L in the evening. Recommended for early mastitis screening.
                    </p>
                  </div>
                </div>

              </div>

              {/* Card Footer Badge */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Offline Dexie Sync Enabled
                </span>
                <span className="font-mono text-[11px] text-slate-500">v2.4 Ready</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}