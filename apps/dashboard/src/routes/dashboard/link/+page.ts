import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
    const { session, supabase } = await parent();

    if (!session)
        throw error(500, 'Failed to fetch session.');

    const { data: urlData, error: err } = await supabase.from('prefix_urls').select('prefix_url').eq('created_by', session.user.id);
    if (err)
        throw error(500, 'Failed to fetch data.');

    // TODO: Better way to figure out which URL page the user is on.
    const currentPrefix = urlData[0].prefix_url;
    const { data: linkData } = await supabase.from('dynamic_links').select('*').eq('prefix_url', currentPrefix);

    return {currentPrefix, linkData};
};
