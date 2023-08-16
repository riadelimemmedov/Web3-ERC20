//!React and Next.js
import { useState,useEffect } from "react";
import { useRouter } from 'next/router';



//!Third Party Packages
import { useMoralis } from "react-moralis";
import {toast, toast as toast_alert} from "react-hot-toast";
import axios from 'axios'



//!Custom Components
import Header from "../components/header"


//!Deployed Contracts
const mytoken_contract = require('../contracts/my_token.js')
const mytoken_contract_prod = require('../contracts/my_token_prod.js')






//?Transfer
export default function Transfer(){
    //state
    
    const [owner,setOwner] = useState()
    const [spender,setSpender] = useState()
    const [recipient,setRecipient] = useState()
    const [disable_approve,setDisableApprove] = useState(false)
    const [disable_allowance,setDisableAllowance] = useState(false)
    const [disable_transfer,setDisableTransfer] = useState(false)

    const [amount_approve,setAmountApprove] = useState()
    const [amount_transfer,setAmountTransfer] = useState()



    const [isCompletedApprove,setCompletedApprove] = useState(false)
    const [confirmedApproveAccount,setConfirmedApproveAccount] = useState()


    const [serverName,setServerName] = useState()


    const router = useRouter();





    const refreshPage = () => {
        setTimeout(() => {
            router.reload()
        }, 3000);
    }


    if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' ){
        window.ethereum.on('chainChanged', (chainId) => {
            if(chainId != 0x7a69){
                console.log('Work if cyrrently you are production  blocjahin server')
                axios.put('http://127.0.0.1:8000/server/get/server/name',{server_name: "production"})
                // toast_alert.success('You are currently PROD must be install metamask for connect to DApp Blockchain application - Sepolia')        
                refreshPage()
            }
            else{
                console.log('You are currently localhost hrafhat server')
                axios.put('http://127.0.0.1:8000/server/get/server/name',{server_name: "local"})
                // toast_alert('You are currently working on HardHat test server  - METAMASK not needed,We give you Fake Account')
                refreshPage()
            }
        })
    }


    const getServerName = async() => {
        setTimeout(async() => {
            const server_name = await axios.get('http://127.0.0.1:8000/server/get/server/name').then((response) => response.data.server_name)
            setServerName(server_name)
        }, 100);
        return
    }

    //raiseAlertTransfer
    const raiseAlertTransfer = (message) => {
        setDisableTransfer(true)
        setTimeout(() => {
            setDisableTransfer(false)
            toast_alert.error(`${message}`)
        }, 3000);
    }

    
    //saveApprove
    const saveApprove = async (approvment_hash,confirmed_account,confirming_account,amount,confirmations) => {
        await axios.post('http://127.0.0.1:8000/approve/create/',{
            approvment_hash:approvment_hash,
            confirmed_account:confirmed_account,
            confirming_account:confirming_account,
            amount:amount,
            confirmations:confirmations
        })
        .then((response) => {
            if(response.data){
                setCompletedApprove(response.data.is_approve)
                setConfirmedApproveAccount(response.data.confirmed_account)
            }
        })
        .catch((err) => {
            console.log('Encounter error when save approved to database ' , err)
        })
        return true
    }




    //saveTransfer
    const saveTransfer = async(transfer_hash,transfer_from,transfer_to,transfer_amount,confirmations) => {
        await axios.post('http://127.0.0.1:8000/transfer/create/',{            
            "transfer_hash":transfer_hash,
            "transfer_from": transfer_from,
            "transfer_to": transfer_to,
            "transfer_amount": transfer_amount,
            "confirmations": confirmations,
            "transfer_approvement":String(transfer_from)
            
        })
        .then((response) => {
            if(response.data){
                console.log('Completed transfer succsesfully ', response.data)
            }
        })
        .catch((err) => {
            console.log('Encounter error when save transfer to database ', err)
        })
        return true
    }


    



    //getContractInformation
    const getContractInformation = async()=>{
        const server_name = await axios.get('http://127.0.0.1:8000/server/get/server/name').then((response) => response.data.server_name)
        const deployed_contract = server_name == 'production' ? await mytoken_contract_prod.deployContractProd() : await mytoken_contract.deployContract()
        const decimals = await deployed_contract.contract.decimals()
        return{deployed_contract,decimals,server_name}
    }

    //handleApprove
    const handleApprove = async(e) => {
        const metamaskAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        setCompletedApprove(false)
        if(metamaskAddressRegex.test(owner)){
            setDisableApprove(true)
            setTimeout(async(e) => {
                const contract_information = await getContractInformation()  
                const formattedAmount = contract_information.server_name == 'production' ? mytoken_contract_prod.Ethers.utils.parseUnits(amount_approve.toString(),contract_information.decimals) : mytoken_contract.Ethers.utils.parseUnits(amount_approve.toString(),contract_information.decimals)
                

                console.log('Formatted amoutn is ', formattedAmount)
                console.log('Owner is ', owner)
                console.log('Deployed contract owner is ', contract_information.deployed_contract.signer)
                

                try{
                    const approved_account = await contract_information.deployed_contract.contract.connect(contract_information.deployed_contract.signer).approve(owner,formattedAmount)

                    console.log('Approbved account wtf ', approved_account)
    
                    await approved_account.wait()
                    
    
                    toast_alert.success('Approved process completed successfully')
                    console.log('Approbved account after ', approved_account)
                    const isSaveApproved = await saveApprove(approved_account.hash,owner,await contract_information.deployed_contract.signer.getAddress(),Number(amount_approve.toString()),1)
                    
                    console.log('IsApproved is ', isSaveApproved)
                    setDisableApprove(false)
                }
                catch(err){
                    toast_alert.error('User rejected transaction') ? err.code == 4001 : toast_alert.error('Please try again')
                }
            }, 5000);
            }
        else{
            setDisableApprove(true)
            setTimeout(()=>{
                toast_alert.error('Please input valid metamask addresss')
                setDisableApprove(false)
            },3000)
        }
}


    //handleAllowance
    const handleAllowance = async (e) => {
        const metamaskAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        try{
            if(metamaskAddressRegex.test(spender)){
                setDisableAllowance(true)
                setTimeout(async (e) => {
                    setDisableAllowance(false)
                    const contract_information = await getContractInformation()  
                    const allowanceAmount = await contract_information.deployed_contract.contract.allowance(contract_information.deployed_contract.deployer, spender); 
                    const formattedAmount = contract_information.server_name == 'production' ? mytoken_contract_prod.Ethers.utils.formatUnits(allowanceAmount,contract_information.decimals) : mytoken_contract.Ethers.utils.formatUnits(allowanceAmount,contract_information.decimals)

                    toast_alert.success(`Allowed process completed successfully,spender balance is : ${formattedAmount}`)
                },5000);
            }
        else{
                setDisableAllowance(true)
                setTimeout(()=>{
                    toast_alert.error('Please input valid metamask addresss')
                    setDisableAllowance(false)
                },3000)
            }
        }
        catch(err){
            console.log('When you --- ALLOW  --- another metamask address encounteres come issues,please try again...')            
        }
    }

    
    //handleTransferFrom
    const handleTransferFrom = async (e) => {
        const metamaskAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
        try{
            const contract_information = await getContractInformation()  

            console.log('Contract information ', contract_information)

            const allowanceAmount = await contract_information.deployed_contract.contract.allowance(contract_information.deployed_contract.deployer, confirmedApproveAccount); 
            
            // const confirmedApproveAccountBalance = mytoken_contract.Ethers.utils.formatUnits(allowanceAmount, contract_information.decimals)
            const confirmedApproveAccountBalance = contract_information.server_name == 'production' ? mytoken_contract_prod.Ethers.utils.formatUnits(allowanceAmount,contract_information.decimals) : mytoken_contract.Ethers.utils.formatUnits(allowanceAmount,contract_information.decimals)

            


            if(recipient == confirmedApproveAccount){
                raiseAlertTransfer('You do not have permission to transfer this own.Plase approve another wallet address')
                return 
            }

            if(Number(amount_transfer) > Number(confirmedApproveAccountBalance)){
                raiseAlertTransfer('Approved account not enough token for transfer process,please increse approved token value')
                return 
            }

            if(metamaskAddressRegex.test(recipient) && metamaskAddressRegex.test(confirmedApproveAccount) != null && isCompletedApprove == true){
                setDisableTransfer(true)
                setTimeout(async (e) => {
                    setDisableTransfer(false)
                    const contract_information = await getContractInformation()  

                    // const formattedAmount = mytoken_contract.Ethers.utils.parseUnits(amount_transfer.toString(),contract_information.decimals)
                    // const formattedAmount = contract_information.server_name == 'production' ? mytoken_contract_prod.Ethers.utils.parseUnits(amount_transfer.toString(),contract_information.decimals) : mytoken_contract.Ethers.utils.parseUnits(amount_transfer.toString(),contract_information.decimals)

                    
                    // const seconSignerAddress = await mytoken_contract.ethers.getSigner(confirmedApproveAccount)
                    const seconSignerAddress = contract_information.server_name == 'production' ?  mytoken_contract_prod.ethers.getSigner(confirmedApproveAccount) : mytoken_contract.ethers.getSigner(confirmedApproveAccount)

                    console.log('Second address wtfffdsadsadsa ', seconSignerAddress)

                    console.log('Ay blet bunedii ala ', await contract_information.deployed_contract.signer.getAddress())


                    const formattedAmount = mytoken_contract_prod.Ethers.utils.parseUnits(amount_transfer, 18);
                    console.log('Formatted amount is ', formattedAmount)
                    const tx = await contract_information.deployed_contract.contract.connect(seconSignerAddress).transferFrom(contract_information.deployed_contract.deployer,recipient,formattedAmount)
                    
                    // const approved_account = await contract_information.deployed_contract.contract.connect(contract_information.deployed_contract.signer).approve(owner,formattedAmount)
                    console.log('Tx workk not ', tx)



                    await tx.wait()
                    toast_alert.success('Transfer From process completed successfully')
                },5000)
            }
            else{
                setDisableTransfer(true)
                setTimeout(() => {
                    setDisableTransfer(false)
                    toast_alert.error('Please first complete APPROVE account process and MetamaskAddress format')
                }, 3000);
            }
        }
        catch(err){
            toast_alert.error('Please first complete APPROVE account process')
        }
    }


    //handleUserBalance
    const handleUserBalance = async (address) => {
        const contract_information = await getContractInformation()  
        const contract = contract_information.server_name == 'production' ? ((await mytoken_contract_prod.deployContractProd()).contract) : (await mytoken_contract.deployContract()).contract 


        // const contract = (await mytoken_contract.deployContract()).contract
        
        const balance = await contract.balanceOf(address)
        const formattedBalance = mytoken_contract.Ethers.utils.formatEther(balance)
        return formattedBalance
    }


    useState(()=>{
        getServerName()
    },[])


    //returned jsx to client
    return(
        
        <>
            <div className="container">
                <div className="m-5">
                    <Header/>
                </div>
                <div className="bg-light text-left p-5 m-5 shadow">
                    <h1 className="mb-5 text-secondary">Transfer One Account To Another Coin</h1>
                    <hr/>
                    <h1 className="mb-5 text-secondary">Server Name : <span className="text-danger text-capitalize">{serverName}</span></h1>

                    {/* !Approve  */}
                    <form className="container mt-5 p-0" style={{marginLeft:'0.1px'}}>
                        Owner address : <b>{owner}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Amount for approver : <b>{amount_approve}</b>
                        <hr/>

                        <div className="row">
                            <div className='col-4'>
                                <input type="text" className="form-control p-3" id="approved_account_address" value={owner} onChange={(e)=>setOwner(e.target.value)}  placeholder="Approved address"/>
                            </div>

                            <div className="col-4">
                                <input type="number" className="form-control p-3" id="approved_account_amount" value={amount_approve} onChange={(e)=>setAmountApprove(e.target.value)} placeholder="Amount value"/>
                            </div>

                            
                            <div className="col-2">
                                <button type="button" onClick={handleApprove} className="btn btn-warning fw-bold w-20" style={{padding:'14px'}} disabled={disable_approve || !owner || !amount_approve }>
                                    {disable_approve ? 'Approving...' : 'Approve'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* !Allowance  */}
                    <form className="container mt-5 p-0" style={{marginLeft:'0.1px'}}>
                        Spender address : <b>{spender}</b>
                        <hr/>

                        <div className="row">
                            <div className="col-8">
                                <input type="text" className="form-control p-3" value={spender} onChange={(e)=>setSpender(e.target.value)}  placeholder="Spender address"/>
                            </div>
                            <div className="col-2">
                                <button type="button" onClick={handleAllowance} className="btn btn-info fw-bold w-20" style={{padding:'14px'}} disabled={disable_allowance || !spender}>
                                    {disable_allowance ? 'Allowed...' : 'Allow'}
                                </button>
                            </div>
                        </div>
                    </form>


                    {/* !Transfer From  */}
                    <form className="container mt-5 p-0" style={{marginLeft:'0.1px'}}>
                        Recipient address : <b>{recipient}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Transfer amount value : <b>{amount_transfer}</b>

                        <hr/>

                        <div className="row">
                            <div className="col-4">
                                <input type="text" className="form-control p-3" value={recipient} onChange={(e)=>setRecipient(e.target.value)}  placeholder="Recipient address"/>
                            </div>
                            <div className="col-4">
                                <input type="text" className="form-control p-3" value={amount_transfer} onChange={(e)=>setAmountTransfer(e.target.value)}  placeholder="Amount value"/>
                            </div>
                            <div className="col-2">
                                <button type="button" onClick={handleTransferFrom} className="btn btn-primary fw-bold w-20" style={{padding:'14px'}} disabled={disable_transfer || !recipient || !amount_transfer}>
                                    {disable_transfer ? 'Transferring...' : 'Transfer'}
                                </button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        
        </>

    )
}