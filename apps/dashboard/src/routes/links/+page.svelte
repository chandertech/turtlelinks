<script lang="ts">
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import CreateLinkModal from './CreateLinkModal.svelte';

	import { faAdd } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let data;

	const modal: ModalSettings = {
		type: 'component',
		component: {
			ref: CreateLinkModal
		},
		response: (r: any) => {}
	};
</script>

<svelte:head>
	<title>Links</title>
</svelte:head>

<div class="mx-auto container p-4">
	<h1 class="mb-4 text-2xl">Links</h1>
	<!-- TODO: Figure out how to validte and call server from modal. -->
	<!-- <button
		class="btn variant-ringed-secondary ml-1"
		on:click={() => {
			modalStore.trigger(modal);
		}}><Fa icon={faAdd} /><span>Create New Link</span></button
	> -->
	<!-- Remove and replace with modal above. -->
	<form method="POST" action="?/create">
		<label>
			Link Name
			<input name="link-name" class="input" type="text" placeholder="My awesome link" required />
		</label>
		<label>
			Subdomain
			<div class="input-group input-group-divider grid-cols-2">
				<input type="search" name="subdomain" placeholder="subdomain" required />
				<div class="input-group-shim">[todo.com]</div>
			</div>
		</label>
		<button class="btn variant-ringed-secondary">Create Link</button>
	</form>
</div>
