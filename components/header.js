//!Third Party Packages
import { useMoralis } from 'react-moralis'


//?Header
export default function Header(){
    const { enableWeb3, account } = useMoralis();

    return(
        <div>
            {
                account ? (
                    <div>
                        Connected to <h1>{account.slice(0,6)} ... {account.slice(account.length-4)}</h1>
                    </div>
                )
                :(
                    <button type="button" onClick={async () => {await enableWeb3()}}>
                        Connect Metamask
                    </button>
                )
            }
        </div>
    )
}