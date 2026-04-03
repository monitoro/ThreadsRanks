"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreadsPost } from '@/types/threads';
import { ArrowUpRight, Flame, Eye, Calendar, Clock } from 'lucide-react';

interface ActivityTableProps {
  posts: ThreadsPost[];
}

type SortOption = 'score' | 'views' | 'date';

export const ActivityTable = ({ posts }: ActivityTableProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('score');

  const sortedPosts = useMemo(() => {
    const validPosts = posts.filter(p => p.id !== 'empty');
    if (validPosts.length === 0) return posts;

    return [...validPosts].sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'views') return b.views - a.views;
      // Date sort
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [posts, sortBy]);

  const handleRowClick = (permalink?: string) => {
    if (permalink) {
      window.open(permalink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.section className="space-y-10 pt-10 pb-32">
      <div className="flex justify-between items-end border-b border-zinc-900 pb-8">
        <div>
          <h3 className="font-black text-3xl italic tracking-tighter text-white text-glow mb-2">Detailed Post Analytics.</h3>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Select a row to view thread</p>
        </div>
        
        {/* Sort Controls */}
        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
          <SortButton active={sortBy === 'score'} onClick={() => setSortBy('score')} icon={<Flame className="w-3 h-3" />} label="Top Score" />
          <SortButton active={sortBy === 'views'} onClick={() => setSortBy('views')} icon={<Eye className="w-3 h-3" />} label="Most Viewed" />
          <SortButton active={sortBy === 'date'} onClick={() => setSortBy('date')} icon={<Calendar className="w-3 h-3" />} label="Latest" />
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/5 bg-[#090909] overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900/80 bg-black/50">
              <th className="px-10 py-8 text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">Content distribution</th>
              <th className="px-6 py-8 text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] text-center w-32">Post Reach</th>
              <th className="px-6 py-8 text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] text-center w-32">Eng. Score</th>
              <th className="px-10 py-8 text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] text-right w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50 relative">
            <AnimatePresence mode="popLayout">
              {sortedPosts.map((post) => {
                const isEmpty = post.id === 'empty';
                return (
                  <motion.tr 
                    key={post.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !isEmpty && handleRowClick(post.permalink)}
                    className={`group/row transition-all duration-300 ${isEmpty ? '' : 'hover:bg-white/[0.02] cursor-pointer'}`}
                  >
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <p className={`text-[14px] font-medium leading-relaxed line-clamp-2 transition-colors ${isEmpty ? 'text-zinc-500 italic' : 'text-zinc-300 group-hover/row:text-white'}`}>
                          {post.text}
                        </p>
                        {post.createdAt && (
                           <div className="flex items-center gap-1.5 text-zinc-600">
                             <Clock className="w-3 h-3" />
                             <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(post.createdAt).toLocaleDateString()}</span>
                           </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-8 text-center">
                      {!isEmpty ? (
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black italic tracking-tighter text-zinc-400 group-hover/row:text-emerald-400 transition-colors">{post.views.toLocaleString()}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700 mt-1">Views</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-8 text-center">
                      {!isEmpty ? (
                        <div className="w-12 h-12 mx-auto rounded-[1.25rem] border border-white/5 bg-white/5 flex items-center justify-center text-sm font-black italic text-zinc-300 group-hover/row:bg-amber-500 group-hover/row:text-black group-hover/row:border-amber-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0)] group-hover/row:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                          {post.score}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-10 py-8 text-right">
                      {!isEmpty && post.permalink && (
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-white/5 text-zinc-500 group-hover/row:bg-white group-hover/row:text-black transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.section>
  );
};

const SortButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all
      ${active ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
  >
    {icon}
    {label}
  </button>
);
