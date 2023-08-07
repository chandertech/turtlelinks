<script lang="ts">
	export let parent: any;

	import { modalStore } from '@skeletonlabs/skeleton';

	const formData = {
		linkname: '',
		subdomain: '',
		description: ''
	};

	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>Create a new link</header>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Link Name</span>
				<input
					class="input"
					type="text"
					bind:value={formData.linkname}
					placeholder="My awesome link"
				/>
			</label>
			<label class="label">
				<span>Subdomain</span>
				<div class="input-group input-group-divider grid-cols-[450px_minmax(900px,_1fr)_100px]">
					<input type="search" bind:value={formData.subdomain} placeholder="subdomain" />
					<div class="input-group-shim">[todo.com]</div>
				</div>
			</label>
			<label class="label">
				<span>Descrption</span>
				<textarea
					class="textarea"
					rows="4"
					bind:value={formData.description}
					placeholder="Description about my link..."
				/>
			</label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Create Link</button>
    </footer>
	</div>
{/if}
