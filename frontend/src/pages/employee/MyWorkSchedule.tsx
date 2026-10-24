/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, CheckCircle2 } from 'lucide-react';
import { employeeService } from '../../services/employeeService';

export default function MyWorkSchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const data = await employeeService.getMySchedule();
        setSchedules(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Timetable & Shift Rosters
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
          My Work Schedule
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your upcoming shifts, dates, and duties assigned by farm management.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-semibold flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading your schedule...</span>
        </div>
      ) : schedules.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center">
          <CalendarCheck className="w-10 h-10 text-emerald-500 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No upcoming shifts assigned
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            You do not have any active shifts scheduled on your roster yet. Check with the farm administrator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {item.shiftName} Shift
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(item.shiftDate).toLocaleDateString('en-KE', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.assignedDuty}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed Shift</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}