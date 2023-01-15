<script lang="ts">
	import { qrcanvas } from 'qrcanvas';

	export let mode: 'content' | 'qrcode' = 'content';
	export let content: string;

	let canvas: HTMLCanvasElement;

	$: if (mode === 'qrcode' && content && canvas) {
		qrcanvas({
			canvas,
			cellSize: 4,
			padding: 4,
			data: content
		});
	}
</script>

<div class="text-right">
	<svelte:element
		this={mode === 'content' ? 'span' : 'a'}
		on:click|preventDefault={() => {
			mode = 'content';
		}}
	>
		Content
	</svelte:element>
	|
	<svelte:element
		this={mode === 'qrcode' ? 'span' : 'a'}
		on:click|preventDefault={() => {
			mode = 'qrcode';
		}}
	>
		QRCode
	</svelte:element>
</div>
{#if mode === 'content'}
	<pre class="flex-1 overflow-auto">{content}</pre>
{:else}
	<div class="flex-1">
		<canvas class="w-72 h-72 dark:brightness-50" bind:this={canvas} />
	</div>
{/if}
