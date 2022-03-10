<script lang="ts">
	import Header from './components/_Header.svelte';
	import Footer from './components/_Footer.svelte';
</script>

<div id="fauxBody">
	<Header />
	<main>
		<slot />
	</main>

	<Footer />
</div>

<style>
	#fauxBody {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: auto;
		background: var(--color-main-bg);
		color: var(--color-flowText);
	}
	main {
		background-color: var(--color-modal-bg);
	}
</style>
