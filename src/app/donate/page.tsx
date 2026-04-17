"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Zap, CreditCard } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/stripe";

export default function DonatePage() {
  const [frequency, setFrequency] = useState<'One-time' | 'Monthly'>('One-time');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const amounts = [25, 50, 100, 250, 500];

  const handleDonate = async () => {
    setLoading(true);
    const result = await createCheckoutSession(amount, frequency);
    if (result.success) {
      // In a real app, this would be a full redirect to Stripe
      window.location.href = result.url;
    }
    setLoading(false);
  };

  return (
    <div className="py-24 px-6 min-h-screen bg-brand-gray/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black tracking-tighter mb-6"
          >
            FUEL THE <span className="text-hot-pink">FIGHT</span>
          </motion.h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Your contribution directly funds prosthetics, covers care-related costs, and empowers cancer survivors to reclaim their lives.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Donation Form */}
          <div className="lg:col-span-3">
            {/* Frequency Toggle */}
            <div className="flex bg-brand-gray p-1.5 rounded-2xl mb-10">
              {['One-time', 'Monthly'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f as any)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    frequency === f ? 'bg-white shadow-md text-brand-black' : 'text-gray-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Amount Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {amounts.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAmount(a); setCustomAmount(''); }}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                    amount === a && !customAmount ? 'border-neon-green bg-neon-green/5 text-brand-black' : 'border-gray-100 hover:border-gray-200 text-gray-400'
                  }`}
                >
                  ${a}
                </button>
              ))}
              <div className="relative col-span-3 sm:col-span-1">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                <input
                  type="number"
                  placeholder="Other"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount(Number(e.target.value));
                  }}
                  className="w-full pl-10 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-neon-green focus:ring-0 font-bold"
                />
              </div>
            </div>

            <button 
              onClick={handleDonate}
              disabled={loading}
              className="w-full bg-brand-black text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95 mb-8 disabled:opacity-50"
            >
              {loading ? "Initializing..." : <><CreditCard size={24} /> Process Donation</>}
            </button>

            <div className="flex items-center justify-center gap-4 text-gray-400 text-xs uppercase tracking-widest font-bold">
              <ShieldCheck size={16} className="text-neon-green" />
              Secure encrypted payment via Stripe
            </div>
          </div>

          {/* Impact Sidebar */}
          <div className="lg:col-span-2 bg-brand-black rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-8 text-neon-green">Your Impact</h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1"><Zap size={20} className="text-hot-pink" /></div>
                <div>
                  <h4 className="font-bold mb-1">$25 pays for...</h4>
                  <p className="text-gray-400 text-sm">Essential physical therapy materials for a new amputee.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><Heart size={20} className="text-neon-green" /></div>
                <div>
                  <h4 className="font-bold mb-1">$100 funds...</h4>
                  <p className="text-gray-400 text-sm">A specialized consultation with a prosthetic specialist.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/10">
              <p className="text-sm text-gray-400 italic">
                "Small contributions build big movements. Thank you for being part of the team." 
                <span className="block mt-4 font-bold not-italic text-white">— Rich Canci</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
