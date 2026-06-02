'use client';

import { useEffect, useState } from 'react';
import { useStore, getSessionId } from '@/lib/store';
import { ProductGrid } from '@/components/product-grid';
import { getSiteContent } from '@/lib/supabase';
import { ShoppingBag } from 'lucide-react';

export default function MerchPage() {
  const { setProducts, setCategories, setCart, setPaymentConfigs, cart, setIsCartOpen } = useStore();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<any>({
    shopTitle: '5XFOUNDATION MERCH',
    shopSubtitle: 'Wear your support. 100% of proceeds fund prosthetics and care-related costs for cancer survivors.',
    shopBanner: '/shop_banner.png',
    shopBannerHeight: '350',
    shopBannerOverlay: '0.4',
    shopBannerSize: 'fill',
    shopBannerPosition: 'center',
    shopTitleColor: '#FFFFFF',
    shopSubtitleColor: '#E5E7EB',
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Step 1: Trigger seeding on mount if database is empty
        await fetch('/api/seed');

        // Step 1.5: Try loading cached dynamic configurations instantly
        try {
          const savedContent = localStorage.getItem('siteContent');
          if (savedContent) {
            setContent((prev: any) => ({ ...prev, ...JSON.parse(savedContent) }));
          }
        } catch (e) {}

        // Fetch fresh updates from Supabase
        try {
          const dbContent = await getSiteContent('siteContent');
          if (dbContent) {
            const parsed = JSON.parse(dbContent);
            setContent((prev: any) => ({ ...prev, ...parsed }));
            localStorage.setItem('siteContent', dbContent);
          }
        } catch (err) {
          console.error('Failed to load site dynamic configurations:', err);
        }

        // Step 2: Fetch products, categories, and payment gateway configs
        const [productsRes, categoriesRes, paymentRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/admin/payment-config'),
        ]);

        if (productsRes.ok) setProducts(await productsRes.json());
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
        if (paymentRes.ok) setPaymentConfigs(await paymentRes.json());

        // Step 3: Fetch session-based database cart items
        const sessionId = getSessionId();
        const cartRes = await fetch(`/api/cart?sessionId=${sessionId}`);
        if (cartRes.ok) setCart(await cartRes.json());
      } catch (err) {
        console.error('Failed to load store data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [setProducts, setCategories, setCart, setPaymentConfigs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Loading Storefront...</p>
        </div>
      </div>
    );
  }

  const bannerImg = content.shopBanner || '/shop_banner.png';
  const hasBanner = bannerImg.trim() !== '' && bannerImg !== 'none';

  return (
    <div className="py-24 md:py-32 px-6 sm:px-12 bg-white text-black min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Store Header Banner */}
        {hasBanner ? (
          <div 
            className="relative w-full overflow-hidden rounded-2xl md:rounded-[2.5rem] shadow-2xl flex flex-col justify-center select-none"
            style={{
              height: `${content.shopBannerHeight || '350'}px`,
              maxHeight: '60vh',
              minHeight: '220px',
              backgroundImage: `url(${bannerImg})`,
              backgroundSize: content.shopBannerSize === 'centered' ? 'contain' : content.shopBannerSize === 'stretch' ? '100% 100%' : 'cover',
              backgroundPosition: content.shopBannerPosition || 'center',
            }}
          >
            <div 
              className="absolute inset-0 bg-black transition-opacity duration-300" 
              style={{ opacity: parseFloat(content.shopBannerOverlay || '0.4') }} 
            />
            <div className="relative z-10 px-8 py-12 text-center max-w-3xl mx-auto space-y-4">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: content.shopSubtitleColor || '#E5E7EB' }}>Official Shop</span>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none"
                style={{ color: content.shopTitleColor || '#FFFFFF' }}
              >
                {content.shopTitle || '5XFOUNDATION MERCH'}
              </h1>
              <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full" />
              <p 
                className="text-sm font-medium leading-relaxed max-w-2xl mx-auto"
                style={{ color: content.shopSubtitleColor || '#E5E7EB' }}
              >
                {content.shopSubtitle || 'Wear your support. 100% of proceeds fund prosthetics and care-related costs for cancer survivors.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-600">Official Shop</span>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
              {content.shopTitle || '5XFOUNDATION MERCH'}
            </h1>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              {content.shopSubtitle || 'Wear your support. 100% of proceeds directly fund access to high-end prosthetics, ease care-related costs, and empower cancer warriors.'}
            </p>
          </div>
        )}

        {/* Dynamic Product Grid & Filters */}
        <ProductGrid />
      </div>

      {/* Floating Cart Icon for Mobile/Desktop */}
      {cart.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform border-2 border-white/20"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-3 -right-3 bg-[#0052FF] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">
              {cart.length}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
