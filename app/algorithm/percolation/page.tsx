'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import Percolation from '@/app/algorithms/percolation';

export default function PercolationPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // Algorithm metadata
  const algorithmConfig = {
    name: 'Percolation (Union-Find)',
    description: 'Simulates site percolation using the Union-Find algorithm.',
    timeComplexity: { average: 'O(N)' },
    spaceComplexity: 'O(N)',
  };

  const size = 12;
  const percRef = useRef<Percolation>(new Percolation(size));
  const [grid, setGrid] = useState<boolean[][]>(
    percRef.current.grid.map((row) => [...row])
  );
  const [steps, setSteps] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(400);

  // Opens a random cell
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

  // Resets the grid
  const handleReset = () => {
    percRef.current = new Percolation(size);
    setGrid(percRef.current.grid.map((row) => [...row]));
    setSteps(0);
    setAutoPlay(false);
    toast.success('Grid reset!');
  };

  // Handles autoplay
  useEffect(() => {
    if (autoPlay && !percRef.current.percolates()) {
      const interval = setInterval(openRandomCell, speed);
      return () => clearInterval(interval);
    }
  }, [autoPlay, speed, grid]);

  // Stats
  const percolates = percRef.current.percolates();
  const totalCells = size * size;
  const openCells = grid.flat().filter(Boolean).length;
  const fraction = ((openCells / totalCells) * 100).toFixed(1);

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'
      } transition-all duration-500 relative overflow-hidden`}
    >
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Header Section */}
        <header
          className={`relative p-6 flex-shrink-0 backdrop-blur-sm ${
            isDarkMode
              ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-b border-slate-700/50'
              : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-b border-gray-200/50'
          } animate-in slide-in-from-top-4 fade-in duration-600 delay-100`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1 animate-in slide-in-from-left-4 fade-in duration-600 delay-200">
              <h2
                className={`text-2xl font-bold tracking-tight ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
                }`}
              >
                {algorithmConfig.name}
              </h2>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                {algorithmConfig.description}
              </p>
            </div>

            {/* Complexity Info */}
            <div className="flex items-center gap-6 animate-in slide-in-from-right-4 fade-in duration-600 delay-300">
              <div
                className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border border-slate-600/30'
                    : 'bg-white/50 border border-gray-200/30'
                } shadow-sm`}
              >
                <span
                  className={`text-xs font-semibold tracking-wide uppercase ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}
                >
                  Time:
                </span>
                <span
                  className={`ml-2 font-mono font-bold ${
                    isDarkMode ? 'text-amber-400' : 'text-amber-600'
                  }`}
                >
                  {algorithmConfig.timeComplexity.average}
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border border-slate-600/30'
                    : 'bg-white/50 border border-gray-200/30'
                } shadow-sm`}
              >
                <span
                  className={`text-xs font-semibold tracking-wide uppercase ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}
                >
                  Space:
                </span>
                <span
                  className={`ml-2 font-mono font-bold ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}
                >
                  {algorithmConfig.spaceComplexity}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Visualization Section */}
        <section className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <div
              className={`flex-1 overflow-hidden p-6 relative ${
                isDarkMode
                  ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30'
                  : 'bg-gradient-to-br from-white/30 to-gray-50/30'
              } backdrop-blur-sm`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />

              <div className="relative h-full flex flex-col items-center justify-center space-y-6">
                {/* Grid */}
                <div
                  className={`grid gap-[2px] ${
                    percolates ? 'ring-4 ring-green-500 p-2 rounded-lg' : ''
                  }`}
                  style={{ gridTemplateColumns: `repeat(${size}, 22px)` }}
                >
                  {grid.map((row, i) =>
                    row.map((cell, j) => {
                      const isTopConnected = percRef.current.uf.connected(
                        percRef.current['topVirtual'],
                        i * size + j
                      );
                      const bgColor = cell
                        ? percolates
                          ? isTopConnected
                            ? 'bg-green-400'
                            : 'bg-blue-400'
                          : isTopConnected
                          ? 'bg-indigo-500'
                          : 'bg-blue-700'
                        : isDarkMode
                        ? 'bg-[#161b22]'
                        : 'bg-gray-200';
                      return (
                        <div
                          key={`${i}-${j}`}
                          onClick={() => {
                            percRef.current.open(i, j);
                            setGrid(percRef.current.grid.map((r) => [...r]));
                            setSteps((s) => s + 1);
                          }}
                          className={`w-6 h-6 rounded-[2px] border border-gray-700 cursor-pointer transition-all duration-200 ${bgColor} hover:scale-105`}
                        />
                      );
                    })
                  )}
                </div>

                {/* Controls */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={openRandomCell}
                    className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all"
                  >
                    Step (Open Random)
                  </button>
                  <button
                    onClick={() => setAutoPlay((prev) => !prev)}
                    className={`px-4 py-1 rounded-md text-white transition-all ${
                      autoPlay
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {autoPlay ? 'Pause Auto' : 'Auto Play'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all"
                  >
                    Reset
                  </button>
                </div>

                {/* Stats */}
                <div
                  className={`${
                    isDarkMode
                      ? 'bg-[#161b22] border border-gray-700 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  } p-4 rounded-lg w-72 text-center shadow-md`}
                >
                  <p className="text-sm">
                    <strong>Grid Size:</strong> {size} × {size}
                  </p>
                  <p className="text-sm">
                    <strong>Open Cells:</strong> {openCells} / {totalCells} (
                    {fraction}%)
                  </p>
                  <p className="text-sm">
                    <strong>Steps Taken:</strong> {steps}
                  </p>
                  {percolates ? (
                    <p className="text-green-400 font-semibold mt-1 animate-bounce">
                      ✅ System Percolates!
                    </p>
                  ) : (
                    <p className="text-gray-400 mt-1">⚪ Not yet percolating</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <Toaster position="top-right" reverseOrder={false} />
      </main>
    </div>
  );
}
