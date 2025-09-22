

export interface Comment {
  id: number;
  prayer_id: number;
  display_name: string;
  content: string;
  likes_count: number;
  created_at?: string;
}
