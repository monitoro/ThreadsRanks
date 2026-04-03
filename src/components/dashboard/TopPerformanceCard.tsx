"use client";

import React from 'react';
import { Crown, Eye, Heart, MessageCircle, Repeat2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThreadsPost } from '@/types/threads';

interface TopPerformanceCardProps {
  post: ThreadsPost | null;
}

export const TopPerformanceCard = ({ post }: TopPerformanceCardProps) => {
  if (!post || post.id === 'empty') return null;

  return (
    <motion.div 
      className="relative w-full rounded-[2.5rem] p-[1px] overflow-hidden group mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Gradient Border Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 animate-spin-slow opacity-20" style={{ animationDuration: '8s' }} />
      
      <div className="relative h-full w-full bg-[#0d0d0d] rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 z-10 shadow-2xl">
        
        {/* Left Section: Crown & Text */}
        <div className="flex-1 flex gap-6 items-start">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] shrink-0">
            <Crown className="w-8 h-8 text-black" fill="currentColor" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              #1 Top Performing Post
            </h3>
            <p className="text-white/90 font-medium text-lg md:text-xl line-clamp-2 leading-relaxed">
              "{post.text}"
            </p>
            {post.createdAt && (
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Stats */}
        <div className="flex items-center gap-4 flex-wrap shrink-0">
          {post.hasInsights ? (
            <>
              <StatBox icon={<Eye className="w-4 h-4 text-emerald-400" />} label="Views" value={post.views} />
              <StatBox icon={<Heart className="w-4 h-4 text-rose-400" />} label="Likes" value={post.likes} />
              <StatBox icon={<MessageCircle className="w-4 h-4 text-blue-400" />} label="Replies" value={post.replies} />
              <StatBox icon={<Repeat2 className="w-4 h-4 text-indigo-400" />} label="Reposts" value={post.reposts} />
              
              {/* Total Score Badge */}
              <div className="bg-white text-black px-6 py-4 rounded-2xl flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.1)] ml-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Eng Score</span>
                <span className="text-2xl font-black italic">{post.score.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl px-8 py-4 flex flex-col items-center justify-center opacity-40">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Insights Unavailable</span>
              <span className="text-xs font-bold text-zinc-600">Update Token Permissions</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Helper component for small stat boxes
const StatBox = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-xl flex flex-col items-center justify-center transition-colors hover:bg-white/10">
    <div className="flex items-center gap-2 mb-1.5 opacity-70">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-lg font-black text-white">{value.toLocaleString()}</span>
  </div>
);
