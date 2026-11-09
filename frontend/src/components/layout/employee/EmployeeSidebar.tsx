import { NavLink, useNavigate } from 'react-router-dom';
import {
  Clock,
  Milk,
  Stethoscope,
  CalendarCheck,
  FileSpreadsheet,
  Send,
  LogOut,
  X,
} from 'lucide-react';
import { authService } from '../../../services/AuthService';
import logo from '../../../assets/logo.png';

interface EmployeeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeSidebar({ isOpen, onClose }: EmployeeSidebarProps) {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.clearSession();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Work Station Home', path: '/dashboard/employee', icon: Clock, end: true },
    { label: 'Log Milking Shift', path: '/dashboard/employee/milking', icon: Milk },
    { label: 'Treatments & Health', path: '/dashboard/employee/health', icon: Stethoscope },
    { label: 'My Work Schedule', path: '/dashboard/employee/schedule', icon: CalendarCheck },
    { label: 'Submit Timesheets', path: '/dashboard/employee/timesheets', icon: FileSpreadsheet },
    { label: 'Reports & Inquiries', path: '/dashboard/employee/messages', icon: Send },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Banner */}
        <div className="h-20 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl p-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 dark:text-white tracking-tight">NaffBright</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400">
                  Worker
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Field & Shed Station</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 custom-scrollbar">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Daily Duties
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* User Card & Sign Out */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.fullName?.charAt(0) || 'W'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.fullName || 'Farm Attendant'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'staff@naffbright.com'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Station</span>
          </button>
        </div>
      </aside>
    </>
  );
}