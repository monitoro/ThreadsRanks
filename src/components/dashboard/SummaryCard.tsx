"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SummaryCardProps {
  title: string;
  value: string;
  trend: number;
  data: number[];
  icon: LucideIcon;
}

export const SummaryCard = ({ title, value, trend, data, icon: Icon }: SummaryCardProps) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass-card p-5 border border-zinc-800/60 bg-[#0d0d0d] relative overflow-hidden group rounded-2xl"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 rounded-xl bg-zinc-800/40">
        <Icon className="w-4.5 h-4.5 text-zinc-400" />
      </div>
      <div className={cn(
        "text-[10px] font-black px-2 py-1 rounded-lg tracking-tighter",
        trend > 0 && "text-emerald-400 bg-emerald-400/5 border border-emerald-400/10",
        trend < 0 && "text-rose-400 bg-rose-400/5 border border-rose-400/10",
        trend === 0 && "text-zinc-500 bg-zinc-500/5 border border-zinc-500/10"
      )}>
        {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : 'LIVE'}
      </div>
    </div>
    <div className="space-y-0.5 relative z-10">
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">{title}</p>
      <h3 className="text-2xl font-black text-zinc-100 italic tracking-tighter">{value}</h3>
    </div>
    {data && data.length > 0 && (
      <div className="absolute bottom-0 left-0 h-16 w-full opacity-30 group-hover:opacity-60 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.map((v, i) => ({ v, i }))}>
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke={trend > 0 ? "#10b981" : "#f43f5e"} 
              strokeWidth={2}
              fill={trend > 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)"}
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )}
  </motion.div>
);
