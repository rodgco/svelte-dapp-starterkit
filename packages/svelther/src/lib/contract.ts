import { writable } from 'svelte/store';
import type { Readable, Writable, Subscriber, Unsubscriber } from 'svelte/store';

import { ethers } from 'ethers';

export type ISignerOrProvider = ethers.Signer | ethers.providers.BaseProvider;

export default class Contract<TContract extends ethers.BaseContract, TState>
	implements Readable<TState>
{
	protected contract: TContract;
	protected address: string;
	protected abi: ethers.ContractInterface;
	protected state: Writable<TState>;

	public subscribe: (
		run: Subscriber<TState>,
		invalidate: (value: TState | undefined) => void
	) => Unsubscriber;

	constructor(
		address: string,
		abi: ethers.ContractInterface,
		initialState: TState,
		provider: ISignerOrProvider
	) {
		this.state = writable({
			...initialState
		});

		this.address = address;
		this.abi = abi;
		this.contract = <TContract>new ethers.Contract(address, abi, provider);
		this.subscribe = this.state.subscribe; // Class "implements store" hack!
	}

	connect(providerOrSigner: ISignerOrProvider) {
		this.contract = <TContract>this.contract.connect(providerOrSigner);
	}
}
