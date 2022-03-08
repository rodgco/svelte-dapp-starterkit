<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ fetch }: LoadInput): Promise<LoadOutput<{ uri: string }>> {
		const { uri } = await fetch('/wc-backend').then(async (result) => await result.json());
		return {
			props: {
				uri
			}
		};
	}
</script>

<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	export let uri: string = '';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		console.log(uri);
		QRCode.toCanvas(canvas, uri, function (error) {
			if (error) console.error(error);
			console.log('success!');
		});
	});
</script>

<canvas id="canvas" bind:this={canvas} />
