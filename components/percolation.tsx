"use client";

import React, { useEffect, useRef, useState } from "react";
import Percolation from "@/app/algorithms/percolation";

export default function PercolationVisualization() {
  const size = 12;
  const percRef = useRef<Percolation>(new Percolation(size));

  const [grid, setGrid] = useState<boolean[][]>(
    percRef.current.grid.map((row) => [...row])
  );
  const [steps, setSteps] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(400);

  const openRandomCell = () => {
    const p = percRef.current;
    let tries = 0;

    while (tries < 100) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      if (!p.isOpen(r, c)) {
        p.open(r, c);
        setGrid(p.grid.map((row) => [...row]));
        setSteps((s) => s + 1);
        return;
      }
      tries++;
    }
  };

  const handleReset = () => {
    percRef.current = new Percolation(size);
    setGrid(percRef.current.grid.map((row) => [...row]));
    setSteps(0);
    setAutoPlay(false);
  };

  // Auto-play animation
  useEffect(() => {
    if (autoPlay && !percRef.current.percolates()) {
      const interval = setInterval(() => {
        openRandomCell();
      }, speed);
      return () => clearInterval(interval);
    }
  }, [autoPlay, speed, grid]);

  const percolates = percRef.current.percolates();

  // Compute stats
  const totalCells = size * size;
  const openCells = grid.flat().filter(Boolean).length;
  const fraction = ((openCells / totalCells) * 100).toFixed(1);

  return (
    <div className="flex flex-col items-center justify-center space-y-5 p-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Percolation Demo (Union-Find)
      </h2>

      {/* Grid */}
      <div
        className={`grid gap-[2px] transition-all duration-300 ${
          percolates ? "ring-4 ring-green-500 p-2 rounded-lg" : ""
        }`}
        style={{ gridTemplateColumns: `repeat(${size}, 24px)` }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const isTopConnected = percRef.current.uf.connected(
              percRef.current["topVirtual"],
              i * size + j
            );
            const bgColor = cell
              ? percolates
                ? isTopConnected
                  ? "bg-green-400 animate-pulse"
                  : "bg-blue-400"
                : isTopConnected
                ? "bg-blue-600"
                : "bg-blue-400"
              : "bg-gray-200";

            return (
              <div
                key={`${i}-${j}`}
                onClick={() => {
                  percRef.current.open(i, j);
                  setGrid(percRef.current.grid.map((r) => [...r]));
                  setSteps((s) => s + 1);
                }}
                className={`w-6 h-6 border border-gray-400 rounded-sm cursor-pointer transition-all duration-200 ${bgColor} hover:scale-105`}
              />
            );
          })
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={openRandomCell}
          className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Step (Open Random)
        </button>

        <button
          onClick={() => setAutoPlay((prev) => !prev)}
          className={`px-3 py-1 rounded-md text-white transition-colors ${
            autoPlay
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {autoPlay ? "Pause Auto" : "Auto Play"}
        </button>

        <button
          onClick={handleReset}
          className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-2 mt-2">
        <label className="text-sm text-gray-700">Speed:</label>
        <input
          type="range"
          min="100"
          max="1000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-32 accent-indigo-600"
        />
        <span className="text-sm text-gray-500">{speed}ms</span>
      </div>

      {/* Stats Panel */}
      <div className="bg-gray-50 p-3 rounded-lg shadow-sm border w-60 text-center">
        <p className="text-sm text-gray-600">
          <strong>Grid Size:</strong> {size} × {size}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Open Cells:</strong> {openCells} / {totalCells} (
          {fraction}%)
        </p>
        <p className="text-sm text-gray-600">
          <strong>Steps Taken:</strong> {steps}
        </p>
        {percolates ? (
          <p className="text-green-600 font-semibold mt-1 animate-bounce">
            ✅ System Percolates!
          </p>
        ) : (
          <p className="text-gray-600 mt-1">⚪ Not yet percolating</p>
        )}
      </div>
    </div>
  );
}
