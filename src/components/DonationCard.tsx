'use client';

import { useState, useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    paypal?: any;
  }
}

export function DonationCard() {
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [tier, setTier] = useState<number | "other">(5);
  const [otherAmount, setOtherAmount] = useState<string>("");
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.paypal) {
        setIsSdkLoaded(true);
        return;
      }

      // Check if script is already in document
      const script = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (script) {
        const handleLoad = () => setIsSdkLoaded(true);
        script.addEventListener("load", handleLoad);

        const interval = setInterval(() => {
          if (window.paypal) {
            setIsSdkLoaded(true);
            clearInterval(interval);
          }
        }, 100);

        return () => {
          script.removeEventListener("load", handleLoad);
          clearInterval(interval);
        };
      }
    }
  }, []);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "AVrTrX38Se2i3orog_E2JzqkaqouA68T2MkcshUPBLJe_F-woWnUMvwRGJEFWjnylukTSUus1hIFNK2a";
  const stripeLink = "https://buy.stripe.com/00wcN5gCLf9c4iUcLD4ow00";

  const baseAmount = tier === "other" ? parseFloat(otherAmount || "0") : tier;
  const totalAmount = (baseAmount * multiplier).toFixed(2);

  const handleStripeCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout/stripe-donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, frequency }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start Stripe checkout');
      }
    } catch (err) {
      console.error(err);
      alert('Error during checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    if (isSdkLoaded && window.paypal) {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = ''; 
        window.paypal.Buttons({
          style: { layout: "vertical", shape: "rect", color: "gold", label: "paypal", height: 48 },
          fundingSource: window.paypal.FUNDING.PAYPAL, // Force only PayPal, disables card/venmo
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [{
                amount: {
                  currency_code: "USD",
                  value: totalAmount,
                },
                description: `${frequency === 'monthly' ? 'Monthly ' : ''}Donation to Five Time Foundation`
              }],
            });
          },
          onApprove: async (data: any, actions: any) => {
            if (actions.order) {
              const details = await actions.order.capture();
              alert(`Thank you for your donation, ${details.payer?.name?.given_name}!`);
            }
          }
        }).render("#paypal-button-container");
      }
    }
  }, [isSdkLoaded, totalAmount, frequency]);

  return (
    <>
    <div className="w-full max-w-5xl mx-auto bg-white rounded-[1rem] shadow-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row p-6 md:p-8 gap-8">
      
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons&disable-funding=card,credit,venmo,paylater`}
        strategy="afterInteractive"
        onLoad={() => setIsSdkLoaded(true)}
      />

      {/* Left Side: Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="relative w-full aspect-square rounded-sm overflow-hidden border border-gray-100 shadow-sm">
          <img 
            src="/api/gdrive/image?id=127m0isss4YxJAZYGIddmCLQ4fYHIQZjP" 
            alt="Thank you for your donations" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className="space-y-6">
          
          {/* Header */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.15em] mb-1">5X FOUNDATION</h4>
            <h2 className="text-[28px] md:text-[34px] font-black uppercase text-black leading-[1.1] mb-3">
              DIRECT FOUNDATION<br/>DONATION
            </h2>
            <div className="text-[26px] font-black text-black mb-3">
              ${totalAmount} USD
            </div>
            <p className="text-[13px] text-black font-medium leading-relaxed max-w-[90%]">
              Your direct contribution explicitly helps fund continuous care programs and cancer patient treatment channels.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Donation Frequency */}
          <div>
            <h5 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Donation Frequency</h5>
            <div className="flex gap-3">
              <button 
                onClick={() => setFrequency("one-time")}
                className={`flex-1 py-3 px-4 rounded-full text-sm font-bold transition-all border-2 ${
                  frequency === "one-time" 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-black border-gray-300 hover:border-black"
                }`}
              >
                One-time purchase
              </button>
              <button 
                onClick={() => setFrequency("monthly")}
                className={`flex-1 py-3 px-4 rounded-full text-sm font-bold transition-all border-2 ${
                  frequency === "monthly" 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-black border-gray-300 hover:border-black"
                }`}
              >
                Monthly Donation
              </button>
            </div>
          </div>

          {/* Select Donation Tier */}
          <div>
            <h5 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Select Donation Tier</h5>
            <div className="flex flex-wrap gap-2">
              {[5, 15, 35, 75, 150].map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`py-2 px-6 rounded-full text-sm font-bold transition-all border-2 ${
                    tier === t 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  ${t} USD
                </button>
              ))}
              <div className="relative flex-1 min-w-[100px]">
                <button
                  onClick={() => setTier("other")}
                  className={`w-full py-2 px-4 rounded-full text-sm font-bold transition-all border-2 text-center ${
                    tier === "other" 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {tier === "other" ? "Custom" : "Other"}
                </button>
              </div>
            </div>
            
            {/* Custom Amount Input */}
            {tier === "other" && (
              <div className="mt-3 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                <input 
                  type="number"
                  min="1"
                  step="1"
                  value={otherAmount}
                  onChange={(e) => setOtherAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 rounded-full border-2 border-black focus:outline-none focus:ring-2 focus:ring-black/20 font-bold"
                />
              </div>
            )}
          </div>

          {/* Multiply Your Impact */}
          <div>
            <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-3">MULTIPLY YOUR IMPACT</h5>
            <div className="inline-flex items-center border border-black rounded-sm overflow-hidden h-10 w-[120px]">
              <button 
                onClick={() => setMultiplier(Math.max(1, multiplier - 1))}
                className="w-10 h-full flex items-center justify-center bg-white hover:bg-gray-100 text-black font-bold text-lg transition-colors"
              >
                -
              </button>
              <div className="flex-1 h-full flex items-center justify-center font-bold text-black border-x border-black text-sm">
                {multiplier}
              </div>
              <button 
                onClick={() => setMultiplier(multiplier + 1)}
                className="w-10 h-full flex items-center justify-center bg-white hover:bg-gray-100 text-black font-bold text-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[#00AEEF] text-sm mb-4">Select payment method</p>
            
            {/* Stripe Button */}
            <button 
              onClick={handleStripeCheckout}
              disabled={isCheckingOut}
              className="flex items-center justify-center gap-2 w-full py-3 rounded bg-[#635BFF] hover:bg-[#4A44D4] text-white text-center font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              {isCheckingOut ? 'Processing...' : 'Donate with Stripe'}
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* PayPal Button Container */}
            <div id="paypal-button-container" className="min-h-[48px] w-full relative z-0">
              {!isSdkLoaded && (
                <div className="animate-pulse h-12 bg-gray-100 rounded text-center leading-[48px] text-gray-400 font-bold text-sm">
                  Loading PayPal...
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
