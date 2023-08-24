<script lang="ts">
	import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let clazz = 'btn';
	export { clazz as class };

	export let disabled = false;
	export let loading = false;
	export let onclick: (event: Event) => void;
</script>

<button class={clazz || ''} type="button" disabled={disabled || loading} on:click={onclick}>
	{#if loading}
		<Fa icon={faCircleNotch} class="animate-spin mr-2" />
	{/if}
	<slot />
</button>
