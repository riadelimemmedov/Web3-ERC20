
//!React and Next.js
import { useState,useEffect } from "react";


//!Third Party Packages
import { useMoralis } from "react-moralis";
import {toast, toast as toast_alert} from "react-hot-toast";



//!Deployed Contracts
const mytoken_contract = require('../contracts/my_token.js')
const mytoken_contract_prod = require('../contracts/my_token_prod.js')



//?CheckUserBalance
export default function CheckUserBalance (props) {

    //state
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("");
    const [loading, setLoading] = useState(false)
    const [isDisable,setIsDisable] = useState(false)


    //handleUserBalance
    const handleUserBalance = async () => {
        const metamaskAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        try{
            if(metamaskAddressRegex.test(address)){
                setLoading(true)
                setTimeout(async(e) => {
                    // const contract = (await mytoken_contract.deployContract()).contract
                    const contract = props.serverNameValueUserBalance == 'production' ? await mytoken_contract_prod.deployContractProd() : await mytoken_contract.deployContract()

                    const balance = await contract.balanceOf(address);
                    const formattedBalance = mytoken_contract.Ethers.utils.formatEther(balance)
                    setBalance(formattedBalance)
                    setLoading(false)
                }, 5000);
            }
            else{
                setLoading(true)
                setTimeout(()=>{
                    toast.error('Please input valid metamask addresss')
                    setLoading(false)
                    setBalance("")
                },2000)
            }
        }
        catch(err){
            console.log(err)
            toast_alert.error('Please try again or check user address and contract')
            setLoading(false)
        }
    }

    console.log('Check user lanace token current server name is ', props.serverNameValueUserBalance);



    //return jsx
    return(
        <>
            <div className="text-center bg-light p-5 m-5 shadow">
                <h1>MYT Balance Check</h1>
                {
                    balance !== "" ? (
                        <h1 className="mb-5 text-danger">{balance} MYT</h1>
                    )
                    :(
                        ""
                    )
                }
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control p-3 m-3" placeholder="Wallet address" />
                <button type="button" onClick={handleUserBalance} className="btn btn-primary col-3 p-3 m-3" disabled={loading || !address}>
                    {loading ? 'Loading...' : 'Check'}
                </button>
            </div>
        </>
    )
}

