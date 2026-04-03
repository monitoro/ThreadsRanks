import { ThreadsPost, SummaryStat, TopFan, HeatmapData, BestTimeData } from '@/types/threads';

/**
 * ThreadsService — 서버사이드 API Route를 통해 데이터를 가져옴
 * 
 * 변경 전: 브라우저에서 직접 graph.threads.net 호출 (토큰 노출!)
 * 변경 후: 브라우저 → /api/threads/* → 서버에서 graph.threads.net 호출 (토큰 안전)
 */
export class ThreadsService {
  private static instance: ThreadsService;
  public isLiveMode = false;

  // 캐시: 같은 세션에서 중복 호출 방지
  private profileCache: any = null;
  private postsCache: ThreadsPost[] | null = null;
  private followersCache: number | null = null;
  private lastFetchTime = 0;
  private readonly CACHE_TTL = 60_000; // 1분 캐시

  private constructor() {}

  public static getInstance(): ThreadsService {
    if (!ThreadsService.instance) {
      ThreadsService.instance = new ThreadsService();
    }
    return ThreadsService.instance;
  }

  /**
   * 캐시가 유효한지 확인
   */
  private isCacheValid(): boolean {
    return Date.now() - this.lastFetchTime < this.CACHE_TTL;
  }

  /**
   * 캐시 초기화 (새로고침 시)
   */
  public clearCache() {
    this.profileCache = null;
    this.postsCache = null;
    this.followersCache = null;
    this.lastFetchTime = 0;
  }

  /**
   * 프로필 + 팔로워 수를 서버 API에서 가져옴
   */
  private async fetchProfile() {
    if (this.profileCache && this.isCacheValid()) {
      return { profile: this.profileCache, followers: this.followersCache };
    }

    try {
      const res = await fetch('/api/threads/profile');
      const data = await res.json();
      
      if (data.success && data.profile) {
        this.profileCache = data.profile;
        this.followersCache = data.followers;
        this.isLiveMode = true;
        this.lastFetchTime = Date.now();
        return { profile: data.profile, followers: data.followers, error: null };
      } else {
        this.isLiveMode = false;
        return { profile: null, followers: null, error: data.message || data.error };
      }
    } catch (e) {
      this.isLiveMode = false;
      return { profile: null, followers: null, error: 'Network error' };
    }
  }

  /**
   * 게시물 목록을 서버 API에서 가져옴
   */
  private async fetchPosts(): Promise<ThreadsPost[]> {
    if (this.postsCache && this.isCacheValid()) {
      return this.postsCache;
    }

    try {
      const res = await fetch('/api/threads/posts');
      const data = await res.json();
      
      if (!data.success || !data.posts || data.posts.length === 0) {
        return [{ 
          id: 'empty', 
          text: data.message || "게시물을 불러올 수 없습니다.", 
          views: 0, likes: 0, reposts: 0, replies: 0, quotes: 0, score: 0 
        }];
      }

      const posts: ThreadsPost[] = data.posts.map((post: any) => {
        // 텍스트 표시 로직 개선
        let displayText = post.text;
        if (!displayText) {
          switch (post.media_type) {
            case 'IMAGE': displayText = '📸 이미지 게시물'; break;
            case 'VIDEO': displayText = '🎬 동영상 게시물'; break;
            case 'CAROUSEL_ALBUM': displayText = '🖼️ 캐러셀 게시물'; break;
            case 'REPOST_FACADE': displayText = '🔄 리포스트'; break;
            default: displayText = '📝 게시물';
          }
        }

        const ins = post.insights;
        const views = ins?.views ?? 0;
        const likes = ins?.likes ?? 0;
        const replies = ins?.replies ?? 0;
        const reposts = ins?.reposts ?? 0;
        const quotes = ins?.quotes ?? 0;

        const rawScore = (likes * 1 + replies * 2 + reposts * 5) / Math.max(1, views / 100);
        const score = Math.min(10, Math.round(rawScore * 10) / 10);

        return {
          id: post.id,
          text: displayText,
          views,
          likes,
          reposts,
          replies,
          quotes,
          score,
          createdAt: post.timestamp,
          permalink: post.permalink,
          hasInsights: !!ins,
          insightsError: post.insightsError,
        } as ThreadsPost;
      });

      this.postsCache = posts;
      this.lastFetchTime = Date.now();
      this.isLiveMode = true;
      return posts;
    } catch (e) {
      console.error('Failed to fetch posts:', e);
      return [{ 
        id: 'empty', 
        text: "네트워크 오류가 발생했습니다.", 
        views: 0, likes: 0, reposts: 0, replies: 0, quotes: 0, score: 0 
      }];
    }
  }

  // ========== Public API ==========

  async getSummaryStats(): Promise<SummaryStat[]> {
    const { profile, followers, error } = await this.fetchProfile();
    const posts = await this.getRecentPosts();
    const validPosts = posts.filter(p => p.id !== 'empty' && p.hasInsights);

    if (!profile) {
      this.isLiveMode = false;
      return [
        { id: 'v', title: '상태', value: '연결 안됨', trend: 0, data: [], icon: 'XCircle' },
        { id: 'f', title: '팔로워', value: '---', trend: 0, data: [], icon: 'UserPlus' },
        { id: 'u', title: '계정', value: error || '토큰을 확인하세요', trend: 0, data: [], icon: 'AtSign' },
        { id: 's', title: 'API 연결', value: '실패', trend: 0, data: [], icon: 'ShieldAlert' },
      ];
    }

    this.isLiveMode = true;

    // 1. 팔로워 수
    const followersValue = followers !== null ? followers.toLocaleString() : '권한 필요';
    
    // 2. 총 인게이지먼트 계산 (댓글, 좋아요, 리포스트, 인용)
    const totalInteractions = validPosts.reduce((sum, p) => sum + p.likes + p.replies + p.reposts + p.quotes, 0);
    
    // 3. 평균 인게이지먼트 점수
    const avgScore = validPosts.length > 0 
      ? Math.round((validPosts.reduce((sum, p) => sum + p.score, 0) / validPosts.length) * 10) / 10 
      : 0;

    // 4. 총 도달(조회수)
    const totalReach = validPosts.reduce((sum, p) => sum + p.views, 0);

    // 트렌드 데이터 (최근 7개 게시물 기준 점수 변화)
    const scoreTrendData = validPosts.slice(0, 7).reverse().map(p => p.score);
    const reachTrendData = validPosts.slice(0, 7).reverse().map(p => p.views);
    const interactTrendData = validPosts.slice(0, 7).reverse().map(p => p.likes + p.replies + p.reposts);

    return [
      { id: 'followers', title: 'Total Followers', value: followersValue, trend: 0, data: [], icon: 'UserPlus' },
      { id: 'interactions', title: 'Total Interactions', value: totalInteractions > 0 ? totalInteractions.toLocaleString() : (validPosts.length > 0 ? '0' : '권한 필요'), trend: 12.4, data: interactTrendData, icon: 'Flame' },
      { id: 'avg_score', title: 'Avg. Eng Score', value: avgScore > 0 ? avgScore.toString() : (validPosts.length > 0 ? '0' : '-'), trend: 5.2, data: scoreTrendData, icon: 'Activity' },
      { id: 'reach', title: 'Total Reach', value: totalReach > 0 ? totalReach.toLocaleString() : (validPosts.length > 0 ? '0' : '-'), trend: 8.1, data: reachTrendData, icon: 'Eye' },
    ];
  }

  async getFollowerCount(): Promise<number | null> {
    const { followers } = await this.fetchProfile();
    return followers;
  }

  async getRecentPosts(): Promise<ThreadsPost[]> {
    return this.fetchPosts();
  }

  async getEngagementData(): Promise<{ score: number, topFans: TopFan[] }> {
    const posts = await this.fetchPosts();
    const validPosts = posts.filter(p => p.id !== 'empty');
    if (validPosts.length === 0) return { score: 0, topFans: [] };

    const avgScore = validPosts.reduce((acc, p) => acc + p.score, 0) / validPosts.length;
    
    return {
      score: Math.round(avgScore * 10) / 10,
      topFans: [
        { rank: 1, name: this.isLiveMode ? "You" : "Demo", handle: "Active", score: 98.4, color: "#10b981", likes: 124, replies: 45, reposts: 12 },
      ]
    };
  }

  async getActivityData(): Promise<{ heatmap: HeatmapData[], bestTimes: BestTimeData[] }> {
    const posts = await this.fetchPosts();
    const validPosts = posts.filter(p => p.id !== 'empty');
    
    if (validPosts.length === 0 || !validPosts.some(p => p.createdAt)) {
      return {
        heatmap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({ day, hours: Array(24).fill(0) })),
        bestTimes: [
          { time: '00-04', score: 35 }, { time: '04-08', score: 12 },
          { time: '08-12', score: 85 }, { time: '12-16', score: 95 },
          { time: '16-20', score: 65 }, { time: '20-24', score: 45 }
        ]
      };
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const heatmap: HeatmapData[] = days.map(day => ({ day, hours: Array(24).fill(0) }));
    const timeBlocks = Array(6).fill(0);

    validPosts.forEach(post => {
      if (post.createdAt) {
        const date = new Date(post.createdAt);
        const hour = date.getHours();
        const day = date.getDay();
        
        const engagementWeight = post.likes + (post.views / 10) + post.replies * 2;
        heatmap[day].hours[hour] += Math.max(1, engagementWeight / 10);
        
        const blockIndex = Math.floor(hour / 4);
        timeBlocks[blockIndex] += engagementWeight;
      }
    });

    const maxScore = Math.max(...timeBlocks, 1);
    const bestTimes = timeBlocks.map((score, i) => {
      const start = (i * 4).toString().padStart(2, '0');
      const end = ((i + 1) * 4).toString().padStart(2, '0');
      return {
        time: `${start}-${end}`,
        score: Math.round((score / maxScore) * 100) || 5
      };
    });

    return { heatmap, bestTimes };
  }
}
