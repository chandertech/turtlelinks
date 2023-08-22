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
	import CreateURLPrefixModal from './modals/CreateURLPrefixModal.svelte';
	import DeleteUrlPrefixModal from './modals/DeleteURLPrefixModal.svelte';
	import CreateLinkModal from './modals/CreateLinkModal.svelte';
	import LinkDetailModal from './modals/LinkDetailModal.svelte';

	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import type { URLInfo, LinkInfo } from '$lib/supabase/supabase-types';

	const scheme = 'https://';

	export let data;
	let organizationId = parseInt(data.orgId);
	let loading = false;
	let selectedURL: string;
	let urls: URLInfo[] = [];
	let links: LinkInfo[] = [];

	const toastError: ToastSettings = {
		message: 'An unexpected error has occurred.',
		background: 'variant-filled-error',
		timeout: 5000
	};

	onMount(async () => {
		loading = true;

		const { data: urlData, error: urlError } = await data.supabase
			.from('urls')
			.select('*')
			.eq('organization_id', organizationId);

		loading = false;

		if (urlError) {
			toastStore.trigger(toastError);
			return;
		}

		if (!urlData || !urlData.length) return;

		urls = urlData;
		selectURL(urls[0].url);
	});

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
				toastStore.trigger(toastError);
				return;
			}

			const { error: urlError } = await data.supabase.from('urls').delete().eq('url', selectedURL);
			if (urlError) {
				toastStore.trigger(toastError);
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
			const { error: linkError } = isEditing
				? await data.supabase.from('dynamic_links').update(newLink).eq('link', link)
				: await data.supabase.from('dynamic_links').insert(newLink);

			if (linkError) {
				var msg =
					linkError.code == '23505'
						? `Link with the suffix "${suffix}" already exists!`
						: toastError.message;
				toastStore.trigger({ ...toastError, message: msg });
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
			.select('*');

		if (linkError) {
			toastStore.trigger(toastError);
			return;
		}

		if (!linkData) return;

		selectedURL = url;
		links = linkData;
	}

	async function deleteLink(link: string) {
		const { data: linkError } = await data.supabase.from('dynamic_links').delete().eq('link', link);

		if (linkError) {
			toastStore.trigger(toastError);
			return;
		}

		links = links.filter((l) => l.link != link);
	}
</script>

<div class="sm:container sm:mx-auto justify-center p-8">
	<div class="flex justify-between">
		<h1 class="h1 flex">{selectedURL ?? ''}</h1>
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
					</div>
					<div class="arrow" />
				</div>

				<div>
					<button
						type="button"
						class="btn variant-filled-surface mr-1"
						on:click={() => {
							modalStore.trigger(createLinkModal);
						}}
					>
						<Fa icon={faAdd} />
						<span>New Link</span>
					</button>
					<button
						type="button"
						class="btn-icon variant-filled-surface mt-2"
						use:popup={{ event: 'click', target: `deleteURLPopup` }}
					>
						<Fa icon={faEllipsisV} />
					</button>

					<!-- Popup -->
					<div class="card shadow-xl" data-popup="deleteURLPopup">
						<div class="flex flex-col">
							<button
								type="button"
								class="btn variant-soft-surface"
								on:click={() => {
									modalStore.trigger({
										...deleteURLModal,
										meta: { url: selectedURL, count: links.length }
									});
								}}><Fa icon={faTrash} /><span>Delete URL Prefix</span></button
							>
						</div>
					</div>
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
												meta: { link: link, isEditing: true }
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
			<div class="flex flex-col items-center py-24 text-xl text-slate-400">
				<Fa icon={faLinkSlash} class="text-4xl mb-2" />
				You do not have any links yet. Create one to get started.
			</div>
		{/if}
	</div>
</div>
