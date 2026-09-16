import { motion } from 'framer-motion';
import { MessageCircle, MapPin, ArrowUpRight } from 'lucide-react';
import logo from '../../assets/logo.png';

const WHATSAPP_PHONE = '254700000000';
const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/your-community-invite-code';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-900 pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-slate-200 dark:border-slate-900">
          
          {/* Brand & Intro (2 Cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center shrink-0">
                <img
                  src={logo}
                  alt="NaffBright Farm Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                NaffBright<span className="text-emerald-600 dark:text-emerald-500">Farm</span>
              </span>
            </a>

            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed font-normal">
              Supplying pure raw milk, thick homemade cultured mala, and verified pedigree dairy heifers. Powered by an offline-first management app built for modern dairy farmers.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Order Line</span>
              </a>

              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>Farmers Group</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </a>
            </div>
          </div>

          {/* Column 2: Farm Products */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Dairy Produce
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Fresh Whole Milk (1L+)
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Thick Cultured Mala
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Bulk Milk Supply (Wholesale)
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Scheduled Estate Drop-Offs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Livestock & Marketplace */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Cattle Marketplace
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#buy-a-cow" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Friesian Heifers (In-Calf)
                </a>
              </li>
              <li>
                <a href="#buy-a-cow" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Pure Ayrshire Heifers
                </a>
              </li>
              <li>
                <a href="#buy-a-cow" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  High-Butterfat Jersey Cows
                </a>
              </li>
              <li>
                <a href="#buy-a-cow" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Weaned Heifer Calves
                </a>
              </li>
              <li>
                <a href="#buy-a-cow" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Book a Farm Visit
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Software Console */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Farm Management
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Farm Dashboard</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    App
                  </span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Milking Shift Logs
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Breeding & AI Calendar
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Offline Shed Sync
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Staff & Vet Sign In
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Farm Gate Tag */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            &copy; {currentYear} NaffBright Farm. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
              Direct Farmgate Pickups & Cold Delivery
            </span>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              Prices
            </a>
            <a href="#buy-a-cow" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              Cows
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}