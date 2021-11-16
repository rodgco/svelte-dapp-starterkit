<script lang="ts">
	import { onMount } from 'svelte';
	import { ethers, providers } from 'ethers';

	import greeterStore from '$lib/GreeterStore';
	import type { GreeterStore } from '$types';

	const contractAddress = <string>import.meta.env.VITE_CONTRACT_ADDRESS;

	let ethereum: providers.ExternalProvider;
	let provider: providers.Web3Provider;

	let greeter: GreeterStore<string>;

	let connected: boolean = false;

	let value: string = '';

	onMount(async () => {
		/*
		 * First make sure we have access to window.ethereum
		 */
		try {
			({ ethereum } = <EthereumWindow>(<unknown>window));
			if (!ethereum) return;

			provider = new ethers.providers.Web3Provider(ethereum);
			greeter = greeterStore(provider, contractAddress);

			/*
			 * Check if we're authorized to access the user's wallet
			 */
			const accounts = await ethereum.request({ method: 'eth_accounts' });
			if (accounts.length !== 0) {
				connected = true;
			} else {
				console.log('No authorized account found');
			}
		} catch (error) {
			console.log(error);
		}
	});

	async function connectWallet() {
		try {
			if (!ethereum) return;

			await ethereum.request({ method: 'eth_requestAccounts' });
			connected = true;
		} catch (error) {
			console.log(error);
		}
	}

	async function greet() {
		try {
			if (ethereum) {
				greeter.greet();
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log('---', error.message);
		}
	}

	async function setGreeting() {
		try {
			if (ethereum) {
				const signer = provider.getSigner();

				greeter.setGreeting(signer, value);
				value = '';
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log('---', error.message);
		}
	}
</script>

<Foo msg="We're Live" />
<div class="mainContainer">
	<div class="dataContainer">
		<div class="header">👋 Hey there!</div>

		<div class="bio">
			I am <a href="https://twitter.com/rodg_co">rodgco</a> and I'm learning to develop web3 apps, that's
			pretty cool right? Connect your Ethereum wallet and greet!
		</div>

		{#if !ethereum}
			<div class="warning">
				You need a wallet to use this app! Try <a href="https://metamask.io">Metamask</a>.
			</div>
		{:else}
			<div class="bio">{$greeter}</div>

			{#if connected}
				<form on:submit|preventDefault={setGreeting}>
					<input type="text" placeholder="message" bind:value />
					<button type="submit" class="waveButton">Change Greeting!</button>
				</form>
			{:else}
				<button class="waveButton" on:click={connectWallet}>Connect Wallet</button>
			{/if}
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
