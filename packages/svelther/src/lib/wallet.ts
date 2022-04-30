import { writable } from 'svelte/store';
import type { Readable, Writable, Subscriber, Unsubscriber } from 'svelte/store';

import type { ethers } from 'ethers';

import type Contract from './contract';
import networks from './networks.json';

interface IWalletState {
	hasWallet: boolean;
	correctChain: boolean;
	chainId: null | string;
	currentAccount: string | undefined;
}

export interface IOptions {
	forceChain?: boolean;
	pollingInterval?: number;
	reloadOnChainChage?: boolean;
}

export interface INetwork {
	chainId: string;
	blockExplorerUrls?: string[];
	chainName?: string;
	iconUrls?: string[];
	nativeCurrency?: { name: string; symbol: string; decimals: number };
	rpcUrls?: string[];
}

export default abstract class Wallet<TWallet extends ethers.providers.Provider>
	implements Readable<IWalletState>
{
	protected network: INetwork = { chainId: '0x1' };
	public abstract provider: TWallet;
	public abstract signer: ethers.Signer | undefined;

	protected state: Writable<IWalletState>;
	protected options: IOptions = {
		reloadOnChainChage: false,
		forceChain: false,
		pollingInterval: 4000
	};

	public subscribe: (
		run: Subscriber<IWalletState>,
		invalidate: (value: IWalletState | undefined) => void
	) => Unsubscriber;

	constructor(networkName: string, options: IOptions = {}) {
		this.network =
			networks.find((entry: INetwork) => entry.chainName === networkName) || this.network;

		this.options = { ...this.options, ...options };

		this.state = writable({
			hasWallet: false,
			correctChain: false,
			chainId: null,
			currentAccount: undefined
		});
		this.subscribe = this.state.subscribe; // Class "implements Svelte store" hack!
	}

	connect(): void | boolean {
		return true;
	}

	abstract changeNetwork(network: INetwork | string | 'default'): void;

	getContract<TContract extends ethers.BaseContract, TState>(
		contract: new (
			address: string,
			abi: ethers.ContractInterface,
			initialState: TState,
			provider: ethers.providers.Provider | ethers.Signer
		) => Contract<TContract, TState>,
		address: string,
		abi: ethers.ContractInterface,
		initialState: TState
	): Contract<TContract, TState> {
		return new contract(address, abi, initialState, this.provider);
	}
}
