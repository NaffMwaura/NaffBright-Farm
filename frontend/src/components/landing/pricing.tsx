import { motion } from 'framer-motion';
import { Check, ShoppingBag } from 'lucide-react';

// Replace with your farm's WhatsApp business number
const WHATSAPP_PHONE = '254700000000';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  badge?: string;
  image: string;
}

const products: Product[] = [
  {
    id: 'milk-daily',
    name: 'Fresh Raw Milk',
    category: 'Daily Fresh',
    price: 'KES 70',
    unit: 'per Liter',
    description: '100% pure, unboiled whole milk straight from our morning and evening milking. Chilled immediately to stay sweet and fresh.',
    features: [
      'High natural cream (thick butterfat)',
      'Zero added water — pure milk',
      'From clean, healthy, vet-checked cows',
      'Delivered cold and ready to boil',
    ],
    badge: 'Daily Favorite',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mala-classic',
    name: 'Thick Cultured Mala',
    category: 'Natural Yogurt / Mala',
    price: 'KES 120',
    unit: 'per Liter',
    description: 'Thick, creamy sour milk made the traditional way. Naturally fermented with a smooth texture and rich, refreshing taste.',
    features: [
      'Thick and velvety texture',
      'No artificial thickeners or chemicals',
      'Healthy for digestion and gut health',
      'Available in 1L, 2L, and 5L bottles',
    ],
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'milk-bulk',
    name: 'Wholesale / Bulk Milk',
    category: 'Hotels & Milk Bars',
    price: 'KES 62',
    unit: 'per Liter (20L Min)',
    description: 'Reliable supply for local milk bars, bakeries, cafes, and schools. Supplied daily in sanitized aluminum cans.',
    features: [
      'Discounted bulk price',
      'Early morning delivery (before 6:30 AM)',
      'Consistent daily supply, rain or shine',
      'Tested for purity with every batch',
    ],
    badge: 'Business Wholesale',
    // New reliable Unsplash image for fresh farm milk supply
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80',
  },
];

export default function Pricing() {
  const getWhatsAppOrderUrl = (product: Product) => {
    const message = `Hello NaffBright Farm, I would like to order:
- Product: ${product.name}
- Price: ${product.price} (${product.unit})

Please let me know how to get my order delivered.`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section
      id="pricing"
      className="scroll-mt-24 py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Fresh Produce
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Direct Farm Prices.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Get pure whole milk and thick homemade mala directly from our cows. Pick up fresh at the farm gate or request doorstep delivery.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all"
            >
              {/* Product Image */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {item.badge && (
                  <span className="absolute top-3.5 right-3.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-md">
                    {item.badge}
                  </span>
                )}
                <span className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-xs">
                  {item.category}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {item.price}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      /{item.unit.replace('per ', '')}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Feature Bullets */}
                  <ul className="mt-5 space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WhatsApp Order Button */}
                <div className="mt-7 pt-5 border-t border-slate-200 dark:border-slate-800">
                  <motion.a
                    href={getWhatsAppOrderUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order via WhatsApp</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}