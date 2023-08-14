<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '../theme.postcss';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppShell, AppBar, Modal, Toast } from '@skeletonlabs/skeleton';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import { faUser, faRightToBracket, faLink } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

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

<!-- Toast should appear above any modals -->
<Toast />
<Modal zIndex="z-[777]" />

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead"
				><a href="/" class="text-xl font-bold"
					><button type="button" class="btn variant-filled-surface">
						<Fa icon={faLink} />
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
