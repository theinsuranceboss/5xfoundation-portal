"use client";

import Link from "next/link";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
        {/* Branding */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-4 mb-8 group">
            <div className="relative w-12 h-12 bg-white rounded-full overflow-hidden border-2 border-white/10 group-hover:border-brand-blue transition-all">
               <img src={`/logo.png?v=${Date.now()}`} alt="5X Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase font-mono">5XFOUNDATION</span>
          </Link>
          <p className="text-gray-400 max-w-md leading-relaxed text-sm font-medium mb-10">
            Empowering cancer warriors to reclaim mobility, confidence, and connection after limb loss.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/FiveTimeFoundation/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://www.instagram.com/5xfoundation" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <div className="w-full">
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-10 text-brand-blue">Navigation</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-bold">
              <li><Link href="/merch" className="hover:text-white transition-colors">Official Shop</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Community Events</Link></li>
              <li><Link href="/donate" className="text-white hover:text-brand-blue transition-colors">Donate Now</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          © {currentYear} 5XFOUNDATION™. All rights reserved.
        </div>
        
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
           {[
              { name: 'Visa', src: 'https://cdn.svgporn.com/logos/visa.svg' },
              { name: 'Mastercard', src: 'https://cdn.svgporn.com/logos/mastercard.svg' },
              { name: 'Amex', src: 'https://cdn.svgporn.com/logos/amex.svg' },
              { name: 'Apple Pay', src: 'https://cdn.svgporn.com/logos/apple-pay.svg' },
              { name: 'Google Pay', src: 'https://cdn.svgporn.com/logos/google-pay-icon.svg' },
              { name: 'PayPal', src: 'https://cdn.svgporn.com/logos/paypal.svg' },
              { name: 'Discover', src: 'https://cdn.svgporn.com/logos/discover.svg' }
            ].map((icon, i) => (
              <img key={i} src={icon.src} alt={icon.name} className="h-3 md:h-4 w-auto object-contain invert" />
            ))}
        </div>
      </div>
    </footer>
  );
}
