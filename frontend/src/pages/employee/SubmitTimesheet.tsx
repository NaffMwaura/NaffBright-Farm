/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import {  CheckCircle2,  AlertCircle, } from 'lucide-react';
import { employeeService } from '../../services/employeeService';

export default function SubmitTimesheet() {
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [hours, setHours] = useState('');
  const [tasks, setTasks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTimesheets = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getMyTimesheets();
      setTimesheets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTimesheets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hours || !tasks) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await employeeService.submitTimesheet({
        hoursWorked: parseFloat(hours),
        tasksCompleted: tasks.trim(),
      });

      setSuccessMsg('Timesheet submitted successfully for management approval.');
      setHours('');
      setTasks('');
      fetchTimesheets();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error submitting timesheet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Labor & Wage Claims
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
          Submit Timesheets
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Log your completed shifts and duties to claim payment and track approval records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Card (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">
            Log Today's Work Shift
          </h3>

          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Hours Worked *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                required
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g. 8"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Tasks Completed *
              </label>
              <textarea
                required
                rows={3}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder="e.g. Cleaned stalls, fed herd 200kg silage, milked 8 cows in morning shift."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
            >
              {isSubmitting ? 'Submitting claim...' : 'Submit For Approval'}
            </button>
          </form>
        </div>

        {/* History List (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              My Submitted Timesheets
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{timesheets.length} Total</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading your history...</div>
          ) : timesheets.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No timesheets submitted yet. Fill out the form on the left to claim your shift.
            </div>
          ) : (
            <div className="space-y-3 mt-3">
              {timesheets.map((sheet) => (
                <div
                  key={sheet.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {sheet.hoursWorked} Hours
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          sheet.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : sheet.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {sheet.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                      {sheet.tasksCompleted}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Date: {new Date(sheet.workDate).toLocaleDateString()}
                    </span>
                  </div>

                  {sheet.approvedPaymentAmount && (
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Approved Payout</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        KES {Number(sheet.approvedPaymentAmount).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}