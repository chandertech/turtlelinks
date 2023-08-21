<script lang="ts">
	export let organizations: {
		id: number;
		name: string;
	}[];
</script>

<div class="card container content-center my-2 max-w-lg p-2">
	{#each organizations as organization}
		<ul class="list">
			<li>
				<span class="flex-auto">{organization.name}</span>
				<a href="/organizations/{organization.id}" class="btn variant-ghost-primary">Manage</a>
			</li>
		</ul>
	{/each}
</div>
