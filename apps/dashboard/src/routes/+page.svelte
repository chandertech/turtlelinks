<script lang="ts">
	import { beforeUpdate, onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { faAdd, faLink, faEllipsisV, faPencil, faMinus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { popup } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from './CreateURLPrefixModal.svelte';

	interface URLInfo {
		url: string;
		id: string;
		subdomain: string;
		domain: string;
	}

	export let data;
	let selectedURL: string;
	let tableData: URLInfo[] = [];

	// TODO: Figure out if there is a better place to fetch data, maybe beforeMount?
	beforeUpdate(async () => {
		if (!data.session) goto('/login');

		const { data: urlData, error: urlError } = await data.supabase
			.from('urls')
			.select('*')
			.eq('id', data.session?.user.id);

		if (urlError) return;

		if (urlData && urlData.length) {
			tableData = urlData;
			selectedURL = tableData[0].url;
		}
	});

	const urlCreationModal: ModalSettings = {
		type: 'component',
		component: { ref: CreateURLPrefixModal },
		response: async ({ subdomain, domain }) => {
			modalStore.close();
		}
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

	<!-- Table -->
	{#if selectedURL}
		<div class="py-12">
			<div class="flex justify-between py-4">
				<button
					class="btn variant-filled-surface w-48 justify-between"
					use:popup={{ event: 'click', target: `popupClick` }}
				>
					<span>{selectedURL}</span>
					<span>↓</span>
				</button>
				<!-- Popup -->
				<div class="card shadow-xl" data-popup="popupClick">
					<div class="flex flex-col items-start">
						<button type="button" class="btn bg-initial"
							><Fa icon={faLink} /><span>suffix2</span></button
						>
						<button type="button" class="btn bg-initial"
							><Fa icon={faLink} /><span>suffix3</span></button
						>
						<button type="button" class="btn bg-initial"
							><Fa icon={faAdd} /><span>Add URL suffix</span></button
						>
					</div>
					<div class="arrow" />
				</div>

				<button
					type="button"
					class="btn btn-sm variant-filled-surface"
					on:click={() => {
						// modalStore.trigger(newLinkModal);
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
								<!-- <td>{row.friendly_name}</td>
							<td>{row.prefix_url}/{row.suffix_url}</td> -->
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
											// modalStore.trigger(linkDetailsModal);
										}}><Fa icon={faLink} /><span>Link Details</span></button
									>
									<button
										type="button"
										class="btn bg-initial"
										on:click={() => {
											// deleteLink(row.suffix_url);
										}}><Fa icon={faMinus} /><span>Delete Link</span></button
									>
								</div>
							</div>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
