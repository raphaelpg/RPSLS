import React, { useEffect, useState } from 'react';
import './App.css';

enum Move {
  Null, Rock, Paper, Scissors, Spock, Lizard
}

interface gameStatus {
  userAddress: string,
  userBalance: number,
  openMenu: boolean,
  startNewGame: boolean,
  opponentAddress: string,
  j1Address: string,
  j2Address: string,
  stake: number,
  c1: Move,
  c1Hash: string,
  c2: Move,
};

const App = () => {
  const [gameStatus, setGameStatus] = useState<gameStatus>({
    userAddress: "",
    userBalance: 0,
    openMenu: false,
    startNewGame: false,
    opponentAddress: "",
    j1Address: "",
    j2Address: "",
    stake: 0,
    c1: 0,
    c1Hash: "",
    c2: 0
  });

  useEffect(() => {
    if (gameStatus.userAddress !== "") {
      getContractInfos();
    }
  }, [gameStatus.userAddress]);

  const connectWallet: React.MouseEventHandler<HTMLButtonElement> | undefined = () => {
    setGameStatus({ 
      ...gameStatus, 
      userAddress: "0xA",
      userBalance: 10,
    });
  }

  const getContractInfos = () => {
    console.log("getContractInfos");
    setGameStatus({ ...gameStatus, openMenu: true, j1Address: "0xB", j2Address: "0xC", c2: 0 });
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
  
  const createGameContract = () => {
    //Hash j1 choice
    //Deploy contract with constructor c1Hash, j2Address, msg.value = stake + contract creation gas
    console.log(`deploy contract construct: c1: ${gameStatus.c1}, c1Hash: hash, opponent: ${gameStatus.opponentAddress}, stake: ${gameStatus.stake}`)
  }

  const j2Answer = () => {
    //Call contract play function with c2 move argument
  }

  const solve = () => {
    //Call contract solve function with c1 move and salt
    //Update userBalance
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
        {gameStatus.openMenu ?
          <div>
            <div>
              <h2>Player Status</h2>
              <p>Player address: {gameStatus.userAddress}</p>
              <p>Player balance: {gameStatus.userBalance}</p>
            </div>
            <div>
              <h2>Game Status</h2>
                {gameStatus.j1Address === gameStatus.userAddress ? 
                  <div>
                    <p>Current game on, you are player 1</p>
                    {gameStatus.c2 === 0 ?
                      <div>
                        <p>Waiting for player 2 to play</p>
                        <p>Timeout coundown: 5:00</p>
                        <button onClick={claimTimeout}>Claim Timeout</button>
                      </div>
                      :
                      <div>
                        <p>Player 2 has replied</p>
                        <button onClick={solve}>Solve game</button>
                      </div>
                    }
                  </div>
                  :
                  <div>
                    {gameStatus.j2Address === gameStatus.userAddress ?
                      <div>
                        <p>Current game playing, you are player 2</p>
                        {gameStatus.c2 === 0 ?
                          <div>
                            <p>Your turn</p>
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
                                name="stake" 
                                id="stake" 
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