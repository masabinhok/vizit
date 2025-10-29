"use client";

import React, { useState } from "react";
import LISDPVisualize from "@/app/visualizations/LIS/LISDPVisualize";
import LISPatienceVisualize from "@/app/visualizations/LIS/LISPatienceVisualize";

export default function LISPage() {
  const [method, setMethod] = useState<"dp" | "patience">("dp");

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar for method toggle */}
      <aside className="w-64 p-6 border-r border-slate-700 bg-slate-800/60 backdrop-blur-md overflow-y-auto">
        <h2 className="text-xl font-bold text-emerald-400 mb-6">LIS Visualizer</h2>

        <button
          onClick={() => setMethod("dp")}
          className={`block w-full text-left px-4 py-2 mb-3 rounded-lg border transition-all font-semibold ${
            method === "dp"
              ? "bg-blue-600 border-blue-400 text-white"
              : "border-slate-600 hover:bg-slate-700"
          }`}
        >
          DP (O(n²))
        </button>

        <button
          onClick={() => setMethod("patience")}
          className={`block w-full text-left px-4 py-2 rounded-lg border transition-all font-semibold ${
            method === "patience"
              ? "bg-emerald-600 border-emerald-400 text-white"
              : "border-slate-600 hover:bg-slate-700"
          }`}
        >
          Patience Sorting (O(n log n))
        </button>
      </aside>

      {/* Visualization container with scroll */}
      <section className="flex-1 overflow-y-auto h-screen p-8 flex items-center justify-center">
        {method === "dp" ? <LISDPVisualize /> : <LISPatienceVisualize />}
      </section>
    </main>
  );
}
