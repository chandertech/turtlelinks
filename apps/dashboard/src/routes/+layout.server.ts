import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals: { getSession, supabase } }) => {
	const isDevelopment = process.env.NODE_ENV === 'development';
	const link = isDevelopment ? url.searchParams.get('link') : url.hostname + url.pathname;

	if (link) {
		const { data: linkData, error: linkError } = await supabase
			.from('dynamic_links')
			.select('deep_link')
			.eq('link', link)
			.single();

		if (!linkError && linkData) throw redirect(303, linkData.deep_link);
	}

	return {
		session: await getSession()
	};
};
