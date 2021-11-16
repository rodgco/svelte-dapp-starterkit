// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const abiSrcFolder = "./artifacts/contracts";
const abiDestFolder = "../frontend/src/lib/abis";

const envFile = "../frontend/.env";
const addressKey = "VITE_CONTRACT_ADDRESS";

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	// We get the contract to deploy
	const Greeter = await hre.ethers.getContractFactory("Greeter");
	const greeter = await Greeter.deploy("Hello, Hardhat!");

	await greeter.deployed();

	// Copy abi to frontend
	try {
		const entries = fs.readdirSync(abiSrcFolder);

		entries.forEach((entry) => {
			console.log("Copying ABI to frontend:", entry);
			const contract = entry.split(".")[0];

			fs.copyFileSync(
				`${abiSrcFolder}${path.sep}${entry}${path.sep}${contract}.json`,
				`${abiDestFolder}${path.sep}${contract}.json`
			);
		});
	} catch (err) {
		console.log(err);
	}

	// Update frontend .env with contract address
	console.log("Greeter deployed to:", greeter.address);
	try {
		const currentEnv = fs.readFileSync(envFile);

		const newEnv = currentEnv
			.toString()
			.split("\n")
			.map((line) => {
				const [key, ..._value] = line.split("=");
				if (key === addressKey) return `${addressKey}=${greeter.address}`;
				return line;
			});

		fs.writeFileSync(envFile, new Buffer.from(newEnv.join("\n")));
	} catch (err) {
		console.log(err);
	}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
