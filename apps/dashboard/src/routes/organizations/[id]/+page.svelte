<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import InviteMemberModal from './modals/InviteMemberModal.svelte';

	import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let data;
	export let form;

	const inviteMemberModal: ModalSettings = {
		type: 'component',
		component: { ref: InviteMemberModal },
		response: async (res) => {
			const { email } = res;

			modalStore.close();
		}
	};
</script>

<div class="sm:container sm:mx-auto justify-center p-8">
	<div class="flex justify-between">
		<h1 class="h1 capitalize">{data.organization.name}'s organization</h1>
		<button
			type="button"
			class="btn variant-filled-surface"
			on:click={() => {
				modalStore.trigger(inviteMemberModal);
			}}
		>
			<Fa icon={faUserPlus} />
			<span>Invite Member</span>
		</button>
	</div>

	<div class="py-12">
		<div class="card container content-center p-8">
			<h2 class="text-2xl font-medium">User</h2>
			<hr class="!border-t-8 mt-2 mb-4" />
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
