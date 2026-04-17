"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Filter, Search } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function MerchPage() {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [v, setV] = useState(0);
  const [categories, setCategories] = useState(['All', 'T-Shirt', 'Hoodie', 'Accessory']);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    setV(Date.now());
    
    // Load from admin sync
    const savedMerch = localStorage.getItem('siteMerch');
    const savedCats = localStorage.getItem('siteCategories');
    
    if (savedMerch) {
      setProducts(JSON.parse(savedMerch));
    } else {
      // Default fallback if no admin data
      setProducts([
        { id: 't1', name: '"fckcncr" Unisex T-Shirt White', price: '30.00', category: 'T-Shirt', img: '/tshirt_white.png' },
        { id: 't2', name: '"fckcncr" Unisex T-Shirt Green', price: '30.00', category: 'T-Shirt', img: '/tshirt_green.png' },
        { id: 't3', name: '"fckcncr" Unisex T-Shirt Pink', price: '30.00', category: 'T-Shirt', img: '/tshirt_pink.png' },
        { id: 'h1', name: 'Legacy Hoodie', price: '50.00', category: 'Hoodie', img: '/hoodie_red.png' },
      ]);
    }

    if (savedCats) {
      setCategories(['All', ...JSON.parse(savedCats)]);
    }
  }, []);

  const filteredProducts = products
    .filter(p => filter === 'All' || p.category === filter)
    .sort((a, b) => {
      const pA = parseFloat(a.price);
      const pB = parseFloat(b.price);
      if (sortBy === 'Price: Low to High') return pA - pB;
      if (sortBy === 'Price: High to Low') return pB - pA;
      return 0;
    });

  return (
    <div className="py-24 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase italic">Official Merch</h1>
          <p className="text-gray-500 max-w-2xl font-medium">
            Wear your support. 100% of proceeds fund prosthetics and care-related costs for cancer survivors.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 py-6 border-y border-gray-100">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all shadow-sm ${
                  filter === cat ? 'bg-black text-white shadow-xl scale-105' : 'bg-gray-100 text-gray-400 hover:bg-black hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Filter size={14} /> Sort by:
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none font-black text-[10px] uppercase tracking-widest focus:ring-0 cursor-pointer"
            >
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex flex-col"
              >
                 <div className="relative aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-10 border border-transparent shadow-sm transition-all group-hover:shadow-2xl group-hover:border-black/5">
                  <img
                    src={`${product.img}?v=${v}`}
                    alt={product.name}
                    className="object-contain p-12 w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none">
                     <div className="bg-black/80 backdrop-blur-md text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                        <ShoppingCart size={14} /> Quick Add
                     </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-black text-xl leading-tight mb-2 uppercase tracking-tighter truncate">{product.name}</h3>
                    <div className="flex items-center gap-4">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue">{product.category}</p>
                       <div className="w-1 h-1 bg-gray-200 rounded-full" />
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.inventory} in stock</p>
                    </div>
                  </div>
                  <p className="font-black text-2xl tracking-tight text-black">${parseFloat(product.price).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
