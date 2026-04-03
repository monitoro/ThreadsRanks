"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Users, 
  UserCircle, 
  LogOut, 
  Lock 
} from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-[0.825rem] text-left group mb-1",
      active 
        ? "bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.1)]" 
        : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
    )}
  >
    <Icon className={cn("w-[18px] h-[18px]", active ? "text-black" : "text-zinc-600 group-hover:text-zinc-400")} />
    {label}
  </button>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onLogout: () => void;
}

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  isLoggedIn, 
  isConnecting, 
  onConnect, 
  onLogout 
}: SidebarProps) => {
  return (
    <aside className="w-[260px] border-r border-zinc-900 hidden lg:flex flex-col p-6 sticky top-0 h-screen bg-black z-40">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-10 px-2 group cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <span className="text-black font-black text-xl font-serif italic">TR</span>
        </div>
        <h1 className="font-black text-xl tracking-tighter italic text-glow">ThreadsRanks.</h1>
      </motion.div>
      
      <nav className="flex-1 space-y-1">
        {['Dashboard', 'Analytics', 'Posts', 'Followers'].map((label, idx) => {
          const icons = [LayoutDashboard, BarChart3, FileText, Users];
          const Icon = icons[idx];
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <SidebarItem 
                icon={Icon} 
                label={label} 
                active={activeTab === label} 
                onClick={() => setActiveTab(label)} 
              />
            </motion.div>
          );
        })}
      </nav>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-6 border-t border-zinc-900 space-y-4"
      >
        {isLoggedIn ? (
          <div className="flex items-center gap-3 px-2 py-3 rounded-2xl border border-transparent hover:border-zinc-800 hover:bg-zinc-900/50 transition-all group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-zinc-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate text-zinc-200">Threads Master</p>
              <p className="text-[10px] text-zinc-600 truncate font-medium">@threads_pro</p>
            </div>
            <LogOut onClick={onLogout} className="w-4 h-4 text-zinc-700 hover:text-rose-500 cursor-pointer transition-colors" />
          </div>
        ) : (
          <button 
            onClick={onConnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            {isConnecting ? <span className="animate-spin text-lg">◌</span> : <Lock className="w-3 h-3" />}
            Connect Threads
          </button>
        )}
        
        {/* Support & Privacy */}
        <div className="px-2 pt-2">
          <Link 
            href="/privacy" 
            className="text-[9px] font-black uppercase tracking-widest text-zinc-700 hover:text-zinc-400 transition-colors flex items-center gap-2"
          >
            <Lock className="w-2.5 h-2.5" />
            Privacy Policy
          </Link>
        </div>
      </motion.div>

    </aside>
  );
};
