"use client";

import React, { useState } from "react";

function* lisDpSteps(arr: number[]) {
  const n = arr.length;
  const dp = Array(n).fill(1);
  yield { dp: [...dp], message: "Initialized DP array" };

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
        yield { dp: [...dp], message: `Updated dp[${i}] using dp[${j}]` };
      }
    }
  }
  yield { dp: [...dp], message: "Final DP array computed" };
}

export default function LISDPVisualize() {
  const [index, setIndex] = useState(0);
  const arr = [10, 9, 2, 5, 3, 7, 101, 18];
  const steps = Array.from(lisDpSteps(arr));
  const current = steps[index];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-white">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        Longest Increasing Subsequence (DP)
      </h1>

      <p className="mb-4 text-lg">{current.message}</p>

      <div className="flex gap-3 mb-6">
        {current.dp.map((v, i) => (
          <div
            key={i}
            className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-lg font-semibold shadow-md"
          >
            {v}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIndex(Math.max(0, index - 1))}
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
        >
          Prev
        </button>
        <button
          onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
