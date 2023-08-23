<script lang="ts">
	import { faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import type { OrgInfo } from '$lib/supabase/supabase-types';

	let organizations = ($modalStore[0]?.meta?.organizations as OrgInfo[]) ?? [];

	let selectedOrgId = organizations[0].id;
	let inputDomain = '';
	let domain = '.turt.link';
	$: isValid = inputDomain.length > 0 && inputDomain.endsWith(domain);
	$: showWarning = inputDomain.length > 0 && !isValid;

	function onFormSubmit(_event: Event): void {
		if ($modalStore[0].response)
			$modalStore[0].response({
				subdomain: inputDomain.replaceAll(domain, ''),
				domain: domain,
				orgId: selectedOrgId
			});
	}
</script>

{#if $modalStore[0]}
	<div class="card p-8 w-modal shadow-xl space-y-4">
		<Stepper on:complete={onFormSubmit}>
			{#if organizations.length > 1}
				<Step locked={!selectedOrgId}>
					<svelte:fragment slot="header">Select an organization</svelte:fragment>
					<select
						class="select"
						size={organizations.length < 4 ? organizations.length : 4}
						bind:value={selectedOrgId}
						on:change={() => {}}
					>
						{#each organizations as organization}
							<option value={organization.id}>{organization.name}</option>
						{/each}
					</select>
				</Step>
			{/if}
			<Step locked={!isValid}>
				<svelte:fragment slot="header">Add URL prefix</svelte:fragment>
				<label class="label">
					<span>Domain</span>
					<input bind:value={inputDomain} class="input" title="domain" type="text" placeholder="" />
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
						{inputDomain} has been verified and approved for use</span
					>
				</div>
			</Step>
		</Stepper>
	</div>
{/if}
