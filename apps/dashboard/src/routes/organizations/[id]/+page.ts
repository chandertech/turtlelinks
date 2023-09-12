import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase, session } = await parent();
	if (!session) {
		throw redirect(303, '/');
	}

	const { data: organization } = await supabase
		.from('organizations')
		.select('id, name')
		.eq('id', params.id)
		.single();

	// If the organization doesn't exist or the user isn't a member of it, redirect to the home page
	if (!organization) {
		throw redirect(303, '/');
	}

	const { data } = await supabase
		.from('profiles')
		.select(
			`
          id,
          full_name,
		  email,
          users_organizations!inner (
            profile_id,
            organization_id
          ),
          organizations!inner (
            id,
            name
          )
        `
		)
		.eq('users_organizations.organization_id', params.id)
		.eq('organizations.id', params.id);

	const members = data?.map((member) => ({
		id: member.id,
		name: member.full_name,
		email: member.email
	}));

	const { data: subscriptionPlans } = await supabase.from('billing_prices').select(
		`
			id,
			billing_products!inner (
				id,
				name
			)
		`
	);

	const { data: activeSubscription } = await supabase
		.from('billing_subscriptions')
		.select('*')
		.match({ organization_id: params.id, status: 'active' })
		.single();

	return {
		organization: organization,
		members: members ?? [],
		subscriptionPlans: subscriptionPlans ?? [],
		activeSubscription: activeSubscription
	};
};
