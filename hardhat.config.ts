import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers"
import { config as dotenv } from "dotenv";
dotenv()

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    moonbase: {
      url: process.env.MOONBASE_RPC,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
