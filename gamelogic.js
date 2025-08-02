// utils/gameLogic.js

/**
 * Generate a new cross sum puzzle
 * @param {number} gridSize - Size of the grid (3-6)
 * @param {string} difficulty - 'Easy', 'Medium', or 'Hard'
 * @returns {Object} Puzzle data including grid, targets, and solution
 */
export const generatePuzzle = (gridSize, difficulty) => {
  const maxNum = getMaxNumber(difficulty);
  const solution = generateRandomSolution(gridSize, maxNum);
  const rowTargets = calculateAllRowSums(solution);
  const colTargets = calculateAllColSums(solution);
  const emptyGrid = createEmptyGrid(gridSize);

  return {
    grid: emptyGrid,
    rowTargets,
    colTargets,
    solution
  };
};

/**
 * Get maximum number allowed for difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {number} Maximum number allowed
 */
const getMaxNumber = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 5;
    case 'Medium': return 7;
    case 'Hard': return 9;
    default: return 5;
  }
};

/**
 * Generate a random solution grid
 * @param {number} gridSize - Size of the grid
 * @param {number} maxNum - Maximum number allowed
 * @returns {Array<Array<number>>} 2D array representing the solution
 */
const generateRandomSolution = (gridSize, maxNum) => {
  const solution = [];
  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push(Math.floor(Math.random() * maxNum) + 1);
    }
    solution.push(row);
  }
  return solution;
};

/**
 * Create an empty grid filled with empty strings
 * @param {number} gridSize - Size of the grid
 * @returns {Array<Array<string>>} Empty 2D array
 */
const createEmptyGrid = (gridSize) => {
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push('');
    }
    grid.push(row);
  }
  return grid;
};

/**
 * Calculate sum of all rows in a grid
 * @param {Array<Array<number>>} grid - The grid to calculate sums for
 * @returns {Array<number>} Array of row sums
 */
const calculateAllRowSums = (grid) => {
  return grid.map(row => row.reduce((sum, num) => sum + num, 0));
};

/**
 * Calculate sum of all columns in a grid
 * @param {Array<Array<number>>} grid - The grid to calculate sums for
 * @returns {Array<number>} Array of column sums
 */
const calculateAllColSums = (grid) => {
  const gridSize = grid.length;
  const colSums = [];
  
  for (let j = 0; j < gridSize; j++) {
    let colSum = 0;
    for (let i = 0; i < gridSize; i++) {
      colSum += grid[i][j];
    }
    colSums.push(colSum);
  }
  
  return colSums;
};

/**
 * Calculate sum of a specific row
 * @param {Array<Array<number|string>>} grid - The current grid
 * @param {number} rowIndex - Index of the row to sum
 * @returns {number} Sum of the row
 */
export const calculateRowSum = (grid, rowIndex) => {
  return grid[rowIndex].reduce((sum, cell) => {
    const num = parseInt(cell) || 0;
    return sum + num;
  }, 0);
};

/**
 * Calculate sum of a specific column
 * @param {Array<Array<number|string>>} grid - The current grid
 * @param {number} colIndex - Index of the column to sum
 * @returns {number} Sum of the column
 */
export const calculateColSum = (grid, colIndex) => {
  let sum = 0;
  for (let i = 0; i < grid.length; i++) {
    const num = parseInt(grid[i][colIndex]) || 0;
    sum += num;
  }
  return sum;
};

/**
 * Check if the puzzle is completed correctly
 * @param {Array<Array<number|string>>} grid - Current grid state
 * @param {Array<number>} rowTargets - Target sums for rows
 * @param {Array<number>} colTargets - Target sums for columns
 * @returns {Object} Completion status and details
 */
export const checkPuzzleCompletion = (grid, rowTargets, colTargets) => {
  const gridSize = grid.length;
  
  // Check if grid is completely filled
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === '' || grid[i][j] === null || grid[i][j] === undefined) {
        return { isComplete: false, reason: 'incomplete' };
      }
    }
  }

  // Check row sums
  for (let i = 0; i < gridSize; i++) {
    const rowSum = calculateRowSum(grid, i);
    if (rowSum !== rowTargets[i]) {
      return { 
        isComplete: false, 
        reason: 'incorrect_row_sum',
        row: i,
        expected: rowTargets[i],
        actual: rowSum
      };
    }
  }

  // Check column sums
  for (let j = 0; j < gridSize; j++) {
    const colSum = calculateColSum(grid, j);
    if (colSum !== colTargets[j]) {
      return { 
        isComplete: false, 
        reason: 'incorrect_col_sum',
        col: j,
        expected: colTargets[j],
        actual: colSum
      };
    }
  }

  return { isComplete: true, reason: 'solved' };
};

/**
 * Validate if a number is valid for the current difficulty
 * @param {number} num - Number to validate
 * @param {string} difficulty - Current difficulty level
 * @returns {boolean} Whether the number is valid
 */
export const isValidNumber = (num, difficulty) => {
  if (isNaN(num) || num < 1) return false;
  const maxNum = getMaxNumber(difficulty);
  return num <= maxNum;
};

/**
 * Get statistics about the current grid state
 * @param {Array<Array<number|string>>} grid - Current grid state
 * @param {Array<number>} rowTargets - Target sums for rows
 * @param {Array<number>} colTargets - Target sums for columns
 * @returns {Object} Statistics about completion, errors, etc.
 */
export const getGridStatistics = (grid, rowTargets, colTargets) => {
  const gridSize = grid.length;
  let filledCells = 0;
  let correctRows = 0;
  let correctCols = 0;
  let overflowRows = 0;
  let overflowCols = 0;

  // Count filled cells
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] !== '' && grid[i][j] !== null && grid[i][j] !== undefined) {
        filledCells++;
      }
    }
  }

  // Check row statistics
  for (let i = 0; i < gridSize; i++) {
    const rowSum = calculateRowSum(grid, i);
    if (rowSum === rowTargets[i]) correctRows++;
    if (rowSum > rowTargets[i]) overflowRows++;
  }

  // Check column statistics
  for (let j = 0; j < gridSize; j++) {
    const colSum = calculateColSum(grid, j);
    if (colSum === colTargets[j]) correctCols++;
    if (colSum > colTargets[j]) overflowCols++;
  }

  return {
    filledCells,
    totalCells: gridSize * gridSize,
    completionPercentage: (filledCells / (gridSize * gridSize)) * 100,
    correctRows,
    correctCols,
    overflowRows,
    overflowCols,
    totalRows: gridSize,
    totalCols: gridSize
  };
};