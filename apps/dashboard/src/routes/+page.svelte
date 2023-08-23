<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { faLink, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, filter } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from './CreateURLPrefixModal.svelte';

	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import type { URLInfo, OrgInfo } from '$lib/supabase/supabase-types';
	import Loading from '$lib/Loading.svelte';

	export let data;
	let organizations: OrgInfo[] = [];
	let urls: URLInfo[] = [];
	let loading = false;

	const toastError: ToastSettings = {
		message: 'An unexpected error has occurred.',
		background: 'variant-filled-error',
		timeout: 5000
	};

	onMount(async () => {
		loading = true;

		const { data: userOrgs } = await data.supabase
			.from('users_organizations')
			.select('profile_id, organization_id')
			.eq('profile_id', data.session.user.id);

		const { data: orgs } = await data.supabase
			.from('organizations')
			.select('*')
			.in(
				'id',
				(userOrgs ?? []).map((org) => org.organization_id)
			);

		const { data: urlData } = await data.supabase.from('urls').select('*');

		organizations = orgs ?? [];
		urls = urlData ?? [];

		loading = false;
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
				toastStore.trigger(toastError);
				return;
			}

			const newURL: URLInfo = {
				domain: domain,
				organization_id: orgId,
				subdomain: subdomain,
				url: subdomain + domain
			};

			modalStore.close();
			toastStore.trigger({
				message: `"${newURL.url}" has been successfully created.`,
				background: 'variant-filled-success',
				timeout: 5000
			});

			urls = [...urls, newURL];
		}
	};
</script>

<div class="sm:container sm:mx-auto justify-center p-8">
	<div class="flex justify-between">
		<h1 class="h2">Dashboard</h1>
		<button
			type="button"
			class="btn variant-filled-surface"
			on:click={() => {
				modalStore.trigger({
					...createURLModal,
					meta: { organizations: organizations }
				});
			}}
		>
			<Fa icon={faLink} />
			<span>New URL Prefix</span>
		</button>
	</div>

	<div class="py-12">
		{#if loading}
			<Loading />
		{:else}
			{#each organizations as organization}
				<h2 class="h3 capitalize">{organization.name}'s Org</h2>
				<div class="py-4">
					{#if urls.filter((url) => url.organization_id == organization.id).length > 0}
						<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
							{#each urls.filter((url) => url.organization_id == organization.id) as url}
								<a
									href="/projects/{organization.id}?url={url.url}"
									class="flex justify-between place-items-center card card-hover cursor-pointer px-8 h-40"
								>
									<div class="flex flex-col gap-2">
										<p class="flex gap-2">{url.url}</p>
										<p class="flex gap-2 text-slate-400">{organization.name}</p>
									</div>
									<Fa icon={faChevronRight} />
								</a>
							{/each}
						</div>
					{:else}
						<div
							class="flex flex-col justify-center place-items-center border-solid border-dashed border-2 border-slate-400 rounded h-40"
						>
							<p>No links</p>
							<p class="text-slate-400 text-sm mb-4">Get started by creating a new link.</p>
							<button
								type="button"
								class="btn variant-ghost"
								on:click={() => {
									modalStore.trigger({
										...createURLModal,
										meta: { organizations: organizations }
									});
								}}
							>
								<Fa icon={faLink} />
								<span>New URL Prefix</span>
							</button>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>
