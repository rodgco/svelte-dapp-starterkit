import Wallet from './wallet';
import type { IOptions, INetwork } from './wallet';
import { ethers } from 'ethers';
import type { MetaMaskInpageProvider } from '@metamask/providers';
interface IProvider<TProvider> extends ethers.providers.Web3Provider {
    provider: TProvider;
}
declare global {
    interface Window {
        ethereum: ethers.providers.ExternalProvider;
    }
}
export default class MetaMaskWallet extends Wallet<IProvider<MetaMaskInpageProvider>> {
    provider: IProvider<MetaMaskInpageProvider>;
    signer: ethers.Signer;
    constructor(networkName: string, options?: IOptions);
    changeNetwork(network?: INetwork | string | 'default'): Promise<void>;
    connect(): void;
}
export {};
//# sourceMappingURL=wallet_metamask.d.ts.map