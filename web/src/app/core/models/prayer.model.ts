

export interface Prayer {
  id: number;
  title: string;
  is_private: boolean;

  // Add optional properties used by templates
  is_closed?: boolean;
  prayed_count?: number;

  // If your API returns other fields, add them here as optional as well
  // created_at?: string;
  // updated_at?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}
