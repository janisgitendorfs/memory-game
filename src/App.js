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
    console.log(difficulty);
  }, [round])

  useEffect(() => {
    if (selectedBlocks.length === difficulty) {

      console.log(selectedBlocks);
      console.log(targetBlocks);

      let points = 0;
      if (selectedBlocks.every(e => targetBlocks.includes(e)))
      {
        points = 1;
      }

      setPoints(p => p + points);
      setTargetBlocks([]);
      setSelectedBlocks([]);
      setRound(round => round + 1);
    }
  }, [selectedBlocks, targetBlocks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedBlocks([]);

      setRound(round => round + 1)

      const block1 = getRandomBlock();
      let block2 = getRandomBlock();
      while (block2 === block1 || targetBlocks.includes(block2) || selectedBlocks.includes(block2)) {
        block2 = getRandomBlock();
      }
      setFlashingBlocks([block1, block2]);
      setTargetBlocks([block1, block2]);
      setTimeout(() => {
        setFlashingBlocks([]);
      }, 500);
    }, 5000);
    return () => {
      clearInterval(interval);
    }
  }, [selectedBlocks, flashingBlocks]);

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