<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';

	import { faUsers } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let input = '';

	function onFormSubmit(_event: Event): void {
		if ($modalStore[0].response) $modalStore[0].response({ name: input });
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
			</label>
		</section>
		<footer class="flex justify-end">
			<button
				type="button"
				class="btn variant-filled-primary"
				disabled={!input}
				on:click={onFormSubmit}>Create organization</button
			>
		</footer>
	</div>
{/if}
