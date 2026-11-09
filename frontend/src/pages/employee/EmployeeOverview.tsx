/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Milk, 
  CalendarCheck,  
  Megaphone,  
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  Send
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { authService } from '../../services/AuthService';

export default function EmployeeOverview() {
  const user = authService.getUser();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [instructions, setInstructions] = useState<any[]>([]);
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [schedData, msgData, sheetData] = await Promise.all([
          employeeService.getMySchedule().catch(() => []),
          employeeService.getMessages().catch(() => []),
          employeeService.getMyTimesheets().catch(() => []),
        ]);
        setSchedules(schedData);
        setInstructions(msgData.filter((m: any) => m.messageType === 'Instruction'));
        setTimesheets(sheetData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const nextShift = schedules[0];
  const pendingTimesheets = timesheets.filter((t) => t.status === 'Pending').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Greeting Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/15 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-100">
            Field & Shed Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
            Welcome, {user?.fullName || 'Attendant'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-1 max-w-lg">
            Your daily shift tools: record milking quantities, check assigned duties, report sick cows, and submit your work hours.
          </p>
        </div>
      </div>

      {/* Broadcast Instructions from Management */}
      {instructions.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-black text-xs uppercase tracking-wider mb-2">
            <Megaphone className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Farm Management Instructions</span>
          </div>
          <div className="space-y-2">
            {instructions.slice(0, 2).map((inst) => (
              <div key={inst.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-800/60">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{inst.subject}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{inst.content}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Posted on {new Date(inst.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Next Shift Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Next Shift</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-2">
            {nextShift ? nextShift.shiftName : 'No Upcoming Shifts'}
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {nextShift ? nextShift.assignedDuty : 'Check with farm manager for new timetable'}
          </p>
        </div>

        {/* Timesheet Approval Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Timesheets</span>
            <CalendarCheck className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-2">
            {pendingTimesheets} Claims
          </div>
          <p className="text-xs text-slate-500 mt-1">Awaiting admin wage sign-off</p>
        </div>

        {/* Quick Report Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Station Status</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-2">Online & Ready</div>
          <p className="text-xs text-slate-500 mt-1">Direct sync with farm database</p>
        </div>

      </div>

      {/* Quick Action Station Grid */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Quick Work Station Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/dashboard/employee/milking"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Milk className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Log Milking Shift</h3>
              <p className="text-xs text-slate-500 mt-1">Record morning, noon or evening cow milk liters</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Open Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/dashboard/employee/health"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Treatments & Health</h3>
              <p className="text-xs text-slate-500 mt-1">Record vaccinations, antibiotics, or vet visits</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Record Treatment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/dashboard/employee/timesheets"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Submit Timesheet</h3>
              <p className="text-xs text-slate-500 mt-1">Submit worked hours and tasks completed</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Submit Hours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/dashboard/employee/messages"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Send Report / Inquiry</h3>
              <p className="text-xs text-slate-500 mt-1">Report broken equipment or ask the farm owner</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Send Message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}