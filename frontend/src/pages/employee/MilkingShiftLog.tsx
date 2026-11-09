/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Milk, CheckCircle2, AlertCircle,} from 'lucide-react';
import { employeeService } from '../../services/employeeService';

export default function MilkingShiftLog() {
  const [cows, setCows] = useState<any[]>([]);
  const [selectedCowId, setSelectedCowId] = useState('');
  const [litres, setLitres] = useState('');
  const [shift, setShift] = useState('Morning');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingCows, setIsLoadingCows] = useState(true);

  // Recent logs state
  const [recentEntries, setRecentEntries] = useState<any[]>([]);

  useEffect(() => {
    const fetchCows = async () => {
      setIsLoadingCows(true);
      try {
        const data = await employeeService.getCows();
        // Only healthy, pregnant or lactating cows
        const eligible = data.filter((c: any) => c.status !== 'Sold' && c.status !== 'Deceased');
        setCows(eligible);
        if (eligible.length > 0) setSelectedCowId(eligible[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingCows(false);
      }
    };
    fetchCows();
  }, []);

  const handleLogMilk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCowId || !litres) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await employeeService.logMilkRecord({
        cowId: selectedCowId,
        quantityLitres: parseFloat(litres),
        shift,
      });

      const cowObj = cows.find((c) => c.id === selectedCowId);
      const newEntry = {
        cowTag: cowObj?.tagNumber || 'Unknown',
        cowName: cowObj?.name || 'Unnamed',
        litres: parseFloat(litres),
        shift,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setRecentEntries([newEntry, ...recentEntries]);
      setSuccessMsg(`Successfully logged ${litres} L for ${cowObj?.tagNumber || 'Cow'}.`);
      setLitres('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to record milk entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Daily Production Input
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
          Log Milking Shift
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select the cow ear-tag, choose the shift, and enter the exact volume milked.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Card (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogMilk} className="space-y-5">
            
            {/* Cow Selection Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Cow (Ear-Tag & Name) *
              </label>
              {isLoadingCows ? (
                <div className="p-3 text-xs text-slate-400">Loading herd register...</div>
              ) : (
                <select
                  value={selectedCowId}
                  onChange={(e) => setSelectedCowId(e.target.value)}
                  required
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  {cows.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.tagNumber} — {c.name || 'Unnamed'} ({c.breed} • {c.status})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Shift Picker Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Milking Shift *
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['Morning', 'Noon', 'Evening'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShift(s)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      shift === s
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {s} Shift
                  </button>
                ))}
              </div>
            </div>

            {/* Liters Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Quantity Yielded (Litres) *
              </label>
              <div className="relative">
                <Milk className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  required
                  value={litres}
                  onChange={(e) => setLitres(e.target.value)}
                  placeholder="e.g. 14.5"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || cows.length === 0}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving record...' : 'Submit Milking Entry'}
            </motion.button>

          </form>
        </div>

        {/* Live Session Log (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Shift Records (This Session)
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {recentEntries.length} Saved
            </span>
          </div>

          {recentEntries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              No entries logged yet in this session. Filled records will appear here for verification.
            </div>
          ) : (
            <div className="space-y-2.5 mt-3">
              {recentEntries.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                      {item.cowTag}
                    </span>
                    <span className="text-xs text-slate-500 ml-1.5">({item.shift})</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {item.litres} L
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}