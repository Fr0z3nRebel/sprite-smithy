export interface UsageTracking {
  id: string;
  user_id: string;
  video_count: number;
  last_reset_at: string;
  created_at: string;
  updated_at: string;
}

export interface UsageStatus {
  video_count: number;
  limit: number;
  has_reached_limit: boolean;
  next_reset_date: Date;
  days_until_reset: number;
}
