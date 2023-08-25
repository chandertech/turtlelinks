<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';

	import { faEnvelope, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import LoadingButton from '$lib/LoadingButton.svelte';
	import InputWarning from '$lib/InputWarning.svelte';

	let loading = false;
	let input = '';
	$: showWarning = input.length > 0 && !isEmailValid;
	$: isEmailValid = /(.+)@(.+){2,}\.(.+){2,}/.test(input);

	function onFormSubmit(_event: Event): void {
		if ($modalStore[0].response)
			$modalStore[0].response({ email: input, isRequesting: (req: boolean) => (loading = req) });
	}
</script>

{#if $modalStore[0]}
	<div class="card flex flex-col gap-4 w-modal shadow-xl overflow-hidden p-8">
		<header class="h1 text-2xl">Invite a member to this organization</header>
		<section>
			<label class="label">
				<span>Email Address</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><Fa icon={faEnvelope} /></div>
					<input
						name="email"
						type="email"
						placeholder="Enter email address..."
						bind:value={input}
					/>
				</div>
				<InputWarning {showWarning} text="The email entered is invalid" />
			</label>
		</section>
		<footer class="flex justify-end">
			<LoadingButton
				class="btn variant-filled-primary"
				disabled={!isEmailValid}
				{loading}
				onclick={onFormSubmit}>Invite member</LoadingButton
			>
		</footer>
	</div>
{/if}
