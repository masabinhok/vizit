import { AlgorithmConfig, AlgorithmStep } from '../../types';

export const mazeGenerationConfig: AlgorithmConfig = {
  id: 'maze-map',
  name: 'Maze Map Generator',
  category: 'Pathfinding',
  description: 'Generates a complete perfect maze map with entrance and exit.',
  defaultInput: '15x15',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
  },
  spaceComplexity: 'O(n)',
  code: [
    'Create grid with walls',
    'Generate perfect maze using DFS (internal)',
    'Open entrance and exit on boundaries',
    'Output final maze map'
  ],
  generateSteps: (input: number[]): AlgorithmStep[] => {
    const width = input[0] ?? 15;
    const height = input[1] ?? 15;

    // Use odd dimensions for clean maze structure
    const w = width % 2 === 0 ? width + 1 : width;
    const h = height % 2 === 0 ? height + 1 : height;

    if (w < 5 || h < 5 || w > 31 || h > 31) {
      throw new Error('Maze size must be between 5x5 and 31x31');
    }

    // --- Generate full maze (internal, no steps) ---
    const grid = new Array(h).fill(null).map(() => new Array(w).fill(1)); // 1 = wall
    const directions = [[0, -2], [2, 0], [0, 2], [-2, 0]];
    const wallDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    // Helper: in bounds and odd coordinates
    const inBounds = (x: number, y: number) => x > 0 && x < w - 1 && y > 0 && y < h - 1;

    // Start at (1,1)
    const stack: [number, number][] = [[1, 1]];
    grid[1][1] = 0; // 0 = path

    while (stack.length > 0) {
      const [x, y] = stack[stack.length - 1];
      const neighbors = [];

      for (let i = 0; i < directions.length; i++) {
        const [dx, dy] = directions[i];
        const nx = x + dx;
        const ny = y + dy;
        if (inBounds(nx, ny) && grid[ny][nx] === 1) {
          neighbors.push({ nx, ny, wx: x + wallDirs[i][0], wy: y + wallDirs[i][1] });
        }
      }

      if (neighbors.length > 0) {
        const { nx, ny, wx, wy } = neighbors[Math.floor(Math.random() * neighbors.length)];
        grid[ny][nx] = 0;
        grid[wy][wx] = 0;
        stack.push([nx, ny]);
      } else {
        stack.pop();
      }
    }

    // --- Open entrance and exit on outer walls ---
    // Entrance: top edge (1, 0)
    grid[0][1] = 0;
    // Exit: bottom edge (w-2, h-1)
    grid[h - 1][w - 2] = 0;

    // --- Flatten grid to 1D array with markers ---
    const flatArray: AlgorithmStep['array'] = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let value = grid[y][x]; // 0 = path, 1 = wall
        if (y === 0 && x === 1) value = 2; // entrance
        else if (y === h - 1 && x === w - 2) value = 3; // exit

        flatArray.push({
          value,
          isComparing: false,
          isSwapping: false,
          isSorted: value !== 1,
          isSelected: false,
        });
      }
    }

    // the final maze map
    return [{
      array: flatArray,
      i: -1,
      j: -1,
      description: 'Final maze map with entrance and exit',
      codeLineIndex: 3,
      comparisons: 0,
      swaps: 0,
      additionalInfo: {
        width: w,
        height: h,
        isMaze: true,
        showStartEnd: true,
      },
    }];
  },
};