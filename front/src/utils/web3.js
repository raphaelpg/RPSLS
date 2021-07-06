import config from '../config/config';
import Web3 from 'web3';
// const Web3 = require('web3');
// import { AbiItem } from 'web3-utils';
// import irrigateContract from '../contracts/Irrigate.json';
// import React from 'react';

// const irrigateAddress = config.web3.irrigateAddress;
// const erc20Address = config.web3.erc20Address;

const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = window.ethereum.networkVersion;
      const obj = {
        connectedStatus: false,
        status: "",
        networkId: 0,
        address: ""
      };
      if (networkId !== config.default.web3.networkId) {
        obj.connectedStatus = false;
        obj.status = "🦊 Set network to Matic.";
        alert("Metamask must be set to Matic Mumbai-Testnet network: https://docs.matic.network/docs/develop/metamask/config-matic/");
        localStorage.setItem("web3", "disconnected");
      } else {
        obj.connectedStatus = true;
        obj.status = "Connected";
        obj.networkId = networkId;
        obj.address = accounts[0];
        localStorage.setItem("web3", "connected");
      };
      return obj;
    } catch (error) {
      if (error === 4001) {
        localStorage.setItem("web3", "disconnected");
        return {
          connectedStatus: false,
          status: "Rejected by user.",
          networkId: 0,
          address: ""
        };
      } else {
        localStorage.setItem("web3", "disconnected");
        return {
          connectedStatus: false,
          status: "🦊 Connect to Metamask using the button on the top right.",
          networkId: 0,
          address: ""
        };
      };
    };
  } else {
    localStorage.setItem("web3", "disconnected");
    console.log("Metamask not found");
    return {
      connectedStatus: false,
      status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html",
      networkId: 0,
      address: ""
    };
  }; 
};

// const createGame = () => {
//   // deploy contract
//   const web3 = new Web3(window.ethereum);
//   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//   const erc20Instance = new web3.eth.Contract(erc20Contract.abi, erc20Address);

//   let userBalance = await erc20Instance.methods.balanceOf(accounts[0]).call();
//   userBalance = web3.utils.fromWei(userBalance, 'ether');
// }

const handleChainChanged = () =>{
  window.location.reload();
}

const handleAccountsChanged = (accounts, currentAddress, setter) => {
  if (accounts.length === 0) {
    console.log('Please connect to MetaMask.');
    localStorage.setItem("web3", "disconnected");
    window.location.reload();
  } else if (accounts[0] !== currentAddress) {
    setter(accounts[0]);
    localStorage.setItem("web3", "connected");
  };
};

// const sendErc20Donation = async (
//   tx: ITransaction,
//   setDonationStatus: React.Dispatch<React.SetStateAction<{ code: number; msg: string; }>>,
//   retrieveAssociationsList: () => void
//   ) => {
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     tx.donorAddress = accounts[0];
//     tx.amount = Web3.utils.toWei(tx.amount, 'ether');
//     await fetch(config.server.serverUrl + config.server.sendDonation, {
//       method: 'POST',
//       body: JSON.stringify(tx),
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       }
//     })
//     .then(res => res.json()
//     )
//     .then(async (res) => {
//       if (res.status == 201) {
//         setDonationStatus({code: 1, msg: ""});
//         const txId: string = res.msg
//         const web3 = new Web3(window.ethereum);
//         const currentBlock = await web3.eth.getBlockNumber();
        
//         const erc20Instance = new web3.eth.Contract(erc20Contract.abi as AbiItem[], erc20Address);
//         erc20Instance.events.Transfer({
//           fromBlock: currentBlock,
//         })
//         .on("connected", () => {
//           console.log("ERC20 IN LISTENER: Started");
//         })
//         .on('data', (event: any) => {
//           let eventSender = event.returnValues[0].toLowerCase();
//           let eventReceiver = event.returnValues[1].toLowerCase();
//           let eventValue = event.returnValues[2];
//           if (eventSender == accounts[0].toLowerCase() && eventReceiver == irrigateAddress.toLowerCase() && eventValue == tx.amount) {
//             console.log("Donation received by Irrigate");
//             setDonationStatus({code: 2, msg: ""});
//           }
//         })
//         .on('error', () => {
//           setDonationStatus({code: 3, msg: "Server error, please retry later"});
//         })

//         const irrigateInstance = new web3.eth.Contract(irrigateContract.abi as any, irrigateAddress);
//         irrigateInstance.events.TokenTransfer({
//           fromBlock: currentBlock,
//         })
//         .on("connected", () => {
//           console.log("ERC20 OUT LISTENER: Started");
//         })
//         .on('data', (event: any) => {
//           if (event.returnValues.donationId == txId) {
//             console.log("Donation transferred");
//             setDonationStatus({code: 3, msg:"Success, your donation has been transferred to the association"});
//             retrieveAssociationsList();
//           }
//         })
//         .on('error', () => {
//           setDonationStatus({code: 3, msg: "Server error, please retry later"});
//         })

//         erc20Instance.methods.transfer(irrigateAddress, tx.amount)
//         .send({ from: accounts[0] })
//         .on('error', () => {
//           setDonationStatus({code: 3, msg: "Transaction rejected by user"});
//           tx.fundsStatus = "pending";
//           fetch(config.server.serverUrl + config.server.deleteDonation, {
//             method: 'DELETE',
//             body: JSON.stringify(tx),
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             }
//           })
//         })
        
//       } else {
//         setDonationStatus({code: 3, msg: "Server error, please retry later"});
//       }
//     })
//     .catch(error => {
//       console.log(error.message);
//       setDonationStatus({code: 3, msg: "Server error, please retry later"});
//       console.log("Server error, please retry later");
//     });
// }

const convertFromWei = (stringValue) => {
  return parseFloat(Web3.utils.fromWei(stringValue, 'ether')).toFixed(2);
}

const convertToWei = (stringValue) => {
  return Web3.utils.toWei(stringValue, 'ether')
}

// const checkUserERC20Balance = async (stringMin) => {
//   const web3 = new Web3(window.ethereum);
//   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//   const erc20Instance = new web3.eth.Contract(erc20Contract.abi, erc20Address);

//   let userBalance = await erc20Instance.methods.balanceOf(accounts[0]).call();
//   userBalance = web3.utils.fromWei(userBalance, 'ether');
//   if (parseInt(userBalance) >= parseInt(stringMin)) {
//     return true;
//   } else {
//     return false;
//   }
// }

export const web3Services = {
  connectWallet,
  handleChainChanged,
  handleAccountsChanged,
  // sendErc20Donation,
  convertFromWei,
  convertToWei,
  // checkUserERC20Balance
};