"use client";

import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HeatmapCellProps {
  value: number;
}

const HeatmapCell = ({ value }: HeatmapCellProps) => {
  const opacity = value / 10;
  return (
    <div 
      className="w-full h-4 rounded-sm transition-colors hover:ring-1 hover:ring-white/20 cursor-pointer"
      style={{ 
        backgroundColor: value === 0 ? 'rgba(255,255,255,0.02)' : `rgba(255,255,255, ${Math.max(0.05, opacity)})`
      }}
      title={`Activity Level: ${value}`}
    />
  );
};

interface ActivityHeatmapProps {
  bestTimeData: { time: string; score: number }[];
  heatmapData: { day: string; hours: number[] }[];
}

export const ActivityHeatmap = ({ bestTimeData, heatmapData }: ActivityHeatmapProps) => {
  return (
    <motion.div className="glass-card p-10 border border-white/5 bg-[#0d0d0d] rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Clock className="w-40 h-40 -rotate-12" />
      </div>
      <div className="flex justify-between items-start mb-14 relative z-10">
        <div className="space-y-2">
          <h3 className="font-black text-2xl italic tracking-tight text-white text-glow">Activity Peaks.</h3>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Your audience's most active windows</p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          AI Distribution Active
        </div>
      </div>
      
      <div className="h-[280px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bestTimeData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
            <XAxis dataKey="time" stroke="#555" fontSize={11} tickLine={false} axisLine={false} dy={10} />
            <YAxis hide />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.02)'}} 
              contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
              itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
              labelStyle={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '4px' }}
              formatter={(value: any) => [`${value} Activity Score`, 'Score']}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {bestTimeData.map((entry, index) => {
                const isTop = entry.score >= Math.max(...bestTimeData.map(d => d.score)) * 0.8;
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isTop ? 'url(#colorScore)' : '#1a1a1a'} 
                    stroke={isTop ? '#34d399' : '#27272a'} 
                    strokeWidth={1} 
                    className="transition-all duration-300"
                  />
                 );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-16 space-y-6 relative z-10">
        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 text-center">Engagement Density Heatmap</h4>
        <div className="space-y-2">
          {heatmapData.map((day) => (
            <div key={day.day} className="flex items-center gap-4">
              <span className="text-[10px] font-black text-zinc-700 uppercase w-8">{day.day}</span>
              <div className="flex-1 grid grid-cols-24 gap-1.5 h-6">
                {day.hours.map((val, i) => (
                  <HeatmapCell key={i} value={val} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
