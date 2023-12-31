<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
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

	const inviteMemberModal: ModalSettings = {
		type: 'component',
		component: { ref: InviteMemberModal },
		response: async (res) => {
			if (!res) return;

			const { email } = res;

			res.isRequesting(true);
			const inviteResponse = await fetch('/api/invite-member', {
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
			const deleteRes = await fetch('/api/delete-org', {
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
</div>
