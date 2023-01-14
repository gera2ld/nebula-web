<script lang="ts">
	import { loading, nebulaData } from '@/common';
	import Network from '@/components/network.svelte';
	import Header from '@/components/header.svelte';
	import Setup from './setup.svelte';

	let editing = -2;

	function handleAdd() {
		editing = -1;
	}

	function handleEdit(id: number) {
		editing = id;
	}

	function handleConfirm(id: number, network: INebulaNetwork) {
		nebulaData.update((data) => {
			const networks = [...data.networks];
			if (id < 0) {
				networks.push(network);
			} else {
				networks[id] = network;
			}
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

{#await loading then}
	<div class="mx-auto max-w-[640px]">
		<Header>
			<svelte:fragment slot="breadcrumb">
				<div>Networks</div>
			</svelte:fragment>
			<div class="mt-4">
				<button on:click={handleAdd}>Add network</button>
			</div>
		</Header>
		{#if !$nebulaData.ca}
			<Setup />
		{:else}
			{#if editing === -1}
				<Network id={-1} editing onConfirm={handleConfirm} onCancel={handleCancel} />
			{/if}
			{#each $nebulaData.networks as network, id}
				<Network
					{network}
					{id}
					editing={id === editing}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
					onEdit={() => handleEdit(id)}
				/>
			{/each}
		{/if}
	</div>
{/await}
