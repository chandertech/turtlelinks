import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const isDevelopment = process.env.NODE_ENV === 'development';
	const link = isDevelopment ? url.searchParams.get('link') : url.toString();

	if (link) {
		const { data: linkData, error: linkError } = await supabaseAdminClient
			.from('dynamic_links')
			.select('deep_link')
			.eq('link', link)
			.single();

		if (!linkError && linkData) throw redirect(303, linkData.deep_link);
	}

	throw error(404, 'It looks like that link no longer exists...');
};
