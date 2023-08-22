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
	import CreateURLPrefixModal from './CreateURLPrefixModal.svelte';

	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import type { URLInfo, OrgInfo } from '$lib/supabase/supabase-types';

	export let data;
	let organizations: OrgInfo[] = [];

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

		organizations = orgs ?? [];
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
</div>
