<script lang="ts">
	import { faCheck } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import type { OrgInfo } from '$lib/supabase/supabase-types';
	import InputWarning from '$lib/InputWarning.svelte';

	let organizations = $modalStore[0].meta.organizations as OrgInfo[];
	let selectedOrgId = $modalStore[0].meta.selectedOrgId ?? organizations[0].id;
	let loading = false;
	let domainInput = '';
	let domain = '.turt.link';

	// 1. Domain cannot start with hyphen
	// 2. 1 to 63 characters in length
	// 3. Doesn't end with a hyphen
	// 4. Must end with "".turt.link"
	$: isDomainValid =
		/^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.turt\.link$/.test(domainInput) &&
		domainInput.length > 0 &&
		domainInput.endsWith(domain);
	$: showWarning = domainInput.length > 0 && !isDomainValid;

	function onFormSubmit(_event: Event): void {
		if ($modalStore[0].response)
			$modalStore[0].response({
				subdomain: domainInput.replaceAll(domain, ''),
				domain: domain,
				orgId: selectedOrgId,
				isRequesting: (req: boolean) => (loading = req)
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
			<Step locked={!isDomainValid}>
				<svelte:fragment slot="header">Add URL prefix</svelte:fragment>
				<label class="label">
					<span>Domain</span>
					<input bind:value={domainInput} class="input" title="domain" type="text" placeholder="" />
					<InputWarning {showWarning} text={`Must be a valid domain ending with ${domain}`} />
				</label>
			</Step>
			<Step locked={loading} buttonCompleteLabel={loading ? 'Adding Prefix...' : 'Add Prefix'}>
				<svelte:fragment slot="header">Finished!</svelte:fragment>
				<div class="card flex flex-row variant-filled-success p-2 px-4">
					<span class="flex"
						><Fa class="place-self-center pr-3" icon={faCheck} />
						{domainInput} has been verified and approved for use</span
					>
				</div>
			</Step>
		</Stepper>
	</div>
{/if}
