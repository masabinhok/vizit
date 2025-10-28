// app/algorithms/percolation.ts
export class UnionFind {
  parent: number[];
  rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): void {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return;

    if (this.rank[rx] < this.rank[ry]) this.parent[rx] = ry;
    else if (this.rank[rx] > this.rank[ry]) this.parent[ry] = rx;
    else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

export default class Percolation {
  n: number;
  grid: boolean[][];
  uf: UnionFind;
  topVirtual: number;
  bottomVirtual: number;

  constructor(n: number) {
    this.n = n;
    this.grid = Array.from({ length: n }, () => Array(n).fill(false));
    this.uf = new UnionFind(n * n + 2);
    this.topVirtual = n * n;
    this.bottomVirtual = n * n + 1;
  }

  private index(row: number, col: number): number {
    return row * this.n + col;
  }

  private isValid(row: number, col: number): boolean {
    return row >= 0 && row < this.n && col >= 0 && col < this.n;
  }

  open(row: number, col: number): void {
    if (!this.isValid(row, col) || this.grid[row][col]) return;
    this.grid[row][col] = true;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (this.isValid(nr, nc) && this.grid[nr][nc]) {
        this.uf.union(this.index(row, col), this.index(nr, nc));
      }
    }

    if (row === 0) this.uf.union(this.index(row, col), this.topVirtual);
    if (row === this.n - 1) this.uf.union(this.index(row, col), this.bottomVirtual);
  }

  isOpen(row: number, col: number): boolean {
    return this.isValid(row, col) && this.grid[row][col];
  }

  percolates(): boolean {
    return this.uf.connected(this.topVirtual, this.bottomVirtual);
  }
}
