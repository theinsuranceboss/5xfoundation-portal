"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, ShieldCheck } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "HOME", href: "/" },
  { name: "FOUNDER", href: "#founder" },
  { name: "SHOP", href: "/merch" },
  { name: "EVENTS", href: "/events" },
  { name: "DONATE", href: "/donate" },
];


export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-6 py-4 md:px-12">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo Home Button */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden transition-transform group-hover:scale-110 duration-300">
            <img 
              src={`/logo.png?v=${Date.now()}`} 
              alt="5X Cancer Foundation Logo" 
              className="w-full h-full object-contain"
            />
          </div>


          <span className="hidden sm:block text-xl font-black tracking-tighter text-black">
            5XFOUNDATION
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[10px] font-black tracking-[0.2em] transition-all hover:text-brand-blue",
                pathname === item.href ? "text-brand-blue" : "text-black"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Icons & Admin */}
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/dashboard" 
            className="hidden md:flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            <ShieldCheck size={16} />
            ADMIN PORTAL
          </Link>
          
          <Link href="/cart" className="text-black hover:text-brand-blue transition-colors">
            <ShoppingBag size={20} strokeWidth={2.5} />
          </Link>

          <button
            className="lg:hidden p-2 text-black"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-8 flex flex-col gap-6 shadow-xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-black tracking-widest text-black"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-sm font-black tracking-widest text-gray-400 flex items-center gap-2 border-t pt-4"
            >
              <ShieldCheck size={18} />
              ADMIN PORTAL
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
