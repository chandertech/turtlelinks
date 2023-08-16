<script>
	export let rows = 4;
	export let height = 10;
	export let space = 8;
</script>

<section class="card w-full">
	<div class="p-4 space-y-{space}">
		{#each { length: rows } as _, i}
			// eslint-disable-line no-unused-vars
			{#if i % 2 === 0}
				<div class="grid grid-cols-3 gap-8">
					<div class="placeholder animate-pulse h-{height}" />
					<div class="placeholder animate-pulse h-{height}" />
					<div class="placeholder animate-pulse h-{height}" />
				</div>
			{:else}
				<div class="grid grid-cols-4 gap-4">
					<div class="placeholder animate-pulse h-{height}" />
					<div class="placeholder animate-pulse h-{height}" />
					<div class="placeholder animate-pulse h-{height}" />
					<div class="placeholder animate-pulse h-{height}" />
				</div>
			{/if}
		{/each}
	</div>
</section>
