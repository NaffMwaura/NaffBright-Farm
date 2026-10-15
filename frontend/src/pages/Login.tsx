import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  Milk,
  Activity,
  CheckCircle2,
  TrendingUp,
  Cpu,

} from 'lucide-react';
import { authService } from '../services/AuthService';
import logo from '../assets/logo.png';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [greeting, setGreeting] = useState('');
  const [timeShift, setTimeShift] = useState('');

  // 1. Dynamic Greeting Based on Time of Day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGreeting('Good Morning');
      setTimeShift('Morning Milking & Feed Shift');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
      setTimeShift('Midday Operations & Dairy Log');
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good Evening');
      setTimeShift('Evening Milking & Security Roster');
    } else {
      setGreeting('Night Duty');
      setTimeShift('Night Watch & Barn Monitoring');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });

      const session = {
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        mustChangePassword: data.mustChangePassword,
      };

      authService.setSession(data.token, session);

      if (data.mustChangePassword) {
        navigate(`/dashboard/reset?password=true&userId=${data.userId}`, { replace: true });
        return;
      }

      if (data.role === 'Admin') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        navigate('/dashboard/employee', { replace: true });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Unable to connect to the farm server. Please verify your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center relative overflow-y-auto selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      
      {/* =========================================================================
          7. Background Grid with Radial Depth Vignette
          ========================================================================= */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98112_1px,transparent_1px),linear-gradient(to_bottom,#10b98112_1px,transparent_1px)] bg-size-[28px_28px] mask-[radial-gradient(ellipse_70%_60%_at_50%_50%,#000_65%,transparent_100%)] pointer-events-none" />

      {/* Floating Ambient Atmosphere Blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-24 -right-24 w-120 h-120 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"
      />

      {/* Main Viewport Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-0 relative z-10 flex-1 flex flex-col justify-center">
        
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: Brand, Dynamic Greeting, Live Status & Farm Stats
              ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 lg:pr-4">
            
            {/* 9. Version Badge & 4. Live System Status */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Version Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold tracking-wide text-emerald-800 dark:text-emerald-300 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>v2.4.0 • Enterprise Core</span>
              </div>

              {/* Live System Status Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 shadow-xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>All Systems Operational</span>
              </div>
            </div>

            {/* Brand Header with 8. Animated Logo Glow */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {/* Radiant Logo Glow Effect */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.7, 0.35] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-1.5 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-400 blur-md pointer-events-none"
                />
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center">
                  <img src={logo} alt="NaffBright Farm" className="w-full h-full object-contain" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  NaffBright<span className="text-emerald-600 dark:text-emerald-500">Farm</span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Precision Dairy Herd & Commercial Automation
                </p>
              </div>
            </div>

            {/* 2. Dynamic Greeting */}
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 dark:text-emerald-400">
                {timeShift}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {greeting}, Farmer! 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1.5 max-w-lg">
                Log into your station to review milking production, update health regimens, and manage daily dairy schedules.
              </p>
            </div>

            {/* 3. Farm Statistics Section */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active Herd</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">100%</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Tracked Digitally
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Milking Shifts</span>
                  <Milk className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">3 Shifts</div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 block">
                  Morning • Noon • Evening
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Cloud Engine</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">99.98%</div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">
                  Encrypted Sync
                </span>
              </div>
            </div>

            {/* Offline & Cloud Note */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Cattle and shift data automatically sync as soon as network is detected.</span>
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN: 5. Upgraded Glass Effect & 6. Animated Hover Login Card
              ========================================================================= */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-slate-800/90 shadow-2xl backdrop-blur-2xl transition-all"
            >
              
              <div className="mb-5">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Sign In To Station
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Enter your registered farm email and password to proceed.
                </p>
              </div>

              {/* Error Message Alert */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold mb-4"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Work Email Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Work Email
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">admin or name@naffbright.com</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.name@naffbright.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/15 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Role Help Pill Accordion / Hint */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                    <span>Role-Based Dispatch</span>
                  </div>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Owner & Attendants</span>
                </div>

                <div className="text-center pt-1">
                  <Link
                    to="/"
                    className="text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>&larr;</span>
                    <span>Return to public farm homepage</span>
                  </Link>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}