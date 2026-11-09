/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, Plus, Search,  Calendar,  X } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function SalesManagement() {
  const [sales, setSales] = useState<any[]>([]);
  const [, setSummary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'Milk' | 'Mala' | 'Cows'>('Milk');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New Sale Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [litresSold, setLitresSold] = useState('');
  const [pricePerLitre, setPricePerLitre] = useState('70');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const sum = await adminService.getSalesSummary().catch(() => null);
      setSummary(sum);

      if (activeTab === 'Milk') {
        const data = await adminService.getMilkSales();
        setSales(data);
      } else if (activeTab === 'Mala') {
        const data = await adminService.getMalaSales();
        setSales(data);
      } else {
        const data = await adminService.getCowSales();
        setSales(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSales();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'Milk') {
        await adminService.recordMilkSale({
          customerName: customerName.trim(),
          litresSold: parseFloat(litresSold),
          pricePerLitre: parseFloat(pricePerLitre),
        });
      } else if (activeTab === 'Mala') {
        await adminService.recordMalaSale({
          customerName: customerName.trim(),
          quantityLitres: parseFloat(litresSold),
          unitPrice: parseFloat(pricePerLitre),
        });
      }
      setIsModalOpen(false);
      setCustomerName('');
      setLitresSold('');
      fetchSales();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSales = sales.filter((s) =>
    (s.customerName || s.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Commercial Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Sales & Receipts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily milk sales, bottled Mala distribution, and live cow purchases.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record {activeTab} Sale</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs self-start">
          {(['Milk', 'Mala', 'Cows'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'Cows' ? 'Live Cattle Sales' : `${tab} Sales`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer / buyer..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Sales List or Empty State */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-semibold flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading sales ledger...</span>
        </div>
      ) : filteredSales.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Receipt className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            No {activeTab} sales recorded yet
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            {searchTerm
              ? `No transactions matched "${searchTerm}".`
              : `Your ${activeTab.toLowerCase()} sales ledger is currently empty. Click "Record ${activeTab} Sale" to log your first transaction.`}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSales.map((sale) => (
            <motion.div
              key={sale.id}
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {sale.customerName || sale.buyerName}
                  </h3>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Paid
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-1 mt-2">
                  {sale.litresSold && <p><strong>Quantity:</strong> {sale.litresSold} Litres</p>}
                  {sale.quantityLitres && <p><strong>Quantity:</strong> {sale.quantityLitres} Litres</p>}
                  {sale.pricePerLitre && <p><strong>Rate:</strong> KES {sale.pricePerLitre}/L</p>}
                  {sale.cowTag && <p><strong>Cattle Tag:</strong> {sale.cowTag} ({sale.cowName})</p>}
                  <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Receipt</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  KES {Number(sale.totalAmount || sale.amount).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Record Sale Modal */}
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
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-lg">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  <span>Record {activeTab} Sale</span>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordSale} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Mama Kevin or Brookside Dairy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Quantity (Litres) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={litresSold}
                      onChange={(e) => setLitresSold(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Price / Litre (KES) *
                    </label>
                    <input
                      type="number"
                      required
                      value={pricePerLitre}
                      onChange={(e) => setPricePerLitre(e.target.value)}
                      placeholder="70"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Receipt'}
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