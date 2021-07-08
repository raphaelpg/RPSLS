import React, { useEffect, useState } from 'react';
import './App.css';

interface gameStatus {
  userAddress: string,
  userBalance: number,
  game: boolean,
  j1Address: string,
  j2Address: string,
  stake: number,
  c2: number
};

const App = () => {
  const [gameStatus, setGameStatus] = useState<gameStatus>({
    userAddress: "",
    userBalance: 0,
    game: false,
    j1Address: "",
    j2Address: "",
    stake: 0,
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
      userAddress: "0xC",
      userBalance: 10,
    });
  }

  const getContractInfos = () => {
    console.log("getContractInfos")
    setGameStatus({ ...gameStatus, game: true, j1Address: "0xB", j2Address: "0xC", c2: 0 });
  }

  const startNewGame = () => {
    console.log("Start new game");
    //Hash j1 choice
    //Deploy contract with constructor c1Hash, j2Address, msg.value = stake + contract creation gas
  }

  const j2Answer = () => {
    //Call contract play function with c2 move argument
  }

  const solve = () => {
    //Call contract solve function with c1 move and salt
  }

  const claimTimeout = () => {
    console.log("Claim timeout")
    // call j1 or j2 timeout depending on userAddress
  }

  console.log(gameStatus)
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Rock Paper Scissors Lizard Spock
        </h1>
        {gameStatus.game ?
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
                        <p>You are not involved in any game</p>
                        <button onClick={startNewGame}>Start a new game</button>
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
