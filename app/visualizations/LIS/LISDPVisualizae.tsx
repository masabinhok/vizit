"use client";
import React, { useState } from "react";
import { lisDpSteps } from "./utils";

export default function LISDPVisualizer() {
  const [index, setIndex] = useState(0);
  const arr = [10, 9, 2, 5, 3, 7, 101, 18];
  const steps = Array.from(lisDpSteps(arr));
  const current = steps[index];

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold mb-4">LIS (DP approach)</h2>
      <p className="mb-2">{current.step}</p>
      <div className="flex justify-center gap-2 mb-4">
        {current.dp.map((v, i) => (
          <div key={i} className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded">
            {v}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIndex(Math.max(0, index - 1))}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Prev
        </button>
        <button
          onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
