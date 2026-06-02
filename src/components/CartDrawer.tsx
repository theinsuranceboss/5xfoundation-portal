"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isCartOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        // Only close if it's not clicking the nav bag button
        const isNavBag = (event.target as HTMLElement).closest(".nav-cart-btn");
        if (!isNavBag) {
          toggleCart();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen, toggleCart]);

  // Disable scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[9998] transition-opacity"
            onClick={toggleCart}
          />

          {/* Drawer container */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white z-[9999] shadow-2xl flex flex-col h-full text-black"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-black" size={22} strokeWidth={2.5} />
                <h2 className="text-xl font-black tracking-tighter uppercase italic">
                  Tu Carrito
                </h2>
                <span className="bg-brand-blue/10 text-brand-blue font-black text-xs px-3 py-1 rounded-full">
                  {cartCount} {cartCount === 1 ? "artículo" : "artículos"}
                </span>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            {/* Empty Cart State */}
            {cartItems.length === 0 ? (
              <div className="flex-1 px-8 py-16 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                  <ShoppingBag size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black uppercase tracking-tighter italic">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-400 text-xs font-semibold max-w-xs uppercase tracking-wider leading-relaxed">
                    ¡Apoya a nuestros guerreros del cáncer comprando mercancía oficial!
                  </p>
                </div>
                <button
                  onClick={toggleCart}
                  className="bg-black text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-blue hover:scale-105 transition-all shadow-xl"
                >
                  Seguir Comprando
                </button>
              </div>
            ) : (
              <>
                {/* Scrollable Line Items */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 bg-gray-50 border border-gray-100 rounded-3xl flex gap-5 relative group hover:border-black/5 hover:bg-white hover:shadow-xl transition-all"
                    >
                      {/* Image mockup front */}
                      <div className="w-20 h-24 bg-gray-100 rounded-2xl p-2 flex items-center justify-center shrink-0 border border-gray-150 overflow-hidden relative">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Info & Variants */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="font-black text-sm uppercase tracking-tighter truncate pr-6 mb-1">
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              Talla: <span className="text-black">{item.size}</span>
                            </span>
                            <div className="w-1 h-1 bg-gray-200 rounded-full self-center" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              Color: <span className="text-black">{item.color}</span>
                            </span>
                          </div>
                        </div>

                        {/* Quantity and sub-actions */}
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Selector */}
                          <div className="flex items-center bg-gray-200/50 border border-gray-250/50 rounded-lg px-2 py-1 gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="text-gray-400 hover:text-black transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-black text-xs min-w-[12px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="text-gray-400 hover:text-black transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Price Display */}
                          <span className="font-black text-sm text-black">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer Checkout Area */}
                <div className="px-8 py-8 border-t border-gray-100 bg-gray-50/50 space-y-6">
                  {/* Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>Subtotal</span>
                      <span className="text-black">${cartTotal.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>Envío e Impuestos</span>
                      <span className="text-black">Calculados al pagar</span>
                    </div>
                    <div className="border-t border-gray-200/60 my-2 pt-2 flex justify-between text-sm font-black uppercase tracking-tighter italic">
                      <span>Total General</span>
                      <span className="text-xl text-black">${cartTotal.toFixed(2)} USD</span>
                    </div>
                  </div>

                  {/* Checkout buttons */}
                  <div className="space-y-3.5">
                    {/* Render specific buttons based on cart items */}
                    <div className="text-center text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                      Finalizar Compra
                    </div>

                    {cartItems.map((item, idx) => {
                      const hasStripe = !!item.stripeUrl && item.stripeUrl.trim() !== "";
                      const hasPaypal = !!item.paypalUrl && item.paypalUrl.trim() !== "";

                      return (
                        <div key={`checkout-${item.id}-${idx}`} className="space-y-2 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                          {cartItems.length > 1 && (
                            <div className="text-[9px] font-black text-black uppercase tracking-widest truncate mb-1">
                              Pagar {item.name} ({item.size}/{item.color}):
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* Stripe Checkout Button */}
                            {hasStripe ? (
                              <a
                                href={item.stripeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-black text-white py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md transition-all active:scale-95"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M13.93 10.09c0-.49-.41-.71-1.07-.71-.79 0-1.57.19-2.31.54L10 8.16c.86-.41 1.93-.65 2.96-.65 1.95 0 3.2 1.01 3.2 2.77 0 2.39-3.23 3-3.23 4.29 0 .42.33.59.88.59.82 0 1.54-.24 2.21-.61l.53 1.63c-.81.49-1.92.77-3.04.77-1.95 0-3.27-1-3.27-2.73 0-2.58 3.4-3.13 3.4-4.88zM24 12c0 6.63-5.37 12-12 12S0 18.63 0 12 5.37 0 12 0s12 5.37 12 12z" />
                                </svg>
                                Stripe
                              </a>
                            ) : (
                              <button
                                disabled
                                className="flex items-center justify-center gap-2 bg-gray-200 text-gray-400 py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed"
                                title="No Stripe link set by admin"
                              >
                                Stripe
                              </button>
                            )}

                            {/* PayPal Checkout Button */}
                            {hasPaypal ? (
                              <a
                                href={item.paypalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-[#FFC439] hover:bg-[#E5AE30] text-[#003087] py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md transition-all active:scale-95"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M20.08 7.02c-.22-1.63-1.39-2.91-3.32-3.31C15.54 3.46 13.9 3.4 12.21 3.4H6.75c-.47 0-.85.34-.92.8L4.05 18.57c-.05.34.21.65.55.65h3.69l.91-5.77c.07-.46.47-.8.94-.8h1.22c3.08 0 5.48-1.25 6.18-4.38.31-1.38.25-2.55-.46-3.25zm-3.31 3.99c-.39 1.76-1.78 1.76-3.29 1.76h-.85l.61-3.87h.85c1.4 0 2.27.06 2.68 1.91.02.07.01.14 0 .2z" />
                                </svg>
                                PayPal
                              </a>
                            ) : (
                              <button
                                disabled
                                className="flex items-center justify-center gap-2 bg-gray-200 text-gray-400 py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed"
                                title="No PayPal link set by admin"
                              >
                                PayPal
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <button
                      onClick={toggleCart}
                      className="w-full bg-white border border-gray-300 text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm text-center block mt-2"
                    >
                      Seguir Comprando
                    </button>
                  </div>

                  {/* Guarantee Panel */}
                  <div className="p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 flex items-start gap-3">
                    <ShieldCheck className="text-brand-blue shrink-0 mt-0.5" size={16} />
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-black block">
                        Garantía Cinco Veces (5X)
                      </span>
                      <p className="text-[8px] font-semibold text-gray-400 uppercase leading-relaxed">
                        El 100% de los ingresos cubren directamente prótesis y costos de atención para sobrevivientes de cáncer.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
