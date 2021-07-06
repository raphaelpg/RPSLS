import React, { useState, useEffect } from 'react';
import { web3Services } from '../../utils/web3.js';
import config from '../../config/config';

const ConnectWallet = () => {
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");

  const connectToWeb3 = async () => {
    const walletResponse = await web3Services.connectWallet();
    setConnectedStatus(walletResponse.connectedStatus);
    setWallet(walletResponse.address);
  }

  const checkWalletConnection = async () => {
    if (window.ethereum) {

      window.ethereum.on('chainChanged', web3Services.handleChainChanged);
      window.ethereum.on('accountsChanged', (accounts) => web3Services.handleAccountsChanged(accounts, walletAddress, setWallet));

      try {
        const networkId = window.ethereum.networkVersion;
        if (networkId === config.default.web3.networkId) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length) {
            setConnectedStatus(true);
            setWallet(accounts[0]);
            localStorage.setItem("web3", "connected");
          } else {
            setConnectedStatus(false);
            // setStatus("🦊 Connect to Metamask using the top right button.");
            localStorage.setItem("web3", "disconnected");
          }
        } else {
          setConnectedStatus(false);
          // setStatus("🦊 Set network to Matic.");
          localStorage.setItem("web3", "disconnected");
        }
      } catch {
        setConnectedStatus(false);
        // setStatus("🦊 Connect to Metamask using the top right button.");
        localStorage.setItem("web3", "disconnected");
      }
    }  
  }

  useEffect(() => {
    checkWalletConnection();
  });

  return(
    <div className="walletContainer">
      { isConnected ? 
        <div className="walletStatus">Connected</div>
        :
        ""  
      }
      { isConnected ?  
        <div className="walletAddress">{walletAddress.substr(0, 6) + "..." + walletAddress.slice(-4)}</div>  
        :
        <button className="wallet-button" onClick={connectToWeb3}>Connect Wallet</button>
      }
    </div>
  );
};

export default ConnectWallet;