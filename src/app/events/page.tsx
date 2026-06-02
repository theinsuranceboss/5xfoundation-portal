"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getSiteContent } from "@/lib/supabase";

export default function EventsPage() {
  const [v, setV] = useState(0);
  const [events, setEvents] = useState([
    {
      id: 'event_1',
      title: "Warrior Walk 2026",
      date: "May 15, 2026",
      time: "09:00 AM",
      loc: "Central Park, NY",
      desc: "Our annual community walk to raise awareness and funds for cancer warrior support.",
      img: "/event_1.png"
    },
    {
      id: 'event_2',
      title: "Symmetry Pop-up",
      date: "June 02, 2026",
      time: "11:00 AM",
      loc: "SoHo, NY",
      desc: "Connect with the community and snag exclusive 5X gear.",
      img: "/event_2.png"
    },
    {
      id: 'event_3',
      title: "Warrior Tech Expo",
      date: "July 20, 2026",
      time: "10:00 AM",
      loc: "Long Island City, NY",
      desc: "Presenting advancements in prosthetic tech for cancer survivors.",
      img: "/event_3.png"
    }
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const dbEvents = await getSiteContent('siteEvents');
        if (dbEvents) {
          setEvents(JSON.parse(dbEvents));
        }
      } catch (err) {
        console.error("Failed to load events from Supabase, falling back to localStorage:", err);
        const savedEvents = localStorage.getItem('siteEvents');
        if (savedEvents) setEvents(JSON.parse(savedEvents));
      }
      setV(Date.now());
    }
    loadData();
  }, []);

  return (
    <div className="py-24 px-6 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-24 text-center">
          <span className="text-[10px] font-black text-black uppercase tracking-[0.5em] mb-6 block opacity-40">Community Events</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 italic uppercase leading-[0.85]">UPCOMING<br />5X EVENTS</h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">Join us as we build a stronger network of warriors together.</p>
        </header>

        <div className="space-y-12">
          {events.map((event, index) => (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl hover:bg-white transition-all group border border-transparent hover:border-black/5"
            >
              <div className="w-full md:w-1/3 aspect-square relative rounded-3xl overflow-hidden shadow-xl bg-gray-200">
                 <img src={`${event.img}?v=${v}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
              </div>

              <div className="flex-1 w-full">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-2">
                  <Calendar size={14} className="text-black" /> {event.date}
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight group-hover:text-black transition-colors leading-none uppercase italic">{event.title}</h3>
                <p className="text-gray-500 mb-8 leading-relaxed text-sm font-medium">{event.desc}</p>
                <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {event.time && <span className="flex items-center gap-2 text-black"><Clock size={16} /> {event.time}</span>}
                  <span className="flex items-center gap-2 text-black"><MapPin size={16} /> {event.loc}</span>
                </div>
              </div>
              
              <button className="whitespace-nowrap bg-black text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-gray-800 transition-all">
                RSVP NOW <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
