import { ThreadsPost, SummaryStat, TopFan, HeatmapData } from '@/types/threads';

// Combined real API with Mock fallback for resilience.
export class ThreadsService {
  private static instance: ThreadsService;
  private readonly baseUrl = 'https://graph.threads.net/v1.0';
  private readonly token = process.env.NEXT_PUBLIC_THREADS_USER_TOKEN || '';
  public isLiveMode = false;

  private constructor() {
    this.isLiveMode = !!this.token;
  }

  public static getInstance(): ThreadsService {
    if (!ThreadsService.instance) {
      ThreadsService.instance = new ThreadsService();
    }
    return ThreadsService.instance;
  }

  private async fetchFromThreads(endpoint: string, params: Record<string, string> = {}) {
    if (!this.token) {
      this.isLiveMode = false;
      return null;
    }

    const queryParams = new URLSearchParams({
      access_token: this.token,
      ...params
    });

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}?${queryParams.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        console.error("Threads API Error Response:", error);
        this.isLiveMode = false;
        return null;
      }
      const data = await response.json();
      this.isLiveMode = true;
      return data;
    } catch (e) {
      console.error("Fetch Exception:", e);
      this.isLiveMode = false;
      return null;
    }
  }

  async getSummaryStats(): Promise<SummaryStat[]> {
    const user = await this.fetchFromThreads('me', { fields: 'id,username,follower_count' });
    
    if (!user) {
      this.isLiveMode = false;
      return [
        { id: 'v', title: 'Post Views (Mock)', value: '5,704', trend: 12.5, data: [120, 180, 150, 320, 240, 410, 380], icon: 'Eye' },
        { id: 'f', title: 'Followers (Mock)', value: '1,240', trend: 2.4, data: [55, 42, 65, 48, 58, 42, 52], icon: 'UserPlus' },
        { id: 'u', title: 'Account Status', value: 'Mock Mode', trend: 0, data: [], icon: 'ShieldAlert' },
        { id: 's', title: 'Connection', value: 'No Token', trend: -100, data: [0,0,0,0,0,0,0], icon: 'XCircle' },
      ];
    }

    this.isLiveMode = true;
    return [
      { id: 'followers', title: 'Real Followers', value: user.follower_count.toLocaleString(), trend: 0, data: [user.follower_count], icon: 'UserPlus' },
      { id: 'account', title: 'Verified Handle', value: `@${user.username}`, trend: 0, data: [], icon: 'AtSign' },
      { id: 'api', title: 'API Access', value: 'Live Connection', trend: 100, data: [1,1,1,1,1,1,1], icon: 'CheckCircle' },
      { id: 'sync', title: 'Last Sync', value: 'Just now', trend: 0, data: [], icon: 'RefreshCw' },
    ];
  }

  async getRecentPosts(): Promise<ThreadsPost[]> {
    const data = await this.fetchFromThreads('me/threads', { 
      fields: 'id,text,timestamp,like_count,reply_count,repost_count,quote_count' 
    });

    if (!data || !data.data) {
      return [
        { id: 'm1', text: "Mock Data: Connect your token for real insights", views: 4500, likes: 1200, reposts: 85, replies: 230, quotes: 45, score: 9.8 },
        { id: 'm2', text: "Mock Data: Example thread content goes here", views: 2340, likes: 560, reposts: 25, replies: 98, quotes: 12, score: 8.5 },
      ];
    }

    return data.data.map((post: any) => {
      const p: ThreadsPost = {
        id: post.id,
        text: post.text || "(Media Content)",
        views: (post.reply_count || 0) * 10 + (post.like_count || 0) * 5,
        likes: post.like_count || 0,
        reposts: post.repost_count || 0,
        replies: post.reply_count || 0,
        quotes: post.quote_count || 0,
        score: 0,
        createdAt: post.timestamp
      };
      p.score = Math.min(10, Math.round(((p.likes * 1 + p.replies * 2 + p.reposts * 5) / Math.max(1, p.views / 100)) * 10) / 10);
      return p;
    });
  }

  async getEngagementData(): Promise<{ score: number, topFans: TopFan[] }> {
    const posts = await this.getRecentPosts();
    const avgScore = posts.length ? posts.reduce((acc, p) => acc + p.score, 0) / posts.length : 0;
    
    return {
      score: Math.round(avgScore * 10) / 10,
      topFans: [
        { rank: 1, name: this.isLiveMode ? "You" : "Community", handle: this.isLiveMode ? "Active" : "@threads", score: 98.4, color: "#10b981", likes: 124, replies: 45, reposts: 12 },
      ]
    };
  }

  async getActivityData(): Promise<HeatmapData[]> {
    const posts = await this.getRecentPosts();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const heatmap: HeatmapData[] = days.map(day => ({ day, hours: Array(24).fill(0) }));

    if (this.isLiveMode) {
      posts.forEach(post => {
        if (post.createdAt) {
          const date = new Date(post.createdAt);
          heatmap[date.getDay()].hours[date.getHours()]++;
        }
      });
    } else {
      heatmap.forEach(h => h.hours = Array.from({length: 24}, () => Math.floor(Math.random() * 5)));
    }

    return heatmap;
  }
}
