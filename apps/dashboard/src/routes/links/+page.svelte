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
		}
	};
</script>

<svelte:head>
	<title>Links</title>
</svelte:head>

<div class="mx-auto container p-4">
	<h1 class="mb-4 text-2xl">Links</h1>
	<button
		class="btn variant-ringed-secondary ml-1"
		on:click={() => {
			modalStore.trigger(modal);
		}}><Fa icon={faAdd} /><span>Create New Link</span></button
	>
</div>
