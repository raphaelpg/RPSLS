import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import config from './config/config';
import RPSFactory from './contracts/contracts/RPS.sol/RPSFactory.json';
import RPS from './contracts/contracts/RPS.sol/RPS.json';
import './App.css';

enum Move {
  Null, Rock, Paper, Scissors, Spock, Lizard
}

interface gameStatus {
  networkId: number,
  userAddress: string,
  userBalance: number,
  previousBalance: number,
  currentRPSAddress: string,
  openMenu: boolean,
  startNewGame: boolean,
  opponentAddress: string,
  j1Address: string,
  j2Address: string,
  j1Stake: number,
  currentStake: number,
  c1: Move,
  salt: number,
  c1Hash: string | null,
  c2: Move,
  retrievedC2: Move,
  gameResult: string
};

const App = () => {
  const [gameStatus, setGameStatus] = useState<gameStatus>({
    networkId: 0,
    userAddress: "",
    userBalance: 0,
    previousBalance: 0,
    currentRPSAddress: "",
    openMenu: false,
    startNewGame: false,
    opponentAddress: "",
    j1Address: "",
    j2Address: "",
    j1Stake: 0,
    currentStake: 0,
    c1: 0,
    salt: 0,
    c1Hash: "",
    c2: 0,
    retrievedC2: 0,
    gameResult: "",
  });

  useEffect(() => {
    if (gameStatus.userAddress !== "") {
      getContractInfos();
    }
  }, [gameStatus.userAddress]);

  const connectWallet: React.MouseEventHandler<HTMLButtonElement> | undefined = async () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const networkId = window.ethereum.networkVersion;
        if (networkId !== config.web3.networkId) {
          alert("Metamask must be set to Matic Mumbai-Testnet network: https://docs.matic.network/docs/develop/metamask/config-matic/");
        } else {
          const web3 = new Web3(window.ethereum);
          const userBalanceInWei = await web3.eth.getBalance(accounts[0]);
          const userBalance = parseInt(Web3.utils.fromWei(userBalanceInWei, 'ether'));
          setGameStatus({ 
            ...gameStatus, 
            networkId: networkId,
            userAddress: accounts[0].toLowerCase(),
            userBalance: userBalance,
          });
        };
      } catch (error) {
        if (error === 4001) {
          alert("Metamask must be set to Matic Mumbai-Testnet network: https://docs.matic.network/docs/develop/metamask/config-matic/");
        } else {
          alert("Metamask must be set to Matic Mumbai-Testnet network: https://docs.matic.network/docs/develop/metamask/config-matic/");
        };
      };
    } else {
      console.log("Metamask not found");
    }; 
  }

  const getContractInfos = async () => {
    console.log("getContractInfos");
    const web3 = new Web3(window.ethereum);
    const RPSFactoryInstance: any = new web3.eth.Contract(RPSFactory.abi as AbiItem[], config.web3.RPSFactoryAddress);
    const _currentRPSAddress = await RPSFactoryInstance.methods.currentRPSAddress().call();
    
    if (_currentRPSAddress !== "0x0000000000000000000000000000000000000000") {
      const RPSInstance: any = new web3.eth.Contract(RPS.abi as AbiItem[], _currentRPSAddress);
      const _j1 = await RPSInstance.methods.j1().call();
      const _j2 = await RPSInstance.methods.j2().call();
      const _currentStake = await RPSInstance.methods.stake().call();
      const _retrievedC2 = await RPSInstance.methods.c2().call();
      setGameStatus({ 
        ...gameStatus, 
        openMenu: true, 
        currentRPSAddress: _currentRPSAddress.toLowerCase(), 
        j1Address: _j1.toLowerCase(), 
        j2Address: _j2.toLowerCase(), 
        currentStake: parseFloat(Web3.utils.fromWei(_currentStake.toString(), 'ether')), 
        retrievedC2: parseInt(_retrievedC2) 
      });
    } else {
      setGameStatus({ 
        ...gameStatus, 
        openMenu: true, 
        currentRPSAddress: _currentRPSAddress
      })
    }
  }
  
  const startNewGame = () => {
    console.log("Start new game");
    setGameStatus({ ...gameStatus, startNewGame: true });
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGameStatus(prevGameStatus => ({
      ...prevGameStatus,
      [name]: value,
    }));
  };
  
  const createGameContract = async () => {
    //Hash j1 choice
    const _c1Hash = Web3.utils.soliditySha3({t: 'uint8', v: gameStatus.c1}, {t: 'uint256', v: gameStatus.salt});
    setGameStatus({ 
      ...gameStatus, 
      c1Hash: _c1Hash
    });

    //Call factory contract createRPS function createRPS (bytes32 _c1Hash, address payable _j2) with value stake
    const web3 = new Web3(window.ethereum);
    const RPSFactoryInstance: any = new web3.eth.Contract(RPSFactory.abi as AbiItem[], config.web3.RPSFactoryAddress);
    RPSFactoryInstance.methods.createRPS(_c1Hash, gameStatus.opponentAddress).send({
      from: gameStatus.userAddress,
      value: Web3.utils.toWei(gameStatus.j1Stake.toString(), 'ether')
    }).on('receipt', async (receipt: any) => {
      console.log(receipt)
      getContractInfos();
    });
  }

  const j2Answer = async () => {
    console.log(gameStatus)
    //Call contract play function with c2 move argument
    const web3 = new Web3(window.ethereum);
    const RPSInstance: any = new web3.eth.Contract(RPS.abi as AbiItem[], gameStatus.currentRPSAddress);
    
    await RPSInstance.methods.play(gameStatus.c2).send({
      from: gameStatus.userAddress,
      value: Web3.utils.toWei(gameStatus.currentStake.toString(), 'ether')
    }).on('receipt', async (receipt: any) => {
      console.log(receipt);
      getContractInfos();
    });
  }

  const solve = async () => {
    //prevbalance = userBalance
    const previousUserBalance = gameStatus.userBalance;
    const previousStake = gameStatus.currentStake;
    //Call contract solve function with c1 move and salt
    const web3 = new Web3(window.ethereum);
    const RPSInstance: any = new web3.eth.Contract(RPS.abi as AbiItem[], gameStatus.currentRPSAddress);
    
    await RPSInstance.methods.solve(gameStatus.c1, gameStatus.salt).send({
      from: gameStatus.userAddress
    }).on('receipt', async (receipt: any) => {
      console.log(receipt);
      //Update userBalance
      const userBalanceInWei = await web3.eth.getBalance(gameStatus.userAddress);
      const userBalance = parseInt(Web3.utils.fromWei(userBalanceInWei, 'ether'));
      setGameStatus({ 
        ...gameStatus, 
        userBalance: userBalance
      });
      getContractInfos();
      //check balance for result
      if (gameStatus.userBalance > previousUserBalance + (2 * previousStake)) {
        setGameStatus({
          ...gameStatus,
          gameResult: "You win"
        })
      } else if (gameStatus.userBalance < previousUserBalance - (2 * previousStake)) {
        setGameStatus({
          ...gameStatus,
          gameResult: "You lost"
        })
      } else {
        setGameStatus({
          ...gameStatus,
          gameResult: "Draw"
        })
      }
    });
  }

  const claimTimeout = () => {
    console.log("Claim timeout")
    // call j1 or j2 timeout depending on userAddress
  }

  const columnDisplay = {
    display: "flex", flexDirection: "column"
  } as const;
  const spaceBetween = {
    display: "flex", justifyContent: "space-between"
  }

  console.log(gameStatus)
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Rock Paper Scissors Lizard Spock
        </h1>
        <button onClick={() => getContractInfos()}>Get contract infos</button>
        {gameStatus.openMenu ?
          <div>
            <div>
              <h2>Player Status</h2>
              <p>Player address: {gameStatus.userAddress}</p>
              <p>Player balance: {gameStatus.userBalance} ETH</p>
            </div>
            <div>
              <h2>Game Status</h2>
                {gameStatus.j1Address === gameStatus.userAddress ? 
                  <div>
                    <p>Current game on, you are player 1</p>
                    {gameStatus.retrievedC2 === 0 ?
                      <div>
                        <p>Waiting for player 2 to play</p>
                        <p>Timeout coundown: 5:00</p>
                        <button onClick={claimTimeout}>Claim Timeout</button>
                      </div>
                      :
                      <div>
                        <p>Player 2 has replied</p>
                        <label style={spaceBetween}>Confirm your previous move:
                          <select 
                            name="c1" 
                            id="c1" 
                            onChange={handleChange}
                            required
                          >
                            <option value="1">Rock</option>
                            <option value="2">Paper</option>
                            <option value="3">Scissors</option>
                            <option value="4">Lizard</option>
                            <option value="5">Spock</option>
                          </select>
                        </label>
                        <label style={spaceBetween}>Enter the previous positive number:
                          <input 
                            type="string" 
                            name="salt" 
                            id="salt" 
                            onChange={handleChange}
                            required
                          />
                        </label>
                        <button onClick={solve}>Solve game</button>
                      </div>
                    }
                  </div>
                  :
                  <div>
                    {gameStatus.j2Address === gameStatus.userAddress ?
                      <div>
                        <p>Current game playing, you are player #2</p>
                        {gameStatus.retrievedC2 === 0 ?
                          <div>
                            <p>You have been challenged by {gameStatus.j1Address}</p>
                            <p> for a stake of {gameStatus.currentStake} ETH</p>
                            <label style={spaceBetween}>Select your move:
                              <select 
                                name="c2" 
                                id="c2" 
                                onChange={handleChange}
                                required
                              >
                                <option value="1">Rock</option>
                                <option value="2">Paper</option>
                                <option value="3">Scissors</option>
                                <option value="4">Lizard</option>
                                <option value="5">Spock</option>
                              </select>
                            </label>
                            <button onClick={j2Answer}>Play</button>
                          </div>
                          :
                          <div>
                            <p>Waiting for player 1 to answer</p>
                            <p>Timeout coundown: 5:00</p>
                            <button onClick={claimTimeout}>Claim Timeout</button>
                          </div>
                        }
                      </div>
                      :
                      <div>
                        {gameStatus.startNewGame === false ?
                          <div>
                            <p>You are not involved in any game</p>
                            <button onClick={startNewGame}>Start a new game</button>
                          </div>
                          :
                          <div style={columnDisplay}>
                            <label style={spaceBetween}>Select your move:
                              <select 
                                name="c1" 
                                id="c1" 
                                onChange={handleChange}
                                required
                              >
                                <option value="1">Rock</option>
                                <option value="2">Paper</option>
                                <option value="3">Scissors</option>
                                <option value="4">Lizard</option>
                                <option value="5">Spock</option>
                              </select>
                            </label>
                            <label style={spaceBetween}>Enter your opponent address:
                              <input 
                                type="string" 
                                name="opponentAddress" 
                                id="opponentAddress" 
                                onChange={handleChange}
                                required
                              />
                            </label>
                            <label style={spaceBetween}>Enter a stake:
                              <input 
                                type="string" 
                                name="j1Stake" 
                                id="j1Stake" 
                                onChange={handleChange}
                                required
                              />
                            </label>
                            <label style={spaceBetween}>Enter a random positive number:
                              <input 
                                type="string" 
                                name="salt" 
                                id="salt" 
                                onChange={handleChange}
                                required
                              />
                            </label>
                            <button onClick={() => createGameContract()}>Start new game</button>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
            </div>
          </div>
          :
          <div>
            <p>No game started at this moment</p>
            <button onClick={connectWallet}>Play Game</button>
          </div>
        }
      </header>
    </div>
  );
}

export default App;