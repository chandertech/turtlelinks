<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import { faUser, faRightToBracket, faLink } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead"
				><a href="/" class="text-xl font-bold"
					><button type="button" class="btn variant-filled-surface">
						<span><Fa icon={faLink} /></span>
						<span><span class="text-green-400">Turtle</span> Links</span>
					</button></a
				></svelte:fragment
			>

			<svelte:fragment slot="trail">
				<a href="https://github.com/chandertech/turtlelinks"
					><button type="button" class="btn-icon variant-filled-surface">
						<Fa icon={faGithub} />
					</button></a
				>
				{#if data.session}
					<a href="/links"
						><button type="button" class="btn variant-filled-surface">
							<Fa icon={faLink} />
							<span>Links</span>
						</button></a
					>
				{/if}
				<a href="/login"
					><button type="button" class="btn variant-filled-surface">
						{#if data.session}
							<Fa icon={faUser} />
							<span>Account</span>
						{:else}
							<Fa icon={faRightToBracket} />
							<span>Login</span>
						{/if}
					</button></a
				>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
