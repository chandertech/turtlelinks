import { json, error } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();
    const { url } = await request.json();

    const res = await supabase.from('prefix_urls').select('*').eq('prefix_url', url);
    if (res.error)
        throw error(500, 'Unexpected server error.');

    const { error: err } = await supabase.from('prefix_urls').insert({
        created_by: session?.user.id,
        prefix_url: url
    });

    if (err)
        throw error(409, 'Prefix URL already exists.');

    return json(url);
}
