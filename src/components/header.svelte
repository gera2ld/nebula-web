<script lang="ts">
	import { nebulaData } from '@/common';
</script>

<header class="sticky top-0 py-4 bg-inherit">
	<nav class="flex items-end">
		<h1 class="text-3xl"><a href="/">Nebula Easy</a></h1>
		<slot name="breadcrumb" />
	</nav>
	{#if $nebulaData.ca}
		<div>Org: {$nebulaData.ca.name}</div>
	{/if}
	<slot />
</header>
