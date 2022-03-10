<script lang="ts">
	import Header from './_components/header.svelte';
	import Footer from './_components/footer.svelte';
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
