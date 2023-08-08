<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from './CreateURLPrefixModal.svelte';
	import LinkTable from './LinkTable.svelte';

	export let data;

	const urlCreationModal: ModalSettings = {
		type: 'component',
		component: { ref: CreateURLPrefixModal },
		response: (url: string) => {}
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
			URL Prefix Creation Flow
		</button>
	</div>

	<LinkTable />
</div>
