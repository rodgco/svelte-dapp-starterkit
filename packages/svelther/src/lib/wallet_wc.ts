import Wallet from './wallet';
import type { IOptions, INetwork } from './wallet';
import networks from './networks.json';

import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { get } from 'svelte/store';
import { browser } from '$app/env';

interface IProvider<TProvider> extends ethers.providers.Web3Provider {
	provider: TProvider;
}

export default class WalletConnectWallet extends Wallet<IProvider<WalletConnectProvider>> {
	public provider: IProvider<WalletConnectProvider>;
	public signer: ethers.Signer;

	private wcProvider: WalletConnectProvider;

	constructor(networkName: string, options: IOptions = {}) {
		super(networkName, options);

		// const rpc = this.network?.rpcUrls?.reduce((o, url, index) => ({ ...o, [index]: url }), {});
		const chainId = parseInt(this.network.chainId, 16);
		const url = this.network.rpcUrls[0];
		const rpc = { [chainId]: url };

		this.wcProvider = new WalletConnectProvider({
			rpc,
			// bridge: 'https://192.168.0.157:3003'
		});

		this.provider = <IProvider<WalletConnectProvider>>(
			(<unknown>new ethers.providers.Web3Provider(this.wcProvider))
		);
		this.signer = this.provider.getSigner();
	}

	async changeNetwork(network: INetwork | string | 'default' = 'default') {
		try {
			if (!browser) throw new Error('No crypto wallet found');
			const net =
				typeof network === 'string'
					? network === 'default'
						? this.network
						: networks.find((item) => item.chainId === network)
					: network;
			await this.wcProvider.request({
				method: 'wallet_addEthereumChain',
				params: [
					{
						...net
					}
				]
			});
		} catch (err: unknown) {
			console.log(err);
		}
	}

	async connect() {
		await this.wcProvider.enable();

		console.log('Wallet enabled');

		await this.wcProvider
			.request({ method: 'eth_requestAccounts' })
			.then((accounts) => this.handleAccountsChanged(accounts))
			.catch((err: { code: number; message: string }) => {
				if (err.code === 4001) {
					console.log('Please connect to an account');
				} else {
					console.error(err);
				}
			});

		this.state.update((current) => ({
			...current,
			hasWallet: true
		}));

		await this.wcProvider.request({ method: 'eth_chainId' }).then((value: unknown) => {
			if (this.options.forceChain) {
				this.changeNetwork(this.network);
			}
			this.handleChainChanged(<string>value);
		});
		this.wcProvider.on('chainChanged', (...args: unknown[]) =>
			this.handleChainChanged(<string>args[0])
		);

		await this.wcProvider
			.request({ method: 'eth_accounts' })
			.then((accounts: unknown) => this.handleAccountsChanged(<string[]>accounts));
		this.wcProvider.on('accountsChanged', (args: unknown) =>
			this.handleAccountsChanged(<string[]>args)
		);
	}

	private handleChainChanged(chainId: string): void {
		console.log('Changing chain', chainId);
		if (browser && this.options.reloadOnChainChage) {
			//	window.location.reload();
		} else {
			this.state.update((current) => ({
				...current,
				chainId,
				correctChain: chainId === this.network.chainId
			}));
		}
		console.log('Chain ID changed:', chainId);
	}

	private handleAccountsChanged(accounts: string[]): void {
		console.log('Changing accounts', accounts);
		if (accounts.length === 0) {
			console.log('Plase connect to an account.');
			this.state.update((current) => ({
				...current,
				currentAccount: undefined
			}));
		} else if (accounts[0] !== get(this.state).currentAccount) {
			this.state.update((current) => ({
				...current,
				currentAccount: accounts[0]
			}));
			console.log('Connected to account:', accounts[0]);
		}
	}
}
