<script lang="ts">
	import Header from '$components/header.svelte';
	import Footer from '$components/footer.svelte';
</script>

<div id="fauxBody">
	<Header />
	<main>
		<slot />
	</main>

	<Footer />
</div>

<style>
	@media screen {
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
	}
</style>
