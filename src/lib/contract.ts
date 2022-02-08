import { ethers } from 'ethers';

import { browser } from '$app/env';
import { writable, get } from 'svelte/store';
import type { Readable, Writable, Subscriber, Unsubscriber } from 'svelte/store';

import networks from '$lib/networks.json';

interface IContractState {
	hasWallet: boolean;
	correctChain: boolean;
	chainId: string;
	currentAccount: string;
}

interface IOptions {
	forceChain?: boolean;
	pollingInterval?: number;
	reloadOnChainChage?: boolean;
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
	protected options: IOptions = {
		reloadOnChainChage: true,
		forceChain: true,
		pollingInterval: 4000
	};

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
			console.log('Options', this.options);
			if (browser && this.options.reloadOnChainChage) {
				// window.location.reload();
			} else {
				this.state.update((current) => ({
					...current,
					chainId,
					correctChain: chainId === this.network.chainId
				}));
			}
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

		this.network = networks.find((entry: any) => entry.chainName === networkName) || {
			chainId: '0x1'
		};

		this.options = { ...this.options, ...options };

		/**
		 *      _
		 *  ___| |_ ___  _ __ ___
		 * / __| __/ _ \| '__/ _ \
		 * \__ \ || (_) | | |  __/
		 * |___/\__\___/|_|  \___|
		 *
		 */
		this.state = writable({
			...initialState,
			hasWallet: false,
			correctChain: false,
			chainId: null,
			currentAccount: null
		});
		this.subscribe = this.state.subscribe; // Class "implements store" hack!

		/**
		 *                        _     _
		 *   _ __  _ __ _____   _(_) __| | ___ _ __ ___
		 *  | '_ \| '__/ _ \ \ / / |/ _` |/ _ \ '__/ __|
		 *  | |_) | | | (_) \ V /| | (_| |  __/ |  \__ \
		 *  | .__/|_|  \___/ \_/ |_|\__,_|\___|_|  |___/
		 *  |_|
		 */
		if (browser && window.ethereum) {
			// Web3 Provider
			this.state.update((current) => ({ ...current, hasWallet: true }));
			this.provider = new ethers.providers.Web3Provider(window.ethereum);
			this.signer = this.provider.getSigner();

			window.ethereum.request({ method: 'eth_chainId' }).then((id: string) => {
				if (options.forceChain) {
					this.changeNetwork(this.network);
				}
				handleChainChanged(id);
			});
			window.ethereum.on('chainChanged', handleChainChanged);

			window.ethereum
				.request({ method: 'eth_accounts' })
				.then((accounts: string[]) => handleAccountsChanged(accounts));
			window.ethereum.on('accountsChanged', handleAccountsChanged);
		} else {
			// JsonRpcProvider
			this.provider = <ethers.providers.JsonRpcProvider>(
				ethers.getDefaultProvider(this.network.rpcUrls ? this.network.rpcUrls[0] : null)
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

	async changeNetwork(network: INetwork | string | 'default' = 'default') {
		try {
			if (!browser && !window.ethereum) throw new Error('No crypto wallet found');
			const net =
				typeof network === 'string'
					? network === 'default'
						? this.network
						: networks.find((item) => item.chainId === network)
					: network;
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
