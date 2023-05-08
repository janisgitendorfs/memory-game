import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [flashingBlocks, setFlashingBlocks] = useState([]);
  const [targetBlocks, setTargetBlocks] = useState([]);
  const [points, setPoints] = useState(0);
  const [round, setRound] = useState(1);
  const [difficulty, setDifficulty] = useState(2);
  const [running, setRunning] = useState(true);

  const DIFFICULTY_INCREASE_PER_ROUNDS = 5;
  const MAX_DIFFICULTY = 3;
  const GAME_SIZE = 10;
  const MAX_ROUNDS = 15;

  function handleClick(i) {
    if (selectedBlocks.length < difficulty) {
      setSelectedBlocks(selectedBlocks => [...selectedBlocks, i]);
    }
  }

  // Upgrade difficulty each 5 rounds
  useEffect(() => {
    if (round % DIFFICULTY_INCREASE_PER_ROUNDS === 0 && difficulty <= MAX_DIFFICULTY)
    {
      setDifficulty(currentDifficulty => currentDifficulty + 1);
    }

    // !!! GAME ENDED !!!
    if (round - 1 === MAX_ROUNDS)
    {
      console.log("Game has ended with player having ..." + points);
      setRunning(false);
    }

  }, [round])

  // Each time move/selection is made
  useEffect(() => {
    if (selectedBlocks.length < difficulty)
      return;

    if (selectedBlocks.every(e => targetBlocks.includes(e)))
    {
      setPoints(p => p + difficulty - 1);
    }

    setRound(round => round + 1);
    setTargetBlocks([]);
    setSelectedBlocks([]);
  }, [selectedBlocks]);

  // If difficulty changes, selection is made or new target blocks are generated
  useEffect(() => {
    const interval = setInterval(() => {
      if (!running)
        return;

      setSelectedBlocks([]);

      const blocks = [];

      for (let i = 0; i < difficulty; i++) {
        let nextBlock = getRandomBlock();
        while (targetBlocks.includes(nextBlock) || targetBlocks.includes(nextBlock) || selectedBlocks.includes(nextBlock)) {
          nextBlock = getRandomBlock();
        }
        blocks.push(nextBlock);
      }
      
      setFlashingBlocks(blocks);
      setTargetBlocks(blocks);

      setTimeout(() => {
        setFlashingBlocks([]);
      }, 500);
    }, 3000);
    return () => {
      clearInterval(interval);
    }
  }, [selectedBlocks, targetBlocks, difficulty, running]);

  function getRandomBlock() {
    return Math.floor(Math.random() * GAME_SIZE * GAME_SIZE);
  }

  const blocks = [];
  for (let i = 0; i < GAME_SIZE * GAME_SIZE; i++) {
    blocks.push(
      <div key={i} className={`block ${selectedBlocks.includes(i) ? "selected" : ""} ${flashingBlocks.includes(i) ? "flash" : ""}`} onClick={() => handleClick(i)}></div>
    );
  }

  return (
    <div className="App">
      <div>
        Points: {points}
      </div>
      <div className={`game-board ${!running ? "hidden" : ""}`}>
        {blocks}
      </div>
    </div>
  );
}

export default App;