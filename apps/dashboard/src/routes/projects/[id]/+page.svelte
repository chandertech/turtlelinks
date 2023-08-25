<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import {
		faAdd,
		faLink,
		faLinkSlash,
		faEllipsisV,
		faPencil,
		faMinus,
		faTrash,
		faArrowDown
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import Loading from '$lib/Loading.svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from '../../CreateURLPrefixModal.svelte';
	import DeleteUrlPrefixModal from './DeleteURLPrefixModal.svelte';
	import CreateLinkModal from './CreateLinkModal.svelte';
	import LinkDetailModal from './LinkDetailModal.svelte';

	import type { URLInfo, LinkInfo } from '$lib/supabase/supabase-types';
	import { DisplayErrorToast, DisplaySuccessToast } from '$lib/Toast';

	const scheme = 'https://';

	export let data;
	let loading = false;
	let selectedURL: string;
	let urls: URLInfo[] = [];
	let links: LinkInfo[] = [];

	onMount(async () => {
		loading = true;

		const { data: urlData, error: urlError } = await data.supabase
			.from('urls')
			.select('*')
			.eq('organization_id', data.org.id);

		loading = false;

		if (urlError) {
			DisplayErrorToast();
			return;
		}

		if (!urlData || !urlData.length) return;

		urls = urlData;

		const urlParams = new URLSearchParams(window.location.search);
		const paramUrl = urls.find((url) => url.url == urlParams.get('url'))?.url;
		selectURL(paramUrl ? paramUrl : urls[0].url);
	});

	const createURLModal: ModalSettings = {
		type: 'component',
		component: { ref: CreateURLPrefixModal },
		response: async (res) => {
			if (!res) return;

			const { subdomain, domain, orgId } = res;
			const domainRes = await fetch('/api/add-domain', {
				method: 'POST',
				body: JSON.stringify({ subdomain: subdomain, domain: domain, orgId: orgId })
			});

			if (!domainRes.ok) {
				DisplayErrorToast();
				return;
			}

			const newURL: URLInfo = {
				url: subdomain + domain,
				organization_id: orgId,
				subdomain: subdomain,
				domain: domain
			};

			modalStore.close();
			DisplaySuccessToast(`"${newURL.url}" has been successfully created.`);

			urls = [...urls, newURL];
			selectURL(newURL.url);
		}
	};

	const deleteURLModal: ModalSettings = {
		type: 'component',
		component: { ref: DeleteUrlPrefixModal },
		response: async (res) => {
			if (!res) return;

			const domainRes = await fetch('/api/delete-domain', {
				method: 'DELETE',
				body: JSON.stringify({ url: selectedURL })
			});

			if (!domainRes.ok) {
				DisplayErrorToast();
				return;
			}

			const { error: urlError } = await data.supabase.from('urls').delete().eq('url', selectedURL);
			if (urlError) {
				DisplayErrorToast();
				return;
			}

			modalStore.close();
			urls = urls.filter((url) => url.url != selectedURL);
			if (urls.length == 0) {
				goto('/');
				return;
			}

			selectURL(urls.length > 0 ? urls[0].url : '');
		}
	};

	const createLinkModal: ModalSettings = {
		type: 'component',
		component: {
			ref: CreateLinkModal
		},
		response: async (res) => {
			if (!res) return;
			const { suffix, deepLink, friendlyName, isEditing } = res;
			const link = selectedURL + '/' + suffix;

			const newLink: LinkInfo = {
				link: link,
				url: selectedURL,
				suffix: suffix,
				deep_link: deepLink,
				friendly_name: friendlyName
			};

			res.isRequesting(true);
			const { error: linkError } = isEditing
				? await data.supabase.from('dynamic_links').update(newLink).eq('link', link)
				: await data.supabase.from('dynamic_links').insert(newLink);
			res.isRequesting(false);

			if (linkError) {
				DisplayErrorToast();
				return;
			}

			modalStore.close();

			// If we are editing an existing link, we just need to update the entry.
			// Otherwise, add to the link array.
			if (isEditing) {
				var existingLinkIndex = links.findIndex((l) => l.link == link);
				links[existingLinkIndex] = newLink;
			} else {
				links = [...links, newLink];
			}
		}
	};

	async function selectURL(url: string) {
		const { data: linkData, error: linkError } = await data.supabase
			.from('dynamic_links')
			.select('*')
			.eq('url', url);

		if (linkError) {
			DisplayErrorToast();
			return;
		}

		if (!linkData) return;

		selectedURL = url;
		links = linkData;
	}

	async function deleteLink(link: string) {
		const { data: linkError } = await data.supabase.from('dynamic_links').delete().eq('link', link);

		if (linkError) {
			DisplayErrorToast();
			return;
		}

		links = links.filter((l) => l.link != link);
	}
</script>

<div class="sm:container sm:mx-auto justify-center p-8">
	<div class="flex justify-between">
		<h1 class="h2">{selectedURL ?? ''}</h1>
	</div>

	<!-- Table -->
	<div class="py-12">
		{#if loading}
			<Loading />
		{:else if selectedURL}
			<div class="flex justify-between py-4">
				<button
					class="btn variant-filled-surface w-64 justify-between"
					use:popup={{ event: 'click', target: `popupClick` }}
				>
					<span class="overflow-hidden">{scheme + selectedURL}</span>
					<Fa icon={faArrowDown} />
				</button>
				<!-- Popup -->
				<div class="card shadow-xl" data-popup="popupClick">
					<div class="flex flex-col">
						{#each urls.filter((d) => d.url != selectedURL) as urlData}
							<button
								type="button"
								class="btn variant-soft-surface"
								on:click={() => {
									selectURL(urlData.url);
								}}><Fa icon={faLink} /><span>{urlData.url}</span></button
							>
						{/each}
						<button
							type="button"
							class="btn variant-soft-surface"
							on:click={() => {
								modalStore.trigger({
									...createURLModal,
									meta: { organizations: [data.org] }
								});
							}}><Fa icon={faLink} /><span>New URL Prefix</span></button
						>
					</div>
					<div class="arrow" />
				</div>

				<div>
					<button
						type="button"
						class="btn variant-ghost-primary mr-1"
						on:click={() => {
							modalStore.trigger(createLinkModal);
						}}
					>
						<Fa icon={faAdd} />
						<span>New Link</span>
					</button>
					<button
						type="button"
						class="btn variant-ghost-error"
						on:click={() => {
							modalStore.trigger({
								...deleteURLModal,
								meta: { url: selectedURL, count: links.length }
							});
						}}
					>
						<Fa icon={faTrash} />
						<span>Delete URL Prefix</span>
					</button>
				</div>
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
								<td>{scheme + link.link}</td>
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
								<div class="flex flex-col">
									<button
										type="button"
										class="btn variant-soft-surface"
										on:click={() => {
											modalStore.trigger({
												...createLinkModal,
												meta: { link: link }
											});
										}}><Fa icon={faPencil} /><span>Edit</span></button
									>
									<button
										type="button"
										class="btn variant-soft-surface"
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
										class="btn variant-soft-surface"
										on:click={() => {
											deleteLink(link.link);
										}}><Fa icon={faMinus} /><span>Delete Link</span></button
									>
								</div>
							</div>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex flex-col items-center py-24 text-xl text-gray-400">
				<Fa icon={faLinkSlash} class="text-4xl mb-2" />
				You do not have any links yet. Create one to get started.
			</div>
		{/if}
	</div>
</div>
