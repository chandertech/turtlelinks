<script lang="ts">
	export let parent: any;

	import { faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import { Stepper, Step } from '@skeletonlabs/skeleton';

	let subdomain = '';
	let domain = '.turt.link';
	$: isValid = subdomain.length > 0 && subdomain.endsWith(domain);
	$: showWarning = subdomain.length > 0 && !isValid;

	function onFormSubmit(event: Event): void {
		if ($modalStore[0].response) $modalStore[0].response(subdomain);
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="card p-8 w-modal shadow-xl space-y-4">
		<Stepper on:complete={onFormSubmit}>
			<Step locked={!isValid}>
				<svelte:fragment slot="header">Add URL prefix</svelte:fragment>
				<label class="label">
					<span>Domain</span>
					<input bind:value={subdomain} class="input" title="domain" type="text" placeholder="" />
					{#if showWarning}
						<span class="flex text-xs text-red-500"
							><Fa class="place-self-center pr-1" icon={faExclamationCircle} />Domain must end with {domain}</span
						>
					{/if}
				</label>
			</Step>
			<Step>
				<svelte:fragment slot="header">Finished!</svelte:fragment>
				<div class="card flex flex-row variant-filled-success p-2 px-4">
					<span class="flex"
						><Fa class="place-self-center pr-3" icon={faCheck} />
						{subdomain + domain} has been verified and approved for use</span
					>
				</div>
			</Step>
		</Stepper>
	</div>
{/if}
