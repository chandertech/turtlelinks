<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';

	import { faEnvelope, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let input = '';
	$: showWarning = input.length > 0 && !isEmailValid;
	$: isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

	function onFormSubmit(_event: Event): void {
		if ($modalStore[0].response) $modalStore[0].response({ email: input });
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
						invalid.</span
					>
				{/if}
			</label>
		</section>
		<footer class="flex justify-end">
			<button
				type="button"
				class="btn variant-filled-primary"
				disabled={!isEmailValid}
				on:click={onFormSubmit}>Invite member</button
			>
		</footer>
	</div>
{/if}
