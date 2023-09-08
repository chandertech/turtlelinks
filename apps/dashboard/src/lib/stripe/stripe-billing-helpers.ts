import type Stripe from 'stripe';
import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';
import { stripeAdminClient } from './stripe-admin-client';

enum BILLING_PROVIDERS {
	stripe = 'stripe'
}

/**
 * Convenience function that checks if a stripe customer with a given email address already exists
 * in our database. If it doesn't, it creates a new one
 * @param profileId
 */
export const createOrRetrieveCustomer = async ({
	profileId,
	email
}: {
	profileId: string;
	email: string;
}) => {
	const { data, error } = await supabaseAdminClient
		.from('billing_customers')
		.select('customer_id')
		.eq('profile_id', profileId)
		.single();
	if (error) {
		// No customer record found, let's create one.
		const customerData: { metadata: { profile_id: string }; email?: string } = {
			metadata: {
				profile_id: profileId
			}
		};

		if (email) {
			customerData.email = email;
		}
		const customer = await stripeAdminClient.customers.create(customerData);
		// now we upsert the customer record. Upsert b/c the stripe webhook also hits this and so there could be
		// a race condition
		await upsertCustomerRecord(customer, profileId);
		console.log(`New customer created and inserted for ${profileId}.`);
		return customer.id;
	}
	if (data) return data.customer_id;
};

/**
 * This is the customer object inside of stripe. It should map 1:1 with accounts in most cases
 * It does NOT map back to users
 * @param customer
 * @param profileId
 */
export const upsertCustomerRecord = async (customer: Stripe.Customer, profileId?: string) => {
	const customerData = {
		profile_id: profileId || customer.metadata.account_id,
		customer_id: customer.id,
		email: customer.email,
		provider: BILLING_PROVIDERS.stripe
	};

	const { error } = await supabaseAdminClient.from('billing_customers').upsert([customerData]);
	if (error) throw error;
};
