import { Category } from '../types';

export const ALGORITHM_CATEGORIES: Category[] = [
  {
    name: "Algorithms",
    algorithms: ["bubble-sort", "quick-sort", "merge-sort", "binary-search", "dijkstra"]
  },
  {
    name: "Data Structures", 
    algorithms: ["binary-tree", "btree", "hash-table", "stack", "queue", "linked-list"]
  },
  {
    name: "Math",
    algorithms: ["sieve", "fibonacci", "prime-factorization", "gcd", "modular-arithmetic"]
  },
  {
    name: "Graphs",
    algorithms: ["bfs", "dfs", "kruskal", "prim", "topological-sort"]
  },
  {
    name: "Fun",
    algorithms: ["game-of-life", "mandelbrot", "sorting-dance", "maze-generation", "fractals"]
  }
];

export const ALGORITHM_NAME_MAP: Record<string, string> = {
  "bubble-sort": "Bubble Sort",
  "quick-sort": "Quick Sort",
  "merge-sort": "Merge Sort",
  "binary-search": "Binary Search",
  "dijkstra": "Dijkstra's Algorithm",
  "binary-tree": "Binary Tree",
  "btree": "B-Tree",
  "hash-table": "Hash Table",
  "stack": "Stack",
  "queue": "Queue",
  "linked-list": "Linked List",
  "sieve": "Sieve of Eratosthenes",
  "fibonacci": "Fibonacci",
  "prime-factorization": "Prime Factorization",
  "gcd": "GCD",
  "modular-arithmetic": "Modular Arithmetic",
  "bfs": "BFS",
  "dfs": "DFS",
  "kruskal": "Kruskal's MST",
  "prim": "Prim's MST",
  "topological-sort": "Topological Sort",
  "game-of-life": "Conway's Game of Life",
  "mandelbrot": "Mandelbrot Set",
  "sorting-dance": "Sorting Dance",
  "maze-generation": "Maze Generation",
  "fractals": "Fractals"
};