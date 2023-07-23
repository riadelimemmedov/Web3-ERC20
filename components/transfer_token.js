
//!React and Next.js
import { useState,useEffect } from "react";

//!Third Party Packages
import { useMoralis } from "react-moralis";
import {toast, toast as toast_alert} from "react-hot-toast";



//!Deployed Contracts
const mytoken_contract = require('../contracts/my_token.js')

//?TransferToken
export default function TransferToken(){
    
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



    //handleInputValue
    const handleInputValue = (key) => (event) => {

        const metamaskAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        console.log('Work handleinput vlaue')
        if(!metamaskAddressRegex.test(event.target.value) && event.target.id == 'address'){
            console.log('Form data address is ', event.target.value)
            toast.error('Please input valid metamask addresss')
            setIsDisable(true)
        }
        else{
            setIsDisable(false)
        }
        

        // if(formData.address.length > 0 && Number(formData.amount) > 0 && event.target.value != ''){
        //     setIsDisable(false)
        // }
        // else if(formData.address == '' || Number(formData.amount) < 0 || event.target.value == ''){
        //     setIsDisable(true)
        // }
        setFormData((prevState) => ({
            ...prevState,
            [key]:event.target.value
        }))
    }
    

    //handleTransfer
    const handleTransfer = async (e) => {
        try{
            setLoading(true)
            setTimeout(async()=>{
                    //Deploy contract
                    const deployed_contract = await mytoken_contract.deployContract()
                    const decimals = await deployed_contract.contract.decimals() 
                    const formattedAmount = mytoken_contract.Ethers.utils.parseUnits(formData.amount.toString(),decimals)

                    // Send the transaction using the signer
                    const tx = await deployed_contract.contract.connect(deployed_contract.signer).transfer(formData.address,formattedAmount)
                    await tx.wait()
                    toast_alert.success('Token transferred successfully')
                    setLoading(false)
                    formData.address = ''
                    formData.amount = null
                    window.location.reload()
            },3000)
        }
        catch(err){
            console.log('Error when transfer coin to another coin wallet')
            toast_alert.error('Error transferring token')
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