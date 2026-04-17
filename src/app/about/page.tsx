"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-[0.4em] text-gray-500 font-black mb-6">The Founder</h2>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-10 leading-none">
              Rich <span className="text-neon-green">Canci</span>
            </h1>
            <div className="space-y-6 text-xl text-gray-600 leading-relaxed italic border-l-4 border-hot-pink pl-8 py-4 bg-brand-gray/50 rounded-r-2xl">
              "My journey with cancer didn't just test my body; it redefined my purpose. After six battles and losing a limb, I realized that the greatest medicine is community and the ability to move forward."
            </div>
            <div className="mt-12 space-y-6 text-gray-600">
              <p>
                Rich Canci is a proud six-time cancer survivor and amputee who founded the Five Time Foundation™ in 2016. After facing the immense physical, emotional, and financial challenges that come with multi-stage cancer treatments and eventual limb loss, Rich dedicated his life to ensuring others don't have to walk that path alone.
              </p>
              <p>
                His story is one of unwavering perseverance. From the first diagnosis to the final reclamation of his mobility with a prosthetic limb, Rich has embodied the "Five Time" spirit—a baseline of resilience that expects challenges but refuses to be defined by them.
              </p>
              <p>
                Today, Rich personally oversees the foundation's efforts, connecting with warriors, sourcing high-end prosthetics, and advocating for amputee rights and accessibility across the globe.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-brand-gray rounded-[2rem] overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                [ Rich Canci Portrait Placeholder ]
              </div>
              {/* Image would go here: <Image src="/rich-canci.jpg" alt="Rich Canci" fill className="object-cover" /> */}
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-neon-green/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-hot-pink/20 rounded-full blur-3xl -z-10" />
            
            <div className="absolute -bottom-6 -right-6 bg-brand-black text-white p-8 rounded-2xl shadow-xl z-20">
              <div className="text-4xl font-black text-neon-green">6X</div>
              <div className="text-xs uppercase tracking-widest font-bold opacity-70">Survivor</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-brand-black px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">The "Five Time" Philosophy</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Named after the sheer number of times Rich had to overcome the impossible, "Five Time" represents the moment when survival becomes second nature and Thriving becomes the only objective. We believe every amputee deserves the chance to thrive, not just survive.
          </p>
        </div>
      </section>
    </div>
  );
}
