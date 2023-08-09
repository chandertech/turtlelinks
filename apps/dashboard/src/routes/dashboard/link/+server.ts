import { json, error } from '@sveltejs/kit';

export const DELETE = async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();
    const { suffix } = await request.json();
    const { error: err } = await supabase.from('dynamic_links').delete().match({'suffix_url': suffix});
    
    // TODO: Return empty if no error, force a refresh on the client?
    return json(500);
}
