import { ThreadsPost, SummaryStat, TopFan, HeatmapData } from '@/types/threads';

// This service encapsulates all Threads API interactions.
// Currently it returns mock data, but is structured to be easily replaced with real API calls.

export class ThreadsService {
  private static instance: ThreadsService;
  
  private constructor() {}

  public static getInstance(): ThreadsService {
    if (!ThreadsService.instance) {
      ThreadsService.instance = new ThreadsService();
    }
    return ThreadsService.instance;
  }

  /**
   * Fetches the analytics summary for the logged-in user.
   */
  async getSummaryStats(period: string = '7D'): Promise<SummaryStat[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real scenario, this would be a fetch call to Meta Graph API
    return [
      { id: 'views', title: 'Post Views', value: '5,704', trend: 12.5, data: [120, 180, 150, 320, 240, 410, 380], icon: 'Eye' },
      { id: 'profile', title: 'Profile Views', value: '276', trend: -2.4, data: [55, 42, 65, 48, 58, 42, 52], icon: 'UserCircle' },
      { id: 'reposts', title: 'Reposts', value: '42', trend: 8.1, data: [6, 9, 14, 8, 18, 12, 16], icon: 'Repeat2' },
      { id: 'interval', title: 'Post Interval', value: '12.2h', trend: -5.0, data: [16, 13, 11, 15, 12, 14, 13], icon: 'Clock' },
    ];
  }

  /**
   * Calculates a custom engagement score based on post metrics.
   * Logic: (Likes * 1 + Replies * 2 + Reposts * 3 + Quotes * 4) / (Views / 100)
   */
  private calculateEngagementScore(post: Partial<ThreadsPost>): number {
    const { likes = 0, replies = 0, reposts = 0, quotes = 0, views = 1 } = post;
    const rawScore = (likes * 1 + replies * 2 + reposts * 3 + quotes * 4) / Math.max(1, views / 100);
    return Math.min(10, Math.round(rawScore * 10) / 10); // Cap at 10.0
  }

  /**
   * Fetches recent posts and their engagement scores.
   */
  async getRecentPosts(): Promise<ThreadsPost[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const rawPosts: Omit<ThreadsPost, 'score'>[] = [
      { id: 1, text: "Threads에 대한 새로운 업데이트 소식...", views: 1250, likes: 345, reposts: 12, replies: 45, quotes: 5 },
      { id: 2, text: "테크 트렌드 2026: AI와 스레드의 조화", views: 2340, likes: 560, reposts: 25, replies: 98, quotes: 12 },
      { id: 3, text: "오늘의 일상: 코딩과 커피 한 잔의 여유", views: 890, likes: 120, reposts: 3, replies: 15, quotes: 2 },
      { id: 4, text: "새로운 프로젝트 'Threads Dashboard' 런칭!", views: 4500, likes: 1200, reposts: 85, replies: 230, quotes: 45 },
      { id: 5, text: "커뮤니티 가이드라인 준수의 중요성", views: 560, likes: 45, reposts: 2, replies: 8, quotes: 0 },
    ];

    return rawPosts.map(post => ({
      ...post as ThreadsPost,
      score: this.calculateEngagementScore(post)
    }));
  }

  /**
   * Fetches engagement score and top contributors.
   */
  async getEngagementData(): Promise<{ score: number, topFans: TopFan[] }> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const posts = await this.getRecentPosts();
    const avgScore = posts.reduce((acc, p) => acc + p.score, 0) / posts.length;
    
    return {
      score: Math.round(avgScore * 100) / 100,
      topFans: [
        { rank: 1, name: "Jin-woo Park", handle: "@jinwoo_dev", score: 98.4, color: "#10b981", likes: 124, replies: 45, reposts: 12 },
        { rank: 2, name: "Sarah Kim", handle: "@sarah_design", score: 85.2, color: "#3b82f6", likes: 98, replies: 23, reposts: 8 },
        { rank: 3, name: "Hiroki Sato", handle: "@hiro_tech", score: 72.8, color: "#a855f7", likes: 67, replies: 18, reposts: 5 },
      ]
    };
  }


  /**
   * Fetches activity heatmap data.
   */
  async getActivityData(): Promise<HeatmapData[]> {
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return [
      { day: 'Mon', hours: Array.from({length: 24}, () => Math.floor(Math.random() * 11)) },
      { day: 'Tue', hours: Array.from({length: 24}, () => Math.floor(Math.random() * 11)) },
      { day: 'Wed', hours: Array.from({length: 24}, () => Math.floor(Math.random() * 11)) },
      { day: 'Thu', hours: Array.from({length: 24}, () => Math.floor(Math.random() * 11)) },
      { day: 'Fri', hours: Array.from({length: 24}, () => Math.floor(Math.random() * 11)) },
      { day: 'Sat', hours: Array.from({length: 24}, () => Math.floor(Math.random() * 11)) },
      { day: 'Sun', hours: Array.from({length: 24}, () => Math.floor(Math.random() * 11)) },
    ];
  }
}
