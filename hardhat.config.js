require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version:"0.8.18",
    settings:{
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "byzantium", // Hardfork to enable unlimited contract size
    }
  },
  defaultNetwork:"hardhat",
  networks:{
    // hardhat:{
    //   accounts:[
    //     {
    //       privateKey:process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
    //       balance:"1000000000000000000000",
    //     },
    //   ],
    //   chainId:31337
    // }
    sepolia:{
      url:process.env.SEPOLIA_NODE_URL_HTTPS,
      accounts:[process.env.METAMASK_PRIVATE_KEY],
      chainId:11155111
    }
  },
  etherscan:{
    apiKey:process.env.API_KEY_SEPOLIA,
  }
};