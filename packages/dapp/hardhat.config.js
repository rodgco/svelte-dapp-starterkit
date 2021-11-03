require("@typechain/hardhat");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

let networks = {};

if (process.env.PRIVATE_KEY) {
	networks.rinkeby = {
		url: process.env.STAGING_ALCHEMY_KEY || "",
		accounts: [process.env.PRIVATE_KEY || ""],
	};
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	solidity: "0.8.4",
	networks,
	paths: {
		artifacts: "../frontend/src/lib/artifacts",
	},
	typechain: {
		outDir: "../frontend/src/types/contracts",
		target: "ethers-v5",
		alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
		externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
	},
};
