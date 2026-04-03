"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ThreadsPost } from '@/types/threads';

interface ActivityTableProps {
  posts: ThreadsPost[];
}

export const ActivityTable = ({ posts }: ActivityTableProps) => {
  return (
    <motion.section className="space-y-10 pt-10 pb-32">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-10">
        <h3 className="font-black text-3xl italic tracking-tighter text-white text-glow">Latest Activity Performance.</h3>
        <div className="px-6 py-3 rounded-full border border-zinc-800 bg-zinc-950/50 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
          Sorted by Engagement Score
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/5 bg-[#090909] overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-black/50">
              <th className="px-10 py-8 text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">Content Distribution</th>
              <th className="px-6 py-8 text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] text-center">Post Reach</th>
              <th className="px-6 py-8 text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] text-center">Precision Score</th>
              <th className="px-10 py-8 text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] text-right">Analytics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-white/[0.01] group/row transition-all duration-500">
                <td className="px-10 py-10">
                    <p className="text-[15px] font-black text-zinc-300 group-hover/row:text-white transition-colors line-clamp-1 italic">{post.text}</p>
                </td>
                <td className="px-6 py-10 text-center text-lg font-black italic tracking-tighter text-zinc-500 group-hover/row:text-white transition-colors">{post.views.toLocaleString()}</td>
                <td className="px-6 py-10 text-center">
                  <div className="w-12 h-12 mx-auto rounded-[1.25rem] border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center text-sm font-black italic text-emerald-400 group-hover/row:bg-emerald-500 group-hover/row:text-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    {post.score}
                  </div>
                </td>
                <td className="px-10 py-10 text-right">
                  <button className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-white text-zinc-600 hover:text-black font-black text-[9px] uppercase tracking-[0.2em] transition-all shadow-xl border border-white/5">
                    Deep Insights
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
};
