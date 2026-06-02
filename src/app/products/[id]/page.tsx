"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSiteContent } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Check, 
  Minus, 
  Plus, 
  Share2, 
  Heart,
  ChevronRight,
  Info,
  ShieldCheck
} from "lucide-react";
import GlobalStyles from "@/components/GlobalStyles";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({ params }: { params: any }) {
  const { addToCart } = useCart();
  const [id, setId] = useState<string>("");
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interaction states
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [v, setV] = useState(0);

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      if (resolved && resolved.id) {
        setId(resolved.id);
      }
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    
    async function loadProduct() {
      setLoading(true);
      try {
        let items: any[] = [];
        const dbMerch = await getSiteContent('siteMerch');
        if (dbMerch) {
          items = JSON.parse(dbMerch);
        } else {
          // Fallback static items
          items = [
            { 
              id: 't1', 
              name: '"fckcncr" Unisex T-Shirt White', 
              price: '30.00', 
              category: 'T-Shirt', 
              img: '/tshirt_white.png',
              imgBack: '',
              inventory: '45',
              sizes: ['S', 'M', 'L', 'XL', '2XL'],
              colors: ['White', 'Off-White'],
              desc: 'The signature monochrome edition unisex fckcncr custom printed t-shirt. High-density premium quality cotton build made to last.',
              stripeUrl: 'https://checkout.stripe.com/pay/placeholder',
              paypalUrl: 'https://paypal.me/placeholder'
            },
            { 
              id: 't2', 
              name: '"fckcncr" Unisex T-Shirt Green', 
              price: '30.00', 
              category: 'T-Shirt', 
              img: '/tshirt_green.png',
              imgBack: '',
              inventory: '12',
              sizes: ['S', 'M', 'L'],
              colors: ['Forest Green', 'Mint'],
              desc: 'The vibrant signature green edition unisex fckcncr custom printed t-shirt. Sits nicely with modern urban streetwear aesthetics.',
              stripeUrl: 'https://checkout.stripe.com/pay/placeholder',
              paypalUrl: 'https://paypal.me/placeholder'
            },
            { 
              id: 't3', 
              name: '"fckcncr" Unisex T-Shirt Pink', 
              price: '30.00', 
              category: 'T-Shirt', 
              img: '/tshirt_pink.png',
              imgBack: '',
              inventory: '8',
              sizes: ['S', 'M', 'L', 'XL'],
              colors: ['Neon Pink', 'Blossom'],
              desc: 'The bold signature pink edition unisex fckcncr custom printed t-shirt. A statement piece that directly funds cancer warrior support.',
              stripeUrl: 'https://checkout.stripe.com/pay/placeholder',
              paypalUrl: 'https://paypal.me/placeholder'
            },
            { 
              id: 'h1', 
              name: 'Legacy Hoodie', 
              price: '50.00', 
              category: 'Hoodie', 
              img: '/hoodie_red.png',
              imgBack: '',
              inventory: '20',
              sizes: ['M', 'L', 'XL', '2XL'],
              colors: ['Ruby Red', 'Dark Heather'],
              desc: 'Premium heavy-weight unisex fleece hoodie featuring full athletic rib-knit construction, kangaroo pouch, and double-lined hood.',
              stripeUrl: 'https://checkout.stripe.com/pay/placeholder',
              paypalUrl: 'https://paypal.me/placeholder'
            },
          ];
        }

        setAllProducts(items);

        // Find the matched product by raw id OR by slugified name
        const found = items.find(p => {
          const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          return p.id === id || slug === id;
        });

        if (found) {
          setProduct(found);
          setActiveImage(found.img);
          if (found.sizes && found.sizes.length > 0) {
            setSelectedSize(found.sizes[0]);
          }
          if (found.colors) {
            let colArr: string[] = [];
            if (Array.isArray(found.colors)) {
              colArr = found.colors;
            } else if (typeof found.colors === 'string') {
              colArr = found.colors.split(',').map((c: string) => c.trim()).filter((c: string) => c !== "");
            }
            if (colArr.length > 0) {
              setSelectedColor(colArr[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
      setV(Date.now());
    }

    loadProduct();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white py-24 px-6">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Product Not Found</h1>
          <p className="text-gray-500 font-medium">We couldn't find the product you're looking for. It might have been updated or removed.</p>
          <Link 
            href="/merch" 
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-blue transition-all shadow-xl"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isHoodie = product.category === 'Hoodie';
  const sizeList = product.sizes || ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  
  let colors = ["Black", "Navy"];
  if (product.colors) {
    if (Array.isArray(product.colors)) {
      colors = product.colors;
    } else if (typeof product.colors === 'string') {
      colors = product.colors.split(',').map((c: string) => c.trim()).filter((c: string) => c !== "");
    }
  }

  return (
    <div className="min-h-screen bg-white text-black py-20 px-6 sm:px-12 lg:px-24">
      <GlobalStyles />
      
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumbs & Back Button */}
        <div className="mb-12 flex justify-between items-center">
          <Link 
            href="/merch" 
            className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Volver a la Tienda</span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <span>Tienda</span>
            <ChevronRight size={10} />
            <span>{product.category}</span>
            <ChevronRight size={10} />
            <span className="text-black font-black">{product.name}</span>
          </div>
        </div>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 mb-24">
          
          {/* LEFT COLUMN: Gallery & Images */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative aspect-square bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm group">
              <img 
                src={`${activeImage}?v=${v}`} 
                alt={product.name} 
                className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Liked Badge */}
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform active:scale-95"
              >
                <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </button>

              {/* Tag Category Badge */}
              <div className="absolute top-8 left-8 bg-black text-white px-5 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-md">
                {product.category}
              </div>
            </div>

            {/* Thumbnail previews */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              <button 
                onClick={() => setActiveImage(product.img)}
                className={`w-24 h-24 rounded-2xl bg-gray-50 border-2 overflow-hidden p-2 shrink-0 transition-all ${activeImage === product.img ? 'border-black shadow-md scale-95' : 'border-transparent hover:border-gray-200'}`}
              >
                <img src={product.img} className="w-full h-full object-contain" alt="Front Preview" />
              </button>

              {product.imgBack && (
                <button 
                  onClick={() => setActiveImage(product.imgBack)}
                  className={`w-24 h-24 rounded-2xl bg-gray-50 border-2 overflow-hidden p-2 shrink-0 transition-all ${activeImage === product.imgBack ? 'border-black shadow-md scale-95' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={product.imgBack} className="w-full h-full object-contain" alt="Back Preview" />
                </button>
              )}

              {/* Extra default previews to showcase variants if it's the signature black/navy tee */}
              {!product.imgBack && (
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-center p-2 opacity-50 shrink-0">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">Variante Black</span>
                  </div>
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-150 flex items-center justify-center p-2 opacity-50 shrink-0">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">Variante Navy</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Purchase Interface */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8 h-fit">
            
            {/* Title & Price */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-tight title-custom">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-black tracking-tight">${parseFloat(product.price).toFixed(2)} USD</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Impuestos incluidos</span>
              </div>
              
              <div className="text-xs text-gray-400 font-medium pb-4 border-b border-gray-100 flex items-center gap-2">
                <Info size={14} className="text-brand-blue" />
                <span><span className="underline cursor-pointer">Shipping</span> calculated at checkout.</span>
              </div>
            </div>

            {/* Variant Selector: Color */}
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                <span>Color</span>
                <span className="text-black">{selectedColor}</span>
              </div>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-8 py-3.5 rounded-xl text-[10px] font-black tracking-widest uppercase border-2 transition-all ${
                      selectedColor === color 
                        ? 'bg-black text-white border-black shadow-lg scale-105' 
                        : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant Selector: Size */}
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                <span>Size</span>
                <span className="text-black">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {sizeList.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl text-[10px] font-black tracking-widest uppercase border-2 transition-all ${
                      selectedSize === size 
                        ? 'bg-black text-white border-black shadow-lg scale-105 z-10' 
                        : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3 pb-6 border-b border-gray-100">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Quantity</label>
              <div className="flex items-center bg-gray-50 border border-gray-250/60 rounded-xl w-36 px-4 py-2 justify-between">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="font-black text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-4">
              <button 
                type="button"
                onClick={() => {
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    price: parseFloat(product.price || '0'),
                    color: selectedColor,
                    size: selectedSize,
                    quantity: quantity,
                    img: product.img,
                    stripeUrl: product.stripeUrl,
                    paypalUrl: product.paypalUrl
                  });
                }}
                className="w-full bg-white text-black border-2 border-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={16} />
                Añadir al Carrito
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Stripe Button */}
                {product.stripeUrl ? (
                  <a 
                    href={product.stripeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2.5 w-full bg-[#635BFF] hover:bg-black text-white py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:shadow-lg active:scale-95 text-center"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M13.93 10.09c0-.49-.41-.71-1.07-.71-.79 0-1.57.19-2.31.54L10 8.16c.86-.41 1.93-.65 2.96-.65 1.95 0 3.2 1.01 3.2 2.77 0 2.39-3.23 3-3.23 4.29 0 .42.33.59.88.59.82 0 1.54-.24 2.21-.61l.53 1.63c-.81.49-1.92.77-3.04.77-1.95 0-3.27-1-3.27-2.73 0-2.58 3.4-3.13 3.4-4.88zM24 12c0 6.63-5.37 12-12 12S0 18.63 0 12 5.37 0 12 0s12 5.37 12 12z" />
                    </svg>
                    Stripe
                  </a>
                ) : (
                  <button 
                    disabled
                    className="flex items-center justify-center gap-2.5 w-full bg-gray-100 text-gray-400 py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed text-center"
                    title="No Stripe checkout link configured"
                  >
                    Stripe
                  </button>
                )}

                {/* PayPal Button */}
                {product.paypalUrl ? (
                  <a 
                    href={product.paypalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2.5 w-full bg-[#FFC439] hover:bg-[#E5AE30] text-[#003087] py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:shadow-lg active:scale-95 text-center"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20.08 7.02c-.22-1.63-1.39-2.91-3.32-3.31C15.54 3.46 13.9 3.4 12.21 3.4H6.75c-.47 0-.85.34-.92.8L4.05 18.57c-.05.34.21.65.55.65h3.69l.91-5.77c.07-.46.47-.8.94-.8h1.22c3.08 0 5.48-1.25 6.18-4.38.31-1.38.25-2.55-.46-3.25zm-3.31 3.99c-.39 1.76-1.78 1.76-3.29 1.76h-.85l.61-3.87h.85c1.4 0 2.27.06 2.68 1.91.02.07.01.14 0 .2z" />
                    </svg>
                    PayPal
                  </a>
                ) : (
                  <button 
                    disabled
                    className="flex items-center justify-center gap-2.5 w-full bg-gray-100 text-gray-400 py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed text-center"
                    title="No PayPal checkout link configured"
                  >
                    PayPal
                  </button>
                )}
              </div>

              <p className="text-[10px] font-semibold text-gray-400 text-center uppercase tracking-wider">
                100% of proceeds directly cover care costs for cancer survivors.
              </p>
            </div>

            {/* Description Tab & Text */}
            <div className="pt-6 space-y-6 border-t border-gray-100">
              <div className="space-y-4 text-xs font-medium text-gray-600 leading-relaxed desc-custom">
                <p>
                  {product.desc && product.desc.length > 50
                    ? product.desc
                    : (isHoodie 
                        ? "This premium heavyweight unisex hoodie is the perfect choice for cooler days, providing both incredible comfort and long-lasting style. Renders sharp details and sits perfectly for layered streetwear outfits."
                        : "The 100% cotton unisex classic tee will help you land a more structured look. It sits nicely, maintains sharp lines around the edges, and goes perfectly with layered streetwear outfits. Plus, it's extra trendy now!")}
                </p>

                <ul className="space-y-2 pl-4 list-disc text-gray-600">
                  {(isHoodie 
                    ? [
                        "50% pre-shrunk cotton, 50% polyester",
                        "Fabric weight: 8.0 oz/yd² (271.25 g/m²)",
                        "Air-jet spun yarn with a soft feel and reduced pilling",
                        "Double-lined hood with matching drawcord",
                        "Quarter-turned body to avoid crease down the middle",
                        "1×1 athletic rib-knit cuffs and waistband with spandex",
                        "Front pouch pocket",
                        "Double-needle stitched collar, shoulders, armholes, cuffs, and hem",
                        "Blank product sourced from Honduras, Mexico, or Nicaragua"
                      ]
                    : [
                        "100% cotton",
                        "Sport Grey is 90% cotton, 10% polyester",
                        "Ash Grey is 99% cotton, 1% polyester",
                        "Heather colors are 50% cotton, 50% polyester",
                        "Fabric weight: 5.0–5.3 oz/yd² (170-180 g/m²)",
                        "Open-end yarn",
                        "Tubular fabric",
                        "Taped neck and shoulders",
                        "Double seam at sleeves and bottom hem",
                        "Blank product sourced from Honduras, Nicaragua, Haiti, Dominican Republic, Bangladesh, Mexico"
                      ]
                  ).map((spec, i) => (
                    <li key={i}>• {spec}</li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-150 space-y-2">
                  <h6 className="text-[10px] font-black uppercase tracking-widest text-black">Disclaimers:</h6>
                  {(isHoodie 
                    ? [
                        "Color saturation may vary slightly due to screen lighting and dye processes.",
                        "Pocket dimensions are scaled matching the selected hoodie size."
                      ]
                    : [
                        "Due to the fabric properties, the White color variant may appear off-white rather than bright white.",
                        "Dark color speckles throughout the fabric are expected for the color Natural."
                      ]
                  ).map((disc, i) => (
                    <p key={i} className="italic text-gray-400">• {disc}</p>
                  ))}
                </div>

                <p className="pt-4 font-semibold text-gray-500 border-t border-gray-150">
                  This product is made especially for you as soon as you place an order, which is why it takes us a bit longer to deliver it to you. Making products on demand instead of in bulk helps reduce overproduction, so thank you for making thoughtful purchasing decisions!
                </p>
              </div>
            </div>

            {/* Size Guide Collapsible / Details Section */}
            <div className="pt-8 border-t border-gray-100 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] italic">Size Guide</h4>
              
              <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-inner bg-white">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-400">
                      <th className="px-6 py-4">Size</th>
                      <th className="px-6 py-4">Length (inches)</th>
                      <th className="px-6 py-4">Width (inches)</th>
                      <th className="px-6 py-4">Sleeve Length (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-500 font-medium">
                    {isHoodie ? (
                      // Hoodie Size Measurements
                      [
                        { s: 'S', l: '27', w: '20', sl: '33' },
                        { s: 'M', l: '28', w: '22', sl: '34' },
                        { s: 'L', l: '29', w: '24', sl: '35' },
                        { s: 'XL', l: '30', w: '26', sl: '36' },
                        { s: '2XL', l: '31', w: '28', sl: '37' },
                        { s: '3XL', l: '32', w: '30', sl: '38' },
                      ].map((row) => (
                        <tr key={row.s} className={selectedSize === row.s ? "bg-brand-blue/5 text-black font-bold" : ""}>
                          <td className="px-6 py-4 text-black font-black">{row.s}</td>
                          <td className="px-6 py-4">{row.l}</td>
                          <td className="px-6 py-4">{row.w}</td>
                          <td className="px-6 py-4">{row.sl}</td>
                        </tr>
                      ))
                    ) : (
                      // T-Shirt Size Measurements (as requested)
                      [
                        { s: 'S', l: '28', w: '18', sl: '15 ⅝' },
                        { s: 'M', l: '29', w: '20', sl: '17' },
                        { s: 'L', l: '30', w: '22', sl: '18 ½' },
                        { s: 'XL', l: '31', w: '24', sl: '20' },
                        { s: '2XL', l: '32', w: '26', sl: '21 ½' },
                        { s: '3XL', l: '33', w: '28', sl: '22 ¾' },
                        { s: '4XL', l: '34', w: '30', sl: '24 ¼' },
                        { s: '5XL', l: '35', w: '32', sl: '25 ¼' },
                      ].map((row) => (
                        <tr key={row.s} className={selectedSize === row.s ? "bg-brand-blue/5 text-black font-bold" : ""}>
                          <td className="px-6 py-4 text-black font-black">{row.s}</td>
                          <td className="px-6 py-4">{row.l}</td>
                          <td className="px-6 py-4">{row.w}</td>
                          <td className="px-6 py-4">{row.sl}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Trust & Guarantee Panel */}
            <div className="p-6 bg-brand-gray/30 rounded-2xl border border-gray-150 flex items-start gap-4">
              <ShieldCheck className="text-brand-blue shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-black block">Five Time Guarantee</span>
                <p className="text-[10px] font-semibold text-gray-400 uppercase leading-relaxed">
                  Supportive community grounded in purpose. Reclaim mobility, confidence, and connection.
                </p>
              </div>
            </div>

            {/* Share and Social actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center gap-6">
              <button 
                onClick={handleShare}
                className="inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
              >
                <Share2 size={14} />
                <span>{isCopied ? "Enlace Copiado!" : "Compartir este producto"}</span>
              </button>
            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: Related Products Slider */}
        <div className="border-t border-gray-100 pt-20">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-12">También te podría gustar</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allProducts
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map((p) => {
                const pSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                
                return (
                  <Link 
                    key={p.id} 
                    href={`/products/${pSlug}`}
                    className="group flex flex-col"
                  >
                    <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 border border-transparent shadow-sm transition-all group-hover:shadow-xl group-hover:border-black/5 relative">
                      <img src={p.img} alt={p.name} className="object-contain p-8 w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-black text-sm uppercase tracking-tighter truncate mb-1">{p.name}</h4>
                    <span className="text-xs font-bold text-gray-400">${parseFloat(p.price).toFixed(2)} USD</span>
                  </Link>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
}
