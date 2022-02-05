import { ethers } from 'ethers';

import { browser } from '$app/env';
import { writable, get } from 'svelte/store';
import type { Readable, Writable, Subscriber, Unsubscriber } from 'svelte/store';

import networks from '$lib/networks.json';

interface IContractState {
	isWeb3: boolean;
	connected: boolean;
	chainId: string;
	currentAccount: string;
	onCorrectChain: boolean;
}

interface IOptions {
	forceChain?: boolean;
	pollingInterval?: number;
}

interface INetwork {
	chainId: string;
	blockExplorerUrls?: string[];
	chainName?: string;
	iconUrls?: string[];
	nativeCurrency?: { name: string; symbol: string; decimals: number };
	rpcUrls?: string[];
}

export default class Contract<TContract extends ethers.BaseContract, TState>
	implements Readable<TState & IContractState>
{
	protected network: INetwork;
	protected provider: ethers.providers.JsonRpcProvider;
	protected signer: ethers.Signer;
	protected contract: TContract;

	protected state: Writable<TState & IContractState>;
	protected options: IOptions = {};

	public subscribe: (
		run: Subscriber<TState & IContractState>,
		invalidate: (value: TState & IContractState) => void
	) => Unsubscriber;

	constructor(
		networkName: string,
		address: string,
		abi: ethers.ContractInterface,
		initialState: TState,
		options: IOptions = {}
	) {
		const handleChainChanged = (chainId: string): void => {
			this.state.update((current) => ({
				...current,
				chainId,
				connected: chainId === this.network.chainId
			}));
			console.log('Chain ID changed:', chainId);
		};

		const handleAccountsChanged = (accounts: string[]): void => {
			if (accounts.length === 0) {
				console.log('Plase connect to an account.');
			} else if (accounts[0] !== get(this.state).currentAccount) {
				this.state.update((current) => ({ ...current, currentAccount: accounts[0] }));
				console.log('Connected to account:', accounts[0]);
			}
		};

		this.network = networks.find((entry: any) => entry.chainName === networkName);

		this.options = options;

		/**
		 *         _
		 *     ___| |_ ___  _ __ ___
		 *    / __| __/ _ \| '__/ _ \
		 *    \__ \ || (_) | | |  __/
		 *    |___/\__\___/|_|  \___|
		 *
		 */
		this.state = writable({
			...initialState,
			isWeb3: false,
			connected: false,
			chainId: null,
			currentAccount: null,
			onCorrectChain: false
		});
		this.subscribe = this.state.subscribe; // Class "implements store" hack!

		/**
		 *   ____                 _     _
		 *  |  _ \ _ __ _____   _(_) __| | ___ _ __ ___
		 *  | |_) | '__/ _ \ \ / / |/ _` |/ _ \ '__/ __|
		 *  |  __/| | | (_) \ V /| | (_| |  __/ |  \__ \
		 *  |_|   |_|  \___/ \_/ |_|\__,_|\___|_|  |___/
		 *
		 */
		if (browser && window.ethereum) {
			this.state.update((current) => ({ ...current, isWeb3: true }));
			this.provider = new ethers.providers.Web3Provider(
				window.ethereum,
				options.forceChain ? parseInt(this.network.chainId, 16) : null
			);
			this.signer = this.provider.getSigner();

			window.ethereum.request({ method: 'eth_chainId' }).then((id: string) => {
				handleChainChanged(id);
			});
			window.ethereum.on('chainChanged', handleChainChanged);

			window.ethereum
				.request({ method: 'eth_accounts' })
				.then((accounts: string[]) => handleAccountsChanged(accounts));
			window.ethereum.on('accountsChanged', handleAccountsChanged);
		} else {
			this.provider = <ethers.providers.JsonRpcProvider>(
				ethers.getDefaultProvider(this.network.rpcUrls[0])
			);
			handleChainChanged(this.network.chainId);
		}

		this.provider.pollingInterval = options.pollingInterval || 4000;

		/**
		 * Initialize Contract
		 */
		this.contract = <TContract>new ethers.Contract(address, abi, this.provider);
	}

	connect() {
		if (window.ethereum) {
			window.ethereum
				.request({ method: 'eth_requestAccounts' })
				// .then(handleAccountsChanged)
				.catch((err: { code: number; message: string }) => {
					if (err.code === 4001) {
						console.log('Please connect to an account');
					} else {
						console.error(err);
					}
				});
		}
	}

	async changeNetwork(network: INetwork | string) {
		try {
			if (!browser && !window.ethereum) throw new Error('No crypto wallet found');
			const net =
				typeof network === 'string' ? networks.find((item) => item.chainId === network) : network;
			await window.ethereum.request({
				method: 'wallet_addEthereumChain',
				params: [
					{
						...net
					}
				]
			});
		} catch (err) {
			console.log(err.message);
		}
	}
}
