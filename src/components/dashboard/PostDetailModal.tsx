"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Heart, MessageCircle, Repeat2, ExternalLink, Activity, Trophy } from 'lucide-react';
import { ThreadsPost } from '@/types/threads';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface PostDetailModalProps {
  post: ThreadsPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PostDetailModal = ({ post, isOpen, onClose }: PostDetailModalProps) => {
  if (!post) return null;

  const engData = [
    { name: 'Likes', value: post.likes, color: '#f43f5e' },
    { name: 'Replies', value: post.replies, color: '#3b82f6' },
    { name: 'Reposts', value: post.reposts, color: '#a855f7' },
    { name: 'Quotes', value: post.quotes, color: '#10b981' },
  ].filter(d => d.value > 0);

  const maxVal = Math.max(...engData.map(d => d.value), 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-[#090909] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col md:flex-row h-full max-h-[800px]"
          >
            {/* Left Section: Content & Text */}
            <div className="flex-1 p-10 flex flex-col overflow-y-auto border-b md:border-b-0 md:border-r border-white/5">
              <div className="flex justify-between items-center mb-10">
                <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-white/5 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Post Insight</span>
                </div>
                <button onClick={onClose} className="md:hidden p-3 rounded-2xl bg-white/5 text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8 flex-1">
                 <div className="space-y-4">
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed text-zinc-100 italic selection:bg-zinc-800">
                      "{post.text}"
                    </p>
                    {post.createdAt && (
                       <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">{new Date(post.createdAt).toLocaleString()}</p>
                    )}
                 </div>

                 {/* Metrics Grid */}
                 <div className="grid grid-cols-2 gap-4">
                    <MetricBox icon={<Eye className="w-4 h-4" />} label="Total Reach" value={post.views} />
                    <MetricBox icon={<Trophy className="w-4 h-4" />} label="Perf. Score" value={post.score} />
                 </div>
              </div>

              <div className="pt-10">
                <a 
                  href={post.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                >
                  View on Threads
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Section: Analytics Charts */}
            <div className="w-full md:w-[320px] lg:w-[400px] bg-black p-10 flex flex-col gap-10">
               <div className="hidden md:flex justify-end">
                  <button onClick={onClose} className="p-3 rounded-2xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                    <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="space-y-8 flex-1">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Engagement Ratio</h4>
                    <div className="h-[240px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={engData} layout="vertical" margin={{ left: -20 }}>
                           <XAxis type="number" hide />
                           <YAxis dataKey="name" type="category" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                           <Tooltip 
                              cursor={{fill: 'rgba(255,255,255,0.02)'}}
                              contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                           />
                           <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                             {engData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                           </Bar>
                         </BarChart>
                       </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Distribution Points</h4>
                     <div className="space-y-3">
                        {engData.map(d => (
                          <div key={d.name} className="flex justify-between items-center p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                <span className="text-xs font-bold text-zinc-400">{d.name}</span>
                             </div>
                             <span className="text-sm font-black text-white">{d.value.toLocaleString()}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const MetricBox = ({ icon, label, value }: any) => (
  <div className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 space-y-2 group hover:bg-zinc-800/50 transition-colors">
     <div className="flex items-center justify-between text-zinc-500">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
     </div>
     <div className="text-3xl font-black italic tracking-tighter text-white group-hover:text-glow transition-all">
       {value.toLocaleString()}
     </div>
  </div>
);
