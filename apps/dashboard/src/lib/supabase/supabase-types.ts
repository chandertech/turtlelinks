import type { Database } from "../../types/database.types";

export type URLInfo = Database['public']['Tables']['urls']['Row'];
export type LinkInfo = Database['public']['Tables']['dynamic_links']['Row'];
