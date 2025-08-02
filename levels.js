import React, { useState, useEffect } from 'react';

// 10 Pre-defined easy puzzles for testing
const EASY_PUZZLES = [
  {
    id: 1,
    gridSize: 3,
    solution: [
      [1, 2, 3],
      [2, 1, 2],
      [3, 2, 1]
    ],
    rowTargets: [6, 5, 6],
    colTargets: [6, 5, 6]
  },
  {
    id: 2,
    gridSize: 3,
    solution: [
      [2, 3, 1],
      [1, 1, 3],
      [3, 2, 2]
    ],
    rowTargets: [6, 5, 7],
    colTargets: [6, 6, 6]
  },
  {
    id: 3,
    gridSize: 4,
    solution: [
      [1, 2, 1, 2],
      [2, 1, 2, 1],
      [1, 3, 1, 1],
      [2, 2, 2, 2]
    ],
    rowTargets: [6, 6, 6, 8],
    colTargets: [6, 8, 6, 6]
  },
  {
    id: 4,
    gridSize: 3,
    solution: [
      [3, 1, 2],
      [2, 2, 1],
      [1, 3, 3]
    ],
    rowTargets: [6, 5, 7],
    colTargets: [6, 6, 6]
  },
  {
    id: 5,
    gridSize: 4,
    solution: [
      [2, 1, 3, 2],
      [1, 3, 1, 3],
      [3, 2, 2, 1],
      [1, 1, 2, 2]
    ],
    rowTargets: [8, 8, 8, 6],
    colTargets: [7, 7, 8, 8]
  },
  {
    id: 6,
    gridSize: 3,
    solution: [
      [1, 1, 4],
      [2, 3, 1],
      [4, 2, 1]
    ],
    rowTargets: [6, 6, 7],
    colTargets: [7, 6, 6]
  },
  {
    id: 7,
    gridSize: 4,
    solution: [
      [1, 1, 2, 3],
      [2, 2, 1, 2],
      [3, 1, 3, 1],
      [2, 3, 2, 1]
    ],
    rowTargets: [7, 7, 8, 8],
    colTargets: [8, 7, 8, 7]
  },
  {
    id: 8,
    gridSize: 3,
    solution: [
      [2, 2, 2],
      [3, 1, 2],
      [1, 3, 2]
    ],
    rowTargets: [6, 6, 6],
    colTargets: [6, 6, 6]
  },
  {
    id: 9,
    gridSize: 4,
    solution: [
      [3, 1, 1, 3],
      [1, 2, 3, 2],
      [2, 3, 2, 1],
      [1, 1, 1, 1]
    ],
    rowTargets: [8, 8, 8, 4],
    colTargets: [7, 7, 7, 7]
  },
  {
    id: 10,
    gridSize: 3,
    solution: [
      [4, 1, 1],
      [1, 2, 3],
      [1, 3, 2]
    ],
    rowTargets: [6, 6, 6],
    colTargets: [6, 6, 6]
  }
];

const CrossSumTestGame = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [grid, setGrid] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const currentPuzzle = EASY_PUZZLES[currentPuzzleIndex];

  useEffect(() => {
    initializePuzzle();
  }, [currentPuzzleIndex]);

  const initializePuzzle = () => {
    const emptyGrid = [];
    for (let i = 0; i < currentPuzzle.gridSize; i++) {
      const row = [];
      for (let j = 0; j < currentPuzzle.gridSize; j++) {
        row.push('');
      }
      emptyGrid.push(row);
    }
    setGrid(emptyGrid);
    setIsComplete(false);
    setMoves(0);
    setShowSolution(false);
  };

  const handleCellChange = (row, col, value) => {
    const numValue = parseInt(value) || '';
    if (numValue > 5 || numValue < 0) return; // Easy level: 1-5

    const newGrid = grid.map((r, rIndex) =>
      r.map((c, cIndex) => (rIndex === row && cIndex === col ? numValue : c))
    );
    
    setGrid(newGrid);
    setMoves(moves + 1);
    checkCompletion(newGrid);
  };

  const checkCompletion = (currentGrid) => {
    // Check if grid is completely filled
    for (let i = 0; i < currentPuzzle.gridSize; i++) {
      for (let j = 0; j < currentPuzzle.gridSize; j++) {
        if (currentGrid[i][j] === '' || currentGrid[i][j] === 0) {
          return;
        }
      }
    }

    // Check row sums
    for (let i = 0; i < currentPuzzle.gridSize; i++) {
      const rowSum = currentGrid[i].reduce((sum, num) => sum + (parseInt(num) || 0), 0);
      if (rowSum !== currentPuzzle.rowTargets[i]) {
        return;
      }
    }

    // Check column sums
    for (let j = 0; j < currentPuzzle.gridSize; j++) {
      let colSum = 0;
      for (let i = 0; i < currentPuzzle.gridSize; i++) {
        colSum += parseInt(currentGrid[i][j]) || 0;
      }
      if (colSum !== currentPuzzle.colTargets[j]) {
        return;
      }
    }

    setIsComplete(true);
    const scoreEarned = currentPuzzle.gridSize * currentPuzzle.gridSize * 10;
    setScore(score + scoreEarned);
  };

  const getCurrentRowSum = (rowIndex) => {
    return grid[rowIndex].reduce((sum, num) => sum + (parseInt(num) || 0), 0);
  };

  const getCurrentColSum = (colIndex) => {
    let sum = 0;
    for (let i = 0; i < currentPuzzle.gridSize; i++) {
      sum += parseInt(grid[i][colIndex]) || 0;
    }
    return sum;
  };

  const nextPuzzle = () => {
    if (currentPuzzleIndex < EASY_PUZZLES.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
    } else {
      alert('Congratulations! You completed all test puzzles!');
    }
  };

  const prevPuzzle = () => {
    if (currentPuzzleIndex > 0) {
      setCurrentPuzzleIndex(currentPuzzleIndex - 1);
    }
  };

  const getTargetClass = (current, target) => {
    if (current === target && current > 0) return 'target-correct';
    if (current > target) return 'target-over';
    return 'target-default';
  };

  const toggleSolution = () => {
    if (!showSolution) {
      setGrid(currentPuzzle.solution.map(row => [...row]));
      setShowSolution(true);
    } else {
      initializePuzzle();
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 15px 0', color: '#333' }}>Cross Sum Test Game</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ padding: '8px 16px', background: '#667eea', color: 'white', borderRadius: '20px' }}>
            Puzzle: {currentPuzzleIndex + 1}/10
          </div>
          <div style={{ padding: '8px 16px', background: '#667eea', color: 'white', borderRadius: '20px' }}>
            Score: {score}
          </div>
          <div style={{ padding: '8px 16px', background: '#667eea', color: 'white', borderRadius: '20px' }}>
            Moves: {moves}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={prevPuzzle}
          disabled={currentPuzzleIndex === 0}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '25px',
            background: currentPuzzleIndex === 0 ? '#ccc' : '#4facfe',
            color: 'white',
            cursor: currentPuzzleIndex === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          ← Previous
        </button>
        
        <button 
          onClick={initializePuzzle}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '25px',
            background: '#10b981',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          🔄 Reset
        </button>

        <button 
          onClick={toggleSolution}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '25px',
            background: showSolution ? '#ef4444' : '#f59e0b',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {showSolution ? '❌ Hide Solution' : '💡 Show Solution'}
        </button>

        <button 
          onClick={nextPuzzle}
          disabled={currentPuzzleIndex === EASY_PUZZLES.length - 1}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '25px',
            background: currentPuzzleIndex === EASY_PUZZLES.length - 1 ? '#ccc' : '#4facfe',
            color: 'white',
            cursor: currentPuzzleIndex === EASY_PUZZLES.length - 1 ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          Next →
        </button>
      </div>

      {/* Puzzle Grid */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '20px' 
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          {/* Column targets */}
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <div style={{ width: '60px', height: '60px' }}></div>
            {currentPuzzle.colTargets.map((target, index) => (
              <div 
                key={index}
                className={getTargetClass(getCurrentColSum(index), target)}
                style={{
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '1.2rem',
                  marginRight: '5px',
                  borderRadius: '10px',
                  background: getCurrentColSum(index) === target ? '#22c55e' : 
                             getCurrentColSum(index) > target ? '#ef4444' : '#f3f4f6',
                  color: getCurrentColSum(index) === target || getCurrentColSum(index) > target ? 'white' : '#333'
                }}
              >
                {target}
              </div>
            ))}
          </div>

          {/* Main grid */}
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', marginBottom: '5px' }}>
              {/* Row target */}
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '1.2rem',
                  marginRight: '5px',
                  borderRadius: '10px',
                  background: getCurrentRowSum(rowIndex) === currentPuzzle.rowTargets[rowIndex] ? '#22c55e' : 
                             getCurrentRowSum(rowIndex) > currentPuzzle.rowTargets[rowIndex] ? '#ef4444' : '#f3f4f6',
                  color: getCurrentRowSum(rowIndex) === currentPuzzle.rowTargets[rowIndex] || getCurrentRowSum(rowIndex) > currentPuzzle.rowTargets[rowIndex] ? 'white' : '#333'
                }}
              >
                {currentPuzzle.rowTargets[rowIndex]}
              </div>
              
              {/* Grid cells */}
              {row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="number"
                  min="1"
                  max="5"
                  value={cell}
                  onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  style={{
                    width: '60px',
                    height: '60px',
                    border: '2px solid #ddd',
                    borderRadius: '10px',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginRight: '5px',
                    background: isComplete ? '#d1fae5' : 'white'
                  }}
                  disabled={isComplete || showSolution}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Completion message */}
      {isComplete && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#22c55e', margin: '0 0 10px 0' }}>🎉 Puzzle {currentPuzzleIndex + 1} Complete!</h2>
          <p>Solved in {moves} moves!</p>
          <p>Points earned: +{currentPuzzle.gridSize * currentPuzzle.gridSize * 10}</p>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>Test Instructions:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Fill each cell with numbers 1-5 (Easy level)</li>
          <li>Each row must add up to its target (left side)</li>
          <li>Each column must add up to its target (top)</li>
          <li>Green = correct sum, Red = too high, Gray = incomplete</li>
          <li>Use "Show Solution" to see the correct answer</li>
          <li>Navigate through all 10 test puzzles to verify the game works</li>
        </ul>
      </div>
    </div>
  );
};

export default CrossSumTestGame;