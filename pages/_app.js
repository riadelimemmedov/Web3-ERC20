//!Third Party Packages
import { MoralisProvider } from "react-moralis";
import { ToastContainer, toast } from 'react-toastify';
import { Toaster } from "react-hot-toast";


//!Next.js
import Head from "next/head";


//?MyApp
function MyApp({Component,pageProps}){
    //jsx
    return(
        <>
            <Head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous"/>
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <Toaster/>
                <Component {...pageProps}/>
            </MoralisProvider>
            <ToastContainer />
        </>
    )
} 
export default MyApp