/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Trash2,
  X,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function CowsManagement() {
  const [cows, setCows] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New Cow Registration Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagNumber, setTagNumber] = useState('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('Holstein-Friesian');
  const [purchasePrice, setPurchasePrice] = useState('0');
  const [status, setStatus] = useState('Healthy');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCows = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCows(statusFilter || undefined);
      setCows(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCows();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleCreateCow = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      await adminService.createCow({
        tagNumber: tagNumber.trim().toUpperCase(),
        name: name.trim(),
        breed,
        purchasePrice: parseFloat(purchasePrice) || 0,
        status,
      });

      setIsModalOpen(false);
      setTagNumber('');
      setName('');
      fetchCows();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Failed to register cow.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCow = async (id: string, tag: string) => {
    if (!confirm(`Are you sure you want to remove cow ${tag}?`)) return;
    try {
      await adminService.deleteCow(id);
      setCows(cows.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCows = cows.filter(c => 
    c.tagNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.breed?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Livestock Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Cow Herd & Records
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain complete ear-tag profiles, health statuses, and breeding records.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Cow</span>
        </button>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
          >
            <option value="">All Herd Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Sick">Sick</option>
            <option value="Pregnant">Pregnant</option>
            <option value="Dry">Dry Period</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        {/* Tag / Name Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ear tag, name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Cows Grid or Empty State */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-semibold flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading cattle profiles...</span>
        </div>
      ) : filteredCows.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <ClipboardList className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            No cows found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            {searchTerm 
              ? `No cattle records match "${searchTerm}".`
              : 'There are no cattle listed under this filter. Click "Register New Cow" to record your first animal.'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCows.map((cow) => (
            <motion.div
              key={cow.id}
              whileHover={{ y: -3 }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                      {cow.tagNumber}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-2">
                      {cow.name || 'Unnamed Cow'}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      cow.status === 'Healthy'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : cow.status === 'Sick'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        : cow.status === 'Pregnant'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {cow.status}
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1 mt-3">
                  <p><strong>Breed:</strong> {cow.breed}</p>
                  <p><strong>Lifetime Milk:</strong> {cow.totalMilkRecorded || 0} Litres</p>
                  {cow.latestHealthCheck && (
                    <p className="text-amber-600 dark:text-amber-400">
                      <strong>Latest Note:</strong> {cow.latestHealthCheck}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => handleDeleteCow(cow.id, cow.tagNumber)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove Cow"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Registration Modal */}
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
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  <span>Register New Cow</span>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateCow} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Ear-Tag Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={tagNumber}
                    onChange={(e) => setTagNumber(e.target.value)}
                    placeholder="e.g. NB007"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500 uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Daisy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Breed
                    </label>
                    <select
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
                    >
                      <option value="Holstein-Friesian">Holstein-Friesian</option>
                      <option value="Ayrshire">Ayrshire</option>
                      <option value="Jersey">Jersey</option>
                      <option value="Guernsey">Guernsey</option>
                      <option value="Fleckvieh">Fleckvieh</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
                    >
                      <option value="Healthy">Healthy</option>
                      <option value="Sick">Sick</option>
                      <option value="Pregnant">Pregnant</option>
                      <option value="Dry">Dry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Purchase Price (KES)
                  </label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
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
                    {isSubmitting ? 'Saving...' : 'Save Cow Record'}
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