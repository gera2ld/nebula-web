<script lang="ts">
	import { pick } from 'lodash-es';
	import YAML from 'yaml';

	export let id: number;
	export let host: INebulaHost = {
		type: 'host',
		name: '',
		ip: '10.10.10.2/24',
		relay: false,
		publicIp: ''
	};
	export let editing: boolean = false;
	export let onConfirm: ((id: number, network: INebulaHost) => void) | null = null;
	export let onEdit = () => {};
	export let onCancel = () => {};

	let config: string;
	let error = '';
	$: fields = [
		'type',
		'name',
		'ip',
		'relay',
		'publicIp',
	];

	$: if (editing) startEditing();

	function startEditing() {
		config = YAML.stringify(pick(host, fields));
	}

	function validate(update: INebulaHost) {
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
		const update: INebulaHost = {
			...host,
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
		<div>[{host.type}] IP: {host.ip}</div>
		<div>Name: {host.name}</div>
		<button on:click={onEdit}>Edit</button>
		<button>Delete</button>
	{/if}
</div>
