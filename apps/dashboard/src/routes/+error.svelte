<script lang="ts">
	import { faExclamationCircle, faHome } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
</script>

<div class="flex flex-col gap-4 items-center py-24 text-xl text-gray-400">
	<Fa icon={faExclamationCircle} class="text-6xl" />
	<h1 class="h1">404</h1>
	<p>The page you requested was not found...</p>
	<a href="/">
		<button type="button" class="btn variant-ghost">
			<Fa icon={faHome} />
			<span>Dashboard</span>
		</button>
	</a>
</div>
