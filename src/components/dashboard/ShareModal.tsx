"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Crown, TrendingUp, Heart, Eye, MessageCircle } from 'lucide-react';
import { ThreadsPost } from '@/types/threads';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  followerCount: string;
  topPost: ThreadsPost | null;
  username: string;
}

export const ShareModal = ({ isOpen, onClose, followerCount, topPost, username }: ShareModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl glass-card bg-[#0d0d0d] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-10 py-8 border-b border-white/5">
              <h3 className="text-xl font-black italic tracking-tighter text-white">Share Your Performance.</h3>
              <button onClick={onClose} className="p-3 rounded-2xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Share Card Area */}
            <div className="p-10 flex flex-col items-center">
              <div id="share-card" className="w-full aspect-[4/5] bg-black rounded-[2.5rem] p-[1px] overflow-hidden relative shadow-2xl">
                {/* Visual Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-indigo-500/20" />
                <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-white/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]" />

                <div className="relative h-full w-full bg-[#050505] rounded-[2.5rem] p-10 flex flex-col justify-between border border-white/10 overflow-hidden">
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Threads Analytics</p>
                      <h4 className="text-3xl font-black italic tracking-tighter text-white">@{username}</h4>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      <span className="text-black font-black text-xl italic font-serif leading-none">TR</span>
                    </div>
                  </div>

                  {/* Follower Highlight */}
                  <div className="text-center space-y-2">
                    <p className="text-[12px] font-black uppercase tracking-[0.5em] text-zinc-600">Total Audience Reach</p>
                    <div className="text-7xl md:text-8xl font-black italic tracking-tighter text-white text-glow leading-none">
                      {followerCount}
                    </div>
                  </div>

                  {/* Top Performance */}
                  {topPost && (
                    <div className="glass-card bg-white/5 p-8 border border-white/10 rounded-[2rem] space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
                          <Crown className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Top Performing Thread</span>
                      </div>
                      <p className="text-white text-base font-medium line-clamp-3 leading-relaxed italic">
                        "{topPost.text}"
                      </p>
                      <div className="flex items-center gap-6 pt-2">
                         <div className="flex items-center gap-2">
                           <Eye className="w-3.5 h-3.5 text-zinc-500" />
                           <span className="text-[11px] font-black text-zinc-300">{topPost.views.toLocaleString()}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <Heart className="w-3.5 h-3.5 text-rose-500" />
                           <span className="text-[11px] font-black text-zinc-300">{topPost.likes.toLocaleString()}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                           <span className="text-[11px] font-black text-zinc-300">{topPost.replies.toLocaleString()}</span>
                         </div>
                         <div className="ml-auto bg-white text-black px-3 py-1 rounded-lg text-[10px] font-black italic tracking-tighter">
                           Score: {topPost.score}
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Footnote */}
                  <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Performance Verified</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">ThreadRank.Pro</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-10 py-8 bg-zinc-900/50 border-t border-white/5 flex gap-4">
              <button 
                onClick={() => {
                  const btn = document.getElementById('save-btn');
                  if (btn) {
                    btn.innerHTML = '◌ Processing...';
                    setTimeout(() => {
                      btn.innerHTML = '✓ Saved to Downloads';
                      setTimeout(() => { btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> Save Image'; }, 2000);
                    }, 1500);
                  }
                }}
                id="save-btn"
                className="flex-1 py-4 rounded-2xl bg-zinc-800 text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-700 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Save Image
              </button>
              <button className="flex-1 py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                <Share2 className="w-4 h-4" />
                Share Directly
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
