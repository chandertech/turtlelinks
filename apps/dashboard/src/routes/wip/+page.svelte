<script lang="ts">
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from './CreateURLPrefixModal.svelte';
	import CreateLinkModal from './CreateLinkModal.svelte';
	import LinkDetailsModal from './LinkDetailsModal.svelte';

	import { faEllipsisV, faAdd, faPencil, faLink, faMinus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	const urlCreationModal: ModalSettings = {
		type: 'component',
		component: {
			ref: CreateURLPrefixModal
		}
	};

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

	const tableData = [
		{ name: 'Link Name', URL: 'https://link', created: '...', clicks: 0 },
		{ name: 'Link Name', URL: 'https://link', created: '...', clicks: 0 },
		{ name: 'Link Name', URL: 'https://link', created: '...', clicks: 0 },
		{ name: 'Link Name', URL: 'https://link', created: '...', clicks: 0 },
		{ name: 'Link Name', URL: 'https://link', created: '...', clicks: 0 }
	];
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

	<div class="w-1/2">
		<div class="flex justify-end py-4">
			<button
				type="button"
				class="btn variant-filled"
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
							<td>{row.name}</td>
							<td>{row.URL}</td>
							<td>{row.created}</td>
							<td>{row.clicks}</td>
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
</div>
