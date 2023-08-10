<script lang="ts">
	import { beforeUpdate } from 'svelte';
	import { goto } from '$app/navigation';

	import { faAdd } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from './CreateURLPrefixModal.svelte';

	export let data;

	beforeUpdate(async () => {
		if (!data.session) goto('/login');
	});

	const urlCreationModal: ModalSettings = {
		type: 'component',
		component: { ref: CreateURLPrefixModal },
		response: async (url: string) => {}
	};
</script>

<div class="sm:container sm:mx-auto justify-center p-8">
	<div class="flex justify-between">
		<div class="flex text-4xl">Dashboard</div>
		<button
			type="button"
			class="btn variant-filled-surface"
			on:click={() => {
				modalStore.trigger(urlCreationModal);
			}}
		>
			<Fa icon={faAdd} />
			<span>Create URL Prefix</span>
		</button>
	</div>
</div>
