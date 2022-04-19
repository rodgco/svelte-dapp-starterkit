import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task("accounts", "Prints the list of accounts", async (_, { ethers }) => {
	const accounts = await ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});
