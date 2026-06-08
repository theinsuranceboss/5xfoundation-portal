"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { getSiteContent } from "@/lib/supabase";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let authorized = false;
      
      // Load custom admin list from Supabase
      const dbAdmins = await getSiteContent('adminUsers');
      let adminList: any[] = [];
      if (dbAdmins) {
        try {
          adminList = JSON.parse(dbAdmins);
        } catch (e) {
          console.error("Failed to parse dbAdmins:", e);
        }
      } else {
        // Fallback to cache
        const cached = localStorage.getItem('adminUsers');
        if (cached) {
          try {
            adminList = JSON.parse(cached);
          } catch (e) {}
        }
      }

      if (adminList && adminList.length > 0) {
        authorized = adminList.some((u: any) => u.username === username && u.password === password);
      }

      // Safe fallback credentials
      if (!authorized) {
        authorized = (username === "admin" && password === "cancer");
      }

      if (authorized) {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials. Access denied.");
      }
    } catch (err) {
      console.error(err);
      // Hard fallback
      if (username === "admin" && password === "cancer") {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials. Access denied.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6 py-24">
      <div className="absolute inset-0 z-0 opacity-20">
        <img src="/hero.png" alt="Background" className="absolute inset-0 w-full h-full object-cover grayscale" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-black rounded-full mx-auto mb-6 flex items-center justify-center p-2">
            <img src="/logo.png" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">PORTAL ACCESS</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">5XFOUNDATION ADMIN</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Admin username"
                className="w-full pl-14 pr-8 py-5 bg-brand-gray border-none rounded-2xl font-bold focus:ring-2 focus:ring-brand-blue"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Enter password"
                className="w-full pl-14 pr-8 py-5 bg-brand-gray border-none rounded-2xl font-bold focus:ring-2 focus:ring-brand-blue"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold text-center border border-red-100 italic">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-black text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-blue transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Authenticate"} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} className="text-brand-blue" /> Secure Administrative Interface
          </div>
        </div>
      </motion.div>
    </div>
  );
}
