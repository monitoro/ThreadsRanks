export interface ThreadsPost {
  id: string | number;
  text: string;
  views: number;
  likes: number;
  reposts: number;
  replies: number;
  quotes: number;
  score: number;
  createdAt?: string;
  permalink?: string;
}

export interface SummaryStat {
  id: string;
  title: string;
  value: string;
  trend: number;
  data: number[];
  icon: any;
}

export interface TopFan {
  rank: number;
  name: string;
  handle: string;
  score: number;
  color: string;
  likes: number;
  replies: number;
  reposts: number;
}

export interface HeatmapData {
  day: string;
  hours: number[];
}

export interface BestTimeData {
  time: string;
  score: number;
}
