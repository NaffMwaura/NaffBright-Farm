import { motion } from 'framer-motion';
import { ShieldCheck, MessageCircle, Info } from 'lucide-react';

const WHATSAPP_PHONE = '254700000000';

interface CowListing {
  id: string;
  breed: string;
  stage: string;
  tagPrefix: string;
  expectedYield: string;
  price: string;
  description: string;
  specs: { label: string; value: string }[];
  image: string;
  isAvailable: boolean;
}

const cattleListings: CowListing[] = [
  {
    id: 'friesian-incalf',
    breed: 'Holstein-Friesian In-Calf Heifer',
    stage: 'Confirmed In-Calf (Month 6)',
    tagPrefix: 'NF-HF-202',
    expectedYield: '28 - 36 Liters/day',
    price: 'KES 175,000',
    description: 'High-volume pedigree Holstein genetics served by certified World Wide Sires semen. Strong udder attachments and deep body capacity.',
    specs: [
      { label: 'Sire Line', value: 'WWS Delta-Lambda Son' },
      { label: 'Vaccination', value: 'FMD, Anthrax, ECF Up to Date' },
      { label: 'Expected Calving', value: 'November 2026' },
      { label: 'Weight Est.', value: '440 KG' },
    ],
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: 'ayrshire-heifer',
    breed: 'Pedigree Ayrshire Heifer',
    stage: 'In-Calf (Month 5)',
    tagPrefix: 'NF-AY-118',
    expectedYield: '22 - 28 Liters/day',
    price: 'KES 145,000',
    description: 'Hardy, forage-efficient cow suited for variable weather. Known for high solids, strong feet/legs, and low somatic cell counts.',
    specs: [
      { label: 'Sire Line', value: 'Finnish Ayrshire AI' },
      { label: 'Vaccination', value: 'Fully Dewormed & ECF Tagged' },
      { label: 'Expected Calving', value: 'December 2026' },
      { label: 'Weight Est.', value: '410 KG' },
    ],
    image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: 'jersey-cross',
    breed: 'Purebred Jersey Dairy Cow',
    stage: 'Early 2nd Lactation',
    tagPrefix: 'NF-JY-049',
    expectedYield: '18 - 24 Liters/day (5.2% BF)',
    price: 'KES 135,000',
    description: 'Exceptional butterfat specialist. Produces ultra-thick cream ideal for mala, butter, and cheese. Low maintenance feed conversion.',
    specs: [
      { label: 'Sire Line', value: 'Danish Jersey Semen' },
      { label: 'Vaccination', value: 'Routine Booster Cert Verified' },
      { label: 'Current Status', value: 'Freshly Calved (Month 2)' },
      { label: 'Weight Est.', value: '380 KG' },
    ],
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: 'pedigree-calf',
    breed: 'Weaned Friesian/Ayrshire Calves',
    stage: '3 - 6 Months Old',
    tagPrefix: 'NF-CF-BATCH',
    expectedYield: 'Future Herd Replacement',
    price: 'KES 55,000',
    description: 'Disbudded, rumen-adapted young calves raised on colostrum protocol and high-protein calf starter pellets. Complete dam card provided.',
    specs: [
      { label: 'Dam Yield Avg', value: '32 L/Day' },
      { label: 'Weaning Weight', value: '95 - 120 KG' },
      { label: 'Registration', value: 'Ear-Tagged & Lineage Tracked' },
      { label: 'Diet Stage', value: 'Hay & Starter Pellets' },
    ],
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
];

export default function BuyACow() {
  const getWhatsAppInquiryUrl = (cow: CowListing) => {
    const message = `Hello NaffBright Farm, I am interested in purchasing livestock:
- Breed: ${cow.breed}
- Reference Tag: ${cow.tagPrefix}
- Listed Price: ${cow.price}
Could you share the sire/dam card, current live video, and schedule a farm visit?`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section
      id="buy-a-cow"
      className="scroll-mt-24 py-20 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Verified Livestock Marketplace
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Buy Certified Pedigree Cattle.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Upgrade your dairy herd genetics with heifers bred for high-volume milk production, longevity, and disease tolerance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Veterinary Health Certificate with Every Animal</span>
          </div>
        </div>

        {/* Livestock 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {cattleListings.map((cow) => (
            <motion.div
              key={cow.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col"
            >
              {/* Image & Stage Header */}
              <div className="relative h-64 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img
                  src={cow.image}
                  alt={cow.breed}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-900/90 text-white backdrop-blur-xs">
                    {cow.tagPrefix}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-600 text-white shadow-xs">
                    {cow.stage}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 px-3 py-1 rounded-lg text-xs font-bold text-slate-900 dark:text-white shadow-sm backdrop-blur-xs">
                  Target: {cow.expectedYield}
                </div>
              </div>

              {/* Specs & Ordering Details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {cow.breed}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                        {cow.price}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cow.description}
                  </p>

                  {/* Specification Table/Pills */}
                  <div className="mt-5 grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                    {cow.specs.map((spec, sIdx) => (
                      <div key={sIdx}>
                        <span className="text-slate-400 dark:text-slate-500 font-medium block">
                          {spec.label}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inquiry CTA */}
                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <motion.a
                    href={getWhatsAppInquiryUrl(cow)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire / Book Farm Visit</span>
                  </motion.a>

                  <a
                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`Hello, please send me the veterinary history card for tag ${cow.tagPrefix}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Request Vet Card"
                    className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}