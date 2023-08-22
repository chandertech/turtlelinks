<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { faLink, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, filter } from '@skeletonlabs/skeleton';
	import CreateURLPrefixModal from './CreateURLPrefixModal.svelte';

	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import type { URLInfo, OrgInfo } from '$lib/supabase/supabase-types';

	export let data;
	let organizations: OrgInfo[] = [];
	let urls: URLInfo[] = [];

	const toastError: ToastSettings = {
		message: 'An unexpected error has occurred.',
		background: 'variant-filled-error',
		timeout: 5000
	};

	onMount(async () => {
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
	});

	const createURLModal: ModalSettings = {
		type: 'component',
		component: { ref: CreateURLPrefixModal },
		response: async (res) => {
			if (!res) return;

			if (!data.session) goto('/login');

			const { subdomain, domain, orgId } = res;
			const domainRes = await fetch('/api/add-domain', {
				method: 'POST',
				body: JSON.stringify({ url: subdomain + domain })
			});

			if (!domainRes.ok) {
				toastStore.trigger(toastError);
				return;
			}

			const newURL: URLInfo = {
				url: subdomain + domain,
				organization_id: orgId,
				subdomain: subdomain,
				domain: domain
			};
			const { error: urlError } = await data.supabase.from('urls').insert(newURL);
			if (urlError) {
				var msg =
					urlError.code == '23505'
						? `URL Prefix with the domain "${subdomain + domain}" already exists!`
						: toastError.message;
				toastStore.trigger({ ...toastError, message: msg });
				return;
			}

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
		<h1 class="h1 flex">Dashboard</h1>
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
		{#each organizations as organization}
			<h2 class="h2 capitalize">{organization.name}</h2>
			<hr class="!border-t-8 mt-2 mb-4" />
			<div class="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mb-4">
				{#each urls.filter((url) => url.organization_id == organization.id) as url}
					<a
						href="/projects/{organization.id}"
						class="flex justify-between place-items-center card card-hover cursor-pointer p-8"
					>
						<p>{url.url}</p>
						<Fa icon={faRightFromBracket} />
					</a>
				{/each}
			</div>
		{/each}
	</div>
</div>
