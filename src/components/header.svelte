<script lang="ts">
	import { nebulaData } from '@/common';
	import Modal from './modal.svelte';
	import QrcodeContent from './qrcode-content.svelte';

	let showCA = false;
	let mode: 'content' | 'qrcode' = 'content';
</script>

<header class="sticky top-0 py-4 bg-inherit">
	<nav class="flex items-end">
		<h1 class="text-3xl"><a href="/">Nebula Easy</a></h1>
		<slot name="breadcrumb" />
	</nav>
	{#if $nebulaData.ca?.crt}
		<div>
			Org: {$nebulaData.ca.name}
			<button class="ml-2" on:click={() => { showCA = true; }}>Show CA</button>
		</div>
	{/if}
	<slot />
</header>

{#if showCA && $nebulaData.ca?.crt}
<Modal onClose={() => { showCA = false; }}>
		<QrcodeContent bind:mode content={$nebulaData.ca.crt} />
</Modal>
{/if}
