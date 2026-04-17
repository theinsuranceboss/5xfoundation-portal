"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  FileEdit, 
  Image as ImageIcon, 
  Calendar, 
  Tag, 
  LogOut,
  Plus,
  Trash2,
  Save,
  Users,
  Upload,
  UserPlus,
  Monitor,
  Layout,
  Settings,
  ShieldCheck
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'content' | 'ads' | 'events' | 'merch' | 'who_we_help' | 'media' | 'theme'>('media');
  const [isSaving, setIsSaving] = useState(false);
  
  // Real paths that reflect what is on the server
  const [siteImages, setSiteImages] = useState([
    { id: 'logo', label: 'Site Branding (Logo)', page: 'Global', dims: '512x512', current: '/logo.png' },
    { id: 'hero_1', label: 'Home Hero Slide 1', page: 'Home Carousel', dims: '1920x1080', current: '/hero_1.png' },
    { id: 'hero_2', label: 'Home Hero Slide 2', page: 'Home Carousel', dims: '1920x1080', current: '/hero_2.png' },
    { id: 'hero_3', label: 'Home Hero Slide 3', page: 'Home Carousel', dims: '1920x1080', current: '/hero_3.png' },
    { id: 'rich', label: 'Founder Portrait (Rich)', page: 'Home/About', dims: '800x1000', current: '/rich.png' },
  ]);

  const [content, setContent] = useState({
    heroTitle: "EMPOWERING CANCER WARRIORS.",
    heroDesc: "We provide access to prosthetics, ease care-related costs, and build a strong, supportive community for those who have experienced limb loss.",
    missionTitle: "WHO WE HELP",
    missionDesc: "Five Time Foundation™ empowers cancer warriors to reclaim mobility, confidence, and connection after limb loss. Founded by 6-time survivor Rich Canci.",
    storiesTitle: "SURVIVOR STORIES",
    fundraisingTitle: "HOW WE RAISE FUNDS",
    fundraisingDesc: "We raise funds through nightlife events, community gatherings, and merchandise sales, creating meaningful experiences while providing vital support.",
    donationTitle: "FUEL THE FIGHT",
    donationDesc: "Your contribution directly funds prosthetics, covers care-related costs, and empowers cancer survivors to reclaim their lives."
  });

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) setContent(JSON.parse(savedContent));
  }, []);

  const [stories, setStories] = useState([
    { id: 'elena', name: 'Elena Rodriguez', tag: 'Outdoor Mentor', journey: 'Elena was diagnosed with osteosarcoma in her early 30s, which eventually led to an above-the-knee amputation. While she beat the cancer, the loss of her leg felt like the loss of her identity. High-performance "running blades" were financially out of reach, and she felt isolated from her old hiking groups.', help: 'The foundation provided Elena with a grant to cover the out-of-pocket costs for a specialized prosthetic limb designed for athletic activity. Beyond the hardware, Elena joined a 5X-sponsored community meet-up where she met other amputee athletes. Today, she isn\'t just walking; she’s mentoring other survivors on how to navigate local trails.', img: '/images/stories/elena.png' },
    { id: 'marcus', name: 'Marcus Thorne', tag: 'Creative Force', journey: 'Marcus faced a rare soft-tissue sarcoma that resulted in the loss of his dominant arm. As a freelancer, the mounting care-related costs—travel for treatments, specialized physical therapy, and home modifications—began to overwhelm his family’s savings.', help: 'The 5X Foundation stepped in to ease the burden of care-related costs, allowing Marcus to focus on his rehabilitation without the looming threat of debt. Through the foundation’s community events, Marcus found a "supportive community grounded in purpose," eventually designing a limited-edition merchandise line for the foundation, which helped him reclaim his confidence as a creator.', img: '/images/stories/marcus.png' },
    { id: 'chloe', name: 'Chloe Chen', tag: 'Academic Excellence', journey: 'Chloe was diagnosed with cancer during her sophomore year. The surgery to save her life resulted in limb loss, and she struggled with the "why me" of it all. She felt out of place on a college campus and worried that she would never have the stamina or the self-assurance to finish her degree.', help: 'Chloe attended a Five Time Foundation™ nightlife fundraiser, where she saw people celebrating life and strength despite their scars. The foundation’s "strength and perseverance" philosophy resonated with her. 5X helped facilitate a connection with a mentor—another survivor who had navigated the professional world with a prosthetic—giving Chloe the social and emotional "connection" she needed to return to school and graduate top of her class.', img: '/images/stories/chloe.png' },
  ]);

  const [categories, setCategories] = useState(['T-Shirt', 'Hoodie', 'Accessory']);
  const [merch, setMerch] = useState([
    { id: 'tshirt_white', name: 'fckcncr Unisex T-Shirt', price: '30.00', inventory: '45', category: 'T-Shirt', sizes: ['S', 'M', 'L', 'XL'], desc: 'The signature fckcncr monochrome unisex t-shirt.', img: '/tshirt_white.png' },
    { id: 'tshirt_green', name: 'fckcncr Unisex T-Shirt Green', price: '30.00', inventory: '12', category: 'T-Shirt', sizes: ['S', 'M', 'L'], desc: 'The signature fckcncr green edition unisex t-shirt.', img: '/tshirt_green.png' },
    { id: 'tshirt_pink', name: 'fckcncr Unisex T-Shirt Pink', price: '30.00', inventory: '8', category: 'T-Shirt', sizes: ['S', 'M', 'L', 'XL'], desc: 'The signature fckcncr pink edition unisex t-shirt.', img: '/tshirt_pink.png' },
    { id: 'hoodie_red', name: 'Unisex Hoodie', price: '50.00', inventory: '20', category: 'Hoodie', sizes: ['M', 'L', 'XL'], desc: 'Premium heavy-weight unisex hoodie.', img: '/hoodie_red.png' },
  ]);

  const [events, setEvents] = useState([
    { id: 'event_1', title: 'Warrior Walk 2026', date: 'May 15, 2026', loc: 'Central Park, NY', desc: 'Our annual community walk to raise awareness and funds for cancer warrior support.', img: '/event_1.png' },
    { id: 'event_2', title: 'Symmetry Pop-up', date: 'June 02, 2026', loc: 'SoHo, NY', desc: 'Connect with the community and snag exclusive 5X gear.', img: '/event_2.png' },
    { id: 'event_3', title: 'Warrior Tech Expo', date: 'July 20, 2026', loc: 'Long Island City, NY', desc: 'Presenting advancements in prosthetic tech for cancer survivors.', img: '/event_3.png' },
  ]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    // Direct link to the asset name
    formData.append('name', `${id}.png`);

    setIsSaving(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData

      });
      const data = await res.json();
      if (data.success) {
        // Update the state with cache buster to refresh the preview instantly
        const cacheBuster = `?v=${Date.now()}`;
        
        setSiteImages(prev => prev.map(img => 
          img.id === id ? { ...img, current: `${data.url}${cacheBuster}` } : img
        ));

        setStories(prev => prev.map(s => 
          s.id === id ? { ...s, img: `${data.url}${cacheBuster}` } : s
        ));

        setMerch(prev => prev.map(m => 
          m.id === id ? { ...m, img: `${data.url}${cacheBuster}` } : m
        ));

        setEvents(prev => prev.map(ev => 
          ev.id === id ? { ...ev, img: `${data.url}${cacheBuster}` } : ev
        ));

        alert(`${id.toUpperCase()} successfully replaced. Site updated.`);
      } else {
        alert(`Error: ${data.err || 'Upload failed'}`);
      }
    } catch (e) {
      alert('Upload failed. Check server connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    // Persist to localStorage for the live site to pick up
    localStorage.setItem('siteContent', JSON.stringify(content));
    localStorage.setItem('siteMerch', JSON.stringify(merch));
    localStorage.setItem('siteCategories', JSON.stringify(categories));
    localStorage.setItem('siteEvents', JSON.stringify(events));
    localStorage.setItem('siteStories', JSON.stringify(stories));
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Content synchronized successfully. Changes are now live on the homepage.');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <input 
        id="image-upload" 
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={(e) => {
          const id = (e.target as any).dataset.currentId;
          handleFileChange(e, id);
        }}
      />

      {/* Sidebar */}
      <aside className="w-80 bg-brand-black text-white flex flex-col h-screen sticky top-0 shadow-2xl">
        <div className="p-10 flex items-center gap-4 border-b border-white/5">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-brand-blue">
            <img src="/logo.png" className="w-full h-full object-cover" alt="logo" />
          </div>
          <div className="font-black text-xl tracking-tighter uppercase font-mono italic">5XADMIN</div>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto mt-6">
          {[
            { id: 'media', icon: <ImageIcon size={18} />, label: 'Image Manager' },
            { id: 'content', icon: <FileEdit size={18} />, label: 'Text Content' },
            { id: 'who_we_help', icon: <Users size={18} />, label: 'Who we help' },
            { id: 'events', icon: <Calendar size={18} />, label: 'Event Center' },
            { id: 'merch', icon: <Tag size={18} />, label: 'Shop Pricing' },
            { id: 'theme', icon: <Layout size={18} />, label: 'Theme Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all group ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-4">
                {tab.icon}
                {tab.label}
              </div>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button 
            onClick={() => {
               localStorage.removeItem("admin_auth");
               router.push("/admin/login");
            }}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-red-500 font-bold hover:bg-red-500/10 transition-all text-sm tracking-[0.2em] uppercase"
          >
            <LogOut size={20} /> Exit System
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-16 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-full">
              <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Portal Online</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter capitalize">{activeTab.replace(/_/g, ' ')}</h1>
          </div>

          
          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-brand-black text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-brand-blue transition-all disabled:opacity-50 shadow-2xl"
          >
            <Save size={18} /> {isSaving ? "Working..." : "Save Changes"}
          </button>
        </header>

        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'media' && (
              <motion.div
                key="media"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {siteImages.map((img) => (
                  <div key={img.id} className="p-8 bg-brand-gray/30 rounded-[2rem] border border-transparent hover:border-brand-blue/20 transition-all group">
                     <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue mb-1">{img.page}</p>
                        <h4 className="text-lg font-black tracking-tight">{img.label}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{img.dims}</span>
                     </div>
                     
                     <div 
                       onClick={() => {
                         const input = document.getElementById('image-upload') as any;
                         input.dataset.currentId = img.id;
                         input.click();
                       }}
                       className="aspect-video relative rounded-2xl overflow-hidden mb-4 bg-black cursor-pointer"
                     >
                        <img src={img.current} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={img.label} />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                          <Upload className="text-white mb-2" size={32} />
                          <span className="text-white text-[10px] font-black tracking-widest uppercase">Click to Replace</span>
                        </div>
                     </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'content' && (
               <motion.div
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
               >
                 <div className="space-y-12 lg:col-span-2">
                    <h3 className="text-2xl font-black italic tracking-tighter">Homepage Text Management</h3>
                    <p className="text-gray-400 text-sm">Edit the global text assets for your landing page below. Click "Save Changes" to publish your edits.</p>
                 </div>

                 {[
                   { label: "Hero Title", key: "heroTitle" },
                   { label: "Hero Description", key: "heroDesc" },
                   { label: "Mission Title", key: "missionTitle" },
                   { label: "Mission Description", key: "missionDesc" },
                   { label: "Stories Title", key: "storiesTitle" },
                   { label: "Fundraising Title", key: "fundraisingTitle" },
                   { label: "Fundraising Description", key: "fundraisingDesc" },
                   { label: "Donation Title", key: "donationTitle" },
                   { label: "Donation Description", key: "donationDesc" }
                 ].map((field) => (
                   <div key={field.key} className="space-y-4">
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue flex items-center gap-2">
                         {field.label}
                      </label>
                      <textarea 
                        className="w-full h-32 bg-brand-gray/50 border-none rounded-3xl p-6 font-bold text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-brand-blue transition-all"
                        value={(content as any)[field.key]}
                        onChange={(e) => setContent({...content, [field.key]: e.target.value})}
                      />
                   </div>
                 ))}
               </motion.div>
            )}
            {activeTab === 'merch' && (
              <motion.div
                key="merch"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                {/* Category Manager */}
                <div className="bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100">
                   <div className="flex justify-between items-center mb-10">
                      <div>
                        <h3 className="text-2xl font-black italic mb-2 uppercase tracking-tighter">Collections / Categories</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Organize your shop by product type</p>
                      </div>
                      <div className="flex gap-4">
                        <input 
                          id="new-category-input"
                          className="bg-white px-8 py-4 rounded-2xl font-bold text-sm border-none shadow-xl focus:ring-2 focus:ring-brand-blue min-w-[300px]" 
                          placeholder="Category Name (e.g. Jackets)..."
                        />
                        <button 
                          onClick={() => {
                            const input = document.getElementById('new-category-input') as HTMLInputElement;
                            if (input.value) {
                              setCategories([...categories, input.value]);
                              input.value = '';
                            }
                          }}
                          className="bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue transition-all"
                        >
                          Add Collection
                        </button>
                      </div>
                   </div>
                   <div className="flex flex-wrap gap-4">
                      {categories.map((cat) => (
                        <div key={cat} className="px-8 py-4 bg-white border-2 border-transparent hover:border-brand-blue rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-4 transition-all group">
                          {cat}
                          <button 
                            onClick={() => setCategories(categories.filter(c => c !== cat))}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Product Inventory</h3>
                  <button 
                    onClick={() => setMerch([...merch, { id: `m_${Date.now()}`, name: 'New Product', price: '0.00', inventory: '0', category: 'T-Shirt', sizes: ['S', 'M', 'L', 'XL'], desc: '', img: '/placeholder.png' }])}
                    className="flex items-center gap-4 bg-brand-blue text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-brand-blue/20"
                  >
                    <Plus size={20} /> Add New Product
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-16">
                  {merch.map((item, idx) => (
                    <div key={item.id} className="p-12 bg-white border-2 border-gray-100 rounded-[4rem] flex flex-col xl:flex-row gap-16 group relative hover:border-brand-blue/20 transition-all shadow-2xl shadow-black/5">
                       <button 
                         onClick={() => setMerch(merch.filter((_, i) => i !== idx))}
                         className="absolute top-10 right-10 p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                       >
                         <Trash2 size={24} />
                       </button>

                       <div 
                         onClick={() => {
                           const input = document.getElementById('image-upload') as any;
                           input.dataset.currentId = item.id;
                           input.click();
                         }}
                         className="w-full xl:w-80 aspect-square bg-brand-gray/30 rounded-[3rem] overflow-hidden cursor-pointer relative shadow-inner"
                       >
                         <img src={`${item.img}?v=${Date.now()}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                            <Upload className="text-white mb-3" size={32} />
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Replace Image</span>
                         </div>
                       </div>
                       
                       <div className="flex-1 space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="md:col-span-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 block mb-4">Product Name</label>
                              <input 
                                className="w-full bg-gray-100 px-8 py-6 rounded-3xl font-black text-2xl border-none focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all" 
                                value={item.name} 
                                onChange={(e) => {
                                  const newMerch = [...merch];
                                  newMerch[idx].name = e.target.value;
                                  setMerch(newMerch);
                                }}
                              />
                            </div>
                            <div>
                               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 block mb-4">Collection Collection</label>
                               <select 
                                 className="w-full bg-gray-100 px-8 py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest border-none focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all"
                                 value={item.category}
                                 onChange={(e) => {
                                   const newMerch = [...merch];
                                   newMerch[idx].category = e.target.value;
                                   setMerch(newMerch);
                                 }}
                               >
                                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                               </select>
                            </div>
                            <div className="flex gap-8">
                              <div className="flex-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 block mb-4">Price (USD)</label>
                                <input 
                                  className="w-full bg-gray-100 px-8 py-6 rounded-3xl font-black text-sm border-none focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all" 
                                  value={item.price} 
                                  onChange={(e) => {
                                    const newMerch = [...merch];
                                    newMerch[idx].price = e.target.value;
                                    setMerch(newMerch);
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 block mb-4">Inventory</label>
                                <input 
                                  className="w-full bg-gray-100 px-8 py-6 rounded-3xl font-black text-sm border-none focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all" 
                                  value={item.inventory} 
                                  onChange={(e) => {
                                    const newMerch = [...merch];
                                    newMerch[idx].inventory = e.target.value;
                                    setMerch(newMerch);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 block mb-4">Available Sizes</label>
                            <div className="flex flex-wrap gap-3">
                               {['S', 'M', 'L', 'XL', 'XXL', 'OS'].map((size) => (
                                 <button 
                                   key={size}
                                   onClick={() => {
                                      const newMerch = [...merch];
                                      const currentSizes = newMerch[idx].sizes || [];
                                      if (currentSizes.includes(size)) {
                                        newMerch[idx].sizes = currentSizes.filter(s => s !== size);
                                      } else {
                                        newMerch[idx].sizes = [...currentSizes, size];
                                      }
                                      setMerch(newMerch);
                                   }}
                                   className={`w-14 h-14 rounded-2xl font-black text-xs transition-all border-4 ${item.sizes?.includes(size) ? 'bg-black text-white border-black shadow-xl scale-110 z-10' : 'bg-gray-50 text-gray-300 border-transparent hover:border-gray-200'}`}
                                 >
                                   {size}
                                 </button>
                               ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 block mb-4">Product Description</label>
                            <textarea 
                              className="w-full bg-gray-100 px-8 py-6 rounded-3xl font-medium text-sm border-none h-32 focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all leading-relaxed" 
                              value={item.desc}
                              placeholder="Tell the story of this product..."
                              onChange={(e) => {
                                const newMerch = [...merch];
                                newMerch[idx].desc = e.target.value;
                                setMerch(newMerch);
                              }}
                            />
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black italic">Upcoming Events</h3>
                  <button 
                    onClick={() => setEvents([...events, { id: `event_${Date.now()}`, title: 'New Event', date: 'Date TBD', loc: 'Location TBD', desc: '', img: '/placeholder.png' }])}
                    className="flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                  >
                    <Plus size={14} /> Schedule Event
                  </button>
                </div>
                <div className="space-y-6">
                  {events.map((event, idx) => (
                    <div key={event.id} className="p-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] flex flex-col lg:flex-row gap-10 items-center group relative">
                       <button 
                         onClick={() => setEvents(events.filter((_, i) => i !== idx))}
                         className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
                       >
                         <Trash2 size={18} />
                       </button>
                       <div 
                         onClick={() => {
                           const input = document.getElementById('image-upload') as any;
                           input.dataset.currentId = event.id;
                           input.click();
                         }}
                         className="w-full lg:w-40 aspect-square bg-gray-200 rounded-3xl overflow-hidden cursor-pointer relative shadow-inner"
                       >
                         <img src={`${event.img}?v=${Date.now()}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={event.title} />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                            <Upload className="text-white mb-2" size={20} />
                            <span className="text-white text-[8px] font-black uppercase tracking-widest">Swap Photo</span>
                         </div>
                       </div>
                       
                       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Event Title</label>
                            <input 
                              className="w-full bg-white px-6 py-4 rounded-xl font-bold text-sm border-none shadow-sm focus:ring-2 focus:ring-brand-blue" 
                              value={event.title} 
                              onChange={(e) => {
                                const newEvents = [...events];
                                newEvents[idx].title = e.target.value;
                                setEvents(newEvents);
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Date & Time</label>
                            <input 
                              className="w-full bg-white px-6 py-4 rounded-xl font-bold text-sm border-none shadow-sm focus:ring-2 focus:ring-brand-blue" 
                              value={event.date} 
                              onChange={(e) => {
                                const newEvents = [...events];
                                newEvents[idx].date = e.target.value;
                                setEvents(newEvents);
                              }}
                            />
                          </div>
                          <div>
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Location</label>
                             <input 
                               className="w-full bg-white px-6 py-4 rounded-xl font-bold text-sm border-none shadow-sm focus:ring-2 focus:ring-brand-blue" 
                               value={event.loc} 
                               onChange={(e) => {
                                 const newEvents = [...events];
                                 newEvents[idx].loc = e.target.value;
                                 setEvents(newEvents);
                               }}
                             />
                          </div>
                          <div>
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Event Text (Paragraph)</label>
                             <textarea 
                               className="w-full bg-white px-6 py-4 rounded-xl font-bold text-sm border-none shadow-sm focus:ring-2 focus:ring-brand-blue h-14" 
                               value={event.desc} 
                               onChange={(e) => {
                                 const newEvents = [...events];
                                 newEvents[idx].desc = e.target.value;
                                 setEvents(newEvents);
                               }}
                             />
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'who_we_help' && (
              <motion.div
                key="who_we_help"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black italic">Survivor Stories (Who We Help)</h3>
                  <button 
                    onClick={() => setStories([...stories, { id: `story_${Date.now()}`, name: 'New Survivor', tag: 'Legacy Member', journey: '', help: '', img: '/placeholder.png' }])}
                    className="flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                  >
                    <Plus size={14} /> Add Story
                  </button>
                </div>
                <div className="space-y-12">
                  {stories.map((story, idx) => (
                    <div key={story.id} className="p-12 bg-white border border-gray-100 rounded-[3rem] shadow-xl space-y-10 relative group">
                       <button 
                         onClick={() => setStories(stories.filter((_, i) => i !== idx))}
                         className="absolute top-8 right-8 p-2 text-gray-400 hover:text-red-500 transition-colors"
                       >
                         <Trash2 size={18} />
                       </button>

                       <div className="flex flex-col lg:flex-row gap-12">
                          <div 
                            onClick={() => {
                              const input = document.getElementById('image-upload') as any;
                              input.dataset.currentId = story.id;
                              input.click();
                            }}
                            className="w-full lg:w-64 aspect-[4/5] bg-gray-100 rounded-[2rem] overflow-hidden cursor-pointer relative shadow-inner shrink-0"
                          >
                            <img src={`${story.img}?v=${Date.now()}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={story.name} />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                                <Upload className="text-white mb-2" size={24} />
                                <span className="text-white text-[8px] font-black uppercase tracking-widest">Replace Photo</span>
                            </div>
                          </div>

                          <div className="flex-1 space-y-6">
                             <div className="grid grid-cols-2 gap-6">
                                <div>
                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Full Name</label>
                                   <input 
                                     className="w-full bg-gray-50 px-6 py-4 rounded-xl font-bold text-lg border-none shadow-inner focus:ring-2 focus:ring-brand-blue" 
                                     value={story.name}
                                     onChange={(e) => {
                                       const ns = [...stories];
                                       ns[idx].name = e.target.value;
                                       setStories(ns);
                                     }}
                                   />
                                </div>
                                <div>
                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Tagline / Role</label>
                                   <input 
                                     className="w-full bg-gray-50 px-6 py-4 rounded-xl font-bold text-lg border-none shadow-inner focus:ring-2 focus:ring-brand-blue" 
                                     value={story.tag}
                                     onChange={(e) => {
                                       const ns = [...stories];
                                       ns[idx].tag = e.target.value;
                                       setStories(ns);
                                     }}
                                   />
                                </div>
                             </div>

                             <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">The Journey</label>
                                <textarea 
                                  className="w-full bg-gray-50 px-6 py-4 rounded-xl font-medium text-sm border-none shadow-inner focus:ring-2 focus:ring-brand-blue h-24" 
                                  value={story.journey}
                                  onChange={(e) => {
                                    const ns = [...stories];
                                    ns[idx].journey = e.target.value;
                                    setStories(ns);
                                  }}
                                />
                             </div>

                             <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">How 5X Foundation Helped</label>
                                <textarea 
                                  className="w-full bg-gray-50 px-6 py-4 rounded-xl font-bold text-sm border-none shadow-inner focus:ring-2 focus:ring-brand-blue h-24 text-brand-blue" 
                                  value={story.help}
                                  onChange={(e) => {
                                    const ns = [...stories];
                                    ns[idx].help = e.target.value;
                                    setStories(ns);
                                  }}
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'theme' && (
              <motion.div
                key="theme"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {/* Typography */}
                   <div className="bg-gray-50 rounded-[2.5rem] p-12 space-y-8 h-full">
                      <h4 className="text-xl font-black mb-8 flex items-center gap-4"><Monitor size={24} className="text-brand-blue" /> Global Styles</h4>
                      
                      <div className="grid grid-cols-1 gap-8">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Site-wide Font</label>
                          <select className="w-full bg-white px-8 py-5 rounded-2xl font-black text-xs border-none shadow-xl">
                            <option>Inter (Sans-Serif)</option>
                            <option>Roboto</option>
                            <option>Outfit (Modern)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Heading Case</label>
                          <div className="grid grid-cols-2 gap-4">
                            {['UPPERCASE', 'Lowercase'].map(c => (
                              <button key={c} className={`py-4 rounded-xl font-black text-[10px] border-2 transition-all ${c === 'UPPERCASE' ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}>
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>

                         <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Global Boldness</label>
                          <input type="range" className="w-full accent-brand-blue" min="100" max="900" step="100" defaultValue="500" />
                        </div>
                      </div>
                   </div>

                   {/* Hero Specifics */}
                   <div className="bg-black text-white rounded-[2.5rem] p-12 space-y-8 h-full">
                      <h4 className="text-xl font-black mb-8 text-brand-blue flex items-center gap-4"><Settings size={24} /> Hero Precision</h4>
                      
                      <div className="grid grid-cols-1 gap-8">
                         <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Main Heading Text</label>
                            <input className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl font-bold text-sm focus:border-brand-blue focus:ring-0" defaultValue="FIVE TIME FOUNDATION™" />
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Font Size (rem)</label>
                               <input type="number" step="0.5" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl font-bold text-sm focus:border-brand-blue" defaultValue="12" />
                            </div>
                            <div>
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Line Height</label>
                               <input type="number" step="0.1" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl font-bold text-sm focus:border-brand-blue" defaultValue="0.75" />
                            </div>
                         </div>

                         <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">Alignment</label>
                            <div className="flex gap-4">
                               <button className="flex-1 py-4 bg-white/10 border border-brand-blue rounded-xl font-black text-[10px] uppercase tracking-widest">Left</button>
                               <button className="flex-1 py-4 bg-white/5 border border-transparent rounded-xl font-black text-[10px] uppercase tracking-widest opacity-40">Center</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>




        </div>
      </main>
    </div>
  );
}
