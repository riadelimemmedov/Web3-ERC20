//!React and Next.js
import { useState,useEffect } from 'react'
import { useRouter } from 'next/router';



//!Thirty Part Packages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//!Custom Components
import Header from "../components/header"
import TransferToken from '../components/transfer_token.js'
import CheckUserBalance from '../components/balance_check.js'
import axios from 'axios';


//!Deployed Contracts
const mytoken_contract = require('../contracts/my_token.js')
const mytoken_contract_prod = require('../contracts/my_token_prod.js')




//?App
export default function App(){

    //state
    const [tokenName,setTokenName] = useState('')
    const [tokenSymbol,setTokenSymbol] = useState('')
    const [totalSupply,setTotalSupply] = useState('')

    const [serverName,setServerName] = useState()
    const [chainId,setChainId] = useState()
    
    const router = useRouter();

    //getContract
    const getContract = async (server_name) => {
        setServerName(server_name)
        // const deployed_contract = await mytoken_contract.deployContract()

        const deployed_contract = server_name == 'production' ? await mytoken_contract_prod.deployContractProd() : await mytoken_contract.deployContract()
        console.log('Server name index file ', server_name)
        

        setTokenName(await deployed_contract.contract.name())
        console.log("🚀 ~ file: index.js:45 ~ getContract ~ deployed_contract.contract.name():",await  deployed_contract.contract.name())
        setTokenSymbol(await deployed_contract.contract.symbol())
        console.log("🚀 ~ file: index.js:47 ~ getContract ~ deployed_contract.contract.symbol():", await deployed_contract.contract.symbol())
        setTotalSupply(mytoken_contract.Ethers.utils.formatUnits(await deployed_contract.contract.totalSupply(),18))
        console.log("🚀 ~ file: index.js:49 ~ getContract ~ mytoken_contract.Ethers.utils.formatUnits(await deployed_contract.contract.totalSupply(),18):", mytoken_contract.Ethers.utils.formatUnits(await deployed_contract.contract.totalSupply(),18))
    }


    const refreshPage = () => {
        setTimeout(() => {
            router.reload()
        }, 3000);
    }


    //checkProdorLocal
    const checkProdorLocal = async () => {

        if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' ){
            window.ethereum.on('chainChanged', (chainId) => {
                console.log('Chain id is ', chainId)
                if(chainId != 0x7a69){
                    getContract('production')
                    axios.put('http://127.0.0.1:8000/server/get/server/name',{server_name: "production"})
                    toast.success('You are currently PROD must be install metamask for connect to DApp Blockchain application - Sepolia')        
                    refreshPage()
                }
                else{
                    getContract('local')
                    axios.put('http://127.0.0.1:8000/server/get/server/name',{server_name: "local"})
                    toast.info('You are currently working on HardHat test server  - METAMASK not needed,We give you Fake Account')
                    refreshPage()
                }
            });
        }
        else{
            toast.error('Something went wrong,please try again')
        }
    }

    //useEffect
    useEffect(() => {
        checkProdorLocal();
    }, []);


    //returned jsx to client
    return(
        <>
        <div className="container">  
            <div className="m-5">
                <Header serverNameValueHeader={serverName}/>
            </div>

            <div className="text-center bg-light p-5 m-5 shadow">
                <h1>Welcome My ERC20 Token Application</h1>
            </div>

            <div className="m-5">
                <p class="alert alert-info" role="alert">Token name : {tokenName}</p>
                <p class="alert alert-info" role="alert">Token symbol : {tokenSymbol}</p>
                <p class="alert alert-info" role="alert">Token total supply : {totalSupply}</p>
            </div>
                <TransferToken serverNameValueTransfer={serverName}/>
                <CheckUserBalance serverNameValueUserBalance={serverName}/>
        </div>
        </>
    )
}