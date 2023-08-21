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



//!React paginate
import ReactPaginate from 'react-paginate';


//!Material UI
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';





//?ContractTransition
export default function ContractTransition(){

    //state
    const [currentUserMetamaskAddress,setcurrentUserMetamaskAddress] = useState()

    const [contractAddress, setcontractAddress] = useState()
    const [contractNetwork, setContractNetwork] = useState()
    const [serverName,setserverName] = useState()

    const [userTransactionAndTransfer,setUserTransactionAndTransfer] = useState([])

    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);


    const {isWeb3Enabled,account} = useMoralis();


    //pagination
    let itemsPerPage = 5
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = userTransactionAndTransfer.slice(itemOffset, endOffset)
    const pageCount = Math.ceil(userTransactionAndTransfer.length / itemsPerPage);


    //options value for date
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};


    //router
    const router = useRouter();


    //refreshPage
    const refreshPage = () => {
        setTimeout(() => {
            router.reload()
        }, 2000);
    }   



    //getUserTransactionAndTransferData
    const getUserTransactionAndTransferData = async (api_url) => {
        setUserTransactionAndTransfer([])
        await axios.get(api_url)
            .then((response) => {
                setUserTransactionAndTransfer(response.data) ? response.data.length > 0 : null
                return 
            })
            .catch((err)=>{
                console.log('Please try again', err)
            })
            
    }



    //getTransactionAndTransferData
    const getTransactionAndTransferData = async (server_name,transaction_type=null) => {
        let currentUserAddress = mytoken_contract.Ethers.utils.getAddress(document.getElementById('user_address').textContent.trim())        

        if(server_name=='production'){
            getUserTransactionAndTransferData(`http://127.0.0.1:8000/transaction/get/${currentUserAddress}/${server_name}/`)
            return
        }
        else if(!loading && server_name=='local' && transaction_type==null){
            getUserTransactionAndTransferData(`http://127.0.0.1:8000/transaction/get/${currentUserAddress}/${server_name}/`)
            return        
        }
        else if(transaction_type != 'Transfer'){
            getUserTransactionAndTransferData(`http://127.0.0.1:8000/transfer/get/${currentUserAddress}/${server_name}/`) 
            return
        }
        else{
            getUserTransactionAndTransferData(`http://127.0.0.1:8000/transaction/get/${currentUserAddress}/${server_name}/`) 
            return
        }
    }



    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % userTransactionAndTransfer.length;
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



    //useEffect
    useEffect(() => {
        getContractInformation()
    },[])



    return(
        <>
            <div className='container'>
                    <div className="m-5">
                        <Header/>
                    </div>
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

                <div className="row mt-4 p-2">
                    <div className='col-4'>
                        Network : <span className="text-danger text-capitalize" id='user_network'> {contractNetwork}</span>
                    </div>
                    <div className='col-4'>
                        User : <span className='text-danger' id='user_address'> {account}</span>
                    </div>
                    <div className='col-4'>
                        Contract Address : <span className='text-danger' id='contract_address'> {contractAddress}</span>
                    </div>
                </div>

                <hr/>

                {/*  Current Account Is : {account} */}

                {
                    loading && serverName=='production' ? (
                    <>
                        <p className='text-warning'>Transaction Prod</p>

                        <table class="table table-secondary table-striped mt-5">
                            <thead>
                                <tr>
                                    <th scope="col">Token Name</th>
                                    <th scope="col">Token Symbol</th>
                                    <th scope="col">From Address</th>
                                    <th scope="col">To Address</th>
                                    <th scope="col">Network</th>
                                    <th scope="col">TimeStamp</th>
                                    <th scope="col">Value</th>
                                    <th scope="col">Success</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                        currentItems.map((transaction, index) => (
                                            <tr>
                                                <th scope="row">{transaction.token_name}</th>
                                                <td>{transaction.token_symbol}</td>
                                                <td>{transaction.transaction_from}</td>
                                                <td>{transaction.transaction_to}</td>
                                                <td>{transaction.network}</td>
                                                <td>{new Date(transaction.created).toLocaleDateString('en-US',options)}</td>
                                                <td>{transaction.transaction_amount}</td>
                                                <td>{String(transaction.is_succsess) == 'true' ? 'Completed' : 'Failed'}</td>
                                            </tr>
                                        )) 
                                }
                            </tbody>
                        </table>
                    </>
                    )
                    :
                    (
                        !loading && serverName=='local' ? (
                            <>
                                <p className="text-warning">Transactions Local</p>

                                <table class="table table-secondary table-striped mt-5">
                                    <thead>
                                        <tr>
                                            <th scope="col">Token Name</th>
                                            <th scope="col">Token Symbol</th>
                                            <th scope="col">From Address</th>
                                            <th scope="col">To Address</th>
                                            <th scope="col">Network</th>
                                            <th scope="col">TimeStamp</th>
                                            <th scope="col">Value</th>
                                            <th scope="col">Success</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentItems.map((transaction, index) => (
                                                <tr>
                                                    <th scope="row">{transaction.token_name}</th>
                                                    <td>{transaction.token_symbol}</td>
                                                    <td>{transaction.transaction_from}</td>
                                                    <td>{transaction.transaction_to}</td>
                                                    <td>{transaction.network}</td>
                                                    <td>{new Date(transaction.created).toLocaleDateString('en-US',options)}</td>
                                                    <td>{transaction.transaction_amount}</td>
                                                    <td>{String(transaction.is_succsess) == 'true' ? 'Completed' : 'Failed'}</td>
                                                </tr>
                                            )) 
                                        }
                                    </tbody>
                                </table>
                            
                            </>
                        )
                        :

                            <>
                                    <p className="text-warning">Transfer Local</p>
                                        
                                    <table class="table table-secondary table-striped mt-5">
                                    <thead>
                                        <tr>
                                            <th scope="col">Token Name</th>
                                            <th scope="col">Token Symbol</th>
                                            <th scope="col">From Address</th>
                                            <th scope="col">To Address</th>
                                            <th scope="col">Network</th>
                                            <th scope="col">TimeStamp</th>
                                            <th scope="col">Value</th>
                                            <th scope="col">Success</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentItems.map((transfer, index) => (
                                                <tr>
                                                    <th scope="row">{transfer.token_name}</th>
                                                    <td>{transfer.token_symbol}</td>
                                                    <td>{transfer.transfer_from}</td>
                                                    <td>{transfer.transfer_to}</td>
                                                    <td>{transfer.network}</td>
                                                    <td>{new Date(transfer.created).toLocaleDateString('en-US',options)}</td>
                                                    <td>{transfer.transfer_amount}</td>
                                                    <td>{String(transfer.is_transfer) == 'true' ? 'Completed' : 'Failed'}</td>
                                                </tr>
                                            )) 
                                        }
                                    </tbody>
                                </table>
                            </>
                        )
                }

                {

                    userTransactionAndTransfer.length <= 0 ? (
                        <div className="alert alert-danger">
                            Not found any transaction history for this account and current selected network
                        </div>
                    )
                    :
                    (
                        <ReactPaginate
                            pageCount={pageCount} 
                            pageRangeDisplayed={5} 
                            marginPagesDisplayed={2} 
                            onPageChange={handlePageClick} 
                            containerClassName={'pagination'} 
                            activeClassName={'active'} 
                            disabled={true}
                        />
                    )
                }

            </div>


        </>
    )
}