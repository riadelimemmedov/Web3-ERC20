//!React and Next.js
import { useState,useEffect } from 'react'


//!Deployed Contracts
const ethers = require("../contracts/ethers.js");
const mytoken_contract_prod = require('../contracts/my_token_prod.js')


//!Custom Components
import Header from "../components/header"


//!Third party packages
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");





//?ContractTransition
export default function ContractTransition(){

    const [contractAddress, setcontractAddress] = useState()
    const [contractNetwork, setContractNetwork] = useState()

    

    //?getContractTransactions
    const getContractTransactions = async () => {
        const deployed_contract = (await mytoken_contract_prod.deployContractProd())
        setcontractAddress(deployed_contract.contract.address)
        setContractNetwork(deployed_contract.deployeNetwork)

        const address = "0x12aEcAc807aA1732da82534fD4c1d05258A845f7"
        const chain = EvmChain.SEPOLIA


        console.log('Adress is ', contractAddress)
        const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
            address,
            chain
        })
        console.log('Data ayeee ', response.toJSON())
    } 





    useEffect(() => {
        getContractTransactions()
    },[])

    return(
        <>
            <div className='container'>
                <div className="m-5">
                    <Header/>
                </div>
                <div className="bg-light text-left p-5 m-5 shadow">
                    <div className="row">
                        <div className='col'>
                            Network <span className="text-danger text-capitalize"> : {contractNetwork}</span>
                        </div>
                        <div className='col'>
                            Address <span className='text-danger'> : {contractAddress}</span>
                        </div>
                    </div>
                    <table class="table table-secondary table-striped mt-5">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">First</th>
                            <th scope="col">Last</th>
                            <th scope="col">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}