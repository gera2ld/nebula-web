<script lang="ts">
	export let id: number;
	export let network: INebulaNetwork;
	export let editing: boolean = false;
	export let onConfirm: ((id: number, network: INebulaNetwork) => void) | null = null;
	export let onEdit = () => {};
	export let onCancel = () => {};

	let values: INebulaNetwork;
	let error = '';

	$: if (editing) startEditing();
	$: staticHostsNumber = network.hosts.filter(host => host.publicIpPort).length;

	function startEditing() {
		values = { ...network };
	}

	function validate(update: INebulaNetwork) {
		error = '';
		try {
			if (!update.name) throw new Error('name is required');
			if (!/^\d+\.\d+\.\d+\.\d+\/\d+$/.test(update.ipRange)) throw new Error('Invalid IP range');
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
			<span>Name:</span>
			<input bind:value={values.name} />
		</label>
		<label class="mb-2">
			<span>IP range:</span>
			<input bind:value={values.ipRange} />
		</label>
		{#if error}
			<div class="mt-2 text-red-500 dark:text-red-700">{error}</div>
		{/if}
		<div class="mt-2">
			<button on:click={handleConfirm}>Confirm</button>
			<button on:click={onCancel}>Cancel</button>
		</div>
	{:else}
		<div>{network.name}</div>
		<div>{network.ipRange} ({staticHostsNumber} static hosts)</div>
		<div class="flex">
			<div class="flex-1">
				<a href="/networks/{id}">{network.hosts.length} hosts</a>
			</div>
			<div>
				<button on:click={onEdit}>Edit</button>
				<button>Delete</button>
			</div>
		</div>
	{/if}
</div>
