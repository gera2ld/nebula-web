<script lang="ts">
	import { loading } from '@/common';
</script>

{#await loading}
	Loading...
{:then}
	<slot />
{/await}
