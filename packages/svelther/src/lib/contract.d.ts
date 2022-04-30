import type { Readable, Writable, Subscriber, Unsubscriber } from 'svelte/store';
import { ethers } from 'ethers';
export declare type ISignerOrProvider = ethers.Signer | ethers.providers.BaseProvider;
export default class Contract<TContract extends ethers.BaseContract, TState> implements Readable<TState> {
    protected contract: TContract;
    protected address: string;
    protected abi: ethers.ContractInterface;
    protected state: Writable<TState>;
    subscribe: (run: Subscriber<TState>, invalidate: (value: TState | undefined) => void) => Unsubscriber;
    constructor(address: string, abi: ethers.ContractInterface, initialState: TState, provider: ISignerOrProvider);
    connect(providerOrSigner: ISignerOrProvider): void;
}
//# sourceMappingURL=contract.d.ts.map