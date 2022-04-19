import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task("balance", "Prints an account's balance")
	.addParam("account", "The account's address")
	.setAction(async (taskArgs, { ethers }) => {
		const balance = await ethers.provider.getBalance(taskArgs.account);

		console.log(ethers.utils.formatEther(balance), "ETH");
	});
