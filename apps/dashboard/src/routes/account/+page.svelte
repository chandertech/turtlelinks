<script lang="ts">
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	import { faRightFromBracket, faUserCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { goto } from '$app/navigation';

	export let data;

	let { session, profile } = data;

	let loading = false;
	let fullName = profile?.full_name ?? null;
	let username = profile?.username ?? null;
	let website = profile?.website ?? null;

	const organizations = data.organizations ?? [];

	const toastError: ToastSettings = {
		message: 'An unexpected error has occurred.',
		background: 'variant-filled-error',
		timeout: 5000
	};
</script>

<div class="mx-auto container p-8">
	<h1 class="h2 mb-4">Account Information</h1>

	<label for="email" class="label text-lg pb-2">Email</label>
	<input
		id="email"
		form="account-info"
		type="text"
		class="input mb-4"
		value={session.user.email}
		disabled
	/>
	<label for="fullName" class="label text-lg pb-2">Full Name</label>
	<input
		id="fullName"
		form="account-info"
		name="fullName"
		type="text"
		class="input mb-4"
		bind:value={fullName}
	/>
	<label for="username" class="label text-lg pb-2">Username</label>
	<input
		id="username"
		form="account-info"
		name="username"
		type="text"
		class="input mb-4"
		bind:value={username}
	/>
	<label for="website" class="label text-lg pb-2">Website</label>
	<input
		id="website"
		form="account-info"
		name="website"
		type="url"
		class="input mb-4"
		bind:value={website}
	/>
	<div>
		<button
			on:click={async () => {
				const email = session.user.email;
				// todo display error
				if (!email) return;

				loading = true;
				const { error } = await data.supabase.from('profiles').upsert({
					id: session?.user.id,
					full_name: fullName ? fullName : null,
					username: username ? username : null,
					website: website ? website : null,
					updated_at: new Date().toISOString(),
					email: email
				});

				if (error) toastStore.trigger(toastError);
				loading = false;
			}}
			class="btn variant-filled-primary"
			disabled={loading}
			><Fa icon={loading ? faSpinner : faUserCheck} /><span
				>{loading ? 'Loading...' : 'Update'}</span
			></button
		>

		<button
			class="btn variant-filled-error ml-1"
			disabled={loading}
			on:click={async () => {
				await data.supabase.auth.signOut();
				goto('/login');
			}}><Fa icon={faRightFromBracket} /><span>Sign Out</span></button
		>
	</div>
</div>
