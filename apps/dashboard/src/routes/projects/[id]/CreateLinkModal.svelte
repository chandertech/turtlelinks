<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import type { LinkInfo } from '$lib/supabase/supabase-types';
	import { DisplayErrorToast } from '$lib/Toast';

	const supabase = $modalStore[0].meta.supabase;
	const url = $modalStore[0].meta.url as string;
	const link = $modalStore[0]?.meta?.link as LinkInfo;

	const isEditing = !!link;

	let suffix = link?.suffix ?? '';
	$: isSuffixValid = suffix.length != 0; // TODO: Validate more.

	let deepLink = link?.deep_link ?? '';
	$: isDeepLinkValid = deepLink.length != 0;

	let friendlyName = link?.friendly_name ?? '';
	$: isFriendlyLinkValid = friendlyName.length != 0;

	let loading = false;

	async function onFormSubmit(_: Event) {
		const newLink: LinkInfo = {
			link: url + '/' + suffix,
			url: url,
			suffix: suffix,
			deep_link: deepLink,
			friendly_name: friendlyName
		};

		loading = true;
		const { error: linkError } = await supabase.from('dynamic_links').upsert(newLink);
		loading = false;

		if (linkError) {
			DisplayErrorToast();
			return;
		}

		if ($modalStore[0].response) $modalStore[0].response({ success: true });
		modalStore.close();
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
				buttonCompleteLabel={loading ? 'Setting up...' : 'Add Link'}
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
