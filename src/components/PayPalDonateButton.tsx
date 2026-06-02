'use client';

import { useState, useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    paypal?: any;
  }
}

export function PayPalDonateButton({ amount = "50" }: { amount?: string }) {
  const [donateAmount, setDonateAmount] = useState(amount);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "AVrTrX38Se2i3orog_E2JzqkaqouA68T2MkcshUPBLJe_F-woWnUMvwRGJEFWjnylukTSUus1hIFNK2a";

  useEffect(() => {
    // If the SDK is loaded and the container exists, render the buttons
    if (isSdkLoaded && window.paypal) {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = ''; // Clear previous buttons if amount changes
        window.paypal.Buttons({
          style: { layout: "vertical", shape: "pill", color: "gold", label: "donate" },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: donateAmount || "10",
                  },
                  description: "Donation to Five Time Foundation"
                },
              ],
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
  }, [isSdkLoaded, donateAmount]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons`}
        strategy="lazyOnload"
        onLoad={() => setIsSdkLoaded(true)}
      />

      <div className="flex gap-2 justify-center mb-4">
        {['10', '25', '50', '100'].map((amt) => (
          <button
            key={amt}
            onClick={() => setDonateAmount(amt)}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              donateAmount === amt 
                ? 'bg-[#003087] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ${amt}
          </button>
        ))}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
          <input 
            type="number"
            value={donateAmount}
            onChange={(e) => setDonateAmount(e.target.value)}
            className="w-24 pl-6 pr-3 py-2 rounded-full border-2 border-gray-200 focus:border-[#003087] focus:outline-none font-bold"
            placeholder="Other"
          />
        </div>
      </div>

      <div id="paypal-button-container" className="min-h-[150px] w-full flex items-center justify-center">
        {!isSdkLoaded && (
          <div className="animate-pulse flex space-x-4">
            <div className="h-12 bg-gray-200 rounded-full w-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
