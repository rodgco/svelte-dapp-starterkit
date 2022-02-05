import Contract from '$lib/contract';
import type { Greeter } from '$types/contracts';

const network = <string>import.meta.env.VITE_NETWORK_NAME;
const contractAddress = <string>import.meta.env.VITE_CONTRACT_ADDRESS;
import { abi } from '$artifacts/contracts/Greeter.sol/Greeter.json';

import type { ethers } from 'ethers';

interface IGreet {
	greet: string;
}

class GreeterContract extends Contract<Greeter, IGreet> {
	constructor(network: string, address: string, abi: ethers.ContractInterface) {
		super(network, address, abi, { greet: '' }, { forceChain: true });

		this.contract.on('Greet', (greet: string) =>
			this.state.update((current) => ({ ...current, greet }))
		);
	}

	async greet() {
		const greet = await this.contract.greet();
		this.state.update((current) => ({ ...current, greet }));

		return greet;
	}

	setGreeting(message: string): void {
		const signer = (<ethers.providers.JsonRpcProvider>this.provider).getSigner();
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

const greeter = new GreeterContract(network, contractAddress, abi);

export default greeter;
