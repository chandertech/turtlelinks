import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

// Only use this on the server and ensure protection against abuse as this client has admin access
export const supabaseAdminClient = createClient<Database>(
	PUBLIC_SUPABASE_URL,
	SUPABASE_SERVICE_KEY
);
