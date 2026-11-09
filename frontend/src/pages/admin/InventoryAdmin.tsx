/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, AlertTriangle,  ArrowUpDown, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function InventoryAdmin() {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Feed Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedName, setFeedName] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [costPerKg, setCostPerKg] = useState('15');
  const [reorderThresholdKg, setReorderThresholdKg] = useState('100');

  // Adjust Stock Modal
  const [adjustTarget, setAdjustTarget] = useState<any>(null);
  const [changeKg, setChangeKg] = useState('');
  const [reason, setReason] = useState('Restock purchase');

  const fetchFeeds = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getFeedInventory();
      setFeeds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeeds();
  }, []);

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.addFeed({
        feedName: feedName.trim(),
        quantityKg: parseFloat(quantityKg),
        costPerKg: parseFloat(costPerKg),
        reorderThresholdKg: parseFloat(reorderThresholdKg),
      });
      setIsModalOpen(false);
      setFeedName('');
      setQuantityKg('');
      fetchFeeds();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTarget) return;
    try {
      await adminService.adjustFeedStock(adjustTarget.id, parseFloat(changeKg), reason);
      setAdjustTarget(null);
      setChangeKg('');
      fetchFeeds();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Nutrition & Silage Reserves
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Feed Inventory & Stocks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor dairy meal bags, silage levels, and configure automated low-stock warnings.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Feed Type</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-semibold flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading feed stock...</span>
        </div>
      ) : feeds.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            No feed inventory recorded
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            You haven't added any feed stocks yet. Add feeds like Silage, Hay, and Dairy Meal to prevent deficits.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feeds.map((feed) => (
            <motion.div
              key={feed.id}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                feed.isLowStock
                  ? 'border-amber-400 dark:border-amber-700 shadow-sm shadow-amber-500/10'
                  : 'border-slate-200/80 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {feed.feedName}
                </h3>
                {feed.isLowStock ? (
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Low Stock
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Adequate
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 space-y-1 mt-3">
                <p><strong>Available:</strong> <span className="text-sm font-black text-slate-900 dark:text-white">{feed.quantityKg} Kg</span></p>
                <p><strong>Cost per Kg:</strong> KES {feed.costPerKg}</p>
                <p><strong>Alert Threshold:</strong> {feed.reorderThresholdKg} Kg</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => setAdjustTarget(feed)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Adjust Stock</span>
                </button>
                <span className="text-xs text-slate-400 font-semibold">
                  Est. Val: KES {Number(feed.estimatedTotalValue).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Adjust Stock Modal */}
      <AnimatePresence>
        {adjustTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Adjust {adjustTarget.feedName} Stock
                </h3>
                <button onClick={() => setAdjustTarget(null)} className="text-slate-400 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAdjustStock} className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Change in Kg (Positive to add, Negative to deduct) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={changeKg}
                    onChange={(e) => setChangeKg(e.target.value)}
                    placeholder="e.g. 200 or -50"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Reason / Shift Log
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAdjustTarget(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                  >
                    Confirm Stock Change
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Feed Modal */}
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
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add New Feed Item</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddFeed} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Feed Name *</label>
                  <input
                    type="text"
                    required
                    value={feedName}
                    onChange={(e) => setFeedName(e.target.value)}
                    placeholder="e.g. Silage"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Initial Kg *</label>
                    <input
                      type="number"
                      required
                      value={quantityKg}
                      onChange={(e) => setQuantityKg(e.target.value)}
                      placeholder="500"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Cost/Kg (KES)</label>
                    <input
                      type="number"
                      value={costPerKg}
                      onChange={(e) => setCostPerKg(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Alert Threshold Kg</label>
                  <input
                    type="number"
                    value={reorderThresholdKg}
                    onChange={(e) => setReorderThresholdKg(e.target.value)}
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
                    Save Feed Item
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