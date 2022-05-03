import { WalletFactory, WALLET_TYPE } from 'svelther';
import GreeterContract from './greeter';

import abi from 'greeter/abi/Greeter.json';

import { browser } from '$app/env';

const contractAddress = <string>import.meta.env.VITE_CONTRACT_ADDRESS;
const networkName = <string>import.meta.env.VITE_NETWORK_NAME;

const type = browser && window.ethereum ? WALLET_TYPE.METAMASK : WALLET_TYPE.JSONRPC;
const wallet = WalletFactory.createWallet(type, networkName);

const greeter = new GreeterContract(
	contractAddress,
	abi,
	{
		greet: ''
	},
	wallet.provider
);

export { wallet, greeter };
