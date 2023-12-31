import type { Database } from '$lib/types/database.types';

export type URLInfo = Database['public']['Tables']['urls']['Row'];
export type LinkInfo = Database['public']['Tables']['dynamic_links']['Row'];
export type OrgInfo = Database['public']['Tables']['organizations']['Row'];
