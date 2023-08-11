<script lang="ts">
	export let parent: any;

	import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';

	const url = $modalStore[0].meta.url as string;
	const count = $modalStore[0].meta.count as number;

	let input = '';
	$: isDeleteDisabled = input !== url;

	function onFormSubmit(event: Event): void {
		if ($modalStore[0].response) $modalStore[0].response({ success: true });
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
					<li>
						<span>-</span>
						<span
							>All <b>{count} dynamic links</b> associated with this domain are permanently deleted</span
						>
					</li>
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
			<button
				type="button"
				class="btn variant-filled-error"
				on:click={onFormSubmit}
				disabled={isDeleteDisabled}>Delete URL Prefix</button
			>
		</footer>
	</div>
{/if}
