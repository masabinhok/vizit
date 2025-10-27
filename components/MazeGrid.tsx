// components/MazeGrid.tsx
import { AlgorithmStep } from '../types';

export default function MazeGrid({
  currentStep,
  isInitialized,
}: {
  currentStep?: AlgorithmStep;
  isInitialized: boolean;
}) {
  if (!isInitialized || !currentStep) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Click "Initialize" to start
      </div>
    );
  }

  const { array, additionalInfo } = currentStep;

  if (additionalInfo?.isMaze) {
    const { width, height, showStartEnd } = additionalInfo as {
      width: number;
      height: number;
      showStartEnd?: boolean;
    };

    const cellSize = Math.min(32, Math.floor(500 / Math.max(width, height)));
    const size = width * cellSize;

    return (
      <div className="flex items-center justify-center h-full w-full overflow-auto">
        <div
          className="grid gap-0 border-2 border-gray-700"
          style={{
            gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
            width: size,
            height: size,
          }}
        >
          {array.map((cell, i) => {
            let bgColor = 'bg-gray-800'; // wall

            if (cell.value === 1) {
              bgColor = 'bg-white'; // path
            } else if (showStartEnd && cell.value === 2) {
              bgColor = 'bg-emerald-500'; // start
            } else if (showStartEnd && cell.value === 3) {
              bgColor = 'bg-rose-500'; // end
            }

            return (
              <div
                key={i}
                className={`${bgColor} border border-gray-900`}
                style={{ width: cellSize, height: cellSize }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback for non-maze (optional)
  return <div>Unsupported visualization</div>;
}