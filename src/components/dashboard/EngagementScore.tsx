"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { TopFan, ThreadsPost } from '@/types/threads';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface EngagementScoreProps {
  isLoggedIn: boolean;
  topFans: TopFan[];
  posts: ThreadsPost[];
}

export const EngagementScore = ({ isLoggedIn, topFans, posts }: EngagementScoreProps) => {
  const validPosts = posts.filter(p => p.id !== 'empty');
  const totalLikes = validPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalReplies = validPosts.reduce((sum, p) => sum + (p.replies || 0), 0);
  const totalReposts = validPosts.reduce((sum, p) => sum + (p.reposts || 0), 0);
  const totalQuotes = validPosts.reduce((sum, p) => sum + (p.quotes || 0), 0);
  
  const totalEng = totalLikes + totalReplies + totalReposts + totalQuotes;

  let engagementData = [
    { name: 'Likes', value: totalLikes, color: '#f43f5e' },    
    { name: 'Replies', value: totalReplies, color: '#3b82f6' },  
    { name: 'Reposts', value: totalReposts, color: '#a855f7' },  
    { name: 'Quotes', value: totalQuotes, color: '#10b981' },    
  ];

  if (totalEng === 0) {
    engagementData = [{ name: 'No Data', value: 1, color: '#27272a' }];
  } else {
    engagementData = engagementData.filter(d => d.value > 0);
  }

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#09090b] border border-white/10 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-1">{payload[0].name}</p>
          <p className="text-xl font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].value.toLocaleString()} 
            {totalEng > 0 && <span className="text-xs text-white opacity-60 ml-2">({((payload[0].value / totalEng) * 100).toFixed(1)}%)</span>}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:col-span-2 flex flex-col gap-8">
      <motion.div className="glass-card p-10 border border-white/5 bg-[#0d0d0d] rounded-[2.5rem] shadow-2xl overflow-hidden group flex flex-col h-[400px]">
        <h3 className="font-black text-xl italic tracking-tight mb-2 text-white text-glow">Engagement Breakdown.</h3>
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-4">Total Interaction Ratio</p>
        
        <div className="flex-1 relative flex items-center justify-center -mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Inner Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total</span>
            <span className="text-2xl font-black text-white italic">{totalEng > 0 ? totalEng.toLocaleString() : '-'}</span>
          </div>
        </div>

        {/* Legend */}
        {totalEng > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {engagementData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold text-zinc-300">{item.name}</span>
                <span className="text-[10px] font-black text-zinc-600 ml-auto">{((item.value / totalEng) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div className="glass-card p-8 border border-white/5 bg-[#0d0d0d] rounded-[2.5rem] shadow-2xl group overflow-hidden flex-1">
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
