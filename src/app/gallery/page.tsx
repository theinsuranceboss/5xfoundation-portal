"use client";

import { motion } from "framer-motion";

const photos = [
  { id: 1, title: 'Charity Walk 2023', category: 'Events', span: 'col-span-2 row-span-2' },
  { id: 2, title: 'Warrior Meetup', category: 'Community', span: 'col-span-1 row-span-1' },
  { id: 3, title: 'Prosthetic Fitting', category: 'Impact', span: 'col-span-1 row-span-1' },
  { id: 4, title: 'Community Gala', category: 'Fundraiser', span: 'col-span-1 row-span-2' },
  { id: 5, title: 'Limb Loss Support Group', category: 'Community', span: 'col-span-2 row-span-1' },
];

export default function GalleryPage() {
  return (
    <div className="py-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center lg:text-left">
          <h1 className="text-5xl font-black tracking-tighter mb-4">Event <span className="text-neon-green">Gallery</span></h1>
          <p className="text-gray-500 max-w-2xl">A collection of moments that define our journey. From fundraisers to community support groups.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-4 h-[1000px] md:h-[800px]">
          {photos.map((photo, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={photo.id}
              className={`${photo.span} relative group overflow-hidden rounded-3xl bg-brand-gray bg-gradient-to-br from-brand-gray to-gray-200`}
            >
              <div className="absolute inset-x-0 bottom-0 p-8 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <span className="text-xs font-bold uppercase tracking-widest text-neon-green bg-black px-3 py-1 rounded-full mb-2 inline-block">
                  {photo.category}
                </span>
                <h3 className="text-white text-xl font-bold">{photo.title}</h3>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors z-10" />
              {/* Image would go here */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                Event Photo {photo.id}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
