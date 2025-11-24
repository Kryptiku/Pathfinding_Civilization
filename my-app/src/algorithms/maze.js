// Perfect maze generation using Recursive Backtracker (depth-first search)
// Returns a 2D boolean array walls[row][col] where true = wall, false = passage

const randShuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const toOdd = (x, max) => {
  // Clamp to [1, max-2] and make odd
  if (max <= 2) return 0; // tiny grids handled by caller
  let v = Math.max(1, Math.min(x, max - 2));
  return v % 2 === 1 ? v : v - 1;
};

export function generateMazeWalls(rows, cols, startPos, finishPos) {
  // For very small grids, return no walls to avoid degenerate cases
  if (rows < 3 || cols < 3) {
    return Array.from({ length: rows }, () => Array(cols).fill(false));
  }

  // Initialize all cells as walls
  const walls = Array.from({ length: rows }, () => Array(cols).fill(true));

  // Directions: [dr, dc]
  const directions = [
    [-1, 0], // N
    [1, 0], // S
    [0, -1], // W
    [0, 1], // E
  ];

  // Choose a starting cell near the start position on odd coordinates
  const startR = toOdd(startPos ? startPos.row : Math.floor(rows / 2), rows);
  const startC = toOdd(startPos ? startPos.col : Math.floor(cols / 2), cols);

  const stack = [];

  // Mark the starting cell as passage
  walls[startR][startC] = false;
  stack.push([startR, startC]);

  const inBoundsOdd = (r, c) =>
    r > 0 && r < rows - 1 && c > 0 && c < cols - 1 && r % 2 === 1 && c % 2 === 1;

  while (stack.length) {
    const [cr, cc] = stack[stack.length - 1];
    const dirs = randShuffle(directions.slice());

    let carved = false;
    for (const [dr, dc] of dirs) {
      const nr = cr + dr * 2;
      const nc = cc + dc * 2;
      if (!inBoundsOdd(nr, nc)) continue;
      if (walls[nr][nc]) {
        // Carve the wall between current and next
        const br = cr + dr; // between cell row
        const bc = cc + dc; // between cell col
        walls[br][bc] = false;
        walls[nr][nc] = false;
        stack.push([nr, nc]);
        carved = true;
        break;
      }
    }

    if (!carved) {
      stack.pop();
    }
  }

  // Ensure start and finish cells are open passages
  if (startPos) walls[startPos.row][startPos.col] = false;
  if (finishPos) walls[finishPos.row][finishPos.col] = false;

  // Also, gently open neighbors of start/finish if surrounded (avoid dead pockets for very small grids)
  const openNeighborIfAllWalls = (pos) => {
    if (!pos) return;
    const { row, col } = pos;
    const neigh = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ].filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols);
    const wallCount = neigh.reduce((acc, [r, c]) => acc + (walls[r][c] ? 1 : 0), 0);
    if (wallCount === neigh.length && neigh.length) {
      const [r, c] = neigh[Math.floor(Math.random() * neigh.length)];
      walls[r][c] = false;
    }
  };

  openNeighborIfAllWalls(startPos);
  openNeighborIfAllWalls(finishPos);

  return walls;
}
