import { ThreadsPost, SummaryStat, TopFan, HeatmapData } from '@/types/threads';

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
        console.error(`Status: ${response.status} | API Error:`, error);
        return null;
      }
      return response.json();
    } catch (e) {
      console.error("Fetch Request Failed:", e);
      return null;
    }
  }

  async getSummaryStats(): Promise<SummaryStat[]> {
    // Try minimal fields first to avoid permission errors
    const user = await this.fetchFromThreads('me', { fields: 'id,username' });
    
    if (!user) {
      this.isLiveMode = false;
      return [
        { id: 'v', title: 'Post Views (Mock)', value: '5,704', trend: 12.5, data: [120, 180, 150, 320, 240, 410, 380], icon: 'Eye' },
        { id: 'f', title: 'Followers (Mock)', value: '1,240', trend: 2.4, data: [55, 42, 65, 48, 58, 42, 52], icon: 'UserPlus' },
        { id: 'u', title: 'API Status', value: 'Check Console', trend: 0, data: [], icon: 'ShieldAlert' },
        { id: 's', title: 'Connection', value: 'Partial Fail', trend: -1, data: [0,0,0,0,0,0,0], icon: 'XCircle' },
      ];
    }

    // If we got here, at least 'me' call succeeded
    this.isLiveMode = true;
    return [
      { id: 'views', title: 'Data Flow', value: 'Active', trend: 0, data: [1,1,1,1,1,1,1], icon: 'Eye' },
      { id: 'followers', title: 'Profile', value: `@${user.username}`, trend: 0, data: [], icon: 'AtSign' },
      { id: 'account', title: 'User ID', value: user.id.slice(0, 8) + '...', trend: 0, data: [], icon: 'UserCircle' },
      { id: 'status', title: 'Network', value: 'Connected', trend: 100, data: [1,1,1,1,1,1,1], icon: 'CheckCircle' },
    ];
  }

  async getRecentPosts(): Promise<ThreadsPost[]> {
    const data = await this.fetchFromThreads('me/threads', { 
      fields: 'id,text,timestamp,like_count,reply_count,repost_count,quote_count' 
    });

    if (!data || !data.data) {
      // Don't set isLiveMode to false here if summary already succeeded
      return [
        { id: 'm1', text: "No posts found or permission restricted. (Check if you have recent threads)", views: 0, likes: 0, reposts: 0, replies: 0, quotes: 0, score: 0 },
      ];
    }

    this.isLiveMode = true;
    return data.data.map((post: any) => {
      const p: ThreadsPost = {
        id: post.id,
        text: post.text || "(Media Content)",
        views: (post.reply_count || 0) * 10 + (post.like_count || 0) * 5 + 10,
        likes: post.like_count || 0,
        reposts: post.repost_count || 0,
        replies: post.reply_count || 0,
        quotes: post.quote_count || 0,
        score: 0,
        createdAt: post.timestamp
      };
      // Simple precision score logic
      const rawScore = (p.likes * 1 + p.replies * 2 + p.reposts * 5) / Math.max(1, p.views / 100);
      p.score = Math.min(10, Math.round(rawScore * 10) / 10);
      return p;
    });
  }

  async getEngagementData(): Promise<{ score: number, topFans: TopFan[] }> {
    const posts = await this.getRecentPosts();
    const livePosts = posts.filter(p => !String(p.id).startsWith('m'));
    
    const avgScore = livePosts.length ? livePosts.reduce((acc, p) => acc + p.score, 0) / livePosts.length : 0;
    
    return {
      score: Math.round(avgScore * 10) / 10,
      topFans: [
        { rank: 1, name: this.isLiveMode ? "You" : "Demo User", handle: "Active", score: 98.4, color: "#10b981", likes: 124, replies: 45, reposts: 12 },
      ]
    };
  }

  async getActivityData(): Promise<HeatmapData[]> {
    const posts = await this.getRecentPosts();
    const livePosts = posts.filter(p => !String(p.id).startsWith('m'));
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const heatmap: HeatmapData[] = days.map(day => ({ day, hours: Array(24).fill(0) }));

    if (livePosts.length > 0) {
      livePosts.forEach(post => {
        if (post.createdAt) {
          const date = new Date(post.createdAt);
          heatmap[date.getDay()].hours[date.getHours()]++;
        }
      });
    } else {
      heatmap.forEach(h => h.hours = Array.from({length: 24}, () => 0));
    }

    return heatmap;
  }
}
