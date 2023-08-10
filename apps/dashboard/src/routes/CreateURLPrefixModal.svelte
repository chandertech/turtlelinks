<script lang="ts">
	export let parent: any;

	import { faCheck } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import { Stepper, Step } from '@skeletonlabs/skeleton';

	let domain = '';
	$: isDomainValid = domain.length != 0; // TODO: Validate more.

	function onFormSubmit(event: Event): void {
		if ($modalStore[0].response) $modalStore[0].response(domain);
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="card p-8 w-modal shadow-xl space-y-4">
		<Stepper on:complete={onFormSubmit}>
			<Step locked={!isDomainValid}>
				<svelte:fragment slot="header">Add URL prefix</svelte:fragment>
				<label class="label">
					<span>Domain</span>
					<input bind:value={domain} class="input" title="domain" type="text" placeholder="" />
				</label>
			</Step>
			<Step>
				<svelte:fragment slot="header">Finished!</svelte:fragment>
				<div class="card flex flex-row variant-filled-success p-2 px-4">
					<span class="flex"
						><Fa class="place-self-center pr-3" icon={faCheck} />
						{domain} has been verified and approved for use</span
					>
				</div>
			</Step>
		</Stepper>
	</div>
{/if}
