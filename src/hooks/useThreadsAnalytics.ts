"use client";

import { useState, useEffect, useCallback } from 'react';
import { ThreadsPost, SummaryStat, TopFan, HeatmapData, BestTimeData } from '@/types/threads';
import { ThreadsService } from '@/services/threads';
import { Eye, UserCircle, Repeat2, Clock, UserPlus, AtSign, CheckCircle, RefreshCw, XCircle, ShieldAlert, Flame, Activity } from 'lucide-react';

export const useThreadsAnalytics = (isLoggedIn: boolean) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryStats, setSummaryStats] = useState<SummaryStat[]>([]);
  const [posts, setPosts] = useState<ThreadsPost[]>([]);
  const [topFans, setTopFans] = useState<TopFan[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [bestTimeData, setBestTimeData] = useState<BestTimeData[]>([]);
  const [engScore, setEngScore] = useState<number>(0);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [followerCount, setFollowerCount] = useState<string>('---');

  const fetchAnalytics = useCallback(async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    const service = ThreadsService.getInstance();
    service.clearCache(); // 매 호출마다 캐시 초기화 후 새로 가져옴
    
    try {
      // 순서를 보장하지 않아도 되므로 병렬 호출
      const [stats, recentPosts, engData, activityData, followers] = await Promise.all([
        service.getSummaryStats(),
        service.getRecentPosts(),
        service.getEngagementData(),
        service.getActivityData(),
        service.getFollowerCount(),
      ]);
      
      const iconMap: any = { Eye, UserCircle, Repeat2, Clock, UserPlus, AtSign, CheckCircle, RefreshCw, XCircle, ShieldAlert, Flame, Activity };
      const statsWithIcons = stats.map(s => ({ ...s, icon: iconMap[s.icon as string] || Eye }));
      
      setSummaryStats(statsWithIcons);
      setPosts(recentPosts);
      setTopFans(engData.topFans);
      setEngScore(engData.score);
      setHeatmapData(activityData.heatmap);
      setBestTimeData(activityData.bestTimes);
      setIsLive(service.isLiveMode);
      setFollowerCount(followers !== null ? followers.toLocaleString() : '권한 필요');
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
    bestTimeData,
    engScore,
    isLive,
    followerCount,
    refresh: fetchAnalytics
  };
};
