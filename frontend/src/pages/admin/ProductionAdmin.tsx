import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Milk, Sparkles, Plus, CheckCircle2, X, Layers } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function ProductionAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [milkUsed, setMilkUsed] = useState('');
  const [malaProduced, setMalaProduced] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleMalaBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await adminService.produceMala({
        milkUsedLitres: parseFloat(milkUsed),
        malaProducedLitres: parseFloat(malaProduced),
      });

      setSuccessMsg(`Successfully logged fermentation batch: ${malaProduced}L Mala produced.`);
      setMilkUsed('');
      setMalaProduced('');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error logging batch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Processing & Value Addition
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Milk & Mala Production
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily milk yields and log farmgate Mala fermentation batches.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Mala Batch</span>
        </button>
      </div>

      {/* Production Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Milk Processing</span>
            <Milk className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">Active</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Continuous Intake</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Value Multiplier</span>
            <Sparkles className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">~1.7x</div>
          <span className="text-[11px] text-slate-500 font-medium">Mala Price vs Raw Milk</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Fermentation Cycle</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">24 - 36 Hrs</div>
          <span className="text-[11px] text-slate-500 font-medium">Standard Incubation</span>
        </div>
      </div>

      {/* Value Addition Educational Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
          <Milk className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Produce High-Margin Farm Mala
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Converting morning or evening surplus raw milk into cultured Mala increases retail margin from KES 70/L to KES 120/L. Click the button below to register a new batch.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          Record Mala Fermentation Batch
        </button>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-lg">
                  <Milk className="w-5 h-5 text-emerald-600" />
                  <span>Log Mala Batch</span>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleMalaBatch} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Raw Milk Used (Litres) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={milkUsed}
                    onChange={(e) => setMilkUsed(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Mala Expected/Produced (Litres) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={malaProduced}
                    onChange={(e) => setMalaProduced(e.target.value)}
                    placeholder="e.g. 48"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Record Batch'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}