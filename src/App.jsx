import { useState, useEffect } from 'react'
import './App.css'

async function getPokemon(e) {
  const array = [];
  const ids = new Set();

  while (array.length < e) {
    const id = Math.floor(Math.random() * 151) + 1;

    if (!ids.has(id)) {
      ids.add(id);

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { mode: 'cors' });
      const { name, sprites } = await response.json();
      const sprite = sprites.other.dream_world.front_default;

      array.push({ name, sprite, id });
    }
  }
  
  return array;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}



/*function App() {
  const [cards, setCards] = useState([]);
  /*const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);*/



function Game1({ cards, setCards, onGameOver, onWin, turns }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedIds.length === cards.length) {
      setMessage("¡Ganaste!");
      onWin();
    }
  }, [selectedIds, cards, onWin]);

  const isEqual = (id) => {
    if (selectedIds.includes(id)) {
      setMessage("Perdiste, seleccionaste un Pokémon repetido.");
      onGameOver();
    } else {
      setSelectedIds([...selectedIds, id]);
      setCards(shuffle([...cards]));
    }
  };

  return (
    <div>
      <p>{message}</p>
      <div className="card-grid">
        {cards.map((card) => (
          <div
            className="card"
            key={card.id}
            onClick={() => isEqual(card.id)}
          >
            <div className="card-front">
              <img src={card.sprite} alt={card.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GameOverScreen({ onRestart }) {
  return (
    <div className="game-over-screen">
      <h2>¡Perdiste!</h2>
      <button onClick={onRestart}>Reiniciar Juego</button>
    </div>
  );
}

function GameWinScreen({ onRestart }) {
  return (
    <div className="game-over-screen">
      <h2>Sos un genio!</h2>
      <button onClick={onRestart}>Reiniciar Juego</button>
    </div>
  );
}

function VictoryScreen ({ onRestart }) {
  return (
    <div className="game-over-screen">
      <h2>¡Ganaste!</h2>
      <button onClick={onRestart}>Siguiente nivel!</button>
    </div>
  );
}


function App() {
  const [cards, setCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [difficulty, setDifficulty] = useState(0);
  const [turns, setTurns] = useState(0);
  const [victory, setVictory] = useState(false);

  const startGame = async () => {
    const array = await getPokemon(5 + difficulty);
    setCards(shuffle(array));
    setGameStarted(true);
    setIsGameOver(false);
    setIsWin(false);
    setVictory(false);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    setDifficulty(0);
    setTurns(0);
  };

  const handleVictory = () => {
    setVictory(true);
    setDifficulty(0);
    setTurns(0);
  };

  const handleWin = () => {

    if (turns === 5) {
      handleVictory();
      return;
    } else {
      setIsWin(true);
    }

    setDifficulty(difficulty + 3);
    setTurns(turns + 1);
  };

  return (
    <div className="App">
      <h1>Pokémon Memory Game</h1>
      {!gameStarted ? (
        <button onClick={startGame}>New Game</button>
      ) : isGameOver ? (
        <GameOverScreen onRestart={startGame} />
      ) : isWin ? (
        <VictoryScreen onRestart={startGame} />
      ) : victory ? (
        <GameWinScreen onRestart={startGame} />
      ) : (
        <Game1 cards={cards} setCards={setCards} onGameOver={handleGameOver} onWin={handleWin} />
      )}
    </div>
  );
}

export default App;