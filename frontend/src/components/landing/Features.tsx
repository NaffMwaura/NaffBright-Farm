import { motion } from 'framer-motion';
import {
  ClipboardList,
  Activity,
  CalendarDays,
  TrendingUp,
  Receipt,
  Smartphone,
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: 'Cow Records & Family Tree',
      desc: 'Keep complete digital profiles for every cow: ear-tag numbers, mother and father history, breed type, and current milking or pregnant stage.',
      icon: <ClipboardList className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Daily Milking & Sickness Alerts',
      desc: 'Log morning, noon, and evening shifts in seconds. The app alerts you immediately if a cow suddenly drops milk output so you can treat it early.',
      icon: <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Breeding & Calving Calendar',
      desc: 'Never miss an AI cycle. Get automatic reminders for 21-day heat re-checks, pregnancy confirmations, dry-off dates, and expected birth dates.',
      icon: <CalendarDays className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Feed Costs vs. Milk Profit',
      desc: 'Track how much silage, hay, and dairy meal each cow eats compared to the milk it gives. Spot which cows are truly profitable and which ones cost you money.',
      icon: <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Milk Sales & Customer Orders',
      desc: 'Track daily farmgate sales, bulk buyer receipts, cooperative milk payouts, and customer WhatsApp orders all in one clean ledger.',
      icon: <Receipt className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Works 100% Offline in Sheds',
      desc: 'Workers and vets can record data right in the cow shed without internet or Wi-Fi. As soon as the phone catches signal, everything syncs up automatically.',
      icon: <Smartphone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    },
  ];

  return (
    <section
      id="features"
      className="scroll-mt-24 py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Smart Farm Management
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Everything Your Farm Needs.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Replace messy notebooks and paper receipts with an easy phone app that your workers and vets can use without training.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 shadow-xs hover:shadow-xl transition-all"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 shadow-xs">
                {feat.icon}
              </div>

              {/* Text */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}