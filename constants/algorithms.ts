import { Category } from '../types';

export const ALGORITHM_CATEGORIES: Category[] = [
  {
    name: "Algorithms",
    algorithms: [
      "bubble-sort",
      "selection-sort",
      "quick-sort",
      "merge-sort",
      "heap-sort",
      "counting-sort",
      "radix-sort",
      "binary-search",
      "linear-search",
      "kmp",
      "suffix-array",
      "lis"
    ]
  },
  {
    name: "Data Structures", 
    algorithms: [
      "binary-tree",
      "btree",
      "hash-table",
      "stack",
      "queue",
      "linked-list",
      "binary-heap",
      "union-find",
      "avl-tree",
      "red-black-tree",
      "trie",
      "segment-tree",
      "fenwick-tree"
    ]
  },
  {
    name: "Math",
    algorithms: [
      "sieve-of-eratosthenes",
      "fibonacci",
      "prime-factorization",
      "gcd",
      "modular-arithmetic",
      "pollard-rho"
    ]
  },
  {
    name: "Graphs",
    algorithms: [
      "bfs",
      "dfs",
      "dijkstra",
      "bellman-ford",
      "a-star",
      "kruskal",
      "prim",
      "topological-sort",
      "edmonds-karp",
      "dinic",
      "tarjan-scc",
      "kosaraju-scc"
    ]
  },
  {
    name: "Fun",
    algorithms: [
      "game-of-life",
      "mandelbrot",
      "sorting-dance",
      "maze-generation",
      "fractals",
      "langtons-ant",
      "percolation"
    ]
  }
];

export const ALGORITHM_NAME_MAP: Record<string, string> = {
  "bubble-sort": "Bubble Sort",
  "selection-sort": "Selection Sort",
  "quick-sort": "Quick Sort",
  "merge-sort": "Merge Sort",
  "heap-sort": "Heap Sort",
  "counting-sort": "Counting Sort",
  "radix-sort": "Radix Sort",
  "binary-search": "Binary Search",
  "linear-search": "Linear Search",
  "kmp": "Knuth–Morris–Pratt (KMP)",
  "suffix-array": "Suffix Array",
  "lis": "Longest Increasing Subsequence",
  "dijkstra": "Dijkstra's Algorithm",
  "binary-heap": "Binary Heap",
  "union-find": "Union-Find",
  "avl-tree": "AVL Tree",
  "red-black-tree": "Red-Black Tree",
  "trie": "Trie",
  "segment-tree": "Segment Tree",
  "fenwick-tree": "Fenwick Tree (Binary Indexed Tree)",
  "binary-tree": "Binary Tree",
  "btree": "B-Tree",
  "hash-table": "Hash Table",
  "stack": "Stack",
  "queue": "Queue",
  "linked-list": "Linked List",
  "sieve-of-eratosthenes": "Sieve of Eratosthenes",
  "fibonacci": "Fibonacci",
  "prime-factorization": "Prime Factorization",
  "pollard-rho": "Pollard's Rho",
  "gcd": "GCD",
  "modular-arithmetic": "Modular Arithmetic",
  "bfs": "BFS",
  "dfs": "DFS",
  "bellman-ford": "Bellman-Ford",
  "a-star": "A* Search",
  "kruskal": "Kruskal's MST",
  "prim": "Prim's MST",
  "topological-sort": "Topological Sort",
  "edmonds-karp": "Edmonds–Karp",
  "dinic": "Dinic's Algorithm",
  "tarjan-scc": "Tarjan's SCC",
  "kosaraju-scc": "Kosaraju's SCC",
  "game-of-life": "Conway's Game of Life",
  "mandelbrot": "Mandelbrot Set",
  "sorting-dance": "Sorting Dance",
  "maze-generation": "Maze Generation",
  "fractals": "Fractals"
  ,
  "langtons-ant": "Langton's Ant",
  "percolation": "Percolation"
};


