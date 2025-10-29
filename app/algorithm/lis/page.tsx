"use client";

import React, { useState } from "react";
import LISDPVisualize from "../../visualizations/LIS/LISDPVisualize";
import LISPatienceVisualize from "../../visualizations/LIS/LISPatienceVisualize";

export default function LISPage() {
  const [method, setMethod] = useState<"dp" | "patience">("dp");

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4 text-emerald-400">LIS Visualizer</h2>
          <button
            onClick={() => setMethod("dp")}
            className={`w-full mb-2 px-4 py-2 rounded-lg text-left ${
              method === "dp"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            DP (O(n²))
          </button>
          <button
            onClick={() => setMethod("patience")}
            className={`w-full px-4 py-2 rounded-lg text-left ${
              method === "patience"
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            Patience Sorting (O(n log n))
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Use buttons above to switch methods.
        </p>
      </aside>

      {/* Scrollable Visualization Section */}
      <main className="flex-1 overflow-y-auto p-8 flex justify-center items-start">
        {method === "dp" ? <LISDPVisualize /> : <LISPatienceVisualize />}
      </main>
    </div>
  );
}
