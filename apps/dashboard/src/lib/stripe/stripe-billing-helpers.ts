import type Stripe from 'stripe';
import { supabaseAdminClient } from '$lib/supabase/supabase-admin-client';

enum BILLING_PROVIDERS {
	stripe = 'stripe'
}

/**
 * This is the customer object inside of stripe. It should map 1:1 with accounts in most cases
 * It does NOT map back to users
 * @param customer
 * @param accountId
 */
export const upsertCustomerRecord = async (customer: Stripe.Customer, accountId?: string) => {
	const customerData = {
		account_id: accountId || customer.metadata.account_id,
		customer_id: customer.id,
		email: customer.email,
		provider: BILLING_PROVIDERS.stripe
	};

	const { error } = await supabaseAdminClient.from('billing_customers').upsert([customerData]);
	if (error) throw error;
};
