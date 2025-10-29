"use client";

import React, { useState } from "react";
import LISDPVisualize from "../../visualizations/LIS/LISDPVisualize";
import LISPatienceVisualize from "../../visualizations/LIS/LISPatienceVisualize";


export default function LISPage() {
  const [method, setMethod] = useState<"dp" | "patience">("dp");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Longest Increasing Subsequence
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setMethod("dp")}
            className={`px-5 py-2 rounded-lg border-2 font-semibold transition-all ${
              method === "dp"
                ? "bg-blue-600 border-blue-400 text-white"
                : "border-slate-600 hover:bg-slate-700"
            }`}
          >
            DP (O(n²))
          </button>
          <button
            onClick={() => setMethod("patience")}
            className={`px-5 py-2 rounded-lg border-2 font-semibold transition-all ${
              method === "patience"
                ? "bg-emerald-600 border-emerald-400 text-white"
                : "border-slate-600 hover:bg-slate-700"
            }`}
          >
            Patience Sorting (O(n log n))
          </button>
        </div>
      </div>

      {/* Conditional rendering */}
      {method === "dp" ? <LISDPVisualize /> : <LISPatienceVisualize />}
    </main>
  );
}
