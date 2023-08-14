<script lang="ts">
	export let parent: any;

	import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { LinkInfo } from '$lib/supabase/supabase-types';

	const scheme = 'https://';

	let link = $modalStore[0].meta as LinkInfo;

	function onFormSubmit(event: Event): void {
		if ($modalStore[0].response) $modalStore[0].response('');
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="card p-8 w-modal shadow-xl space-y-8">
		<div>
			<p class="text-l">Link name</p>
			<p>{link.friendly_name}</p>
		</div>
		<div>
			<p class="text-l">Deep link</p>
			<p>{link.deep_link}</p>
		</div>
		<div class="grid grid-cols-2">
			<div>
				<p class="flex text-l">
					<Fa icon={faAndroid} class="place-self-center pr-1" />Android app
				</p>
				<p>...</p>
			</div>
			<div>
				<p class="flex text-l"><Fa class="place-self-center pr-1" icon={faApple} />Apple app</p>
				<p>...</p>
			</div>
		</div>
		<div>
			<p class="text-l">Long Dynamic Link</p>
			<p>{scheme + link.url + link.suffix + '/?link=' + link.deep_link}</p>
		</div>
		<div>
			<p class="text-l">Short Dynamic Link</p>
			<p>{scheme + link.url + '/' + link.suffix}</p>
		</div>
	</div>
{/if}
