<script lang="ts">
	import { onMount } from 'svelte';

	import {
		faLink,
		faUsers,
		faChevronRight,
		faGear,
		faUsersSlash
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from './CreateURLPrefixModal.svelte';

	import type { URLInfo, OrgInfo } from '$lib/supabase/supabase-types';
	import Loading from '$lib/Loading.svelte';
	import CreateOrgModal from './CreateOrgModal.svelte';
	import { DisplayErrorToast, DisplaySuccessToast } from '$lib/Toast';

	export let data;
	let organizations: OrgInfo[] = [];
	let urls: URLInfo[] = [];
	let subscriptions: any[] = [];
	let loading = false;

	onMount(async () => {
		fetchData();
	});

	async function fetchData() {
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

		const { data: subs } = await data.supabase.from('billing_subscriptions').select(
			`
				organization_id,
				billing_prices(billing_products(name))
			`
		);

		const { data: urlData } = await data.supabase.from('urls').select('*');

		organizations = orgs ?? [];
		urls = urlData ?? [];
		subscriptions = subs ?? [];

		loading = false;
	}

	const createURLModal: ModalSettings = {
		type: 'component',
		component: { ref: CreateURLPrefixModal },
		response: async (res) => {
			if (!res) return;

			const { subdomain, domain, orgId } = res;

			res.isRequesting(true);
			const domainRes = await fetch('/api/url/create', {
				method: 'POST',
				body: JSON.stringify({ subdomain: subdomain, domain: domain, orgId: orgId })
			});
			res.isRequesting(false);

			if (!domainRes.ok) {
				DisplayErrorToast();
				return;
			}

			const newURL: URLInfo = {
				domain: domain,
				organization_id: orgId,
				subdomain: subdomain,
				url: subdomain + domain
			};

			modalStore.close();
			DisplaySuccessToast(`"${newURL.url}" has been successfully created.`);

			urls = [...urls, newURL];
		}
	};

	const createOrgModal: ModalSettings = {
		type: 'component',
		component: { ref: CreateOrgModal },
		response: async (res) => {
			if (!res) return;

			const { name } = res;

			res.isRequesting(true);
			const orgRes = await fetch('/api/org/create', {
				method: 'POST',
				body: JSON.stringify({ name: name })
			});
			res.isRequesting(false);

			if (!orgRes.ok) {
				DisplayErrorToast();
				return;
			}

			modalStore.close();
			fetchData();
		}
	};

	function getPlanName(orgId: number) {
		return (
			subscriptions.find((sub) => sub.organization_id == orgId)?.billing_prices?.billing_products
				.name ?? 'Free'
		);
	}
</script>

<div class="sm:container sm:mx-auto justify-center p-8">
	<div class="flex justify-between">
		<h1 class="h2">Dashboard</h1>
		<div class="flex gap-2">
			{#if organizations.length > 0}
				<button
					type="button"
					class="btn variant-ghost-primary"
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
			{/if}
			<button
				type="button"
				class="btn variant-ghost-secondary"
				on:click={() => {
					modalStore.trigger(createOrgModal);
				}}
			>
				<Fa icon={faUsers} />
				<span>Create Organization</span>
			</button>
		</div>
	</div>

	<div class="py-12">
		{#if loading}
			<Loading />
		{:else if organizations.length > 0}
			{#each organizations as organization, i}
				<div class="flex place-items-center justify-between">
					<div class="flex gap-2">
						<h1 class="h2 capitalize">{organization.name}'s org</h1>
						<span class="badge variant-filled-secondary self-center rounded-full"
							>{getPlanName(organization.id)}</span
						>
					</div>
					<a href="/organizations/{organization.id}"
						><button type="button" class="btn-icon btn-icon-sm variant-filled-surface">
							<Fa icon={faGear} />
						</button></a
					>
				</div>
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
										<p class="flex gap-2 text-gray-400">{organization.name}</p>
									</div>
									<Fa icon={faChevronRight} />
								</a>
							{/each}
						</div>
					{:else}
						<div
							class="flex flex-col justify-center place-items-center border-solid border-dashed border-2 border-gray-400 rounded h-40"
						>
							<p>No links</p>
							<p class="text-gray-400 text-sm mb-4">Get started by creating a new link.</p>
							<button
								type="button"
								class="btn variant-ghost"
								on:click={() => {
									modalStore.trigger({
										...createURLModal,
										meta: { organizations: organizations, selectedOrgId: organization.id }
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
		{:else}
			<div class="flex flex-col gap-4 items-center py-24 text-xl text-gray-400">
				<Fa icon={faUsersSlash} class="text-4xl" />
				<p>You do not have any orgs yet. Create one to get started.</p>
				<button
					type="button"
					class="btn variant-ghost-secondary"
					on:click={() => {
						modalStore.trigger(createOrgModal);
					}}
				>
					<Fa icon={faUsers} />
					<span>Create Organization</span>
				</button>
			</div>{/if}
	</div>
</div>
