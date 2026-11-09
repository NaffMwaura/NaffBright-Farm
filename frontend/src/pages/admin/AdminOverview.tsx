/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Milk, 
  Receipt, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const [kpis, setKpis] = useState<any>(null);
  const [finance, setFinance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [kpiData, finData] = await Promise.all([
        adminService.getDashboardKpis().catch(() => null),
        adminService.getProfitAndLoss().catch(() => null),
      ]);
      setKpis(kpiData);
      setFinance(finData);
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

  const formatKES = (val: number = 0) => 
    `KES ${Number(val).toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Executive Control & Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Farm Overview & Calculations
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-xs cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>

          <Link
            to="/dashboard/admin/cows"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Cow</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Herd */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Cattle Herd</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">
            {isLoading ? '...' : kpis?.totalCows ?? 0}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{kpis?.healthyCows ?? 0} Healthy</span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">{kpis?.pregnantCows ?? 0} Pregnant</span>
          </div>
        </motion.div>

        {/* Today's Milk Output */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Milk Yield</span>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60">
              <Milk className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">
            {isLoading ? '...' : `${kpis?.todayMilkOutputLitres ?? 0} L`}
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">Recorded across active shifts</p>
        </motion.div>

        {/* Today's Revenue */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Milk Sales</span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">
            {isLoading ? '...' : formatKES(kpis?.todaySalesAmount)}
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">Direct sales & buyer receipts</p>
        </motion.div>

        {/* Dynamic Net Profit */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-6 rounded-3xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Calculated Net Profit</span>
            <div className="p-2.5 rounded-xl bg-white/20 text-white backdrop-blur-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black mt-3">
            {isLoading ? '...' : formatKES(finance?.netProfit)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-emerald-100 font-semibold">
            <span>Margin: {finance?.profitMarginPercent ?? 0}%</span>
            <span>Revenue - Expenses</span>
          </div>
        </motion.div>
      </div>

      {/* Financial Math Summary Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Dynamic Profit & Loss Calculation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Formula: Revenue (Milk + Mala + Cow Sales) minus Expenses (Feed, Labor, Vet).
            </p>
          </div>
          <Link
            to="/dashboard/admin/finance"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Detailed Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-xs font-semibold text-slate-500">Gross Revenue (Period)</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {formatKES(finance?.revenue?.totalRevenue)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-xs font-semibold text-slate-500">Farm Expenses & Vet Costs</span>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {formatKES(finance?.expenses?.totalExpenses)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-xs font-semibold text-slate-500">Realized Profit Margin</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {finance?.profitMarginPercent ?? 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Low Feed Alerts Section */}
      {kpis?.lowFeedAlerts?.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 font-bold text-sm mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Low Feed Inventory Warning</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {kpis.lowFeedAlerts.map((feed: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">{feed.feedName}</span>
                <span className="text-rose-600 font-black">{feed.quantityKg} Kg left</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}