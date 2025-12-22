import { UserProfile } from './auth';
import { Purchase } from './purchase';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>;
      };
      purchases: {
        Row: Purchase;
        Insert: Omit<Purchase, 'id' | 'created_at'>;
        Update: Partial<Omit<Purchase, 'id' | 'user_id' | 'created_at'>>;
      };
      admin_setup: {
        Row: {
          id: string;
          is_completed: boolean;
          completed_by: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          is_completed?: boolean;
        };
        Update: {
          is_completed?: boolean;
          completed_by?: string;
          completed_at?: string;
        };
      };
      usage_tracking: {
        Row: {
          id: string;
          user_id: string;
          video_count: number;
          last_reset_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          video_count?: number;
        };
        Update: {
          video_count?: number;
          last_reset_at?: string;
        };
      };
    };
  };
}
