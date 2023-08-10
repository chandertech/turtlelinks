<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { faAdd, faLink, faEllipsisV, faPencil, faMinus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { popup } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from './modals/CreateURLPrefixModal.svelte';
	import CreateLinkModal from './modals/CreateLinkModal.svelte';
	import LinkDetailModal from './modals/LinkDetailModal.svelte';
	import type { URLInfo, LinkInfo } from '$lib/Types.svelte';

	export let data;
	let selectedURL: string;
	let urls: URLInfo[] = [];
	let links: LinkInfo[] = [];

	onMount(async () => {
		if (!data.session) goto('/login');

		const { data: urlData, error: urlError } = await data.supabase
			.from('urls')
			.select('*')
			.eq('id', data.session?.user.id);

		if (urlError || !urlData || !urlData.length) return;

		urls = urlData;
		selectURL(urls[0].url);
	});

	const createURLModal: ModalSettings = {
		type: 'component',
		component: { ref: CreateURLPrefixModal },
		response: async (res) => {
			if (!res) return;

			// TODO: Do we need to check session here again?
			const { subdomain, domain } = res;
			const newURL: URLInfo = {
				url: subdomain + domain,
				id: data.session?.user.id ?? '0',
				subdomain: subdomain,
				domain: domain
			};
			const { error: urlError } = await data.supabase.from('urls').insert(newURL); // TODO: Maybe display an error modal?
			if (urlError) return;

			modalStore.close();
			urls = [...urls, newURL];
			selectURL(newURL.url);
		}
	};

	const createLinkModal: ModalSettings = {
		type: 'component',
		component: {
			ref: CreateLinkModal
		},
		response: async (res) => {
			if (!res) return;

			const { suffix, deepLink, friendlyName } = res;
			const newLink: LinkInfo = {
				url: selectedURL,
				suffix: suffix,
				deep_link: deepLink,
				friendly_name: friendlyName
			};
			const { error: linkError } = await data.supabase.from('dynamic_links').insert(newLink);
			if (linkError) return; // TODO: Maybe display an error modal?

			modalStore.close();
			links = [...links, newLink];
		}
	};

	async function selectURL(url: string) {
		const { data: linkData, error: linkError } = await data.supabase
			.from('dynamic_links')
			.select('*')
			.eq('url', url);

		if (linkError || !linkData) return;

		selectedURL = url;
		links = linkData;
	}

	async function deleteLink(link: string) {
		const { data: linkError } = await data.supabase
			.from('dynamic_links')
			.delete()
			.match({ url: link });

		if (linkError) return;

		links = links.filter((l) => l.url != link);
	}
</script>

<div class="sm:container sm:mx-auto justify-center p-8">
	<div class="flex justify-between">
		<div class="flex text-4xl">Dashboard</div>
		<button
			type="button"
			class="btn variant-filled-surface"
			on:click={() => {
				modalStore.trigger(createURLModal);
			}}
		>
			<Fa icon={faLink} />
			<span>New URL Prefix</span>
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
						{#each urls.filter((d) => d.url != selectedURL) as urlData}
							<button
								type="button"
								class="btn bg-initial"
								on:click={() => {
									selectURL(urlData.url);
								}}><Fa icon={faLink} /><span>{urlData.url}</span></button
							>
						{/each}
						<button
							type="button"
							class="btn bg-initial"
							on:click={() => {
								modalStore.trigger(createURLModal);
							}}><Fa icon={faLink} /><span>New URL Prefix</span></button
						>
					</div>
					<div class="arrow" />
				</div>

				<button
					type="button"
					class="btn btn-sm variant-filled-surface"
					on:click={() => {
						modalStore.trigger(createLinkModal);
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
						{#each links as link, i}
							<tr on:click={() => {}}>
								<td>{link.friendly_name}</td>
								<td>{link.url}/{link.suffix}</td>
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
									<button
										type="button"
										class="btn bg-initial"
										on:click={() => {
											modalStore.trigger({ ...createLinkModal, meta: link });
										}}><Fa icon={faPencil} /><span>Edit</span></button
									>
									<button
										type="button"
										class="btn bg-initial"
										on:click={() => {
											modalStore.trigger({
												type: 'component',
												component: {
													ref: LinkDetailModal
												},
												meta: link
											});
										}}><Fa icon={faLink} /><span>Link Details</span></button
									>
									<button
										type="button"
										class="btn bg-initial"
										on:click={() => {
											deleteLink(link.url);
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
