<script lang="ts">
	export let data;
	export let form;
</script>

<div class="mx-auto container p-8">
	<h1 class="h1 capitalize mb-4">{data.organization.name}'s organization</h1>
	<div class="card container content-center p-8">
		<h2 class="text-2xl font-medium">User</h2>
		<hr class="!border-t-8 mt-2 mb-4" />
		{#each data.members as member}
			<div>
				{#if member.name}
					<p class="font-medium">{member.name}</p>
				{/if}
				<p class="text-slate-400">{member.email}</p>
			</div>
			<hr class="my-4" />
		{/each}
		<!-- <form method="POST">
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
		</form> -->
		<div>
			<p>{data.members.length == 1 ? '1 User' : `${data.members.length} Users`}</p>
		</div>
	</div>
</div>
