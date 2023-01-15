<script lang="ts">
	export let id: number;
	export let host: INebulaHost;
	export let editing: boolean = false;
	export let onConfirm: ((id: number, network: INebulaHost & { pub: string }) => void) | null =
		null;
	export let onEdit = () => {};
	export let onCancel = () => {};

	let values: INebulaHost & { pub: string };
	let error = '';

	$: if (editing) startEditing();

	function startEditing() {
		values = { ...host, pub: '' };
	}

	function validate(update: INebulaHost) {
		error = '';
		try {
			if (!update.name) throw new Error('name is required');
			if (!/^\d+\.\d+\.\d+\.\d+$/.test(update.ip)) throw new Error('Invalid IP');
			if (update.publicIpPort && !/^\d+\.\d+\.\d+\.\d+:\d+$/.test(update.publicIpPort)) throw new Error('Invalid public IP');
		} catch (err) {
			error = `${err}`;
		}
		return !error;
	}

	function handleConfirm() {
		if (validate(values)) onConfirm?.(id, values);
	}
</script>

<div class="mb-4 t-card">
	{#if editing}
		<label class="mb-2">
			<span>Type:</span>
			<select bind:value={values.type}>
				<option value="host">Host</option>
				<option value="lighthouse">Lighthouse</option>
			</select>
		</label>
		<label class="mb-2">
			<span>Name: (usually a host name)</span>
			<input bind:value={values.name} />
		</label>
		<label class="mb-2">
			<span>IP:</span>
			<input bind:value={values.ip} />
		</label>
		<label class="mb-2">
			<span>Public IP and port: (optional)</span>
			<input bind:value={values.publicIpPort} />
		</label>
		<label class="mb-2">
			<span>Relay:</span>
			<input type="checkbox" bind:checked={values.relay} />
		</label>
		<label class="mb-2">
			<span>Use an existing public key: (optional)</span>
			<textarea class="min-h-[4em] mb-2" bind:value={values.pub} />
		</label>
		{#if error}
			<div class="mb-2 text-red-500 dark:text-red-700">{error}</div>
		{/if}
		<div class="text-right">
			<button on:click={handleConfirm}>Confirm and Sign</button>
			<button on:click={onCancel}>Cancel</button>
		</div>
	{:else}
		<div>[{host.type}] IP: {host.ip} {host.publicIpPort ? `(Public IP: ${host.publicIpPort})` : ''}</div>
		<div>Name: {host.name}</div>
		<div class="text-right">
			<button on:click={onEdit}>Edit</button>
			<button>Delete</button>
		</div>
	{/if}
</div>
