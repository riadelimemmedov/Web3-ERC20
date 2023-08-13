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

    console.log('Worked else and our contract deploy on PRODUCTION')
    const provider = new Ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner()
    console.log('Signer address is PROD ', signer.getAddress())
    contract = new Ethers.Contract(MyTokenProd.address,MyTokenProd.abi,signer)
    let ub = (await signer.getBalance()).toString()
    userBalance = ub.toString()
    deployeNetwork=MyTokenProd.network

    return {contract,deployeNetwork,userBalance,signer}
}
module.exports = {Ethers,ethers,MyTokenProd,deployContractProd}