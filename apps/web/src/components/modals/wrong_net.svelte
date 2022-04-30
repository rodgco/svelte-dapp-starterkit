<script lang="ts">
	import Modal from './modal.svelte';
</script>

<Modal id="wrong" showClose={false}>
	<svelte:fragment slot="header">Wrong Network</svelte:fragment>
	<svelte:fragment slot="content">
		<p>Please change your network to Polygon.</p>
	</svelte:fragment>
</Modal>
