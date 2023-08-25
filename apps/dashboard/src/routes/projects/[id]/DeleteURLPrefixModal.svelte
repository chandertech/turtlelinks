<script lang="ts">
	import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import LoadingButton from '$lib/LoadingButton.svelte';

	const url = $modalStore[0].meta.url as string;
	const count = $modalStore[0].meta.count as number;

	let loading = false;
	let input = '';
	$: isDeleteDisabled = input !== url;

	function onFormSubmit(_event: Event): void {
		if ($modalStore[0].response)
			$modalStore[0].response({ success: true, isRequesting: (req: boolean) => (loading = req) });
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal shadow-xl space-y-4 overflow-hidden">
		<header
			class="card-header text-2xl font-medium flex py-4 px-8"
			style="background-color: #D4163C"
		>
			<Fa icon={faTriangleExclamation} class="place-self-center pr-2" /><span
				>Delete URL Prefix and associated links</span
			>
		</header>
		<section class="px-8">
			<div class="pb-4">
				When you delete <b>{url}</b>, the following will immediately happen:
				<ol class="list">
					{#if count > 0}
						<li>
							<span>-</span>
							<span
								>{count > 1 ? 'All' : ''}
								<b>{count} dynamic {count == 1 ? 'link' : 'links'}</b> associated with this domain are
								permanently deleted</span
							>
						</li>
					{/if}
					<li>
						<span>-</span>
						<span>...</span>
					</li>
				</ol>
			</div>
			<label class="label">
				<span>To delete your URL prefix and associated dynamic links, type in <b>{url}</b></span>
				<input
					class="input"
					title="suffix"
					type="text"
					placeholder="Enter your URL prefix"
					bind:value={input}
				/>
			</label>
		</section>
		<footer class="card-footer flex justify-end pb-4 px-8">
			<LoadingButton
				class="btn variant-filled-error"
				onclick={onFormSubmit}
				{loading}
				disabled={isDeleteDisabled}>Delete URL Prefix</LoadingButton
			>
		</footer>
	</div>
{/if}
