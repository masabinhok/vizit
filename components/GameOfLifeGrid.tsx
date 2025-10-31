import { AlgorithmStep } from '../types';

export default function GameOfLifeGrid({
  currentStep,
  isInitialized
}: {
  currentStep?: AlgorithmStep;
  isInitialized: boolean;
}) {
  if (!isInitialized || !currentStep) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Click "Apply" to start
      </div>
    );
  }

  const { array, additionalInfo } = currentStep;
  const { width, height } = (additionalInfo || {}) as { width: number; height: number };
  const cellSize = Math.min(28, Math.floor(520 / Math.max(width || 20, height || 20)));
  const size = (width || 20) * cellSize;

  return (
    <div className="flex items-center justify-center h-full w-full overflow-auto">
      <div
        className="grid gap-0 border-2 border-gray-700"
        style={{ gridTemplateColumns: `repeat(${width}, ${cellSize}px)`, width: size, height: (height || 20) * cellSize }}
      >
        {array.map((cell, i) => (
          <div
            key={i}
            className={`${cell.value ? 'bg-emerald-500' : 'bg-slate-900'} border border-gray-900`}
            style={{ width: cellSize, height: cellSize }}
          />
        ))}
      </div>
    </div>
  );
}


