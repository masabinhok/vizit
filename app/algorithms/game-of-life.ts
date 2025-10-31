import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const codeLines = [
  "// Conway's Game of Life",
  'for each generation:',
  '  for each cell:',
  '    neighbors = live neighbors around cell',
  '    if cell is alive and (neighbors < 2 or neighbors > 3) => dies',
  '    if cell is alive and (neighbors === 2 or neighbors === 3) => survives',
  '    if cell is dead and neighbors === 3 => becomes alive',
  '  apply all changes simultaneously'
];

function buildArrayFromGrid(grid: number[][]): ArrayElement[] {
  const arr: ArrayElement[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const v = grid[r][c];
      arr.push({
        value: v,
        isComparing: false,
        isSwapping: false,
        isSorted: false,
        color: v ? '#22c55e' : '#0f172a'
      });
    }
  }
  return arr;
}

function generateRandomGrid(width: number, height: number, density: number): number[][] {
  const grid: number[][] = Array.from({ length: height }, () => Array(width).fill(0));
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      grid[r][c] = Math.random() < density ? 1 : 0;
    }
  }
  return grid;
}

export function nextGeneration(grid: number[][]): { next: number[][]; births: number; deaths: number; survivals: number } {
  const h = grid.length;
  const w = grid[0].length;
  const next: number[][] = Array.from({ length: h }, () => Array(w).fill(0));
  let births = 0, deaths = 0, survivals = 0;
  const dirs = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], /*self*/ [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      let live = 0;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < h && nc >= 0 && nc < w) live += grid[nr][nc];
      }
      if (grid[r][c] === 1) {
        if (live === 2 || live === 3) { next[r][c] = 1; survivals++; }
        else { next[r][c] = 0; deaths++; }
      } else {
        if (live === 3) { next[r][c] = 1; births++; }
      }
    }
  }
  return { next, births, deaths, survivals };
}

export const gameOfLifeConfig: AlgorithmConfig = {
  id: 'game-of-life',
  name: "Conway's Game of Life",
  category: 'Fun',
  description: 'A zero-player cellular automaton where simple rules create complex patterns.',
  timeComplexity: {
    best: 'O(wh) per generation',
    average: 'O(wh) per generation',
    worst: 'O(wh) per generation'
  },
  spaceComplexity: 'O(wh)',
  code: codeLines,
  defaultInput: '25x25@0.30',
  generateSteps: (input: number[]): AlgorithmStep[] => {
    // Page will manage evolution; we just emit an initial step when needed.
    const width = input[0] || 25;
    const height = input[1] || 25;
    const densityPct = input[2] ?? 30; // percent if provided
    const grid = generateRandomGrid(width, height, Math.max(0, Math.min(1, densityPct / 100)));
    const arr = buildArrayFromGrid(grid);
    const step: AlgorithmStep = {
      array: arr,
      description: 'Initial random configuration',
      codeLineIndex: 0,
      additionalInfo: { isGrid: true, width, height, generation: 0 }
    };
    return [step];
  }
};


