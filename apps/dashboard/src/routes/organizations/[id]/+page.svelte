<script lang="ts">
	export let data;
	export let form;
</script>

<div class="p-4">
	<h1 class="h1 py-2">{data.organization.name}</h1>
	<h2 class="py-2">Members</h2>
	<div class="card container content-center my-2 max-w-lg p-2">
		{#each data.members as member}
			<ul class="list">
				<li>
					<span class="flex-auto">{member.name ?? 'No Name'}</span>
					<span class="flex-auto">{member.email}</span>
				</li>
			</ul>
		{/each}
		<hr class="my-4" />
		<form method="POST">
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">Add Member</div>
				<input name="email" type="email" placeholder="Email..." />
				<button class="variant-filled-secondary">Submit</button>
			</div>
			{#if form?.success}
				<p class="p-2">Invited member</p>
			{/if}
			{#if form?.error}
				<p class="p-2">{form?.error}</p>
			{/if}
		</form>
	</div>
</div>
