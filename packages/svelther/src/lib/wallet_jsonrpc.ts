import Wallet from './wallet';
import type { INetwork, IOptions } from './wallet';
import networks from './networks.json';

import { ethers } from 'ethers';

export default class JsonRpcWallet extends Wallet<ethers.providers.JsonRpcProvider> {
	public provider: ethers.providers.JsonRpcProvider;
	public signer: ethers.Signer;

	constructor(networkName: string, options: IOptions = {}) {
		super(networkName, options);

		this.provider = <ethers.providers.JsonRpcProvider>(
			ethers.getDefaultProvider(this.network.rpcUrls ? this.network.rpcUrls[0] : undefined)
		);

		this.signer = this.provider.getSigner();

		this.state.update((current) => ({
			...current,
			chainId: this.network.chainId,
			correctChain: true
		}));
	}

	changeNetwork(network: INetwork | string | 'default' = 'default') {
		try {
			const net =
				typeof network === 'string'
					? network === 'default'
						? this.network
						: networks.find((item) => item.chainId === network)
					: network;
			this.provider = <ethers.providers.JsonRpcProvider>(
				ethers.getDefaultProvider(net?.rpcUrls ? net?.rpcUrls[0] : undefined)
			);
			this.state.update((current) => ({
				...current,
				chainId: this.network.chainId,
				correctChain: true
			}));
		} catch (err: unknown) {
			console.log(err);
		}
	}
}
