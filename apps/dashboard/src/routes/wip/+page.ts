import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
    const { session, supabase } = await parent();

    const { data: profile } = session
        ? await supabase.from('profiles').select(`username, full_name, website`).eq('id', session.user.id).single()
        : { data: null };

    return {profile, session};
};
