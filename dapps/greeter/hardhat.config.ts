import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";
import "hardhat-abi-exporter";

import "./tasks/accounts";
import "./tasks/balance";
import "./tasks/block-number";

interface Etherscan {
	etherscan: { apiKey: string | undefined };
}

type HardhatUserEtherscanConfig = HardhatUserConfig & Etherscan;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserEtherscanConfig = {
	solidity: "0.8.4",
	networks: {
		localhost: {
			url: "http://localhost:8545",
		},
		hardhat: {},
		remote: {
			url: process.env.STAGING_URL || "",
			accounts: [
				process.env.PRIVATE_KEY ||
					"0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
			],
			gas: 6000000, // Gas sent with each transaction (default: ~6700000)
			gasPrice: 3000000000, // 3 gwei (in wei) (default: 100 gwei)
		},
		coverage: {
			url: "http://127.0.0.1:8555", // Coverage launches its own ganache-cli client
		},
	},
	// paths: {
	// 	artifacts: '../src/artifacts'
	// },
	typechain: {
		// outDir: '../src/types/contracts',
		target: "ethers-v5",
		alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
		externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
	abiExporter: {
		path: "./dist/abi",
		runOnCompile: true,
		clear: true,
		flat: true,
	},
};

export default config;
