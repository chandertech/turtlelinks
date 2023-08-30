<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { InviteStatusFromDb, InviteStatusToDb } from '$lib/types/app';
	import { goto } from '$app/navigation';

	import {
		faAdd,
		faLink,
		faLinkSlash,
		faEllipsisV,
		faPencil,
		faMinus,
		faTrash,
		faArrowDown,
		faHome
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let data;

	const supabase = data.supabase;

	let errorDescription: string | null = null;

	onMount(() => {
		checkInvite();
	});

	async function checkInvite() {
		const hashParams = new URLSearchParams(window.location.hash.substring(1));
		const access_token = hashParams.get('access_token');
		const refresh_token = hashParams.get('refresh_token');

		if (!access_token || !refresh_token) {
			errorDescription = 'Missing access or refresh token';
			return;
		}

		const { data, error } = await supabase.auth.setSession({
			access_token,
			refresh_token
		});

		if (error || !data.session) {
			errorDescription = 'Error setting session';
			return;
		}
		const session = data.session;

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
		// todo do something with this error
		const { data: userOrgs, error: _userOrgsError } = await supabase
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

		// Update invite status to accepted.
		const { error: _updateInviteStatusError } = await supabase
			.from('organization_invites')
			.update({ status: InviteStatusToDb('accepted') })
			.eq('id', invite.id);

		if (_updateInviteStatusError) {
			errorDescription = 'Error updating invite status';
			return;
		}

		goto(`/organizations/${invite.organization_id}`, { replaceState: true });
	}
</script>

{#if errorDescription}
	<div class="flex flex-col gap-4 items-center py-24 text-xl text-gray-400">
		<Fa icon={faLinkSlash} class="text-4xl" />
		<p>This organization invite is no longer valid.</p>
		<a href="/">
			<button type="button" class="btn variant-ghost">
				<Fa icon={faHome} />
				<span>Dashboard</span>
			</button>
		</a>
	</div>
{/if}
