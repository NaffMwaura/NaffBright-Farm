/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare,  Plus, Clock, } from 'lucide-react';
import { employeeService } from '../../services/employeeService';

export default function EmployeeInquiries() {
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Report' | 'Inquiry'>('All');
  const [isLoading, setIsLoading] = useState(true);

  // New Message Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageType, setMessageType] = useState<'Report' | 'Inquiry'>('Report');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) return;

    setIsSending(true);
    try {
      await employeeService.sendMessage({
        messageType,
        subject: subject.trim(),
        content: content.trim(),
      });
      setIsModalOpen(false);
      setSubject('');
      setContent('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const filtered = messages.filter((m) =>
    activeTab === 'All' ? true : m.messageType === activeTab
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Internal Communication Channel
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Reports & Inquiries
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Send shed incident reports, request feeds or supplies, and read manager instructions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Report / Inquiry</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs self-start">
        {(['All', 'Report', 'Inquiry'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {tab === 'All' ? 'All Communications' : `${tab}s`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-semibold flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading messages...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center">
          <MessageSquare className="w-10 h-10 text-emerald-500 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No communications found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            You haven't submitted any inquiries or reports yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((msg) => (
            <motion.div
              key={msg.id}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                msg.messageType === 'Instruction'
                  ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      msg.messageType === 'Instruction'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : msg.messageType === 'Report'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}
                  >
                    {msg.messageType}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {msg.subject}
                  </h3>
                </div>

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {msg.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
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
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>Send Message to Management</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 cursor-pointer">
                  &times;
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Category *
                  </label>
                  <select
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                  >
                    <option value="Report">Incident / Status Report</option>
                    <option value="Inquiry">General Question / Request</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Broken water pipe in Shed B"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Detail the issue or inquiry clearly..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                  >
                    {isSending ? 'Sending...' : 'Send to Admin'}
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