<script lang="ts">
	import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let text: string;
	export let showWarning: boolean;
</script>

{#if showWarning}
	<span class="flex text-xs text-red-500"
		><Fa class="place-self-center pr-1" icon={faExclamationCircle} />{text}</span
	>
{/if}
