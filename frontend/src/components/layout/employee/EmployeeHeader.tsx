import { Menu, Sun, Moon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { authService } from '../../../services/AuthService';

interface EmployeeHeaderProps {
  onToggleSidebar: () => void;
}

export default function EmployeeHeader({ onToggleSidebar }: EmployeeHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const user = authService.getUser();

  const getShiftLabel = () => {
    const hr = new Date().getHours();
    if (hr >= 4 && hr < 12) return 'Morning Milking Shift';
    if (hr >= 12 && hr < 17) return 'Afternoon Feeding Shift';
    return 'Evening Shift';
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      
      {/* Left: Mobile Toggle & Shift Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 lg:hidden cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Field & Shed Station
          </h2>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3 h-3" />
            <span>{getShiftLabel()}</span>
          </div>
        </div>
      </div>

      {/* Right: Theme Toggle & Staff Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          aria-label="Toggle Dark/Light Mode"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Sun className="w-4 h-4 text-amber-400" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Moon className="w-4 h-4 text-slate-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Staff User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.fullName?.charAt(0) || 'W'}
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:block">
            {user?.fullName?.split(' ')[0] || 'Attendant'}
          </span>
        </div>
      </div>
    </header>
  );
}