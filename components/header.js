//!React and Next.js
import { useState,useEffect } from 'react'


//!Third Party Packages
import { useMoralis } from 'react-moralis'
import { ConnectButton } from 'web3uikit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//!Deployed Contracts
const ethers = require("../contracts/ethers.js");
const mytoken_contract = require('../contracts/my_token.js')



//?Header
export default function Header(){

    //state
    // const { enableWeb3, account,isWeb3Enabled } = useMoralis();
    const {isWeb3Enabled,account} = useMoralis();
    const [userBalance,setUserBalance] = useState(0)


    // enableMoralisWeb3
    const enableMoralisWeb3 = async () => {
        await enableWeb3()
    }


    //useEffect
    useEffect(() => {
        if(isWeb3Enabled && account){
            const getBalance = async () => {
                const contract = (await mytoken_contract.deployContract()).contract
                const balance = await contract.balanceOf(account);
                const formattedBalance = mytoken_contract.Ethers.utils.formatEther(balance)
                setUserBalance(formattedBalance)
            }
            getBalance()
        }
        
    }, [isWeb3Enabled,account]);


    //jsx
    return(
        <div>
            <div className="d-flex justify-content-between">
                <ConnectButton/>
                <p>
                    {
                        isWeb3Enabled && account ? (
                            <span className="badge bg-primary">{userBalance} <span class="text-warning">MYT</span></span>
                        )
                        :(
                            <span></span>
                        )
                    }
                </p>               
            </div>
            {
            //     account ? (
            //         <div>
            //             Connected to <h1>{account.slice(0,6)} ... {account.slice(account.length-4)}</h1>
            //         </div>
            //     )
            //     :(
            //         <button type="button" className="btn btn-outline-warning text-dark border-2" onClick={enableMoralisWeb3}>
            //             Connect Metamask
            //         </button>
            //     )
            }
        </div>
    )
}