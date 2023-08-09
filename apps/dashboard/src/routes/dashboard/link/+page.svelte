<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import CreateLinkModal from './CreateLinkModal.svelte';
	import LinkDetailsModal from './LinkDetailsModal.svelte';
	import { faEllipsisV, faAdd, faPencil, faLink, faMinus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let data;
	const { currentPrefix, linkData } = data;
	const tableData = linkData ?? [];

	const newLinkModal: ModalSettings = {
		type: 'component',
		component: {
			ref: CreateLinkModal
		}
	};

	const linkDetailsModal: ModalSettings = {
		type: 'component',
		component: {
			ref: LinkDetailsModal
		}
	};

	console.log(tableData);
</script>

<svelte:head>
	<title>Link</title>
</svelte:head>

<div class="mx-auto max-w-screen-xl lg:p-12 px-4">
	<div class="flex justify-between py-4">
		<button class="btn variant-filled w-48 justify-between">
			<span class="capitalize">{currentPrefix}</span>
			<span>↓</span>
		</button>
		<button
			type="button"
			class="btn btn-sm variant-filled"
			on:click={() => {
				modalStore.trigger(newLinkModal);
			}}
		>
			<Fa icon={faAdd} />
			<span>New Link</span>
		</button>
	</div>
	<div class="table-container">
		<table class="table">
			<thead>
				<tr>
					<th>Link name</th>
					<th>URL</th>
					<th>Created</th>
					<th>Clicks</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each tableData as row, i}
					<tr on:click={() => {}}>
						<td>{row.friendly_name}</td>
						<td>{row.prefix_url}/{row.suffix_url}</td>
						<td>...</td>
						<td>...</td>
						<button
							type="button"
							use:popup={{ event: 'click', target: `editLinkPopup-${i}` }}
							class="btn-icon btn-icon-sm variant-filled-surface mt-2"
						>
							<Fa icon={faEllipsisV} />
						</button>
					</tr>

					<!-- Popup -->
					<div class="card shadow-xl" data-popup="editLinkPopup-{i}">
						<div class="flex flex-col items-start">
							<button type="button" class="btn bg-initial"
								><Fa icon={faPencil} /><span>Edit</span></button
							>
							<button
								type="button"
								class="btn bg-initial"
								on:click={() => {
									modalStore.trigger(linkDetailsModal);
								}}><Fa icon={faLink} /><span>Link Details</span></button
							>
							<button type="button" class="btn bg-initial"
								><Fa icon={faMinus} /><span>Archive Link</span></button
							>
						</div>
					</div>
				{/each}
			</tbody>
		</table>
	</div>
</div>
