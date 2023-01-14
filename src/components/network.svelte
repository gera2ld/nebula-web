<script lang="ts">
	import { pick } from 'lodash-es';
	import YAML from 'yaml';

	export let id: number;
	export let network: INebulaNetwork = {
		name: '',
		ip: '10.10.10.0/24',
		staticHostMap: {},
		hosts: []
	};
	export let editing: boolean = false;
	export let onConfirm: ((id: number, network: INebulaNetwork) => void) | null = null;
	export let onEdit = () => {};
	export let onCancel = () => {};

	let config: string;
	let error = '';
	$: fields = [
		'name',
		...id < 0 ? ['ip'] : [],
		'staticHostMap',
	];

	$: if (editing) startEditing();

	function startEditing() {
		config = YAML.stringify(pick(network, fields));
	}

	function validate(update: INebulaNetwork) {
		error = '';
		try {
			if (!update.name) throw new Error('name is required');
			if (!update.ip) throw new Error('ip is required');
		} catch (err) {
			error = `${err}`;
		}
		return !error;
	}

	function handleConfirm() {
		const data = YAML.parse(config);
		const update: INebulaNetwork = {
			...network,
			...pick(data, fields)
		};
		if (validate(update)) onConfirm?.(id, update);
	}
</script>

<div class="mb-4 t-card">
	{#if editing}
		<span class="text-xs">Edit config as YAML:</span>
		<textarea class="min-h-[8em] mt-2" bind:value={config} />
		{#if error}
			<div class="mt-2 text-red-500 dark:text-red-700">{error}</div>
		{/if}
		<div class="mt-2">
			<button on:click={handleConfirm}>Confirm</button>
			<button on:click={onCancel}>Cancel</button>
		</div>
	{:else}
		<div>{network.name}</div>
		<div>{network.ip}</div>
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
