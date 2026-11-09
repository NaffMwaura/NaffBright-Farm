/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Plus, Trash2, Filter, Calendar, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function ExpensesAdmin() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('Veterinary');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getExpenses(categoryFilter || undefined);
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExpenses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter]);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.logExpense({
        category,
        amount: parseFloat(amount),
        description: description.trim(),
      });
      setIsModalOpen(false);
      setAmount('');
      setDescription('');
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await adminService.deleteExpense(id);
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalSpent = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Cost Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Farm Expenses & Bills
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Log labor costs, electricity, fuel, veterinary meds, and facility maintenance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Filter Bar & Total Spent */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Veterinary">Veterinary</option>
            <option value="Feed">Feed Purchase</option>
            <option value="Labor">Labor & Wages</option>
            <option value="Fuel">Fuel & Transport</option>
            <option value="Utilities">Utilities & Water</option>
          </select>
        </div>

        <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
          Total Filtered: <span className="text-rose-600 dark:text-rose-400 font-black">KES {totalSpent.toLocaleString()}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-semibold flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading farm expenses...</span>
        </div>
      ) : expenses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Wallet className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            No expenses found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            {categoryFilter
              ? `No expense records under "${categoryFilter}".`
              : 'You have not recorded any farm expenses yet. Click "Log Expense" to log overhead costs.'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenses.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.category}
                  </span>
                  <span className="text-base font-black text-rose-600 dark:text-rose-400">
                    KES {Number(item.amount).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 font-medium">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDeleteExpense(item.id)}
                  className="p-1 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete Expense"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Log Expense Modal */}
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
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Log Farm Expense</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateExpense} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                  >
                    <option value="Veterinary">Veterinary</option>
                    <option value="Feed">Feed</option>
                    <option value="Labor">Labor</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Amount (KES) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details on the purchase..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                  >
                    Save Expense
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