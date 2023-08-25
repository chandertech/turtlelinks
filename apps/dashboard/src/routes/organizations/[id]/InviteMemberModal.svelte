<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';

	import { faEnvelope, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import LoadingButton from '$lib/LoadingButton.svelte';
	import { DisplayErrorToast, DisplaySuccessToast } from '$lib/Toast';

	const orgId = $modalStore[0].meta.orgId;

	let loading = false;
	let input = '';
	$: showWarning = input.length > 0 && !isEmailValid;
	$: isEmailValid = /(.+)@(.+){2,}\.(.+){2,}/.test(input);

	async function onFormSubmit(_event: Event) {
		loading = true;
		const inviteResponse = await fetch('/api/invite-member', {
			method: 'POST',
			body: JSON.stringify({ id: orgId, email: input })
		});
		loading = false;

		if (!inviteResponse.ok) {
			DisplayErrorToast();
			return;
		}

		if ($modalStore[0].response) $modalStore[0].response({ success: true });
		modalStore.close();
		DisplaySuccessToast(`${input} has been invited to the organization.`);
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
				{#if showWarning}
					<span class="flex text-xs text-red-500"
						><Fa class="place-self-center pr-1" icon={faExclamationCircle} />The email entered is
						invalid</span
					>
				{/if}
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
