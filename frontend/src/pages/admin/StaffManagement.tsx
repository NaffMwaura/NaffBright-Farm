/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion, } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  Power, 
  Search, 
  AlertCircle,
  Milk,
  Phone,
  Mail
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function StaffManagement() {
  const [activeTab, setActiveTab] = useState<'Directory' | 'Timesheets' | 'Onboard'>('Directory');
  const [isLoading, setIsLoading] = useState(true);

  // Directory State
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionError, setActionError] = useState('');

  // Timesheets State
  const [timesheets, setTimesheets] = useState<any[]>([]);

  // Onboarding Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [onboardResult, setOnboardResult] = useState<any>(null);
  const [onboardError, setOnboardError] = useState('');
  const [isOnboarding, setIsOnboarding] = useState(false);

const loadData = async () => {
    setIsLoading(true);
    setActionError('');
    try {
      if (activeTab === 'Directory') {
        const data = await adminService.getEmployees();
        console.log('[StaffManagement] Fetched employees payload:', data);
        setEmployees(Array.isArray(data) ? data : []);
      } else if (activeTab === 'Timesheets') {
        const data = await adminService.getAllTimesheets();
        console.log('[StaffManagement] Fetched timesheets payload:', data);
        setTimesheets(Array.isArray(data) ? data : []);
      }
    } catch (err: unknown) {
      console.error('[StaffManagement] Error loading staff data:', err);
      const message = err instanceof Error ? err.message : 'Failed to fetch staff data from server.';
      setActionError(message);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleToggleStatus = async (id: string, name: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'reactivate';
    if (!confirm(`Are you sure you want to ${action} ${name}?`)) return;

    setActionError('');
    try {
      await adminService.toggleEmployeeStatus(id);
      setEmployees(employees.map(emp => emp.id === id ? { ...emp, isActive: !emp.isActive } : emp));
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to update employee status.');
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!confirm(`Permanently delete ${name}? This cannot be undone.`)) return;

    setActionError('');
    try {
      await adminService.deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete employee.');
    }
  };

  const handleReviewTimesheet = async (id: string, status: 'Approved' | 'Rejected', payout?: number) => {
    try {
      await adminService.reviewTimesheet(id, status, payout);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

 const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardError('');
    setOnboardResult(null);
    setIsOnboarding(true);

    try {
      const res = await adminService.registerEmployee({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
      });
      setOnboardResult(res);
      setFullName('');
      setPhoneNumber('');
      // Refresh directory in background so it appears when switching back
      adminService.getEmployees().then(data => setEmployees(Array.isArray(data) ? data : []));
    } catch (err: unknown) {
      setOnboardError(err instanceof Error ? err.message : 'Failed to register employee.');
    } finally {
      setIsOnboarding(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phoneNumber?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Workforce & Payroll
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Staff & Workforce Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage worker accounts, review shift timesheets, or onboard new employees.
          </p>
        </div>

        {/* 3-Tab Selector */}
        <div className="flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
          {(['Directory', 'Timesheets', 'Onboard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'Directory' ? 'Staff Directory' : tab === 'Timesheets' ? 'Timesheets' : 'Onboard Worker'}
            </button>
          ))}
        </div>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: STAFF DIRECTORY (View, Deactivate/Reactivate, Delete)
          ========================================================================= */}
      {activeTab === 'Directory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff by name, email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <span className="text-xs font-semibold text-slate-400 hidden sm:block">
              Total Staff: <strong className="text-slate-900 dark:text-white">{employees.length}</strong>
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400 font-semibold flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading staff roster...</span>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                No employees found
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                {searchTerm
                  ? `No employees match "${searchTerm}".`
                  : 'No workers have been registered yet. Click the "Onboard Worker" tab to create your first worker account.'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((emp) => (
                <motion.div
                  key={emp.id}
                  whileHover={{ y: -2 }}
                  className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between ${
                    emp.isActive
                      ? 'border-slate-200/80 dark:border-slate-800 shadow-xs'
                      : 'border-slate-200/50 dark:border-slate-800/50 opacity-60 bg-slate-50/50 dark:bg-slate-950/50'
                  }`}
                >
                  <div>
                    {/* Status Badge & Actions */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black text-xs">
                          {emp.fullName?.charAt(0) || 'W'}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {emp.fullName}
                          </h3>
                          <span
                            className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                              emp.isActive
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                            }`}
                          >
                            {emp.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono truncate">{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{emp.phoneNumber || 'No phone recorded'}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Milk className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span><strong>{emp.totalMilkLogs}</strong> milking logs recorded</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Toggle Active / Delete */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleStatus(emp.id, emp.fullName, emp.isActive)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        emp.isActive
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100 border border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{emp.isActive ? 'Deactivate' : 'Reactivate'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteEmployee(emp.id, emp.fullName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Permanently Delete Employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: TIMESHEETS REVIEW
          ========================================================================= */}
      {activeTab === 'Timesheets' && (
        isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-semibold flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading worker timesheets...</span>
          </div>
        ) : timesheets.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center">
            <Clock className="w-10 h-10 text-emerald-500 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No timesheets submitted</h3>
            <p className="text-xs text-slate-500 mt-1">Pending claims submitted by staff will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {timesheets.map((sheet) => (
              <div
                key={sheet.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{sheet.employeeName}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      sheet.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {sheet.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    <strong>Logged:</strong> {sheet.hoursWorked} Hours • {sheet.tasksCompleted}
                  </p>
                </div>

                {sheet.status === 'Pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReviewTimesheet(sheet.id, 'Approved', 1200)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve (KES 1,200)</span>
                    </button>
                    <button
                      onClick={() => handleReviewTimesheet(sheet.id, 'Rejected')}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* =========================================================================
          TAB 3: ONBOARD WORKER
          ========================================================================= */}
      {activeTab === 'Onboard' && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Onboard Farm Worker</h3>
            <p className="text-xs text-slate-500 mt-1">
              Creates <code className="text-emerald-600">firstname.lastname@naffbright.com</code> with temp password.
            </p>
          </div>

          {onboardError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold">
              {onboardError}
            </div>
          )}

          {onboardResult && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-1.5">
              <p className="font-bold text-sm">Worker Created Successfully!</p>
              <p>Email: <strong>{onboardResult.generatedEmail}</strong></p>
              <p>Temporary Password: <strong>{onboardResult.temporaryPassword}</strong></p>
            </div>
          )}

          <form onSubmit={handleOnboard} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Peter Kamau"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Phone Number *</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +254712345678"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isOnboarding}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              {isOnboarding ? 'Registering Worker...' : 'Create Worker Account'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}