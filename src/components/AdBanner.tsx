"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { getActiveAds, recordAdClick } from "@/lib/supabase";

interface AdBannerProps {
  location: 'footer' | 'sidebar';
}

export default function AdBanner({ location }: AdBannerProps) {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAd() {
      const { data, error } = await getActiveAds(location);
      if (!error && data && data.length > 0) {
        // Simple logic: pick a random active ad for the location
        const randomAd = data[Math.floor(Math.random() * data.length)];
        setAd(randomAd);
      }
      setLoading(false);
    }
    fetchAd();
  }, [location]);

  const handleClick = async () => {
    if (ad) {
      await recordAdClick(ad.id);
    }
  };

  if (loading) return <div className="animate-pulse bg-gray-100 rounded-xl h-24 w-full" />;
  if (!ad) return null;

  return (
    <div className={`relative group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all shadow-sm hover:shadow-md ${location === 'sidebar' ? 'aspect-square' : 'w-full'}`}>
      <a 
        href={ad.link_url} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block h-full w-full"
      >
        <div className="absolute inset-x-0 top-0 p-4 z-10 bg-gradient-to-b from-black/20 to-transparent pointer-events-none">
          <span className="text-[10px] uppercase font-bold text-white tracking-widest bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">Sponsored</span>
        </div>
        
        <img 
          src={ad.image_url || 'https://placehold.co/600x400?text=Your+Ad+Here'} 
          alt={ad.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />

        <div className="absolute bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
          <span className="font-bold text-xs truncate max-w-[70%]">{ad.name}</span>
          <ExternalLink size={14} className="text-gray-400" />
        </div>
      </a>
    </div>
  );
}
