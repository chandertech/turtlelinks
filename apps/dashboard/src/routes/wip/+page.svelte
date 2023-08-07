<script lang="ts">
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from './CreateURLPrefixModal.svelte';

	const modal: ModalSettings = {
		type: 'component',
		component: {
			ref: CreateURLPrefixModal
		}
	};
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class="flex items-center justify-center">
	<div class="py-10">
		<button
			type="button"
			class="btn variant-filled-surface"
			on:click={() => {
				modalStore.trigger(modal);
			}}
		>
			URL Prefix Creation Flow
		</button>
	</div>
</div>
