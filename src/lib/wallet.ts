import { browser } from '$app/env';
import { writable, get } from 'svelte/store';
import { BaseContract, ethers, providers } from 'ethers';

import type { Readable } from 'svelte/store';
import type { Signer, ContractInterface } from 'ethers';

interface WalletMethods {
	connect: () => void;
	changeNetwork: (networkName: string) => void;
}

interface State<T> {
	active: boolean;
	connected: boolean;
	account: string | null;
	chain_id: string | null;
	contract: T | null;
	signer: Signer;
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
	mumbai: {
		chainId: `0x${Number(80001).toString(16)}`,
		chainName: 'Polygon Testnet Mumbai',
		nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
		rpcUrls: [
			'https://matic-mumbai.chainstacklabs.com',
			'https://rpc-mumbai.maticvigil.com',
			'https://matic-testnet-archive-rpc.bwarelabs.com'
		],
		blockExplorerUrls: ['https://mumbai.polygonscan.com']
	}
};

export default function wallet_factory<Type extends BaseContract>(
	contractAddress: string,
	abi: ContractInterface
): Readable<State<Type>> & WalletMethods & Type {
	let state: State<Type> = {
		active: false,
		connected: false,
		account: null,
		chain_id: null,
		contract: null,
		signer: null
	};

	let provider: providers.Web3Provider | providers.JsonRpcProvider;
	let signer: Signer;

	if (browser && window.ethereum) {
		provider = new ethers.providers.Web3Provider(window.ethereum);
		signer = provider.getSigner();

		window.ethereum?.on('accountsChanged', handleAccountsChanged);
		window.ethereum?.on('chainChanged', handleChainChanged);
	} else {
		provider = new ethers.providers.JsonRpcProvider(
			'https://polygon-mumbai.g.alchemy.com/v2/KoJsH9RXRUb39GHhqlBS4NsN0_m1MS3R'
		);
	}

	const contract =
		contractAddress && abi ? <Type>new ethers.Contract(contractAddress, abi, provider) : null;

	let { subscribe, update } = writable(state, (set) => {
		let state: State<Type> = {
			active: false,
			connected: false,
			account: null,
			chain_id: null,
			contract,
			signer
		};

		provider
			.listAccounts()
			.then((accounts: string[]) => {
				return {
					...state,
					active: browser && window.ethereum,
					connected: accounts.length > 0,
					account: accounts[0]
				};
			})
			.then((state: State<Type>) => {
				set(state);
			})
			.catch((err) => console.log('Wallet init error.', err));

		return () => {
			if (browser) {
				window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
				window.ethereum?.removeListener('chainChanged', handleChainChanged);
			}
		};
	});

	function handleAccountsChanged(_accounts: string[]) {
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
	}

	function handleChainChanged(_chainId: string) {
		console.log('Chain ID changed:', _chainId);
		update((current) => ({
			...current,
			chain_id: _chainId
		}));
	}

	const methods = {
		async connect() {
			const { active, connected } = get({ subscribe });
			console.log('connect', active, connected);
			if (!active) return;
			if (!connected) {
				try {
					const accounts = await window.ethereum?.request({ method: 'eth_requestAccounts' });
					console.log('Connected to accounts', accounts);
					update((current) => ({ ...current, connected: true }));
				} catch (error) {
					console.log(error);
				}
			}
		},
		async changeNetwork(networkName: string) {
			try {
				if (!browser && !window.ethereum) throw new Error('No crypto wallet found');
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
	return { subscribe, ...methods, ...contract };
}
