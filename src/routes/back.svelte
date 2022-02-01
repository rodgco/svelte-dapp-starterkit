<script context="module">
	export const hydrate = false;
	import { ethers } from 'ethers';

	const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
	import { abi } from '$artifacts/contracts/Greeter.sol/Greeter.json';

	export async function load() {
		const provider = new ethers.providers.JsonRpcProvider(
			'https://matic-mumbai.chainstacklabs.com',
			80001
		);
		const contract = new ethers.Contract(contractAddress, abi, provider);
		const greeting = await contract.greet();
		return {
			props: {
				greeting
			}
		};
	}
</script>

<script>
	export let greeting = '';
</script>

<h1>{greeting}</h1>
