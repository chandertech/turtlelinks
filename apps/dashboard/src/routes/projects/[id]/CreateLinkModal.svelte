<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import type { LinkInfo } from '$lib/supabase/supabase-types';

	const link = $modalStore[0]?.meta?.link as LinkInfo;
	const isEditing = !!link;

	let loading = false;

	let suffix = link?.suffix ?? '';
	$: isSuffixValid = suffix.length != 0; // TODO: Validate more.

	let deepLink = link?.deep_link ?? '';
	$: isDeepLinkValid = deepLink.length != 0;

	let friendlyName = link?.friendly_name ?? '';
	$: isFriendlyLinkValid = friendlyName.length != 0;

	function onFormSubmit(_event: Event): void {
		if ($modalStore[0].response)
			$modalStore[0].response({
				suffix,
				deepLink,
				friendlyName,
				isEditing,
				isRequesting: (req: boolean) => (loading = req)
			});
	}
</script>

{#if $modalStore[0]}
	<div class="card p-8 w-modal shadow-xl space-y-4">
		<Stepper on:complete={onFormSubmit}>
			<Step locked={!isSuffixValid}>
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
						<input
							class="input"
							title="suffix"
							type="text"
							bind:value={suffix}
							disabled={isEditing}
						/>
					</label>
				</div>
			</Step>
			<Step
				locked={!isDeepLinkValid || !isFriendlyLinkValid || loading}
				buttonCompleteLabel={loading ? 'Creating Link...' : 'Create Link'}
			>
				<svelte:fragment slot="header">Setup your dynamic link</svelte:fragment>
				<label class="label">
					<span>Deep link URL</span>
					<input
						class="input"
						title="url"
						type="text"
						placeholder="Example: https://yourapp.com/welcome"
						bind:value={deepLink}
					/>
				</label>
				<label class="label">
					<span>Deep link name</span>
					<input
						class="input"
						title="name"
						type="text"
						placeholder="Example: Seasonal Promo"
						bind:value={friendlyName}
					/>
				</label>
			</Step>
		</Stepper>
	</div>
{/if}
