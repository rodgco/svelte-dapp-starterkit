<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export function load({ url }: LoadInput): LoadOutput<{ url: string }> {
		return {
			props: {
				url: url.href
			}
		};
	}
</script>

<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	export let url: string = '';

	let canvas: HTMLCanvasElement;
	let wcString = `wc:8a5e5bdc-a0e4-4702-ba63-8f1a5655744f@1?bridge=${url}/bridge?key=teste`;

	onMount(() => {
		console.log(wcString);
		QRCode.toCanvas(canvas, wcString, function (error) {
			if (error) console.error(error);
			console.log('success!');
		});
	});
</script>

<canvas id="canvas" bind:this={canvas} />
