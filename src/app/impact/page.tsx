"use client";

import { motion } from "framer-motion";
import { Quote, ArrowRight } from "lucide-react";

// In a real app, these would come from the 'warrior_stories' table in Supabase
const stories = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Cancer Warrior",
    story: "After my surgery, I felt like my world had stopped. Five Time Foundation provided the community I needed to realize that my journey was just beginning. They aren't just a foundation; they are my team.",
    image: "https://placehold.co/600x800/00A3FF/white?text=Warrior+Sarah"
  },
  {
    id: 2,
    name: "James D.",
    role: "Survivor & Fighter",
    story: "The support I received for my prosthetic care removed a weight I couldn't carry alone. Now I help mentor other warriors facing similar paths. Strength is found together.",
    image: "https://placehold.co/600x800/000000/white?text=Warrior+James"
  },
  {
    id: 3,
    name: "Elena R.",
    role: "Grit & Resilience",
    story: "Reclaiming my mobility was about more than walking—it was about reclaiming my identity. Five Time Foundation was there for every step.",
    image: "https://placehold.co/600x800/00A3FF/white?text=Warrior+Elena"
  }
];

export default function ImpactPage() {
  return (
    <div className="py-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center md:text-left">
          <span className="text-xs font-black text-brand-blue uppercase tracking-[0.5em] mb-6 block">Real Stories</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-10">
            WHO WE <br/> <span className="text-brand-blue">HELP</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            Every warrior has a story. Every donation builds a bridge to a better tomorrow.
          </p>
        </header>

        <div className="space-y-32">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-24`}
            >
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-all z-10" />
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-8">
                <Quote className="text-brand-blue/20" size={80} fill="currentColor" />
                <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                  "{story.story}"
                </h3>
                <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black">{story.name}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mt-1">{story.role}</p>
                  </div>
                  <button className="p-4 bg-brand-gray rounded-full hover:bg-brand-blue hover:text-white transition-all group">
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <section className="mt-48 bg-brand-black rounded-[4rem] py-32 px-12 text-center text-white relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-blue/10 blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-blue/10 blur-[100px]" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-10">Become Part of the <span className="text-brand-blue">Team</span></h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="bg-brand-blue text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-brand-blue/20">
                Donate to the Cause
              </button>
              <button className="bg-white/5 text-white border border-white/10 px-12 py-6 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                Share a Warrior Story
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
