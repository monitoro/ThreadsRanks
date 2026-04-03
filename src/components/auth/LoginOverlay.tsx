"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';

interface LoginOverlayProps {
  isConnecting: boolean;
  onConnect: () => void;
}

export const LoginOverlay = ({ isConnecting, onConnect }: LoginOverlayProps) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full glass-card p-12 border border-white/10 bg-[#0d0d0d] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] rounded-[3rem] text-center space-y-10"
      >
        <div className="flex justify-center">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] rotate-12 group-hover:rotate-0 transition-transform duration-500"
          >
            <span className="text-black font-black text-4xl font-serif italic">TR</span>
          </motion.div>
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-black italic tracking-tighter leading-tight text-white text-glow">Unlock Your Performance.</h3>
          <p className="text-zinc-500 text-xs font-bold leading-relaxed uppercase tracking-widest px-4">Experience the most advanced Threads analytics system ever built.</p>
        </div>
        <div className="space-y-6">
          <button 
            onClick={onConnect}
            disabled={isConnecting}
            className="group w-full py-5 rounded-[1.25rem] bg-white text-black font-black text-xs uppercase tracking-[0.25em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(255,255,255,0.1)] active:scale-95 disabled:bg-zinc-800"
          >
            {isConnecting ? (
              <span className="flex items-center gap-3"><span className="animate-spin text-xl">◌</span> Connecting...</span>
            ) : (
              <>
                <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Login with Threads
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-4 opacity-20">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-700" />
             <span className="text-[9px] font-black uppercase tracking-widest">Secure OAuth 2.0</span>
             <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-700" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
