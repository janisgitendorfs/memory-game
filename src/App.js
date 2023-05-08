import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [flashingBlocks, setFlashingBlocks] = useState([]);
  const [targetBlocks, setTargetBlocks] = useState([]);
  const [checkSelectedBlocks] = useState(null);
  const [points, setPoints] = useState(0);
  const [round, setRound] = useState(0);
  const [difficulty, setDifficulty] = useState(2);

  function handleClick(i) {
    if (selectedBlocks.length < difficulty) {
      setSelectedBlocks(selectedBlocks => [...selectedBlocks, i]);
    }
  }

  useEffect(() => {
    if (round !== 0 && round % 5 === 0 && difficulty <= 5)
    {
      console.log(`difficulty increased ... round: ${round} difficulty: ${difficulty}`);
      setDifficulty(currentDifficulty => currentDifficulty + 1);
    }

  }, [round])

  useEffect(() => {
    if (selectedBlocks.length < difficulty)
      return;

    let points = 0;
    if (selectedBlocks.every(e => targetBlocks.includes(e)))
    {
      points = difficulty - 1;
      setRound(round => round + 1);
    }

    setPoints(p => p + points);
    setTargetBlocks([]);
    setSelectedBlocks([]);
  }, [selectedBlocks]);

  useEffect(() => {
    const interval = setInterval(() => {
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
  }, [selectedBlocks, targetBlocks, difficulty]);

  function getRandomBlock() {
    return Math.floor(Math.random() * 100);
  }

  const blocks = [];
  for (let i = 0; i < 100; i++) {
    blocks.push(
      <div key={i} className={`block ${selectedBlocks.includes(i) ? "selected" : ""} ${flashingBlocks.includes(i) ? "flash" : ""}`} onClick={() => handleClick(i)}></div>
    );
  }

  return (
    <div className="App">
      <div>
        Points: {points}
      </div>
      <div className="game-board" onMouseDown={checkSelectedBlocks}>
        {blocks}
      </div>
    </div>
  );
}

export default App;