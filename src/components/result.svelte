<script lang="ts">
	import Modal from './modal.svelte';
	import QrcodeContent from './qrcode-content.svelte';

	export let onClose = () => {};
	export let data: {
		name: string;
		config: string;
		ca: string;
		crt: string;
		key?: string;
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
		...(data.key
			? [
					{
						name: 'host.key',
						content: data.key
					}
			  ]
			: [])
	];

	let active = -1;
	let mode: 'content' | 'qrcode' = 'content';
	let downloading = false;

	$: content = entries[active]?.content;

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
			a.download = `nebula-${data.name}.tar.gz`;
			a.click();
			setTimeout(() => {
				URL.revokeObjectURL(url);
			}, 2000);
		} finally {
			downloading = false;
		}
	}
</script>

<Modal {onClose}>
	<p>Host <strong>{data.name}</strong> created and signed.</p>
	<p>Please download or copy your keys. They won't be stored and displayed again.</p>
	{#if downloading}
		<span>Downloading...</span>
	{:else}
		<button on:click|preventDefault={handleDownload}>Download as a tarball</button>
	{/if}
	<div class="t-card flex items-stretch max-h-[60vh] my-2">
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
				<span class="text-gray-400 dark:text-gray-500"
					>Select a file on the left and view its content.</span
				>
			{:else}
				<QrcodeContent bind:mode {content} />
			{/if}
		</div>
	</div>
</Modal>
