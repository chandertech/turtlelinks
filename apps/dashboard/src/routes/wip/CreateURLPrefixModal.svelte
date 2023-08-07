<script lang="ts">
	export let parent: any;

	import { modalStore } from '@skeletonlabs/skeleton';
	import { Stepper, Step } from '@skeletonlabs/skeleton';

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	// Step 1 (domain)
	let domain = '';
	$: isDomainValid = domain.length != 0; // TODO: Validate more.

	// Step 2
	// Step 3

	// Step 4 (finish)
	function onFormSubmit(event: Event): void {
		if ($modalStore[0].response) $modalStore[0].response('');
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<Stepper on:complete={onFormSubmit}>
			<Step locked={!isDomainValid}>
				<svelte:fragment slot="header">Add URL prefix</svelte:fragment>
				<label for="domain">Domain</label>
				<input bind:value={domain} class="input" title="domain" type="text" placeholder="" />
			</Step>
			<Step>
				<svelte:fragment slot="header">Finished!</svelte:fragment>
				<div class="card flex flex-row variant-filled-success p-2 px-4">
					<span>{domain} has been verified and approved for use</span>
				</div>
			</Step>
		</Stepper>
	</div>
{/if}
