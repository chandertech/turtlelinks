<script lang="ts">
	import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import LoadingButton from '$lib/LoadingButton.svelte';
	import { DisplayErrorToast } from '$lib/Toast';

	const name = $modalStore[0].meta.name as string;
	const orgId = $modalStore[0].meta.orgId as number;

	let input = '';
	let loading = false;
	$: isDeleteDisabled = input !== name;

	async function onFormSubmit(_event: Event) {
		loading = true;
		const deleteRes = await fetch('/api/delete-org', {
			method: 'POST',
			body: JSON.stringify({ orgId: orgId })
		});
		loading = false;

		if (!deleteRes.ok) {
			DisplayErrorToast();
			return;
		}

		if ($modalStore[0].response) $modalStore[0].response({ success: true });
		modalStore.close();
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
			<LoadingButton
				class="btn variant-filled-error"
				onclick={onFormSubmit}
				{loading}
				disabled={isDeleteDisabled}>Delete Organization</LoadingButton
			>
		</footer>
	</div>
{/if}
