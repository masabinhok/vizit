'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

interface Bar {
  value: number;
  state: 'default' | 'left' | 'right' | 'mid' | 'found' | 'done';
}

export default function BinarySearchVisualization() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const [array, setArray] = useState<Bar[]>([]);
  const [target, setTarget] = useState<number | ''>('');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [message, setMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<'controls' | 'pseudocode' | 'explanation'>('controls');

  // Utility
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const showMessage = (text: string, type: Message['type']) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Generate sorted random array
  const generateArray = () => {
    const arr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10)
      .sort((a, b) => a - b)
      .map((v) => ({ value: v, state: 'default' as const }));
    setArray(arr);
    setMessage(null);
  };

  // Clear highlights
  const resetArrayStates = () =>
    setArray((prev) => prev.map((bar) => ({ ...bar, state: 'default' })));

  // Binary search animation
  const startSearch = async () => {
    if (isRunning) return;
    if (array.length === 0) {
      showMessage('Generate an array first!', 'error');
      return;
    }
    if (target === '') {
      showMessage('Enter a target number!', 'error');
      return;
    }

    setIsRunning(true);
    resetArrayStates();

    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      setArray((prev) =>
        prev.map((bar, i) => {
          if (i === left) return { ...bar, state: 'left' };
          if (i === right) return { ...bar, state: 'right' };
          if (i > left && i < right) return { ...bar, state: 'default' };
          return bar;
        })
      );

      const mid = Math.floor((left + right) / 2);
      setArray((prev) =>
        prev.map((bar, i) => {
          if (i === mid) return { ...bar, state: 'mid' };
          return bar;
        })
      );

      await sleep(speed);

      if (array[mid].value === Number(target)) {
        setArray((prev) =>
          prev.map((bar, i) => ({
            ...bar,
            state: i === mid ? 'found' : 'done',
          }))
        );
        showMessage(`Value ${target} found at index ${mid}`, 'success');
        setIsRunning(false);
        return;
      } else if (array[mid].value < Number(target)) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }

      await sleep(speed);
    }

    showMessage(`Value ${target} not found`, 'error');
    resetArrayStates();
    setIsRunning(false);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Message */}
      {message && (
        <div
          className={`mx-auto px-4 py-2 rounded-lg text-sm font-medium shadow-md ${
            message.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
              : message.type === 'error'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-400/30'
              : 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-2">
        {['controls', 'pseudocode', 'explanation'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === tab
                ? isDarkMode
                  ? 'bg-blue-600/40 text-blue-200'
                  : 'bg-blue-200 text-blue-800'
                : isDarkMode
                ? 'bg-slate-700/40 text-slate-300 hover:bg-slate-600/50'
                : 'bg-gray-200/40 text-gray-600 hover:bg-gray-300/60'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'controls' && (
        <div
          className={`flex flex-wrap justify-center items-center gap-4 rounded-xl p-4 shadow-inner ${
            isDarkMode
              ? 'bg-slate-800/50 border border-slate-700/30'
              : 'bg-white/70 border border-gray-200/50'
          }`}
        >
          <button
            onClick={generateArray}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-all shadow"
          >
            Generate Array
          </button>

          <input
            type="number"
            placeholder="Target..."
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className={`w-24 px-3 py-2 rounded-md border text-center font-semibold ${
              isDarkMode
                ? 'bg-slate-800 border-slate-600 text-slate-200'
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />

          <button
            onClick={startSearch}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:scale-105 transition-all shadow"
          >
            Start Search
          </button>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-400">Speed:</label>
            <input
              type="range"
              min="100"
              max="1000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {activeTab === 'pseudocode' && (
        <pre
          className={`text-sm p-4 rounded-xl overflow-x-auto shadow-inner ${
            isDarkMode
              ? 'bg-slate-800/70 text-slate-200 border border-slate-700/40'
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}
        >
{`function binarySearch(arr, target):
  left ← 0
  right ← length(arr) - 1
  while left ≤ right:
      mid ← floor((left + right) / 2)
      if arr[mid] == target:
          return mid
      else if arr[mid] < target:
          left ← mid + 1
      else:
          right ← mid - 1
  return -1`}
        </pre>
      )}

      {activeTab === 'explanation' && (
        <div
          className={`text-sm leading-relaxed p-4 rounded-xl shadow-inner ${
            isDarkMode
              ? 'bg-slate-800/60 text-slate-300 border border-slate-700/40'
              : 'bg-gray-50 text-gray-700 border border-gray-200'
          }`}
        >
          <p>
            Binary Search is a divide-and-conquer algorithm used to find a target element in a sorted
            array. It repeatedly divides the search range in half:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Compare the middle element with the target.</li>
            <li>If it matches, we’re done.</li>
            <li>If it’s smaller, search the right half.</li>
            <li>If it’s larger, search the left half.</li>
          </ul>
          <p className="mt-2">
            This approach reduces the search space by half each time, achieving a logarithmic time
            complexity of <code>O(log n)</code>.
          </p>
        </div>
      )}

      {/* Visualization Area */}
      <div
        className={`flex-1 flex justify-center items-end gap-2 rounded-xl p-6 mt-2 overflow-hidden ${
          isDarkMode
            ? 'bg-slate-900/40 border border-slate-700/50'
            : 'bg-white/60 border border-gray-200/50'
        }`}
      >
        {array.map((bar, i) => (
          <div
            key={i}
            className={`flex flex-col items-center transition-all duration-300`}
            style={{ height: `${bar.value * 2}px` }}
          >
            <div
              className={`w-6 rounded-t-md transition-all duration-300 ${
                bar.state === 'default'
                  ? isDarkMode
                    ? 'bg-slate-600'
                    : 'bg-gray-400'
                  : bar.state === 'left'
                  ? 'bg-amber-400'
                  : bar.state === 'right'
                  ? 'bg-pink-400'
                  : bar.state === 'mid'
                  ? 'bg-blue-400'
                  : bar.state === 'found'
                  ? 'bg-emerald-500'
                  : 'bg-slate-700'
              }`}
              style={{ height: `${bar.value * 2}px` }}
            ></div>
            <span
              className={`mt-2 text-xs font-semibold ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}
            >
              {bar.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
