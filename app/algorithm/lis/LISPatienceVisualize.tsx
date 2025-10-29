"use client";

import React, { useState, useEffect } from "react";

function* lisPatienceSteps(arr: number[]) {
  const piles: number[][] = [];
  yield { piles: [], message: "Start with no piles" };

  for (const x of arr) {
    let left = 0, right = piles.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (piles[mid][piles[mid].length - 1] >= x) right = mid;
      else left = mid + 1;
    }
    if (left === piles.length) piles.push([x]);
    else piles[left].push(x);

    yield { piles: piles.map(p => [...p]), message: `Placed ${x} → pile ${left + 1}` };
  }

  yield { piles: piles.map(p => [...p]), message: `Final piles (LIS length = ${piles.length})` };
}

export default function LISPatienceVisualize() {
  const [index, setIndex] = useState(0);
  const arr = [10, 9, 2, 5, 3, 7, 101, 18];
  const steps = Array.from(lisPatienceSteps(arr));
  const current = steps[index];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (steps.length > 1) {
      setIndex(1); // automatically start visualization
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-white">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
        Longest Increasing Subsequence (Patience Sorting)
      </h1>

      <p className="mb-4 text-lg">{current.message}</p>

      <div className="flex gap-6 mb-6">
        {current?.piles?.map((pile, i) => (
          <div key={i} className="flex flex-col-reverse items-center">
            {pile.map((v, j) => (
              <div
                key={j}
                className="w-10 h-10 bg-emerald-600 flex items-center justify-center rounded-md font-semibold mb-1 shadow-md"
              >
                {v}
              </div>
            ))}
            <span className="text-sm text-emerald-300 mt-1">Pile {i + 1}</span>
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
          className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
