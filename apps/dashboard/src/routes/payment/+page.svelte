<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;

	async function subscribe(priceId: string) {
		const res = await fetch('/api/stripe/subscribe', {
			method: 'POST',
			body: JSON.stringify({ priceId: priceId })
		});
		const { url } = await res.json();
		goto(url);
	}

	async function manage(subscriptionId: string) {
		const res = await fetch('api/stripe/manage', {
			method: 'POST',
			body: JSON.stringify({ subscriptionId: subscriptionId })
		});
		const { url } = await res.json();
		goto(url);
	}
</script>

<div class="flex flex-col gap-4 items-center py-24">
	{#if !data.activeSubscription}
		{#each data.subscriptionPlans as subscription}
			<button
				type="button"
				class="btn variant-ghost-primary"
				on:click={() => {
					subscribe(subscription.id);
				}}
			>
				<span>{subscription.billing_products?.name}</span>
			</button>
		{/each}
	{:else}
		<button
			type="button"
			class="btn variant-ghost-primary"
			on:click={() => {
				if (data.activeSubscription) manage(data.activeSubscription.id);
			}}
		>
			<span>Modify active subscription - {data.activeSubscription.id}</span>
		</button>
	{/if}
</div>
