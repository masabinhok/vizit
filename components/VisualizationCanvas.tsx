'use client';

import { AlgorithmStep } from '../types';

interface VisualizationCanvasProps {
  currentStep?: AlgorithmStep;
  steps: AlgorithmStep[];
  isDarkMode: boolean;
  isInitialized: boolean;
}

export default function VisualizationCanvas({ 
  currentStep, 
  steps, 
  isDarkMode, 
  isInitialized 
}: VisualizationCanvasProps) {
  if (!isInitialized || !currentStep) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'} text-center`}>
          <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-lg font-medium">Visualization Canvas</p>
          <p className="text-sm">Enter an array and click Apply to begin</p>
        </div>
      </div>
    );
  }

  const maxValue = steps.length > 0 ? Math.max(...steps[0].array.map(el => el.value)) : 100;

  return (
    <div className="h-full flex flex-col justify-center">
      {/* Array Visualization */}
      <div className="flex items-end justify-center gap-2 h-80">
        {currentStep.array.map((element, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Bar */}
            <div
              className={`w-12 rounded-t transition-all duration-300 flex items-end justify-center text-white text-sm font-bold ${
                element.isSorted
                  ? 'bg-green-500'
                  : element.isSwapping
                  ? 'bg-red-500 animate-pulse'
                  : element.isComparing
                  ? 'bg-yellow-500'
                  : element.isPivot
                  ? 'bg-purple-500'
                  : element.isSelected
                  ? 'bg-orange-500'
                  : isDarkMode
                  ? 'bg-blue-400'
                  : 'bg-blue-500'
              }`}
              style={{
                height: `${(element.value / maxValue) * 250}px`,
                minHeight: '30px'
              }}
            >
              <span className="mb-1">{element.value}</span>
            </div>
            {/* Index */}
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {index}
            </div>
          </div>
        ))}
      </div>
      
      {/* Step Info */}
      <div className="mt-6 text-center">
        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {currentStep.description}
        </p>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Step {steps.findIndex(step => step === currentStep) + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}