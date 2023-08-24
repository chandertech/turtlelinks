<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import InviteMemberModal from './InviteMemberModal.svelte';

	import { faUserPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import DeleteOrgModal from './DeleteOrgModal.svelte';
	import { goto } from '$app/navigation';
	import { DisplayErrorToast, DisplayToast } from '$lib/Toast';

	export let data;

	const inviteMemberModal: ModalSettings = {
		type: 'component',
		component: { ref: InviteMemberModal },
		response: async (res) => {
			if (!res) return;

			const { email } = res;
			const inviteResponse = await fetch('/api/invite-member', {
				method: 'POST',
				body: JSON.stringify({ id: data.organization.id, email: email })
			});

			if (!inviteResponse.ok) {
				DisplayErrorToast();
				return;
			}

			DisplayToast(`${email} has been invited to the organization.`, 'variant-filled-success');

			modalStore.close();
		}
	};

	const deleteOrgModal: ModalSettings = {
		type: 'component',
		component: { ref: DeleteOrgModal },
		response: async (res) => {
			if (!res) return;

			const deleteRes = await fetch('/api/delete-org', {
				method: 'POST',
				body: JSON.stringify({ orgId: data.organization.id })
			});

			if (!deleteRes.ok) {
				DisplayErrorToast();
				return;
			}

			modalStore.close();
			goto('/');
		}
	};
</script>

<div class="sm:container sm:mx-auto justify-center p-8">
	<div class="flex justify-between">
		<h1 class="h2 capitalize">{data.organization.name}'s org</h1>
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

	<div class="py-12">
		<div class="card container content-center p-8">
			<h2 class="text-2xl">User</h2>
			<hr class="my-4" />
			{#each data.members as member}
				<div>
					{#if member.name}
						<p class="font-medium">{member.name}</p>
					{/if}
					<p class="text-slate-400">{member.email}</p>
				</div>
				<hr class="my-4" />
			{/each}
			<div>
				<p>{data.members.length == 1 ? '1 User' : `${data.members.length} Users`}</p>
			</div>
		</div>
	</div>
</div>
