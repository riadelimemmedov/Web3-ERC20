//!React and Next.js
import { useState,useEffect } from 'react'


//!Thirty Part Packages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//!Custom Components
import Header from "../components/header"
import TransferToken from '../components/transfer_token.js'
import CheckUserBalance from '../components/balance_check.js'


//!Deployed Contracts
const mytoken_contract = require('../contracts/my_token.js')


//?App
export default function App(){

    //state
    const [tokenName,setTokenName] = useState('')
    const [tokenSymbol,setTokenSymbol] = useState('')
    const [totalSupply,setTotalSupply] = useState('')
    
    

    //getContract
    const getContract = async () => {
        const deployed_contract = await mytoken_contract.deployContract()
        setTokenName(await deployed_contract.contract.name())
        setTokenSymbol(await deployed_contract.contract.symbol())
        setTotalSupply(mytoken_contract.Ethers.utils.formatUnits(await deployed_contract.contract.totalSupply(),18))
    }


    //checkProdorLocal
    const checkProdorLocal = async () => {
        if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
            toast.success('You are currently PROD must be install metamask for connect to DApp Blockchain application - Rinkeby')
        }
        else{
            toast.info('You are currently working on HardHat test server  - METAMASK not needed,We give you Fake Account')
        }
    }


    //useEffect
    useEffect(() => {
        getContract();
        checkProdorLocal();
    }, []);


    //returned jsx to client
    return(
        <div className="container">  
            <div className="m-5">
                <Header/>
            </div>

            <div className="text-center bg-light p-5 m-5 shadow">
                <h1>Welcome My ERC20 Token Application</h1>
            </div>

            <div className="m-5">
                <p class="alert alert-info" role="alert">Token name : {tokenName}</p>
                <p class="alert alert-info" role="alert">Token symbol : {tokenSymbol}</p>
                <p class="alert alert-info" role="alert">Token total supply : {totalSupply}</p>
            </div>
            <TransferToken/>
            <CheckUserBalance/>
        </div>
    )
}