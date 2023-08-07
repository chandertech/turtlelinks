import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/login');
	}
};

export const actions = {
	create: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();

		const linkname = formData.get('link-name') as string | null;
		const subdomain = formData.get('subdomain') as string | null;

		const session = await getSession();

		if (!session) {
			// log and display error message
			return;
		}

		const { error } = await supabase.from('links').upsert({
			id: session?.user.id,
			link_name: linkname,
			subdomain: subdomain
		});

		if (error) {
			console.error(error);
			return fail(500, {
				linkname,
				subdomain
			});
		}

		return {
			linkname,
			subdomain
		};
	},
};