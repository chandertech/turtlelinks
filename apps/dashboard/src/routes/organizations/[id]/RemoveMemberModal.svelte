<script lang="ts">
	import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { modalStore } from '@skeletonlabs/skeleton';
	import LoadingButton from '$lib/LoadingButton.svelte';

	const orgName = $modalStore[0].meta.orgName as string;
	const userId = $modalStore[0].meta.userId as string;
	const userName = $modalStore[0].meta.userName as string;

	let loading = false;

	function onFormSubmit(_event: Event): void {
		if ($modalStore[0].response)
			$modalStore[0].response({ userId: userId, isRequesting: (req: boolean) => (loading = req) });
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal shadow-xl space-y-4 overflow-hidden">
		<header
			class="card-header text-2xl font-medium flex py-4 px-8"
			style="background-color: #D4163C"
		>
			<Fa icon={faTriangleExclamation} class="place-self-center pr-2" /><span>Remove User</span>
		</header>
		<section class="px-8">
			<div class="pb-4">
				Are you sure you want to remove <span class="font-bold">{userName}</span> from {orgName}?
			</div>
		</section>
		<footer class="card-footer flex justify-end pb-4 px-8">
			<LoadingButton class="btn variant-filled-error" {loading} onclick={onFormSubmit}
				>Remove</LoadingButton
			>
		</footer>
	</div>
{/if}
