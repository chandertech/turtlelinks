import { json, error } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();
    const { prefix, suffix } = await request.json();

    const { error } = await supabase.from('dynamic_links').upsert({
        prefix_url: prefix,
        suffix_url: suffix,
        friendly_name: 'TODO'
    });
    
    // TODO: Return empty if no error, force a refresh on the client?
    return json(500);
}

export const DELETE = async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();
    const { suffix } = await request.json();
    const { error: err } = await supabase.from('dynamic_links').delete().match({'suffix_url': suffix});
    
    // TODO: Return empty if no error, force a refresh on the client?
    return json(500);
}
