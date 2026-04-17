"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, HeartHandshake, Rocket } from "lucide-react";

const fadeInUp: any = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const pillars = [
  {
    icon: <ShieldCheck size={32} className="text-neon-green" />,
    title: "Access to Care",
    description: "Removing financial barriers to high-quality prosthetics and essential rehabilitation care."
  },
  {
    icon: <Rocket size={32} className="text-hot-pink" />,
    title: "Reclaiming Mobility",
    description: "Specialized support programs designed to help amputees regain their physical independence."
  },
  {
    icon: <HeartHandshake size={32} className="text-neon-green" />,
    title: "Strong Community",
    description: "Building a network of warriors who provide emotional support and shared experiences."
  },
  {
    icon: <Zap size={32} className="text-hot-pink" />,
    title: "Driven by Purpose",
    description: "Empowering survivors to find new meaning and strength through their journey."
  }
];

export default function MissionPage() {
  return (
    <div className="bg-white">
      {/* Narrative Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-12"
          >
            Our <span className="text-neon-green">WHY</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8 text-xl text-gray-600 leading-relaxed text-left"
          >
            <p>
              "Five Time Foundation™ empowers cancer warriors to reclaim mobility, confidence, and connection after limb loss. We provide access to prosthetics, ease care-related costs, and build a strong, supportive community grounded in perseverance, strength, and purpose."
            </p>
            <p>
              Founded in 2016, we recognized that the journey doesn't end when treatment does. For many, the physical and financial toll of limb loss creates a new mountain to climb. We are here to provide the gear and the team to help you summit it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars of Impact */}
      <section className="py-24 bg-brand-black text-white px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <header className="mb-20 text-center">
            <h2 className="text-4xl font-bold tracking-tight mb-4">The Pillars of Five Time</h2>
            <div className="w-20 h-1 bg-neon-green mx-auto"></div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 p-10 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-24 px-6 bg-brand-gray text-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <motion.div {...fadeInUp}>
              <div className="text-6xl font-black mb-2 text-neon-green">$0</div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Cost to our Warriors</p>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <div className="text-6xl font-black mb-2 text-hot-pink">5X</div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Resilience Baseline</p>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <div className="text-6xl font-black mb-2">100%</div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Proceeds Reinvested</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
