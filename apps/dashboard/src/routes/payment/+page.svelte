<script lang="ts">
	import { goto } from '$app/navigation';
	async function subscribe() {
		const res = await fetch('/api/stripe-checkout', {
			method: 'POST'
		});
		const { url } = await res.json();
		goto(url);
	}
</script>

<div class="flex flex-col gap-4 items-center py-24">
	<button
		type="button"
		class="btn variant-ghost-primary"
		on:click={() => {
			subscribe();
		}}
	>
		<span>Stripe Test</span>
	</button>
</div>
