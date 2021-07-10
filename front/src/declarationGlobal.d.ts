declare global {
  interface Window {
    ethereum:any,
    web3: any;
  }
} 

let ethereum = window.ethereum;
export {}