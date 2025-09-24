'use client';

import { AlgorithmStep, AlgorithmConfig } from '../types';

interface InfoPanelProps {
  algorithmConfig?: AlgorithmConfig;
  currentStep?: AlgorithmStep;
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isDarkMode: boolean;
}

export default function InfoPanel({
  algorithmConfig,
  currentStep,
  steps,
  currentStepIndex,
  isDarkMode
}: InfoPanelProps) {
  return (
    <aside className={`w-80 h-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border-l border-gray-200 dark:border-gray-700 flex flex-col`}>
      {/* Tabs - Fixed */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        {["Code", "Explanation", "Stats"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "Code"
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Panel - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {algorithmConfig && (
          <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4 font-mono text-sm`}>
            <div className="space-y-1">
              {algorithmConfig.code.map((line, index) => (
                <div
                  key={index}
                  className={`px-2 py-1 rounded ${
                    currentStep?.codeLineIndex === index
                      ? 'bg-yellow-200 dark:bg-yellow-800'
                      : ''
                  }`}
                >
                  <span className="text-gray-500 dark:text-gray-400 mr-2">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold mb-3">Current Step</h3>
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} p-3 rounded-lg`}>
            <p className="text-sm">
              {currentStep?.description || "Enter numbers separated by commas and click Apply to start visualization"}
            </p>
          </div>
          
          {!currentStep && (
            <div className={`mt-3 ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'} p-3 rounded-lg`}>
              <p className="text-xs text-green-600 dark:text-green-400">
                💡 <strong>Tip:</strong> Try these examples:<br/>
                • Small: 3,1,4,1,5<br/>
                • Medium: 64,34,25,12,22,11,90<br/>
                • Reverse: 9,8,7,6,5,4,3,2,1
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-3">Statistics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Comparisons:</span>
              <span className="font-mono">{currentStep?.comparisons || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Swaps:</span>
              <span className="font-mono">{currentStep?.swaps || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Array Size:</span>
              <span className="font-mono">{currentStep?.array.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Step:</span>
              <span className="font-mono">{currentStepIndex + 1} / {steps.length || 1}</span>
            </div>
          </div>
        </div>

        {algorithmConfig && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Complexity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Best Case:</span>
                <span className="font-mono">{algorithmConfig.timeComplexity.best}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Case:</span>
                <span className="font-mono">{algorithmConfig.timeComplexity.average}</span>
              </div>
              <div className="flex justify-between">
                <span>Worst Case:</span>
                <span className="font-mono">{algorithmConfig.timeComplexity.worst}</span>
              </div>
              <div className="flex justify-between">
                <span>Space:</span>
                <span className="font-mono">{algorithmConfig.spaceComplexity}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}