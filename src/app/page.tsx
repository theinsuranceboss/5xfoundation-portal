"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Heart, Users, Calendar, Quote, ShoppingBag } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function StatCounter({ value, suffix = "" }: { value: number, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, value, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

function PaymentMethods() {
  const icons = [
    { name: 'Visa', src: 'https://cdn.svgporn.com/logos/visa.svg' },
    { name: 'Mastercard', src: 'https://cdn.svgporn.com/logos/mastercard.svg' },
    { name: 'Amex', src: 'https://cdn.svgporn.com/logos/amex.svg' },
    { name: 'Apple Pay', src: 'https://cdn.svgporn.com/logos/apple-pay.svg' },
    { name: 'Google Pay', src: 'https://cdn.svgporn.com/logos/google-pay-icon.svg' },
    { name: 'PayPal', src: 'https://cdn.svgporn.com/logos/paypal.svg' },
    { name: 'Discover', src: 'https://cdn.svgporn.com/logos/discover.svg' }
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
      {icons.map((icon, i) => (
        <img key={i} src={icon.src} alt={icon.name} className="h-4 md:h-5 w-auto object-contain" />
      ))}
    </div>
  );
}

const fadeInUp: any = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function Home() {
  const [v, setV] = useState(0);
  const [amount, setAmount] = useState("$50");
  const [freq, setFreq] = useState("One-time");
  
  const [content, setContent] = useState({
    heroTitle: "FIVE TIME FOUNDATION",
    heroDesc: "We provide access to prosthetics, ease care-related costs, and build a strong, supportive community for those who have experienced limb loss.",
    missionTitle: "OUR MISSION",
    missionDesc: "Five Time Foundation™ empowers cancer warriors to reclaim mobility, confidence, and connection after limb loss. Founded by 6-time survivor Rich Canci.",
    storiesTitle: "SURVIVOR STORIES",
    fundraisingTitle: "How We Raise Funds",
    fundraisingDesc: "We raise funds through nightlife events, community gatherings, and merchandise sales, creating meaningful experiences while providing vital support to cancer patients and survivors who have experienced limb loss.",
    donationTitle: "FUEL THE FIGHT",
    donationDesc: "Your contribution directly funds prosthetics, covers care-related costs, and empowers cancer survivors to reclaim their lives."
  });

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) setContent(JSON.parse(savedContent));
    
    // Small delay to ensure server wrote files, then bump version to bust cache
    setV(Date.now());
  }, []);

  const [currentHero, setCurrentHero] = useState(0);
  const heroImages = [
    `/hero_1.png?v=${v}`,
    `/hero_2.png?v=${v}`,
    `/hero_3.png?v=${v}`,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000); // 6 second slides
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section - Carousel Edition */}
      <section className="relative h-screen flex items-center text-left px-6 md:px-24 overflow-hidden">
        {/* Animated Background Carousel */}
        <div className="absolute inset-0 bg-black">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentHero}
              src={heroImages[currentHero]} 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "circOut" }}
              className="w-full h-full object-cover" 
              alt="Foundation Hero" 
            />
          </AnimatePresence>
          {/* Subtle gradient just for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent z-10" />
        </div>


        <div className="max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-[10px] md:text-sm uppercase tracking-[0.6em] text-white font-black mb-8 opacity-80">
              Empowering Cancer Warriors
            </h2>
            <h1 className="text-7xl md:text-[8.5rem] font-black text-white tracking-[-0.04em] leading-[0.75] mb-12 uppercase italic whitespace-pre-line">
              {content.heroTitle}
            </h1>


            <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-2xl leading-relaxed font-medium">
              {content.heroDesc}
            </p>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6">
              <Link
                href="/donate"
                className="bg-brand-blue text-white font-black text-xl uppercase tracking-[0.2em] px-12 py-8 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 group"
              >
                <span>Donate Now</span>
                <div className="w-3 h-3 bg-white group-hover:bg-brand-blue transition-colors" />
              </Link>
              <Link
                href="/merch"
                className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-black text-xl uppercase tracking-[0.2em] px-12 py-8 hover:bg-brand-blue hover:border-brand-blue transition-all flex items-center justify-center gap-4 group"
              >
                <span>Shop Merch</span>
                <div className="w-3 h-3 bg-brand-blue group-hover:bg-white transition-colors" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Our Mission Section */}
      <section id="mission" className="py-32 bg-white px-6 text-center border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-4xl font-black tracking-tight mb-12">
            {content.missionTitle}
          </motion.h2>
          <motion.p {...fadeInUp} transition={{ delay: 0.1 }} className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium px-4">
            {content.missionDesc}
          </motion.p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-32 bg-black text-white px-6 md:px-24 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-10">
            The "Five Time" Philosophy
          </motion.h2>
          <motion.p {...fadeInUp} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-gray-400 leading-loose">
            Named after the sheer number of times Rich had to overcome the impossible, "Five Time" represents the moment when survival becomes second nature and Thriving becomes the only objective. We believe every amputee deserves the chance to thrive, not just survive.
          </motion.p>
        </div>
      </section>

      {/* Meet Our Founder Section */}
      <section id="founder" className="py-32 bg-white px-6 md:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Founder Text */}
            <motion.div {...fadeInUp} className="space-y-10">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black">The Founder</h4>
                <h3 className="text-6xl font-black tracking-tighter">Rich Canci</h3>
              </div>

              {/* Quote Box */}
              <div className="bg-gray-50 border-l-[6px] border-[#4A5568] p-10 rounded-r-3xl">
                <p className="text-xl md:text-2xl italic text-[#2D3748] leading-relaxed font-medium">
                  "My journey with cancer didn't just test my body; it redefined my purpose. After six battles and losing a limb, I realized that the greatest medicine is community and the ability to move forward."
                </p>
              </div>

              <div className="space-y-8 text-gray-500 leading-relaxed text-lg">
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

            {/* Founder Image Container */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-brand-gray shadow-2xl relative">
                <img 
                  src={`/rich.png?v=${v}`} 
                  alt="Rich Canci - 5X Cancer Foundation Founder" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                
                {/* 6X Survivor Badge */}
                <div className="absolute bottom-[-20px] right-[-20px] bg-black text-white p-8 md:p-10 rounded-3xl shadow-2xl border-4 border-white transition-transform hover:scale-105">
                  <div className="text-4xl md:text-5xl font-black mb-1">6X</div>
                  <div className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60">Survivor</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Survivor Stories Section */}
      <section id="stories" className="py-32 bg-black px-6 md:px-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.h2 {...fadeInUp} className="text-5xl md:text-7xl font-black tracking-tight mb-24 text-center uppercase text-white italic">{content.storiesTitle}</motion.h2>
          
          {/* Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40 bg-white/5 p-12 md:p-20 rounded-[4rem] shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-blue/5 opacity-20 pointer-events-none" />
            {[
              { icon: <Heart size={40} />, val: 500, label: "Lives Impacted", suffix: "+" },
              { icon: <Users size={40} />, val: 2000, label: "Community Members", suffix: "+" },
              { icon: <Calendar size={40} />, val: 100, label: "Events Hosted", suffix: "+" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center space-y-6 relative z-10"
              >
                <div className="text-white group-hover:opacity-100 transition-opacity">{stat.icon}</div>
                <div className="text-6xl md:text-8xl font-black tracking-tighter text-brand-blue italic">
                   <StatCounter value={stat.val} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] md:text-xs uppercase font-black tracking-[0.5em] text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-24 md:gap-40">
            {/* Elena Rodriguez */}
            <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full lg:w-2/5 aspect-[4/5] rounded-[3rem] overflow-hidden bg-white/5 shadow-2xl relative group border border-white/10"
              >
                <img src="/images/stories/elena.png" alt="Elena Rodriguez" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-10 flex flex-col justify-end">
                   <p className="text-brand-blue font-black text-xs uppercase tracking-widest">Outdoor Mentor</p>
                </div>
              </motion.div>
              <motion.div {...fadeInUp} className="flex-1 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.6em] text-brand-blue font-black">Success Story</h4>
                  <h3 className="text-5xl md:text-7xl font-black tracking-tighter italic text-white leading-none">Elena Rodriguez</h3>
                </div>
                <div className="space-y-6 text-lg md:text-xl text-gray-400 leading-relaxed font-medium">
                  <p>Elena was diagnosed with osteosarcoma in her early 30s, which eventually led to an above-the-knee amputation. While she beat the cancer, the loss of her leg felt like the loss of her identity. High-performance "running blades" were financially out of reach, and she felt isolated from her old hiking groups.</p>
                  <div className="bg-white/5 p-10 rounded-3xl border-l-[6px] border-brand-blue">
                    <p className="text-white font-bold leading-loose">The foundation provided Elena with a grant to cover the out-of-pocket costs for a specialized prosthetic limb designed for athletic activity. Beyond the hardware, Elena joined a 5X-sponsored community meet-up where she met other amputee athletes. Today, she isn't just walking; she’s mentoring other survivors on how to navigate local trails.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Marcus Thorne */}
            <div className="flex flex-col lg:flex-row-reverse gap-12 md:gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full lg:w-2/5 aspect-[4/5] rounded-[3rem] overflow-hidden bg-white/5 shadow-2xl relative group border border-white/10"
              >
                <img src="/images/stories/marcus.png" alt="Marcus Thorne" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-10 flex flex-col justify-end">
                   <p className="text-brand-blue font-black text-xs uppercase tracking-widest">Creative Force</p>
                </div>
              </motion.div>
              <motion.div {...fadeInUp} className="flex-1 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.6em] text-brand-blue font-black">Success Story</h4>
                  <h3 className="text-5xl md:text-7xl font-black tracking-tighter italic text-white leading-none">Marcus Thorne</h3>
                </div>
                <div className="space-y-6 text-lg md:text-xl text-gray-400 leading-relaxed font-medium">
                  <p>Marcus faced a rare soft-tissue sarcoma that resulted in the loss of his dominant arm. As a freelancer, the mounting care-related costs—travel for treatments, specialized physical therapy, and home modifications—began to overwhelm his family’s savings.</p>
                  <div className="bg-white/5 p-10 rounded-3xl border-l-[6px] border-brand-blue">
                    <p className="text-white font-bold leading-loose">The 5X Foundation stepped in to ease the burden of care-related costs, allowing Marcus to focus on his rehabilitation without the looming threat of debt. Through the foundation’s community events, Marcus found a "supportive community grounded in purpose," eventually designing a limited-edition merchandise line for the foundation, which helped him reclaim his confidence as a creator.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Chloe Chen */}
            <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full lg:w-2/5 aspect-[4/5] rounded-[3rem] overflow-hidden bg-white/5 shadow-2xl relative group border border-white/10"
              >
                <img src="/images/stories/chloe.png" alt="Chloe Chen" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-10 flex flex-col justify-end">
                   <p className="text-brand-blue font-black text-xs uppercase tracking-widest">Academic Excellence</p>
                </div>
              </motion.div>
              <motion.div {...fadeInUp} className="flex-1 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.6em] text-brand-blue font-black">Success Story</h4>
                  <h3 className="text-5xl md:text-7xl font-black tracking-tighter italic text-white leading-none">Chloe Chen</h3>
                </div>
                <div className="space-y-6 text-lg md:text-xl text-gray-400 leading-relaxed font-medium">
                  <p>Chloe was diagnosed with cancer during her sophomore year. The surgery to save her life resulted in limb loss, and she struggled with the "why me" of it all. She felt out of place on a college campus and worried that she would never have the stamina or the self-assurance to finish her degree.</p>
                  <div className="bg-white/5 p-10 rounded-3xl border-l-[6px] border-brand-blue">
                    <p className="text-white font-bold leading-loose">Chloe attended a Five Time Foundation™ nightlife fundraiser, where she saw people celebrating life and strength despite their scars. The foundation’s "strength and perseverance" philosophy resonated with her. 5X helped facilitate a connection with a mentor—another survivor who had navigated the professional world with a prosthetic—giving Chloe the social and emotional "connection" she needed to return to school and graduate top of her class.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Raise Funds Section */}
      <section className="py-32 bg-[#1A1C23] text-white px-6 md:px-24">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <motion.h2 {...fadeInUp} className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">{content.fundraisingTitle}</motion.h2>
          <motion.p {...fadeInUp} className="text-xl text-gray-400 font-medium leading-relaxed max-w-3xl mx-auto">
            {content.fundraisingDesc}
          </motion.p>
          <motion.div {...fadeInUp} className="pt-8 flex justify-center">
            <Link
              href="/merch"
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-black text-xl uppercase tracking-[0.2em] px-16 py-8 hover:bg-brand-blue hover:border-brand-blue transition-all flex items-center justify-center gap-4 group"
            >
              <span>Shop Merchandise</span>
              <div className="w-4 h-4 bg-brand-blue group-hover:bg-white transition-colors" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Fuel the Fight - Donation Section */}
      <section id="donate" className="py-32 bg-gray-50 px-6 md:px-24">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2 {...fadeInUp} className="text-6xl md:text-7xl font-black tracking-tighter mb-6 uppercase">{content.donationTitle}</motion.h2>
          <motion.p {...fadeInUp} transition={{ delay: 0.1 }} className="text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            {content.donationDesc}
          </motion.p>
        </div>

        <motion.div 
          {...fadeInUp} 
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl flex flex-col lg:flex-row gap-12 border border-gray-100"
        >
          {/* Donation Form */}
          <div className="flex-1 space-y-10">
            {/* Frequency Tabs */}
            <div className="flex bg-gray-100 rounded-3xl p-1.5 max-w-sm">
              {["One-time", "Monthly"].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFreq(f)}
                  className={`flex-1 font-black text-[10px] py-4 rounded-2xl uppercase tracking-widest transition-all ${freq === f ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Amount Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {["$25", "$50", "$100", "$250", "$500", "$ Other"].map((amt) => (
                <button 
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-6 rounded-2xl font-black text-xl transition-all border-2 ${amount === amt ? 'border-black bg-white scale-105 shadow-xl shadow-black/5 z-10' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-brand-blue hover:bg-white hover:text-black'}`}
                >
                  {amt}
                </button>
              ))}
            </div>

            <button className="w-full bg-black text-white py-10 rounded-[2.5rem] font-black text-lg uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-brand-blue transition-all shadow-2xl shadow-black/20">
               Process Donation
            </button>

            <div className="space-y-6 pt-2">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                🛡️ Secure Encrypted Payment via Stripe
              </div>
              <PaymentMethods />
            </div>
          </div>

          {/* Impact Info */}
          <div className="lg:w-80 bg-black text-white rounded-[2.5rem] p-12 space-y-10 flex flex-col justify-between">
            <div>
              <h4 className="text-2xl font-black mb-10">Your Impact</h4>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 font-black text-sm">
                    <span className="text-xl text-brand-blue">⚡</span> $25 pays for...
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">Essential physical therapy materials for a new amputee.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 font-black text-sm">
                    <span className="text-xl text-brand-blue">❤️</span> $100 funds...
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">A specialized consultation with a prosthetic specialist.</p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/10 italic text-[11px] font-medium leading-relaxed text-gray-400">
              "Small contributions build big movements. Thank you for being part of the team."
              <span className="block mt-4 not-italic font-black text-white">— Rich Canci</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

