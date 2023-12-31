//!Third Party Packages
import { MoralisProvider } from "react-moralis";
import { ToastContainer, toast } from 'react-toastify';
import { Toaster } from "react-hot-toast";


//!Css classes
import './../css/header.css'


//!Custom styles
import './../css/Pagination.css'


//!Next.js
import Head from "next/head";
import { useState } from "react";


//*Environment variables
require('dotenv').config()


//?MyApp
function MyApp({Component,pageProps}){

    //return jsx to client
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