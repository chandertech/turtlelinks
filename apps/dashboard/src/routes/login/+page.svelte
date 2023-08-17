<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class="flex items-center justify-center p-8">
	<div class="card mx-auto container p-8 w-96">
		<Auth
			supabaseClient={data.supabase}
			view="magic_link"
			redirectTo={`${data.url}/auth/callback`}
			showLinks={false}
			additionalData={undefined}
			appearance={{
				theme: ThemeSupa,
				className: {
					input: 'input',
					label: 'label'
				},
				style: {
					label: 'color: white; font-size: 16px;',
					input: 'color: white;'
				},
				variables: {
					default: {
						colors: {
							brand: '#0d9cde',
							brandAccent: '#0c8cc8',
							inputBorderFocus: '#0d9cde'
						}
					}
				}
			}}
		/>
	</div>
</div>
