import Wallet from './wallet';
import type { IOptions } from './wallet';

import { ethers } from 'ethers';

export default class JsonRpcWallet extends Wallet<ethers.providers.JsonRpcProvider> {
	public provider: ethers.providers.JsonRpcProvider;
	public signer: ethers.Signer;

	constructor(networkName: string, options: IOptions = {}) {
		super(networkName, options);

		this.provider = <ethers.providers.JsonRpcProvider>(
			ethers.getDefaultProvider(this.network.rpcUrls ? this.network.rpcUrls[0] : undefined)
		);
		this.provider.listAccounts().then((accounts) => console.log(accounts));
		this.signer = this.provider.getSigner();
	}
}
