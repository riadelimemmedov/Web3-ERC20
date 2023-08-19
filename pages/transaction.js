//!React and Next.js
import { useState,useEffect } from 'react'
import { useRouter } from 'next/router';



//!Deployed Contracts
const ethers = require("../contracts/ethers.js");
const mytoken_contract = require('../contracts/my_token.js')
const mytoken_contract_prod = require('../contracts/my_token_prod.js')


//!Custom Components
import Header from "../components/header"


//!Third party packages
import { useMoralis } from 'react-moralis'
import {toast, toast as toast_alert} from "react-hot-toast";
import axios from 'axios';

const { getAddress, toChecksumAddress } = require('ethers').utils;

import ReactPaginate from 'react-paginate';



import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

//?ContractTransition
export default function ContractTransition(){

    const [currentUserMetamaskAddress,setcurrentUserMetamaskAddress] = useState()

    const [contractAddress, setcontractAddress] = useState()
    const [contractNetwork, setContractNetwork] = useState()
    const [serverName,setserverName] = useState()

    const [userTransactionAndTransfer,setUserTransactionAndTransfer] = useState([])



    const {isWeb3Enabled,account} = useMoralis();

    const router = useRouter();

    const [loading, setLoading] = useState(false);


    const [currentPage, setCurrentPage] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    const itemsOwnerToUser = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const itemsUserToUser = [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];


    //pagination
    let itemsPerPage = 10
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = itemsOwnerToUser.slice(itemOffset, endOffset)
    const pageCount = Math.ceil(itemsOwnerToUser.length / itemsPerPage);



    //refreshPage
    const refreshPage = () => {
        setTimeout(() => {
            router.reload()
        }, 2000);
    }   

    



    const getUserTransactionAndTransferData = async (api_url) => {
        console.log('Qaqasss bunediii ', api_url);
        setUserTransactionAndTransfer([])
        axios.get(api_url)
            .then((response) => {
                console.log('Qaqa response geldiee ', response.data)
                console.log('Qaqa response uzunlug ', response.data.length)
                setUserTransactionAndTransfer(response.data)
            })
            .catch((err)=>{
                console.log('Ala errorrr ', err)
            })
    
    }


    const getTransactionAndTransferData = async (server_name,transaction_type=null) => {
        console.log('Get transaction loading value ', loading)
        console.log('Server name  ', server_name)
        console.log('User change loading valuee ', transaction_type)

        let currentUserAddress = mytoken_contract.Ethers.utils.getAddress(document.getElementById('user_address').textContent.trim())

        
        console.log('Current user address dsadsadsadsadsa ', currentUserAddress)
        if(currentUserAddress){
            console.log('First reload pageee returnedd current account address this ', currentUserAddress)
        }

        
        if(!loading && server_name=='production'){
            // http://127.0.0.1:8000/transaction/get/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266/
            // http://127.0.0.1:8000/transfer/get/0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65/
            getUserTransactionAndTransferData(`http://127.0.0.1:8000/transaction/get/${currentUserAddress}/`) // 10
            console.log('Ay qaaa production')
        }
        else if(!loading && server_name=='local' && transaction_type==null){
            getUserTransactionAndTransferData(`http://127.0.0.1:8000/transaction/get/${currentUserAddress}/`) // 200
            console.log('Ay broo LOCAL Transaction')            
        }
        else if(transaction_type != 'Transfer'){
            getUserTransactionAndTransferData(`http://127.0.0.1:8000/transfer/get/${currentUserAddress}/`) //100
            console.log('Demeli bura transferdi')
        }
        else{
            getUserTransactionAndTransferData(`http://127.0.0.1:8000/transaction/get/${currentUserAddress}/`) // 200
            console.log('Demeli bura transactiondu')
        }
    }


       // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % itemsOwnerToUser.length;
        setItemOffset(newOffset);
    };


    //getContract
    const getContractInformation = async () => {
        const server_name = await axios.get('http://127.0.0.1:8000/server/get/server/name').then((response) => response.data.server_name)
        const deployed_contract = server_name == 'production' ? await mytoken_contract_prod.deployContractProd() : await mytoken_contract.deployContract()

        setLoading(server_name == 'production' ? true : false)

        setcontractAddress(deployed_contract.contract.address)
        setContractNetwork(deployed_contract.deployeNetwork)
        setserverName(server_name)


        await getTransactionAndTransferData(server_name)
    }


    //checkNetwork
    if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' ){
        window.ethereum.on('accountsChanged', getContractInformation);
        window.ethereum.on('chainChanged', (chainId) => {
            if(chainId != 0x7a69){
                axios.put('http://127.0.0.1:8000/server/get/server/name',{server_name: "production"})
                refreshPage()
            }
            else{
                axios.put('http://127.0.0.1:8000/server/get/server/name',{server_name: "local"})
                refreshPage()
            }
        })
    }



    useEffect(() => {
        getContractInformation()
    },[])

    return(
        <>
            <div className='container'>
                    <div className="m-5">
                        <Header/>
                    </div>
                    <div className="bg-light text-left p-5 m-5 shadow">

                    <FormControlLabel
                        sx={{display: 'block'}}
                        control={
                            <Switch checked={loading} onChange={() =>getTransactionAndTransferData(serverName,document.getElementById('transaction_text').textContent) && setLoading(!loading)} name="loading" color="primary" disabled={loading && serverName=='production' ? true : false}/>
                        }
                        label={<span style={{fontWeight: 'bold',color:'black'}} id='transaction_text'>{loading && serverName=='production' ? "Transactions" : (!loading && serverName=='local' ? 'Transactions' : 'Transfer' )}</span>}
                    />
                    <hr/>


                    Alaaa : {userTransactionAndTransfer.length}
                    Current Account Is : {account}

                    <div className="row mt-4 p-2">
                        <div className='col-2'>
                            Network : <span className="text-danger text-capitalize" id='user_network'> {contractNetwork}</span>
                        </div>
                        <div className='col-5'>
                            User : <span className='text-danger' id='user_address'> {account}</span>
                        </div>
                        <div className='col-5'>
                            Address : <span className='text-danger' id='contract_address'> {contractAddress}</span>
                        </div>
                    </div>

                    <hr/>

                    {/*  Current Account Is : {account} */}

                    {
                        loading && serverName=='production' ? (
                        <>
                            <p>Transaction Prod</p>
                            
                            <ReactPaginate
                                pageCount={pageCount} 
                                pageRangeDisplayed={5} 
                                marginPagesDisplayed={2} 
                                onPageChange={handlePageClick} 
                                containerClassName={'pagination'} 
                                activeClassName={'active'} 
                                disabled={true}
                            />
                        </>
                        )
                        :
                        (
                            !loading && serverName=='local' ? (
                                <p>Transactions Local</p>
                            )
                            :
                            (
                                <p>Transfer Local</p>
                            )
                        )
                    }

                    
                </div>

            </div>
        </>
    )
}