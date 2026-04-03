"use client";

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Components
import { Sidebar } from '@/components/layout/Sidebar';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { EngagementScore } from '@/components/dashboard/EngagementScore';
import { ActivityTable } from '@/components/dashboard/ActivityTable';
import { LoginOverlay } from '@/components/auth/LoginOverlay';
import { TopPerformanceCard } from '@/components/dashboard/TopPerformanceCard';

// Hooks
import { useThreadsAnalytics } from '@/hooks/useThreadsAnalytics';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

const SkeletonCard = () => (
  <div className="h-[160px] glass-card bg-zinc-900/20 animate-pulse rounded-2xl border border-white/5" />
);

export default function ThreadsProDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const {
    loading,
    summaryStats,
    posts,
    topFans,
    heatmapData,
    bestTimeData,
    engScore,
    isLive
  } = useThreadsAnalytics(isLoggedIn);

  const topPost = React.useMemo(() => {
    if (!posts || posts.length === 0 || posts[0].id === 'empty') return null;
    return [...posts].sort((a, b) => b.score - a.score)[0];
  }, [posts]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate OAuth delay
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsConnecting(false);
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div 
      className="flex min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800 overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        // @ts-ignore
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      }}
    >
      {/* Dynamic Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-30 spotlight-bg opacity-40 transition-opacity duration-300" />
      <div className="pointer-events-none fixed inset-0 z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        isConnecting={isConnecting}
        onConnect={handleConnect}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#050505] relative z-20">
        
        {/* Connection Overlay */}
        {!isLoggedIn && (
          <LoginOverlay isConnecting={isConnecting} onConnect={handleConnect} />
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isLoggedIn ? "visible" : "hidden"}
          className={cn("p-6 md:p-10 space-y-16 max-w-[1400px] mx-auto transition-all duration-1000", !isLoggedIn && "blur-2xl grayscale pointer-events-none opacity-40")}
        >
          {/* Header */}
          <motion.header variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black italic tracking-tighter flex items-center gap-4 text-glow">
                Hi, Welcome back <span className="animate-bounce not-italic">👋</span>
              </h2>
              <div className="flex items-center gap-3">
                <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] opacity-60">Performance distribution</p>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5",
                  isLive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isLive ? "bg-emerald-400" : "bg-rose-400")} />
                  {isLive ? "Live Connection" : "Demo Mode (Check Token)"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl px-6 py-4 flex items-center gap-6 shadow-2xl transition-all hover:border-white/10">
                <div className="text-right">
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-1">Total Followers</p>
                  <p className="text-2xl font-black italic tracking-tighter text-zinc-100">12,504</p>
                </div>
                <div className="w-px h-10 bg-zinc-800" />
                <button className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-2xl hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                  <Share2 className="w-3.5 h-3.5" />
                  Broadcast Dash
                </button>
              </div>
            </div>
          </motion.header>

          {/* Key Metrics Grid */}
          <section className="space-y-8">
            <motion.div variants={itemVariants} className="flex justify-between items-center px-1">
              <h3 className="font-black text-[10px] text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-px bg-zinc-800" />
                Key Performance Metrics
                <span className="text-zinc-700 font-black ml-2">Period: 7D</span>
              </h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                Array.from({length: 4}).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                summaryStats.map((stat) => (
                  <motion.div key={stat.id} variants={itemVariants}>
                    <SummaryCard {...stat} />
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Top Performance Highlight */}
          {!loading && topPost && <TopPerformanceCard post={topPost} />}

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
            {/* Optimal Posting Time & Heatmap */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              {loading ? (
                <div className="h-[600px] glass-card bg-zinc-900/20 animate-pulse rounded-[2.5rem] border border-white/5" />
              ) : (
                <ActivityHeatmap bestTimeData={bestTimeData} heatmapData={heatmapData} />
              )}
            </motion.div>

            {/* Engagement Score & Ranking */}
            <EngagementScore isLoggedIn={isLoggedIn} topFans={topFans} />
          </div>

          {/* Table Section */}
          {loading ? (
            <div className="h-[400px] glass-card bg-zinc-900/20 animate-pulse rounded-[2.5rem] border border-white/5" />
          ) : (
            <ActivityTable posts={posts} />
          )}
        </motion.div>
      </main>
    </div>
  );
}
