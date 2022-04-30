import Wallet from './wallet';
import type { INetwork, IOptions } from './wallet';
import { ethers } from 'ethers';
export default class JsonRpcWallet extends Wallet<ethers.providers.JsonRpcProvider> {
    provider: ethers.providers.JsonRpcProvider;
    signer: ethers.Signer;
    constructor(networkName: string, options?: IOptions);
    changeNetwork(network?: INetwork | string | 'default'): void;
}
//# sourceMappingURL=wallet_jsonrpc.d.ts.map