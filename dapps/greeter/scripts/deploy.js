// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');
const fs = require('fs');

const { env, contracts } = require('../rodgco.config');

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	console.log('Contracts', contracts);
	contracts.forEach(async (contractSpec) => {
		console.log('Working on', contractSpec.name);
		// try {
		const contractFactory = await hre.ethers.getContractFactory(contractSpec.name);

		console.log('Deploying...', contractSpec.name, contractSpec.deployArgs);
		const contract = contractSpec.deployArgs
			? await contractFactory.deploy(contractSpec.deployArgs)
			: await contractFactory.deploy();
		await contract.deployed();

		console.log('Contract deployed to:', contract.address);
		if (contractSpec.env) {
			updateEnv(contractSpec.env.key, contract[contractSpec.env.value]);
		}
		// } catch (error) {
		// 	console.log('Error ===>', error);
		// }
	});
}

function updateEnv(key, value) {
	// Update frontend .env with contract address
	try {
		const currentEnv = fs.readFileSync(env);

		let changed = false;

		const newEnv = currentEnv
			.toString()
			.split('\n')
			.map((line) => {
				const [_key, ..._value] = line.split('=');
				if (_key === key) {
					changed = true;
					return `${key}=${value}`;
				}
				return line;
			});

		if (!changed) newEnv.push(`${key}=${value}`);

		fs.writeFileSync(env, new Buffer.from(newEnv.join('\n')));
	} catch (err) {
		console.log(err);
	}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main();
//	.then(() => process.exit(0))
//	.catch((error) => {
//		console.error(error);
//		process.exit(1);
//	});
