import type { IOptions } from './wallet';
import type Wallet from './wallet';

import MetaMaskWallet from './wallet_metamask';
import JsonRpcWallet from './wallet_jsonrpc';
import WalletConnectWallet from './wallet_wc';
import type { ethers } from 'ethers';

export enum WALLET_TYPE {
	JSONRPC,
	METAMASK,
	WALLETCONNECT
}

export default class WalletFactory {
	static createWallet(
		type: WALLET_TYPE,
		networkName: string,
		options: IOptions = {}
	): Wallet<ethers.providers.BaseProvider> {
		if (type === WALLET_TYPE.METAMASK) return new MetaMaskWallet(networkName, options);
		if (type === WALLET_TYPE.WALLETCONNECT) return new WalletConnectWallet(networkName, options);
		else return new JsonRpcWallet(networkName, options);
	}
}
