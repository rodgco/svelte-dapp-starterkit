import { writable, get } from 'svelte/store';
import { Contract, ethers, providers } from 'ethers';

import { browser } from '$app/env';

import type { Readable } from 'svelte/store';
import type { Signer, ContractInterface } from 'ethers';

interface WalletMethods {
	connect: () => void;
	addContract: (address: string, abi: ContractInterface) => Contract;
	getSigner: () => Signer;
	setProvider: (_provider: providers.Web3Provider) => void;
	changeNetwork: (networkName: string) => void;
}

export interface Wallet extends Readable<State>, WalletMethods {}

interface State {
	active: boolean;
	connected: boolean;
	account: string | null;
	chain_id: string | null;
	contracts: Contract[];
}

const networks = {
	polygon: {
		chainId: `0x${Number(137).toString(16)}`,
		chainName: 'Polygon Mainnet',
		nativeCurrency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18
		},
		rpcUrls: ['https://polygon-rpc.com/'],
		blockExplorerUrls: ['https://polygonscan.com/']
	},
	bsc: {
		chainId: `0x${Number(56).toString(16)}`,
		chainName: 'Binance Smart Chain Mainnet',
		nativeCurrency: {
			name: 'Binance Chain Native Token',
			symbol: 'BNB',
			decimals: 18
		},
		rpcUrls: [
			'https://bsc-dataseed1.binance.org',
			'https://bsc-dataseed2.binance.org',
			'https://bsc-dataseed3.binance.org',
			'https://bsc-dataseed4.binance.org',
			'https://bsc-dataseed1.defibit.io',
			'https://bsc-dataseed2.defibit.io',
			'https://bsc-dataseed3.defibit.io',
			'https://bsc-dataseed4.defibit.io',
			'https://bsc-dataseed1.ninicoin.io',
			'https://bsc-dataseed2.ninicoin.io',
			'https://bsc-dataseed3.ninicoin.io',
			'https://bsc-dataseed4.ninicoin.io',
			'wss://bsc-ws-node.nariox.org'
		],
		blockExplorerUrls: ['https://bscscan.com']
	}
};

function wallet_factory(): Wallet {
	let state: State = {
		active: false,
		connected: false,
		account: null,
		chain_id: null,
		contracts: []
	};

	let provider: providers.Web3Provider;

	let { subscribe, update } = writable(state, (set) => {
		if (browser) {
			// window.ethereum?.enable();

			window.ethereum?.request({ method: 'eth_accounts' }).then((_accounts: string[]) => {
				if (_accounts.length != 0) {
					set({
						...state,
						active: true,
						connected: true,
						account: _accounts[0],
						chain_id: window.ethereum?.chainId
					});
				} else {
					set({
						...state,
						active: true,
						connected: false,
						account: null,
						chain_id: window.ethereum?.chainId
					});
				}
			});
			window.ethereum?.on('accountsChanged', handleAccountsChanged);
			window.ethereum?.on('chainChanged', handleChainChanged);
		}
		return () => {
			if (browser) {
				window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
				window.ethereum?.removeListener('chainChanged', handleChainChanged);
			}
		};
	});

	const handleAccountsChanged = (_accounts: string[]) => {
		console.log('Account changed:', _accounts);

		if (_accounts.length > 0) {
			update((current) => ({
				...current,
				connected: true,
				account: _accounts[0],
				chain_id: window.ethereum?.chainId
			}));
		} else {
			update((current) => ({
				...current,
				connected: false,
				account: null,
				chain_id: window.ethereum?.chainId
			}));
		}
	};

	const handleChainChanged = (_chainId: string) => {
		console.log('Chain ID changed:', _chainId);
		update((current) => ({
			...current,
			chain_id: _chainId
		}));
	};

	const methods = {
		async connect() {
			if (!get({ subscribe }).connected) {
				try {
					const accounts = await window.ethereum?.request({ method: 'eth_requestAccounts' });
					console.log('Connected to accounts', accounts);
					update((current) => ({ ...current, connected: true }));
				} catch (error) {
					console.log(error);
				}
			}
		},
		addContract(address: string, abi: ContractInterface): Contract {
			try {
				const contract: Contract = new ethers.Contract(address, abi, provider);
				const contracts = [...get({ subscribe }).contracts, contract];
				update((current) => ({ ...current, contracts }));

				return contract;
			} catch (error) {
				console.log(error);
			}
		},
		getSigner() {
			return provider.getSigner();
		},
		setProvider(_provider: providers.Web3Provider): void {
			provider = _provider;
		},
		async changeNetwork(networkName: string) {
			try {
				if (!window.ethereum) throw new Error('No crypto wallet found');
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							...networks[networkName]
						}
					]
				});
			} catch (err) {
				console.log(err.message);
			}
		}
	};

	return { subscribe, ...methods };
}

const wallet = wallet_factory();
export default wallet;
