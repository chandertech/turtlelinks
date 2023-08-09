import type { PageLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
    const { session, supabase } = await parent();

    if (!session)
        throw error(500, 'Failed to fetch session.');

    const { data: data, error: err } = await supabase.from('prefix_urls').select('prefix_url').eq('created_by', session.user.id);
    if (err)
        throw error(500, 'Failed to fetch data.');

    if (data.length > 0)
        throw redirect(303, '/dashboard/link');
};
