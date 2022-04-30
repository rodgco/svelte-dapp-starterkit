import type { IOptions } from './wallet';
import type Wallet from './wallet';
import type { ethers } from 'ethers';
export declare enum WALLET_TYPE {
    JSONRPC = 0,
    METAMASK = 1
}
export default class WalletFactory {
    static createWallet(type: WALLET_TYPE, networkName: string, options?: IOptions): Wallet<ethers.providers.BaseProvider>;
}
//# sourceMappingURL=wallet_factory.d.ts.map