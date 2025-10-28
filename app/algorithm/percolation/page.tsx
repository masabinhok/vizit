"use client";

import dynamic from "next/dynamic";

const PercolationVisualization = dynamic(
  () => import("@/components/percolation"),
  { ssr: false }
);

export default function PercolationPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-8">
      <PercolationVisualization />
    </main>
  );
}
