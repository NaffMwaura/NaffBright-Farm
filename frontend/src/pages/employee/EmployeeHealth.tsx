/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Plus,  Calendar,} from 'lucide-react';
import { employeeService } from '../../services/employeeService';

export default function EmployeeHealth() {
  const [records, setRecords] = useState<any[]>([]);
  const [cows, setCows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCowId, setSelectedCowId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [vetName, setVetName] = useState('');
  const [treatmentCost, setTreatmentCost] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [recs, herd] = await Promise.all([
        employeeService.getHealthRecords(),
        employeeService.getCows(),
      ]);
      setRecords(recs);
      setCows(herd);
      if (herd.length > 0) setSelectedCowId(herd[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleSubmitTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCowId || !diagnosis || !treatment) return;

    setIsSubmitting(true);
    try {
      await employeeService.recordTreatment({
        cowId: selectedCowId,
        diagnosis: diagnosis.trim(),
        treatment: treatment.trim(),
        vetName: vetName.trim() || 'Farm Staff',
        treatmentCost: parseFloat(treatmentCost) || 0,
      });

      setIsModalOpen(false);
      setDiagnosis('');
      setTreatment('');
      setVetName('');
      setTreatmentCost('0');
      loadData();
    } catch (err: unknown) {
      setFeedbackMsg(err instanceof Error ? err.message : 'Error recording treatment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Veterinary & Clinical Observations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Treatments & Health Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Record illness signs, administered vaccines, antibiotic withholding periods, and vet visits.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Treatment</span>
        </button>
      </div>

      {/* Health Records List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-semibold flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading health records...</span>
        </div>
      ) : records.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center">
          <Stethoscope className="w-10 h-10 text-emerald-500 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No health treatments recorded
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            The herd has zero active medical treatments on file. Click "Record New Treatment" when administering veterinary care.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((rec) => (
            <motion.div
              key={rec.id}
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                    {rec.cowTag}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(rec.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {rec.diagnosis}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  <strong>Medication:</strong> {rec.treatment}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Attendant: <strong>{rec.vetName}</strong></span>
                {rec.treatmentCost > 0 && (
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    KES {Number(rec.treatmentCost).toLocaleString()}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span>Record Cow Treatment</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  &times;
                </button>
              </div>

              {feedbackMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 text-xs font-semibold">
                  {feedbackMsg}
                </div>
              )}

              <form onSubmit={handleSubmitTreatment} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Target Cow *
                  </label>
                  <select
                    value={selectedCowId}
                    onChange={(e) => setSelectedCowId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                  >
                    {cows.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.tagNumber} — {c.name || 'Unnamed'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Diagnosis / Symptoms *
                  </label>
                  <input
                    type="text"
                    required
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Mild Mastitis left quarter"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Treatment Given *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="e.g. Intramammary antibiotic infusion + 3 days milk discard"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      Vet / Attendant
                    </label>
                    <input
                      type="text"
                      value={vetName}
                      onChange={(e) => setVetName(e.target.value)}
                      placeholder="e.g. Dr. Omondi"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                      Cost (KES)
                    </label>
                    <input
                      type="number"
                      value={treatmentCost}
                      onChange={(e) => setTreatmentCost(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Health Record'}
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