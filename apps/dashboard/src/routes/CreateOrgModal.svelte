<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';

	import { faUsers } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import LoadingButton from '$lib/LoadingButton.svelte';
	import InputWarning from '$lib/InputWarning.svelte';

	let input = '';
	let loading = false;
	$: showWarning = input.length >= 20;

	function onFormSubmit(_event: Event): void {
		if ($modalStore[0].response)
			$modalStore[0].response({ name: input, isRequesting: (req: boolean) => (loading = req) });
	}
</script>

{#if $modalStore[0]}
	<div class="card flex flex-col gap-4 w-modal shadow-xl overflow-hidden p-8">
		<header class="h1 text-2xl">Create a new organization</header>
		<section>
			<label class="label">
				<span>Organization name</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><Fa icon={faUsers} /></div>
					<input name="orgname" placeholder="Enter a name..." bind:value={input} />
				</div>
				<InputWarning {showWarning} text={'Organization name is too long!'} />
			</label>
		</section>
		<footer class="flex justify-end">
			<LoadingButton
				class="btn variant-filled-primary"
				disabled={!input || showWarning}
				{loading}
				onclick={onFormSubmit}>Create organization</LoadingButton
			>
		</footer>
	</div>
{/if}
