<script lang="ts">
	import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';

	const id = $modalStore[0].meta.id as number;
	const name = $modalStore[0].meta.name as string;

	let input = '';
	$: isDeleteDisabled = input !== name;

	function onFormSubmit(_event: Event): void {
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
				>Delete Organization</span
			>
		</header>
		<section class="px-8">
			<div class="pb-4">
				When you delete the organization <b>{name}</b>, all associated links will be deleted.
			</div>
			<label class="label">
				<span>To delete your organization and links, type in <b>{name}</b></span>
				<input
					class="input"
					title="suffix"
					type="text"
					placeholder="Enter organization name..."
					bind:value={input}
				/>
			</label>
		</section>
		<footer class="card-footer flex justify-end pb-4 px-8">
			<button
				type="button"
				class="btn variant-filled-error"
				on:click={onFormSubmit}
				disabled={isDeleteDisabled}>Delete Organization</button
			>
		</footer>
	</div>
{/if}
