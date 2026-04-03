"use client";

import { useState, useEffect, useCallback } from 'react';
import { ThreadsPost, SummaryStat, TopFan, HeatmapData } from '@/types/threads';
import { ThreadsService } from '@/services/threads';
import { Eye, UserCircle, Repeat2, Clock } from 'lucide-react';

export const useThreadsAnalytics = (isLoggedIn: boolean) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryStats, setSummaryStats] = useState<SummaryStat[]>([]);
  const [posts, setPosts] = useState<ThreadsPost[]>([]);
  const [topFans, setTopFans] = useState<TopFan[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [engScore, setEngScore] = useState<number>(0);

  const fetchAnalytics = useCallback(async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    const service = ThreadsService.getInstance();
    
    try {
      // Run fetches in parallel for better performance
      const [stats, recentPosts, engData, activityData] = await Promise.all([
        service.getSummaryStats(),
        service.getRecentPosts(),
        service.getEngagementData(),
        service.getActivityData()
      ]);
      
      // Since icons are strings in the service, we map them back to Lucide components here
      const iconMap: any = { Eye, UserCircle, Repeat2, Clock };
      const statsWithIcons = stats.map(s => ({ ...s, icon: iconMap[s.icon as string] || Eye }));
      
      setSummaryStats(statsWithIcons);
      setPosts(recentPosts);
      setTopFans(engData.topFans);
      setEngScore(engData.score);
      setHeatmapData(activityData);
    } catch (error) {
      console.error("Failed to fetch Threads analytics", error);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAnalytics();
    }
  }, [isLoggedIn, fetchAnalytics]);

  return {
    loading,
    summaryStats,
    posts,
    topFans,
    heatmapData,
    engScore,
    refresh: fetchAnalytics
  };
};
