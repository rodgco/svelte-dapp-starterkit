import Wallet from './wallet';
import type { IOptions, INetwork } from './wallet';
import networks from './networks.json';

import { ethers } from 'ethers';
import type { MetaMaskInpageProvider } from '@metamask/providers';

import { get } from 'svelte/store';
import { browser } from '$app/env';
import type { Maybe } from '@metamask/providers/dist/utils';

interface IProvider<TProvider> extends ethers.providers.Web3Provider {
	provider: TProvider;
}

declare global {
	interface Window {
		ethereum: ethers.providers.ExternalProvider;
	}
}

declare let window: Window;

export default class MetaMaskWallet extends Wallet<IProvider<MetaMaskInpageProvider>> {
	public provider: IProvider<MetaMaskInpageProvider>;
	public signer: ethers.Signer;

	constructor(networkName: string, options: IOptions = {}) {
		super(networkName, options);

		const handleChainChanged = (chainId: string): void => {
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
		};

		const handleAccountsChanged = (accounts: string[]): void => {
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
		};

		this.provider = <IProvider<MetaMaskInpageProvider>>(
			(<unknown>new ethers.providers.Web3Provider(window.ethereum))
		);
		this.signer = this.provider.getSigner();

		this.state.update((current) => ({
			...current,
			hasWallet: true
		}));

		this.provider.provider.request({ method: 'eth_chainId' }).then((value: Maybe<unknown>) => {
			if (options.forceChain) {
				this.changeNetwork(this.network);
			}
			handleChainChanged(<string>value);
		});
		this.provider.provider.on('chainChanged', (...args: unknown[]) =>
			handleChainChanged(<string>args[0])
		);

		this.provider.provider
			.request({ method: 'eth_accounts' })
			.then((accounts: Maybe<unknown>) => handleAccountsChanged(<string[]>accounts));
		this.provider.provider.on('accountsChanged', (args: unknown) =>
			handleAccountsChanged(<string[]>args)
		);
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
			await this.provider.provider.request({
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

	connect() {
		this.provider.provider
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
