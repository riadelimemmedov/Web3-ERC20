//!Third Party Packages
import { MoralisProvider } from "react-moralis";


//?MyApp
function MyApp({Component,pageProps}){
    return(
        <>
            <MoralisProvider initializeOnMount={false}>
                <Component {...pageProps}/>
            </MoralisProvider>
        </>
    )
} 
export default MyApp