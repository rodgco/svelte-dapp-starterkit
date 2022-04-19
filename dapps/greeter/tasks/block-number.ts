import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task(
	"block-number",
	"Prints the current block number",
	async (_, { ethers }) => {
		const blockNumber = await ethers.provider.getBlockNumber();
		console.log("Current block number:", blockNumber);
	}
);
