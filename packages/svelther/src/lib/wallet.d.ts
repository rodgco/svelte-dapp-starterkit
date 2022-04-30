import type { Readable, Writable, Subscriber, Unsubscriber } from 'svelte/store';
import type { ethers } from 'ethers';
import type Contract from './contract';
interface IWalletState {
    hasWallet: boolean;
    correctChain: boolean;
    chainId: null | string;
    currentAccount: null | string;
}
export interface IOptions {
    forceChain?: boolean;
    pollingInterval?: number;
    reloadOnChainChage?: boolean;
}
export interface INetwork {
    chainId: string;
    blockExplorerUrls?: string[];
    chainName?: string;
    iconUrls?: string[];
    nativeCurrency?: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls?: string[];
}
export default abstract class Wallet<TWallet extends ethers.providers.BaseProvider> implements Readable<IWalletState> {
    protected network: INetwork;
    abstract provider: TWallet;
    protected state: Writable<IWalletState>;
    protected options: IOptions;
    subscribe: (run: Subscriber<IWalletState>, invalidate: (value: IWalletState | undefined) => void) => Unsubscriber;
    constructor(networkName: string, options?: IOptions);
    connect(): void | boolean;
    getContract<TContract extends ethers.BaseContract, TState>(contract: new (address: string, abi: ethers.ContractInterface, initialState: TState, provider: ethers.providers.BaseProvider | ethers.Signer) => Contract<TContract, TState>, address: string, abi: ethers.ContractInterface, initialState: TState): Contract<TContract, TState>;
}
export {};
//# sourceMappingURL=wallet.d.ts.map