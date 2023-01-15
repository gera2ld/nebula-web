<script lang="ts">
	export let onClose = () => {};
</script>

<div class="fixed inset-0 bg-gray-500/50" on:click={onClose}>
	<div class="t-card max-w-[640px] mx-auto mt-24 t-bg" on:click|stopPropagation>
		<slot></slot>
	</div>
</div>
