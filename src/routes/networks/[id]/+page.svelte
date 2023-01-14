<script lang="ts">
	import YAML from 'yaml';
	import { page } from '$app/stores';
	import Host from '@/components/host.svelte';
	import Header from '@/components/header.svelte';
	import { nebulaData, signCert } from '@/common';
	import { getHostConfig, getLighthouseConfig } from '@/common/config';

	const networkId = +$page.params.id;
	let result: {
		config: string;
		ca: string;
		crt: string;
		key: string;
	} | null = null;

	$: network = $nebulaData.networks[networkId];

	let editing = -2;

	function handleAdd() {
		editing = -1;
	}

	function handleEdit(id: number) {
		editing = id;
	}

	function getConfig(host: INebulaHost) {
		if (host.type === 'lighthouse') {
			return getLighthouseConfig();
		}
		const lighthouses = network.hosts.filter(host => host.type === 'lighthouse');
		const lighthouseHosts = lighthouses.map(host => host.ip);
		const staticHostMap = lighthouses.reduce((prev, host) => {
			if (host.publicIp) {
				prev[host.ip] = [host.publicIp];
			}
			return prev;
			}, {} as Record<string, string[]>);
		const relays = Object.values(staticHostMap).flat();
		return getHostConfig({
			staticHostMap,
			lighthouseHosts,
			relays,
		});
	}

	async function handleConfirm(id: number, host: INebulaHost) {
		const { crt, key } = await signCert(host.name, host.ip);
		result = {
			config: YAML.stringify(getConfig(host)),
			ca: $nebulaData.ca!.crt,
			crt,
			key,
		};
		nebulaData.update((data) => {
			const hosts = [...network.hosts];
			if (id < 0) {
				hosts.push(host);
			} else {
				hosts[id] = host;
			}
			const networks = [...data.networks];
			networks[networkId] = {
				...network,
				hosts
			};
			editing = -2;
			return {
				...data,
				networks
			};
		});
	}

	function handleCancel() {
		editing = -2;
	}
</script>

{#if network}
	<div class="mx-auto max-w-[640px]">
		<Header>
			<svelte:fragment slot="breadcrumb">
				<div>
					<div class="inline-block">
						<div class="text-xs">Network:</div>
						<div>{network.name} ({network.ip})</div>
					</div>
				</div>
				<div>Hosts</div>
			</svelte:fragment>
			<div class="mt-4">
				<button on:click={handleAdd}>Add host</button>
			</div>
		</Header>
		{#if editing === -1}
			<Host id={-1} editing onConfirm={handleConfirm} onCancel={handleCancel} />
		{/if}
		{#each network.hosts as host, id}
			<Host
				{host}
				{id}
				editing={id === editing}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				onEdit={() => handleEdit(id)}
			/>
		{/each}
	</div>
{/if}
