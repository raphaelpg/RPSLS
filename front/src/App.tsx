import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';

interface playerStatus {
  address: string
};

interface gameStatus {
  game: boolean,
  j1Address: string,
  j2Address: string
};

const App = () => {
  const [playerStatus, setPlayerStatus] = useState<playerStatus>({address: ""});
  const [gameStatus, setGameStatus] = useState<gameStatus>({
    game: false,
    j1Address: "",
    j2Address: "",
  });

  useEffect(() => {
    setPlayerStatus({ address: "0x" });
    // const userAccount = "0xAA";
    // const j1Address = "0xAA";
    // if (userAccount === j1Address) {
    //   setGameStatus({ ...gameStatus, game: true }); 
    // };
  }, []);

  const playGame: React.MouseEventHandler<HTMLButtonElement> | undefined = () => {
    console.log("play")
    setGameStatus({ ...gameStatus, game: true });
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>
          Rock Paper Scissors Lizard Spock
        </h1>
        {gameStatus.game ?
          <div>
            <div>
              <h2>Player Status</h2>
              <p>Player address: {playerStatus.address}</p>
            </div>
            <div>
              <h2>Game Status</h2>
                <div>
                  <p>Joueur 1 Address: {gameStatus.j1Address}</p>
                  <p>Joueur 2 Address: {gameStatus.j1Address}</p>
                </div>
            </div>
          </div>
          :
          <div>
            <p>No game started at this moment</p>
            <button onClick={playGame}>Play Game</button>
          </div>
        }
      </header>
    </div>
  );
}

export default App;
