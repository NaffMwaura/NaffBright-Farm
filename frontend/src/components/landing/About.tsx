import { motion } from 'framer-motion';
import {
  Smartphone,
  Stethoscope,
  BarChart3,
  WifiOff,
  BellRing,
  ShieldCheck,
} from 'lucide-react';

export default function About() {
  const steps = [
    {
      num: '1',
      title: 'Attendants Record Milk & Feed in Seconds',
      desc: 'Workers log morning and evening milk directly in the shed on any affordable smartphone. Big buttons, fast entry, and zero confusion.',
      icon: <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      num: '2',
      title: 'Vets Track Health & Breeding Cycles',
      desc: 'Your vet or field officer logs insemination dates, pregnancy checks, deworming, and treatments so no cow is forgotten.',
      icon: <Stethoscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      num: '3',
      title: 'You Track Production & Profits From Anywhere',
      desc: 'Check total daily milk collected, customer sales, and feed costs on your phone whether you are on the farm, in town, or traveling.',
      icon: <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
  ];

  const highlights = [
    {
      title: 'Works With No Internet',
      tag: 'Zero Signal Needed',
      desc: 'Staff can record in remote sheds without network. Everything saves safely on the phone and syncs automatically when signal returns.',
      icon: <WifiOff className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Automatic Heat & Vet Reminders',
      tag: 'Never Miss a Cycle',
      desc: 'The system counts the days after insemination (AI) and alerts you for 21-day heat re-checks, 60-day pregnancy tests, and drying-off dates.',
      icon: <BellRing className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    },
    {
      title: 'Secure Permanent Records',
      tag: 'No Lost Notebooks',
      desc: 'No more lost paper notebooks or faded handwriting. Every calf born, milk recorded, and shilling spent is stored permanently.',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    },
  ];

  return (
    <section
      id="about"
      className="scroll-mt-24 py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 3-Step Role Workflow (7 cols) */}
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Simple Roles for Everyone
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Easy for Workers in the Shed. <br />
              <span className="text-emerald-600 dark:text-emerald-400">
                Total Control for You.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              You do not have to spend all day in the cow shed to know how your herd is doing. NaffBright Farm makes data entry fast for workers while giving you total peace of mind.
            </p>

            {/* Step list */}
            <div className="mt-8 space-y-4 sm:space-y-5">
              {steps.map((step) => (
                <motion.div
                  key={step.num}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Key Farm Benefits (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 p-7 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Built For Real Dairy Farms
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}