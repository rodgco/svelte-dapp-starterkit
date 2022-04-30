import type { IOptions } from './wallet';
import type Wallet from './wallet';

import MetaMaskWallet from './wallet_metamask';
import JsonRpcWallet from './wallet_jsonrpc';
import type { ethers } from 'ethers';

export enum WALLET_TYPE {
	JSONRPC,
	METAMASK
}

export default class WalletFactory {
	static createWallet(
		type: WALLET_TYPE,
		networkName: string,
		options: IOptions = {}
	): Wallet<ethers.providers.BaseProvider> {
		if (type === WALLET_TYPE.METAMASK) return new MetaMaskWallet(networkName, options);
		else return new JsonRpcWallet(networkName, options);
	}
}
