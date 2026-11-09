/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { TrendingUp, ArrowDownRight, ArrowUpRight, } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function FinanceReports() {
  const [finance, setFinance] = useState<any>(null);
  const [period, setPeriod] = useState<'30' | '90' | '365'>('30');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinance = async () => {
      setIsLoading(true);
      try {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - parseInt(period));
        const data = await adminService.getProfitAndLoss(fromDate.toISOString());
        setFinance(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinance();
  }, [period]);

  const formatKES = (val: number = 0) =>
    `KES ${Number(val).toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Accounting & Audit
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Profit & Loss Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic ledger math reconciling revenues against operational, vet, and feed costs.
          </p>
        </div>

        {/* Period Selector Dropdown */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500 cursor-pointer self-start sm:self-auto"
        >
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Current Year (365 Days)</option>
        </select>
      </div>

      {/* 3 Master Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Farm Revenue</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-3">
            {isLoading ? '...' : formatKES(finance?.revenue?.totalRevenue)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Milk, Mala & Live Cattle sales</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Farm Expenses</span>
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-3">
            {isLoading ? '...' : formatKES(finance?.expenses?.totalExpenses)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Feeds, vet bills, labor & fuel</p>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/20">
          <div className="flex justify-between items-center text-emerald-100">
            <span className="text-xs font-bold uppercase tracking-wider">Net Farm Profit</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black mt-3">
            {isLoading ? '...' : formatKES(finance?.netProfit)}
          </div>
          <span className="text-xs font-bold text-emerald-100 mt-1 block">
            Profit Margin: {finance?.profitMarginPercent ?? 0}%
          </span>
        </div>
      </div>

      {/* Itemized Revenue vs Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
            Revenue Streams
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Raw Milk Sales</span>
              <strong className="text-emerald-600">{formatKES(finance?.revenue?.milkSales)}</strong>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Mala Bottle Sales</span>
              <strong className="text-emerald-600">{formatKES(finance?.revenue?.malaSales)}</strong>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Cattle Market Sales</span>
              <strong className="text-emerald-600">{formatKES(finance?.revenue?.cowSales)}</strong>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
            Operating Expenditures
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Feed, Labor & Utilities</span>
              <strong className="text-rose-600">{formatKES(finance?.expenses?.generalOperations)}</strong>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Veterinary & Vaccinations</span>
              <strong className="text-rose-600">{formatKES(finance?.expenses?.veterinaryCosts)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}