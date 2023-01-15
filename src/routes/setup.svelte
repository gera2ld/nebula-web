<script lang="ts">
	import { loadData, setUpCA } from '@/common';

	export let value = '';

	async function handleSubmit() {
		if (!value) return;
		await setUpCA(value);
		await loadData();
	}
</script>

<form class="t-card" on:submit|preventDefault={handleSubmit}>
	<p>Please set up a CA first.</p>
	<label class="block my-2">
		<span class="text-xs">Org name:</span>
		<input bind:value placeholder="e.g. MoneyMore, Inc" />
	</label>
	<button type="submit">Set up</button>
</form>
