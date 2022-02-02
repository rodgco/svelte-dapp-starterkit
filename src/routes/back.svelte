<script context="module" lang="ts">
	export const prerender = true;

	import greeter from '$lib/greeter';
	import { onDestroy, onMount } from 'svelte';

	export async function load() {
		const greeting = await greeter.greet();
		return {
			props: {
				greeting
			}
		};
	}
</script>

<script lang="ts">
	export let greeting = '';

	onMount(async () => {
		await greeter.greet();
		$greeter.contract.on('Greet', (message: string) => (greeting = message));
	});

	onDestroy(async () => {
		$greeter.contract.removeAllListeners();
	});
</script>

<h1>{greeting}</h1>
