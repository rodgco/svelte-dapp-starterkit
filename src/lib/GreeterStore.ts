import { writable } from "svelte/store";
import { ethers, providers } from "ethers";

import type { Signer } from "ethers";

import type { Greeter } from "$types/contracts";
import type { GreeterStore } from "$types";

import { abi } from "$lib/abis/Greeter.json";

export default function (
	provider: providers.Web3Provider,
	contractAddress: string
): GreeterStore<string> {
	const greeting = "";

	const { set, update, subscribe } = writable(greeting);

	const contract = new ethers.Contract(
		contractAddress,
		abi,
		provider
	) as Greeter;

	async function init() {
		set(await contract.greet());
	}
	init();

	// Events can be monitored here..
	// contract.on('<<event_name>>', (<<list_of_event_parameters>>) => {
	//	update((current) => <<do_something>>);
	// });

	async function setGreeting(signer: Signer, message: string) {
		try {
			const signerContract = contract.connect(signer) as Greeter;

			const txn = await signerContract.setGreeting(message, {
				gasLimit: 300_000,
			});
			console.log("Mining:", txn.hash);
			await txn.wait();
			console.log("Mined:", txn.hash);

			set(message);
		} catch (error) {
			console.log(error);
		}
	}

	async function greet(): Promise<string> {
		try {
			const greeting: string = await contract.greet();
			set(greeting);
			return greeting;
		} catch (error) {
			console.log(error);
		}
	}

	return { set, update, subscribe, greet, setGreeting };
}
