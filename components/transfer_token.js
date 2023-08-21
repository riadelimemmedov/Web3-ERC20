
//!React and Next.js
import { useState,useEffect } from "react";

//!Third Party Packages
import { useMoralis } from "react-moralis";
import {toast, toast as toast_alert} from "react-hot-toast";
import axios from 'axios';




//!Deployed Contracts
const mytoken_contract = require('../contracts/my_token.js')
const mytoken_contract_prod = require('../contracts/my_token_prod.js')



//?TransferToken
export default function TransferToken(props){

    //state
    const [address,setAddress] = useState('')
    const [amount,setAmount] = useState()
    const [loading,setLoading] = useState(false)
    const [formData, setFormData] = useState({
        address: '',
        amount: '',
    });
    const [isDisable,setIsDisable] = useState(true)


    //Account
    const { account } = useMoralis()



    //saveTransaction
    const saveTransaction = async(transaction_hash,transaction_from,transaction_to,transaction_amount,token_name,token_symbol,network,confirmations) => {
        await axios.post('http://127.0.0.1:8000/transaction/create/',{            
            "transaction_hash":transaction_hash,
            "transaction_from": transaction_from,
            "transaction_to": transaction_to,
            "transaction_amount": transaction_amount,
            "token_name":token_name,
            "token_symbol":token_symbol,
            "network":network,
            "confirmations": confirmations,
        })
        .then((response) => {
            if(response.data){
                console.log('Completed transaction succsesfully ', response.data)
            }
        })
        .catch((err) => {
            console.log('Encounter error when save transfer to database ', err)
        })
        return true
    }


    //handleInputValue
    const handleInputValue = (key) => (event) => {
        const metamaskAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        if(!metamaskAddressRegex.test(event.target.value) && event.target.id == 'address'){
            toast.error('Please input valid metamask addresss')
            setIsDisable(true)
        }
        else{
            setIsDisable(false)
        }
        setFormData((prevState) => ({
            ...prevState,
            [key]:event.target.value
        })) 
    }
    

    //handleTransfer
    const handleTransfer = async (e) => {
        const metamaskAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        let isFinished = false
        if(metamaskAddressRegex.test(formData.address)){
            setLoading(true)
            setTimeout(async()=>{
                    //Deploy contract
                    const server_name = await axios.get('http://127.0.0.1:8000/server/get/server/name').then((response) => response.data.server_name)
                    const deployed_contract = server_name == 'production' ? await mytoken_contract_prod.deployContractProd() : await mytoken_contract.deployContract()
                    
                    const decimals = await deployed_contract.contract.decimals() 
                    const formattedAmount = mytoken_contract.Ethers.utils.parseUnits(formData.amount.toString(),decimals)

                    try{
                        // Send the transaction using the signer
                        const tx = await deployed_contract.contract.connect(deployed_contract.signer).transfer(formData.address,formattedAmount)
                        await tx.wait()
                        toast_alert.success('Token transferred successfully')
                        isFinished=true
                        const isSaveTransaction = await saveTransaction(tx.hash,await deployed_contract.signer.getAddress(),formData.address,Number(formData.amount),await deployed_contract.contract.name(),await deployed_contract.contract.symbol(),deployed_contract.deployeNetwork,isFinished == true ? 1 : 0)
                        setLoading(false)
                        formData.address = ''
                        formData.amount = ''
                    }
                    catch(err){
                        if(err.code == "ACTION_REJECTED"){
                            toast_alert.error('User rejected transaction')
                        }
                        else if(err.code == "UNPREDICTABLE_GAS_LIMIT" ){
                            toast_alert.error('Transfer amount exceeds balance')
                        }
                        setLoading(false)
                    }
            },3000)
        }
        else{
            toast_alert.error('Please input valid metamask address format')
            setLoading(false)
        }
    }


    //return jsx
    return(
        <div className="text-center bg-light p-5 m-5 shadow">
            <h1>Transfer MYT From Contract Owner</h1>        
            <input type="text" className="form-control p-3 m-3 border-2 border-primary" id="address" placeholder="Wallet address" value={formData.address} onChange={handleInputValue('address')} required/>
            <input type="number" className="form-control p-3 m-3 border-2 border-primary" id="amount" placeholder="Amount of token" value={formData.amount} onChange={handleInputValue('amount')} required/>
            <button type="button" onClick={handleTransfer} className="btn btn-primary col-3 p-3 m-3" disabled={loading || !formData.address || !formData.amount || isDisable}>
                {loading ? "Loading..." : "Transfer"}    
            </button>
        </div>  
    )
}