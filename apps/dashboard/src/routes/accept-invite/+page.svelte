<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { InviteStatusFromDb, InviteStatusToDb } from '$lib/types/app';
	import { goto } from '$app/navigation';

	export let data;

	const supabase = data.supabase;
	const session = $page.data.session;

	let successMessage: string | null = null;
	let errorDescription: string | null = null;

	onMount(() => {
		checkInvite();
	});

	async function checkInvite() {
		console.log('checkInvite() start');
		if (!session) {
			errorDescription = 'You must be logged in to accept an invite';
			return;
		}

		// Get invite code from URL and validate
		const inviteCode = $page.url.searchParams.get('inviteCode');
		if (!inviteCode) {
			errorDescription = 'Missing invite code';
			return;
		}

		// Get invite from database
		const { data: invite, error: inviteError } = await supabase
			.from('organization_invites')
			.select('id, invitee_email, organization_id, status')
			.eq('invite_code', inviteCode)
			.single();

		if (inviteError || !invite) {
			errorDescription = 'Error fetching invite';
			return;
		}

		// Check if user is already in organization
		const { data: userOrgs, error: userOrgsError } = await supabase
			.from('users_organizations')
			.select('organization_id')
			.eq('profile_id', session.user.id)
			.eq('organization_id', invite?.organization_id)
			.single();

		// Treat this as a success, maybe the user reloaded or clicked an old invite link
		if (userOrgs) {
			goto(`/settings/organizations/${userOrgs.organization_id}`, { replaceState: true });
			return;
		}

		const inviteStatus = InviteStatusFromDb(invite.status);

		// Only proceed if invite is pending
		if (inviteStatus !== 'pending') {
			errorDescription = 'Invite must be pending to accept';
			return;
		}

		// Add user to organization
		const { error: _updateUserOrgsError } = await supabase
			.from('users_organizations')
			.insert({ profile_id: session.user.id, organization_id: invite.organization_id });

		if (_updateUserOrgsError) {
			errorDescription = 'Error adding user to organization';
			return;
		}

		// Update invite status to accepted. TODO figure out why this doesn't work, maybe convert to transaction
		const { error: _updateInviteStatusError } = await supabase
			.from('organization_invites')
			.update({ status: InviteStatusToDb('accepted') })
			.eq('id', invite.id);

		if (_updateInviteStatusError) {
			errorDescription = 'Error updating invite status';
			return;
		}

		goto(`/settings/organizations/${invite.organization_id}`, { replaceState: true });
	}
</script>

{#if errorDescription}
	<div class="p-4">
		<h2 class="py-2">Error</h2>
		<p class="py-2">{errorDescription}</p>
		<p>To login with your email, please <a href="/settings/account">click here</a>.</p>
	</div>
{/if}
