<script lang="ts">
	import { browser } from '$app/env';

	import greeter from '$lib/greeter';
	import { onDestroy, onMount } from 'svelte';

	import Header from './_header.svelte';

	let greeting: string = '';
	let value: string = '';

	onMount(async () => {
		if (browser) {
			greeting = await greeter.greet();
			$greeter.contract.on('Greet', (message: string) => (greeting = message));
		}
	});

	onDestroy(async () => {
		if (browser) $greeter.contract.removeAllListeners();
	});

	async function setGreeting() {
		try {
			if ($greeter.connected) {
				const signer = $greeter.signer;
				const txn = await $greeter.contract.connect(signer).setGreeting(value, {
					gasLimit: 300_000
				});
				console.log('Mining:', txn.hash);
				value = '';
			}
		} catch (error) {
			console.log('---', error);
		}
	}
</script>

<Header />
<div class="mainContainer">
	<div class="dataContainer">
		<div class="header">👋 Hey there!</div>

		<div class="bio">
			I am <a href="https://twitter.com/rodg_co">rodgco</a> and I'm learning to develop web3 apps, that's
			pretty cool right? Connect your Ethereum wallet and greet!
		</div>

		<div class="greeting">{greeting}</div>
		{#if $greeter.connected}
			<form on:submit|preventDefault={setGreeting}>
				<input type="text" placeholder="message" bind:value />
				<button type="submit" class="waveButton">Change Greeting!</button>
			</form>
		{:else if $greeter.active}
			<button class="waveButton" on:click={() => greeter.connect()}>Connect Wallet</button>
		{:else}
			<div class="warning">
				You need a wallet to use this app! Try <a href="https://metamask.io">Metamask</a>.
			</div>
		{/if}
	</div>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 600px;
	}

	input {
		padding: 0.5rem 0.75rem;
		margin-top: 1rem;
	}

	.mainContainer {
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 64px;
	}

	.dataContainer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 600px;
	}

	.header {
		text-align: center;
		font-size: 32px;
		font-weight: 600;
	}

	.bio {
		text-align: center;
		color: gray;
		margin-top: 16px;
	}

	.greeting {
		text-align: center;
		color: blue;
		margin-top: 16px;
		font-size: large;
		font-weight: bolder;
	}

	.warning {
		text-align: center;
		color: #cf5d00;
		background: #e0d392;
		padding: 1rem;
		margin-top: 1rem;
		border: 2px solid #cf5d00;
		border-radius: 0.25rem;
	}

	.waveButton {
		margin-top: 16px;
		padding: 8px;
		border: 0;
		border-radius: 5px;
	}
</style>
