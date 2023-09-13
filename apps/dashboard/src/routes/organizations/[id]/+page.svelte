<script lang="ts">
	import { ProgressBar, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import InviteMemberModal from './InviteMemberModal.svelte';
	import RemoveMemberModal from './RemoveMemberModal.svelte';

	import { faUserPlus, faTrash, faUserSlash } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import DeleteOrgModal from './DeleteOrgModal.svelte';
	import { goto } from '$app/navigation';
	import { DisplayErrorToast, DisplaySuccessToast } from '$lib/Toast';

	export let data;
	let members = data.members ?? [];
	$: activePlanName =
		data.subscriptionPlans.find((plan) => plan.id == data.activeSubscription?.price_id)
			?.billing_products?.name ?? 'Free';

	const inviteMemberModal: ModalSettings = {
		type: 'component',
		component: { ref: InviteMemberModal },
		response: async (res) => {
			if (!res) return;

			const { email } = res;

			res.isRequesting(true);
			const inviteResponse = await fetch('/api/org/invite', {
				method: 'POST',
				body: JSON.stringify({ id: data.organization.id, email: email })
			});
			res.isRequesting(false);

			if (!inviteResponse.ok) {
				DisplayErrorToast();
				return;
			}

			DisplaySuccessToast(`${email} has been invited to the organization.`);

			modalStore.close();
		}
	};

	const removeMemberModal: ModalSettings = {
		type: 'component',
		component: { ref: RemoveMemberModal },
		response: async (res) => {
			if (!res) return;

			const { userId } = res;

			res.isRequesting(true);
			const { error: deleteError } = await data.supabase
				.from('users_organizations')
				.delete()
				.eq('profile_id', userId);
			res.isRequesting(false);

			if (deleteError) {
				DisplayErrorToast();
			}

			modalStore.close();
			members = members.filter((member) => member.id != userId);
		}
	};

	const deleteOrgModal: ModalSettings = {
		type: 'component',
		component: { ref: DeleteOrgModal },
		response: async (res) => {
			if (!res) return;

			res.isRequesting(true);
			const deleteRes = await fetch('/api/org/delete', {
				method: 'POST',
				body: JSON.stringify({ orgId: data.organization.id })
			});
			res.isRequesting(false);

			if (!deleteRes.ok) {
				DisplayErrorToast();
				return;
			}

			modalStore.close();
			goto('/');
		}
	};

	async function subscribe(organizationId: number, priceId: string) {
		const res = await fetch('/api/stripe/subscribe', {
			method: 'POST',
			body: JSON.stringify({ organizationId: organizationId, priceId: priceId })
		});
		const { url } = await res.json();
		goto(url);
	}

	async function manage(organizationId: number, subscriptionId: string) {
		const res = await fetch('/api/stripe/manage', {
			method: 'POST',
			body: JSON.stringify({ organizationId: organizationId, subscriptionId: subscriptionId })
		});
		const { url } = await res.json();
		goto(url);
	}
</script>

<div class="sm:container sm:mx-auto justify-center p-8">
	<div class="flex justify-between">
		<div class="flex gap-2">
			<h1 class="h2 capitalize">{data.organization.name}'s org</h1>
			<span class="badge variant-filled-secondary self-center rounded-full">{activePlanName}</span>
		</div>
		<div class="flex gap-2">
			<button
				type="button"
				class="btn variant-ghost-primary"
				on:click={() => {
					modalStore.trigger(inviteMemberModal);
				}}
			>
				<Fa icon={faUserPlus} />
				<span>Invite Member</span>
			</button>
			<button
				type="button"
				class="btn variant-ghost-error"
				on:click={() => {
					modalStore.trigger({
						...deleteOrgModal,
						meta: { name: data.organization.name }
					});
				}}
			>
				<Fa icon={faTrash} />
				<span>Delete Organization</span>
			</button>
		</div>
	</div>

	<div class="py-4">
		<div class="card container content-center p-8">
			<h2 class="text-2xl">User</h2>
			<hr class="my-4" />
			{#each members as member}
				<div class="flex place-items-center justify-between">
					<div>
						{#if member.name}
							<p class="font-medium">{member.name}</p>
						{/if}
						<p class="text-gray-400">{member.email}</p>
					</div>
					{#if member.id != data.session?.user.id}
						<button
							type="button"
							class="btn variant-ghost-error"
							on:click={() => {
								modalStore.trigger({
									...removeMemberModal,
									meta: {
										orgName: data.organization.name,
										userId: member.id,
										userName: member.name ?? member.email
									}
								});
							}}
						>
							<Fa icon={faUserSlash} />
							<span>Remove</span>
						</button>
					{/if}
				</div>
				<hr class="my-4" />
			{/each}
			<div>
				<p>{members.length == 1 ? '1 User' : `${members.length} Users`}</p>
			</div>
		</div>
	</div>

	<h2 class="h2 capitalize mb-4">Billing</h2>
	<div class="flex gap-2">
		<div class="card container flex flex-col content-center p-8 w-1/2">
			<h3 class="h3 capitalize">Active Plan</h3>
			<div class="py-4">
				<p class="text-gray-400">This organization is currently on the plan:</p>
				<p class="text-xl font-medium uppercase text-green-400">{activePlanName}</p>
			</div>
		</div>
		{#if !data.activeSubscription}
			{#each data.subscriptionPlans as plan}
				{#if plan.billing_products}
					<div class="card container flex flex-col content-center p-8 gap-4 w-1/2">
						<div>
							<p class="text-xl font-medium uppercase text-green-400">
								{plan.billing_products.name}
							</p>
							<p class="text-gray-400">{plan.billing_products.description}</p>
						</div>
						<button
							type="button"
							class="btn variant-ghost-secondary"
							disabled={activePlanName == plan.billing_products.name}
							on:click={() => {
								subscribe(data.organization.id, plan.id);
							}}
						>
							<span>Upgrade to {plan.billing_products.name}</span>
						</button>
					</div>
				{/if}
			{/each}
		{:else}
			<div class="card container flex flex-col content-center p-8 justify-center">
				<div class="flex flex-col gap-2">
					<div class="flex justify-between">
						<div>
							<p class="text-gray-200">
								Current billing cycle - ({data.activeSubscription.current_period_start} - {data
									.activeSubscription.current_period_end})
							</p>
							<p class="text-gray-400 uppercase">{data.activeSubscription.status}</p>
						</div>
						<p class="text-gray-400 self-center">20 days remaining</p>
					</div>
					<ProgressBar label="Progress Bar" value={30} max={100} />
				</div>
				<div class="flex justify-end mt-4">
					<button
						type="button"
						class="btn variant-ghost-secondary"
						on:click={() => {
							if (data.activeSubscription) manage(data.organization.id, data.activeSubscription.id);
						}}
					>
						<span>Manage subscription</span>
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
