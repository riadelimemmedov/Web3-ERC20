//!React and Next.js
import { useState,useEffect } from 'react'
import { useRouter } from 'next/router';



//!Third Party Packages
import { useMoralis } from 'react-moralis'
import { ConnectButton } from 'web3uikit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';



//!Deployed Contracts
const mytoken_contract = require('../contracts/my_token.js')
const mytoken_contract_prod = require('../contracts/my_token_prod.js')




//?Header
export default function Header(props){

    //state
    // const { enableWeb3, account,isWeb3Enabled } = useMoralis();
    const {isWeb3Enabled,account} = useMoralis();
    const [userBalance,setUserBalance] = useState(0)


    // enableMoralisWeb3
    const enableMoralisWeb3 = async () => {
        await enableWeb3()
    }


    //router
    const router = useRouter()


    const convertBalance = (balance) => {
        const divisor = 1e18; // Dividing by 10^18 to convert to Ether
        const decimalPlaces = 4;
        const formattedNumber = (balance / divisor).toFixed(decimalPlaces)
        return formattedNumber
        
    }



    //useEffect
    useEffect(() => {
        if(isWeb3Enabled && account){
            const getBalance = async () => {
                const server_name = await axios.get('http://127.0.0.1:8000/server/get/server/name').then((response) => response.data.server_name)
                console.log('Abiler bunedir bele ', server_name)

                const contract = server_name == 'production' ? await mytoken_contract_prod.deployContractProd() : await mytoken_contract.deployContract()
                const balance = server_name == 'production' ? await contract.contract.balanceOf(account) : await contract.contract.balanceOf(account); 
                const formattedBalance = convertBalance(balance)

                console.log('Acoount ', account)
                console.log('Formatted ERC20 Token balance is ', formattedBalance)
                // console.log('Balance is ', contract.userBalance.toString())
                const balance1 = await contract.contract.balanceOf(account);
                console.log('ddddddddd ', balance1.toString());
                // const formattedBalance = mytoken_contract.Ethers.utils.formatEther(balance)

                // const divisor = 1e18; // Dividing by 10^18 to convert to Ether
                // const decimalPlaces = 4;
                // const formattedNumber = (balance / divisor).toFixed(decimalPlaces)

                // console.log('Formatted Balance is ', formattedNumber)
                setUserBalance(formattedBalance)
            }
            getBalance()
        }
        
    }, [isWeb3Enabled,account]);


    //jsx
    return(
        <>
            <div className="d-flex justify-content-between">
                <ConnectButton/>
                <p>
                    <span className='m-0'>
                        <a href="/transfer" className={`badge bg-danger ${router.asPath=='/transfer' ? 'disable-link' : ''}`} style={{textDecoration:"none"}}>Transfer one account to another</a>
                    </span>
                    {
                        isWeb3Enabled && account ? (
                            <>  
                                <span className='m-2'>
                                    <a href="/transaction" className={`badge bg-secondary ${router.asPath=='/transaction' ? 'disable-link' : ''}`} style={{textDecoration:"none"}}>Transaction</a>
                                </span>
                                <span className="badge bg-primary">{userBalance} <span class="text-warning">MYT</span></span>
                            </>
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
        </>
    )
}