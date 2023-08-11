<!-- TODO: Can we generate this via supabase? -->
<script lang="ts" context="module">
	export interface URLInfo {
		url: string;
		id: string;
		subdomain: string;
		domain: string;
	}

	export interface LinkInfo {
		link: string;
		url: string;
		suffix: string;
		deep_link: string;
		friendly_name: string;
		is_archived: boolean;
	}
</script>
