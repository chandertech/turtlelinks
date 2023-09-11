import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase } = await parent();

	const { data: subscriptionPlans } = await supabase.from('billing_prices').select(
		`
			id,
			billing_products!inner (
				id,
				name
			)
		`
	);

	// TODO: Subscriptions should be related to orgs, there should only be one as well, we need to filter here.
	const { data: activeSubscription } = await supabase
		.from('billing_subscriptions')
		.select('*')
		.eq('status', true)
		.single();

	return { activeSubscription: activeSubscription, subscriptionPlans: subscriptionPlans ?? [] };
};
