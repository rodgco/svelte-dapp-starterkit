import walletFactory from '$lib/wallet';
import type { Greeter } from '$types/contracts';

const network = <string>import.meta.env.VITE_NETWORK;
const contractAddress = <string>import.meta.env.VITE_CONTRACT_ADDRESS;
import { abi } from '$artifacts/contracts/Greeter.sol/Greeter.json';

const greeter = walletFactory<Greeter>(contractAddress, abi);

export default greeter;
