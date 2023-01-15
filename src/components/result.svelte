<script lang="ts">
	import { qrcanvas } from 'qrcanvas';

	export let onClose = () => {};
	export let data: {
		config: string;
		ca: string;
		crt: string;
		key: string;
	};

	const entries = [
		{
			name: 'config.yml',
			content: data.config
		},
		{
			name: 'ca.crt',
			content: data.ca
		},
		{
			name: 'host.crt',
			content: data.crt
		},
		{
			name: 'host.key',
			content: data.key
		}
	];

	let active = -1;
	let mode: 'content' | 'qrcode' = 'content';
	let downloading = false;
	let canvas: HTMLCanvasElement;

	$: content = entries[active]?.content;
	$: if (mode === 'qrcode' && content && canvas) {
		qrcanvas({
			canvas,
			cellSize: 4,
			data: content
		});
	}

	async function handleDownload() {
		downloading = true;
		try {
			const [pako, { TarWriter }] = await Promise.all([import('pako'), import('@gera2ld/tarjs')]);
			const writer = new TarWriter();
			entries.forEach(({ name, content }) => {
				writer.addFile(name, content);
			});
			const blob = await writer.write();
			const buffer = await blob.arrayBuffer();
			const output = pako.gzip(buffer);
			const tgz = new Blob([output]);
			const url = URL.createObjectURL(tgz);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'nebula-config.tar.gz';
			a.click();
			setTimeout(() => {
				URL.revokeObjectURL(url);
			}, 2000);
		} finally {
			downloading = false;
		}
	}
</script>

<div class="fixed inset-0 bg-gray-600/50" on:click={onClose}>
	<div class="t-card max-w-[640px] mx-auto mt-24 bg-white" on:click|stopPropagation>
		<p>Please download or copy your keys. They won't be stored and displayed again.</p>
		{#if downloading}
			<span>Downloading...</span>
		{:else}
			<button on:click|preventDefault={handleDownload}>Download as a tarball</button>
		{/if}
		<div class="t-card flex items-stretch max-h-[80vh]">
			<div class="pr-2 border-r border-gray-400">
				<ul>
					{#each entries as entry, idx}
						<li>
							{#if active === idx}
								<span>{entry.name}</span>
							{:else}
								<a
									on:click|preventDefault={() => {
										active = idx;
									}}
								>
									{entry.name}
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
			<div class="flex-1 min-w-0 px-2 flex flex-col">
				{#if active < 0}
					<span class="text-gray-400">Select a file on the left and view its content.</span>
				{:else}
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
							<canvas class="w-72 h-72" bind:this={canvas} />
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>
