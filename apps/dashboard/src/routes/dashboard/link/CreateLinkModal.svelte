<script lang="ts">
	export let parent: any;

	import { modalStore } from '@skeletonlabs/skeleton';
	import { Stepper, Step } from '@skeletonlabs/skeleton';

	// Step 1 (suffix)
	let urlSuffix = '';
	$: isURLSuffixValid = urlSuffix.length == 0; // TODO: Validate more.

	function onFormSubmit(event: Event): void {
		if ($modalStore[0].response) $modalStore[0].response('');
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="card p-8 w-modal shadow-xl space-y-4">
		<Stepper on:complete={onFormSubmit}>
			<Step locked={!isURLSuffixValid}>
				<svelte:fragment slot="header">Setup your short URL link</svelte:fragment>
				<div>Customize your short link URL to make it more professional and contextual.</div>
				<div class="flex gap-1">
					<label class="label">
						<span>URL prefix</span>
						<input
							class="input"
							title="domain"
							type="text"
							placeholder="https://testlink.turtle.link/"
							disabled={true}
						/>
					</label>
					<label class="label">
						<span>URL suffix</span>
						<input class="input" title="suffix" type="text" bind:value={urlSuffix} />
					</label>
				</div>
			</Step>
			<Step>
				<svelte:fragment slot="header">Setup your dynamic link</svelte:fragment>
				<label class="label">
					<span>Deep link URL</span>
					<input
						class="input"
						title="url"
						type="text"
						placeholder="Example: https://yourapp.com/welcome"
					/>
				</label>
				<label class="label">
					<span>Deep link name</span>
					<input class="input" title="name" type="text" placeholder="Example: Seasonal Promo" />
				</label>
			</Step>
			<Step>
				<svelte:fragment slot="header">Define link behaviour for Apple</svelte:fragment>
			</Step>
			<Step>
				<svelte:fragment slot="header">Define link behaviour for Android</svelte:fragment>
			</Step>
			<Step>
				<svelte:fragment slot="header">Advanced options (optional)</svelte:fragment>
			</Step>
		</Stepper>
	</div>
{/if}
