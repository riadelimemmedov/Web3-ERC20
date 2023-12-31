//!Ethers js and Ether js provider
const Ethers = require('ethers')
const ethers = require("./ethers");


//!Counter Contract Abi Value
const MyTokenLocal = require('../data/MyTokenLocal.json')
const MyTokenProd = require('../data/MyTokenProd.json')


//!DotEnv
require('dotenv').config({path:"..//.env"})



//*deployContractdeployContractProd Production Network
const deployContractProd = async () => {
    let contract;
    let deployeNetwork=null
    let userBalance = null
    let signer = null
    let deployer = MyTokenProd.deployer

    const provider = new Ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner()
    contract = new Ethers.Contract(MyTokenProd.address,MyTokenProd.abi,signer)
    let ub = (await signer.getBalance()).toString()
    userBalance = ub.toString()
    deployeNetwork=MyTokenProd.network

    return {contract,deployeNetwork,userBalance,signer,deployer,provider}
}
module.exports = {Ethers,ethers,MyTokenProd,deployContractProd}