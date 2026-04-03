"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { TopFan } from '@/types/threads';

interface EngagementScoreProps {
  isLoggedIn: boolean;
  topFans: TopFan[];
}

export const EngagementScore = ({ isLoggedIn, topFans }: EngagementScoreProps) => {
  return (
    <div className="lg:col-span-2 flex flex-col gap-8">
      <motion.div className="glass-card p-10 border border-white/5 bg-[#0d0d0d] rounded-[2.5rem] flex-1 shadow-2xl overflow-hidden group">
        <h3 className="font-black text-xl italic tracking-tight mb-10 text-white text-glow">Engagement Score.</h3>
        <div className="space-y-8">
          {[
            { label: 'Avg. Retention', value: 85, color: '#10b981' },
            { label: 'Fan Response', value: 65, color: '#3b82f6' },
            { label: 'Viral Coeff.', value: 42, color: '#a855f7' },
          ].map((item) => (
            <div key={item.label} className="space-y-4">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                <span className="text-zinc-500">{item.label}</span>
                <span className="text-zinc-300">{item.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={isLoggedIn ? { width: `${item.value}%` } : {}}
                  transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                  className="h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-10 border-t border-zinc-900/50">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Precision Rating</p>
            <p className="text-5xl font-black italic tracking-tighter text-white text-glow">8.42</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="glass-card p-8 border border-white/5 bg-[#0d0d0d] rounded-[2.5rem] shadow-2xl group overflow-hidden">
        <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-all group-hover:scale-110">
          <Users className="w-40 h-40" />
        </div>
        <h3 className="font-black text-[10px] text-zinc-600 uppercase tracking-[0.3em] mb-8">Top Contributor Growth</h3>
        <div className="space-y-6 relative z-10">
          {topFans.slice(0, 3).map((fan, i) => (
            <div key={i} className="flex items-center gap-4 group/fan">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black italic text-zinc-700 group-hover/fan:bg-white group-hover/fan:text-black transition-all">
                {i+1}
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-zinc-300 truncate">{fan.name}</p>
                <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-tighter">{fan.handle}</p>
              </div>
              <div className="text-right">
                 <span className="text-sm font-black italic text-emerald-400">+{fan.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
