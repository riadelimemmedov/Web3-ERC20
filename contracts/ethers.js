//!Ethers and Ethers Rpc Provider
const Ethers = require('ethers');
const ethers = new Ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")

//export ethers
module.exports = ethers
