<script lang="ts">
	import { page } from '$app/stores';
	import Host from '@/components/host.svelte';
	import Header from '@/components/header.svelte';
	import { nebulaData, signCert } from '@/common';

	const networkId = +$page.params.id;
	$: network = $nebulaData.networks[networkId];

	let editing = -2;

	function handleAdd() {
		editing = -1;
	}

	function handleEdit(id: number) {
		editing = id;
	}

	async function handleConfirm(id: number, host: INebulaHost) {
		const { crt, key } = await signCert(host.name, host.ip);
		console.log(key, crt);
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
