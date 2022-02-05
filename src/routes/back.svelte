<script lang="ts">
	import greeter from '$lib/greeter';
	import { onMount } from 'svelte';

	onMount(async () => {
		await greeter.greet();
	});
</script>

{#if $greeter.isWeb3 && !$greeter.currentAccount}
	<button on:click={greeter.connect}>Connect</button>
{/if}
<h1>{$greeter.greet}</h1>
<h2>{$greeter.chainId} - {$greeter.currentAccount}</h2>
{#if $greeter.isWeb3}
	<button on:click={() => greeter.setGreeting('Greatest!!!')}>Greatest!!!</button>
{/if}
