import Wallet from './wallet';
import type { IOptions, INetwork } from './wallet';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
interface IProvider<TProvider> extends ethers.providers.Web3Provider {
    provider: TProvider;
}
export default class WalletConnectWallet extends Wallet<IProvider<WalletConnectProvider>> {
    provider: IProvider<WalletConnectProvider>;
    signer: ethers.Signer;
    private wcProvider;
    constructor(networkName: string, options?: IOptions);
    changeNetwork(network?: INetwork | string | 'default'): Promise<void>;
    connect(): Promise<void>;
    private handleChainChanged;
    private handleAccountsChanged;
}
export {};
//# sourceMappingURL=wallet_wc.d.ts.map