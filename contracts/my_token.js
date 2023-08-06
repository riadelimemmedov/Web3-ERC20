//!Ethers js and Ether js provider
const Ethers = require('ethers')
const ethers = require("./ethers");


//!Counter Contract Abi Value
const MyTokenLocal = require('../data/MyTokenLocal.json')
const MyTokenProd = require('../data/MyTokenProd.json')

//!DotEnv
require('dotenv').config({path:"..//.env"})



//*deployContract Local Hardhat
const deployContract = async () => {
    let contract;
    let deployeNetwork=null
    let userBalance = null
    let signer = null

    console.log('Worked else and our contract deploy on localhost')
    signer = ethers.getSigner()
    console.log('Signer address is ', signer.getAddress())
    contract = new Ethers.Contract(MyTokenLocal.address,MyTokenLocal.abi,signer)
    let ub = await contract.balanceOf((await ethers.getSigner().getAddress()))
    userBalance = ub.toString()
    deployeNetwork=MyTokenLocal.network

    return {contract,deployeNetwork,userBalance,signer}
}
module.exports = {Ethers,ethers,MyTokenLocal,MyTokenProd,deployContract}