<script lang="ts">
	import WalletConnectProvider from '@walletconnect/web3-provider';
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { ethers } from 'ethers';

	let canvas: HTMLCanvasElement;
	let uri = writable('xxx');

	// Establish connection
	/* try { */
	const connector = new WalletConnectProvider({
		rpc: {
			80001: 'https://matic-mumbai.chainstacklabs.com'
		}
		// bridge: 'https://svelte-dapp-starterkit.vercel.app/eip1328/bridge'
	});
	/* } catch (error) { */
	/* 	console.log(error); */
	/* } */

	// Check if connection is established
	if (!connector.connected) {
		// Create a dialogue
		connector.enable();
	}

	connector.on('display_uri', function (error, payload) {
		if (error) throw error;
		uri.set(payload.params[0]);
	});

	// Subscribe to connection events
	connector.on('connect', (error, payload) => {
		if (error) {
			throw error;
		}
		// After the connection is successful, the wallet account and chain ID will be returned
		const { accounts, chainId } = payload.params[0];
		console.log('On Connect.\nAccounts:', accounts, '\nChain', chainId);
	});

	/* connector.on('session_update', (error, payload) => { */
	/* 	if (error) { */
	/* 		throw error; */
	/* 	} */
	/* 	const { accounts, chainId } = payload.params[0]; */
	/* 	console.log('On Connect.\nAccounts:', accounts, '\nChain', chainId); */
	/* }); */

	/* connector.on('disconnect', (error, _payload) => { */
	/* 	if (error) { */
	/* 		throw error; */
	/* 	} */
	/* }); */

	// For the calling method, please refer to: https://docs.walletconnect.com/1.0/client-api
	// Example of how to send a transaction
	/* $: if (connector.connected) */
	/* 	connector */
	/* 		.sendTransaction({ */
	/* 			data: '0x', */
	/* 			from: '0xc115ceadf9e5923330e5f42903fe7f926dda65d2', */
	/* 			gasLimit: '0x5208', */
	/* 			gasPrice: '0x746a528800', */
	/* 			nonce: '0x12', */
	/* 			to: '0xc115ceadf9e5923330e5f42903fe7f926dda65d2', */
	/* 			value: '0x00' */
	/* 		}) */
	/* 		.then((txHash) => { */
	/* 			// hash If the transaction is sent successfully, the wallet will return the transaction hash */
	/* 			console.log('txHash: ', txHash); */
	/* 		}); */

	onMount(() => {
		console.log('Mount URI', $uri);
		QRCode.toCanvas(canvas, $uri, function (error) {
			if (error) console.error(error);
			console.log('success!');
		});
	});
</script>

<h1>Teste</h1>
<p>{$uri}</p>
<canvas id="canvas" bind:this={canvas} />
