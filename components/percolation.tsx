"use client";

import React, { useRef, useState } from "react";
import Percolation from "@/app/algorithms/percolation";

export default function PercolationVisualization() {
  const size = 12;
  const percRef = useRef<Percolation>(new Percolation(size));

  const [grid, setGrid] = useState<boolean[][]>(
    percRef.current.grid.map((row) => [...row])
  );

  const handleOpenCell = (r: number, c: number) => {
    const p = percRef.current;
    p.open(r, c);
    setGrid(p.grid.map((row) => [...row]));
  };

  const handleOpenRandom = () => {
    const p = percRef.current;
    let tries = 0;

    while (tries < 100) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      if (!p.isOpen(r, c)) {
        p.open(r, c);
        setGrid(p.grid.map((row) => [...row]));
        return;
      }
      tries++;
    }
  };

  const handleReset = () => {
    percRef.current = new Percolation(size);
    setGrid(percRef.current.grid.map((row) => [...row]));
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-semibold">Percolation Demo (Union-Find)</h2>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${size}, 22px)` }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <button
              key={`${i}-${j}`}
              onClick={() => handleOpenCell(i, j)}
              className={`w-5 h-5 rounded-sm border transition-colors ${
                cell
                  ? "bg-blue-500 border-blue-600"
                  : "bg-gray-200 border-gray-300"
              }`}
            />
          ))
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleOpenRandom}
          className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Open Random Cell
        </button>

        <button
          onClick={handleReset}
          className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Reset Grid
        </button>
      </div>

      <p className="text-gray-700 mt-3">
        {percRef.current.percolates() ? (
          <span className="text-green-600">
            ✅ System percolates (top connected to bottom)
          </span>
        ) : (
          <span>⚪ Not yet percolating</span>
        )}
      </p>
    </div>
  );
}
