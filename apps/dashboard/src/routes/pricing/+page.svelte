<script lang="ts">
	import { faCircleCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	interface PriceData {
		name: string;
		cost: string;
		description: string;
		features: string[];
	}

	const pricingPlan: PriceData[] = [
		{
			name: 'Hobby',
			cost: '$0',
			description: 'Start your next side project',
			features: ['First example feature', 'Second example feature']
		},
		{
			name: 'Pro',
			cost: '$20',
			description: 'Everything in Hobby, plus extra!',
			features: ['First example feature', 'Second example feature']
		},
		{
			name: 'Enterprise',
			cost: 'Custom',
			description: '...',
			features: ['First example feature', 'Second example feature']
		}
	];
</script>

<svelte:head>
	<title>Pricing</title>
</svelte:head>

<div class="flex flex-col items-center justify-center p-8">
	<div class="flex flex-col gap-3 py-24 text-center">
		<p class="font-bold text-5xl">Find a plan to power your links</p>
		<p class="text-slate-300 text-xl">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ullamcorper arcu ut arcu
			ultricies venenatis. Sed ac nibh vitae eros scelerisque feugiat.
		</p>
	</div>
	<div class="grid gap-4 md:grid-cols-3 lg:px-24 w-full">
		{#each pricingPlan as plan}
			<div class="card container p-8">
				<div class="flex flex-col gap-1 pb-10">
					<p class="font-medium text-xl">{plan.name}</p>
					<p class="font-bold text-3xl">{plan.cost}</p>
					<p class="text-slate-400">{plan.description}</p>
				</div>
				<div class="flex flex-col gap-2 pb-10">
					{#each plan.features as feature}
						<p class="flex gap-1">
							<Fa class="place-self-center" icon={faCircleCheck} />
							<span class="text-slate-300">{feature}</span>
						</p>
					{/each}
				</div>
				<a href="/pricing" class="text-xl"
					><button type="button" class="btn variant-filled-surface w-full flex justify-start">
						<span class="flex-grow text-start">Get started</span>
						<Fa icon={faArrowRight} />
					</button></a
				>
			</div>
		{/each}
	</div>
</div>
