<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from './CreateURLPrefixModal.svelte';

	const urlCreationModal: ModalSettings = {
		type: 'component',
		component: { ref: CreateURLPrefixModal },
		response: async (url: string) => {
			const res = await fetch('/dashboard/', {
				method: 'POST',
				body: JSON.stringify({ url: url }),
				headers: { 'content-type': 'application/json' }
			});
		}
	};
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class="flex flex-col items-center justify-center">
	<div class="py-10">
		<button
			type="button"
			class="btn variant-filled-surface"
			on:click={() => {
				modalStore.trigger(urlCreationModal);
			}}
		>
			Create URL Prefix
		</button>
	</div>
</div>
