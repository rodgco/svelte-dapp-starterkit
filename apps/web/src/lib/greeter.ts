import { Contract } from 'svelther';
import type { ISignerOrProvider } from 'svelther';

import type { Greeter } from 'greeter';
import type { ethers } from 'ethers';
// import abi from 'greeter/abi/Greeter.json';

// const contractAddress = <string>import.meta.env.VITE_CONTRACT_ADDRESS;

export interface IGreet {
	greet: string;
}

export default class GreeterContract extends Contract<Greeter, IGreet> {
	constructor(
		address: string,
		abi: ethers.ContractInterface,
		initialState: IGreet,
		provider: ISignerOrProvider
	) {
		super(address, abi, initialState, provider);

		this.contract.on('Greet', (greet: string) =>
			this.state.update((current) => ({ ...current, greet }))
		);
	}

	async greet() {
		const greet = await this.contract.greet();
		this.state.update((current) => ({ ...current, greet }));

		return greet;
	}

	setGreeting(message: string, signer: ethers.Signer): void {
		signer ||= this.contract.signer;
		this.contract
			.connect(signer)
			.setGreeting(message, {
				gasLimit: 300_000
			})
			.then((txn) => {
				console.log('Mining:', txn.hash);
			});
	}
}
