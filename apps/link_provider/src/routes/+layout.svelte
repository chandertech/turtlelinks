<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '../theme.postcss';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	import { faLink } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead"
				><a href="/" class="text-xl font-bold"
					><button type="button" class="btn variant-filled-surface">
						<Fa icon={faLink} />
						<span>Link Provider</span>
					</button></a
				></svelte:fragment
			>

			<svelte:fragment slot="trail">
				<a href="https://github.com/chandertech/turtlelinks"
					><button type="button" class="btn-icon variant-filled-surface">
						<Fa icon={faGithub} />
					</button></a
				>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
