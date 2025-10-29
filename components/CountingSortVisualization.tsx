'use client';

import { useTheme } from '../contexts/ThemeContext';
import { AlgorithmStep } from '../types';

interface CountingSortVisualizationProps {
  currentStep: AlgorithmStep;
  isInitialized: boolean;
}

export default function CountingSortVisualization({
  currentStep,
  isInitialized
}: CountingSortVisualizationProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  if (!isInitialized || !currentStep) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          Enter an array and click Initialize to start
        </p>
      </div>
    );
  }

  const { array, countArray, outputArray, phase, highlightCountIndex, currentIndex } = currentStep;
  
  // Calculate max value for scaling
  const maxValue = Math.max(...array.map(el => el.value), 1);
  const maxCount = countArray ? Math.max(...countArray, 1) : 1;

  // Get phase color
  const getPhaseColor = () => {
    switch (phase) {
      case 'counting': return isDarkMode ? 'from-blue-500 to-cyan-500' : 'from-blue-400 to-cyan-400';
      case 'cumulative': return isDarkMode ? 'from-purple-500 to-pink-500' : 'from-purple-400 to-pink-400';
      case 'placing': return isDarkMode ? 'from-emerald-500 to-teal-500' : 'from-emerald-400 to-teal-400';
      case 'complete': return isDarkMode ? 'from-green-500 to-emerald-500' : 'from-green-400 to-emerald-400';
      default: return isDarkMode ? 'from-slate-500 to-gray-500' : 'from-slate-400 to-gray-400';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 w-full h-full overflow-y-auto">
      {/* Phase Indicator */}
      <div className={`px-4 py-2 rounded-lg backdrop-blur-sm ${
        isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
      } border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} shadow-lg`}>
        <div className="flex justify-between items-center">
          <span className={`text-sm font-semibold uppercase tracking-wide ${
            isDarkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Phase:
          </span>
          <span className={`ml-2 px-3 py-1 rounded-md bg-gradient-to-r ${getPhaseColor()} text-white font-bold text-sm shadow-md`}>
            {phase === 'init' && 'Initialization'}
            {phase === 'counting' && 'Counting Occurrences'}
            {phase === 'cumulative' && 'Cumulative Sum'}
            {phase === 'placing' && 'Placing Elements'}
            {phase === 'complete' && 'Complete'}
          </span>
        </div>
      </div>

      {/* Input Array */}
      <div className={`rounded-xl p-4 backdrop-blur-sm ${
        isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
      } border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} shadow-lg`}>
        <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Input Array
        </h3>
        <div className="flex flex-wrap justify-center items-end gap-2 min-h-[120px]">
          {array.map((element, idx) => {
            const height = Math.max((element.value / maxValue) * 80, 20);
            const isHighlighted = currentIndex === idx;
            
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                {/* Bar */}
                <div
                  className={`relative w-12 rounded-t-lg transition-all duration-300 flex items-end justify-center pb-2 ${
                    isHighlighted
                      ? 'bg-gradient-to-t from-amber-500 to-orange-500 shadow-lg shadow-orange-500/50 scale-110'
                      : element.isComparing
                      ? 'bg-gradient-to-t from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50'
                      : isDarkMode
                      ? 'bg-gradient-to-t from-slate-600 to-slate-500'
                      : 'bg-gradient-to-t from-gray-400 to-gray-300'
                  }`}
                  style={{ height: `${height}px` }}
                >
                  <span className="font-bold text-white text-sm">{element.value}</span>
                </div>
                {/* Index */}
                <span className={`text-xs font-mono ${
                  isHighlighted 
                    ? 'text-orange-500 font-bold' 
                    : isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Counting Array */}
      {countArray && countArray.length > 0 && (
        <div className={`rounded-xl p-4 backdrop-blur-sm ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
        } border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} shadow-lg`}>
          <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            {phase === 'cumulative' || phase === 'placing' || phase === 'complete' 
              ? 'Counting Array (Cumulative)' 
              : 'Counting Array (Frequency)'}
          </h3>
          <div className="flex flex-wrap justify-center items-end gap-2 min-h-[120px]">
            {countArray.map((count, idx) => {
              const height = count === 0 ? 5 : Math.max((count / maxCount) * 80, 20);
              const isHighlighted = highlightCountIndex === idx;
              
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  {/* Bar */}
                  <div
                    className={`relative w-12 rounded-t-lg transition-all duration-300 flex items-end justify-center pb-2 ${
                      isHighlighted
                        ? phase === 'counting'
                          ? 'bg-gradient-to-t from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50 scale-110'
                          : phase === 'cumulative'
                          ? 'bg-gradient-to-t from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 scale-110'
                          : 'bg-gradient-to-t from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/50 scale-110'
                        : count === 0
                        ? isDarkMode
                          ? 'bg-slate-700/30'
                          : 'bg-gray-300/30'
                        : isDarkMode
                        ? 'bg-gradient-to-t from-slate-600 to-slate-500'
                        : 'bg-gradient-to-t from-gray-400 to-gray-300'
                    }`}
                    style={{ height: `${height}px` }}
                  >
                    {count > 0 && (
                      <span className="font-bold text-white text-sm">{count}</span>
                    )}
                  </div>
                  {/* Index (value) */}
                  <span className={`text-xs font-mono ${
                    isHighlighted 
                      ? phase === 'counting'
                        ? 'text-blue-500 font-bold'
                        : phase === 'cumulative'
                        ? 'text-purple-500 font-bold'
                        : 'text-emerald-500 font-bold'
                      : isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Output Array */}
      {outputArray && outputArray.length > 0 && (
        <div className={`rounded-xl p-4 backdrop-blur-sm ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
        } border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} shadow-lg`}>
          <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Output Array (Sorted)
          </h3>
          <div className="flex flex-wrap justify-center items-end gap-2 min-h-[120px]">
            {outputArray.map((element, idx) => {
              const height = element.value === -1 ? 5 : Math.max((element.value / maxValue) * 80, 20);
              const isEmpty = element.value === -1;
              
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  {/* Bar */}
                  <div
                    className={`relative w-12 rounded-t-lg transition-all duration-300 flex items-end justify-center pb-2 ${
                      isEmpty
                        ? isDarkMode
                          ? 'bg-slate-700/20 border-2 border-dashed border-slate-600'
                          : 'bg-gray-200/20 border-2 border-dashed border-gray-400'
                        : element.isSwapping
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50 scale-110'
                        : element.isSorted
                        ? 'bg-gradient-to-t from-green-500 to-emerald-500 shadow-md'
                        : isDarkMode
                        ? 'bg-gradient-to-t from-slate-600 to-slate-500'
                        : 'bg-gradient-to-t from-gray-400 to-gray-300'
                    }`}
                    style={{ height: `${height}px` }}
                  >
                    {!isEmpty && (
                      <span className="font-bold text-white text-sm">{element.value}</span>
                    )}
                  </div>
                  {/* Index */}
                  <span className={`text-xs font-mono ${
                    element.isSwapping
                      ? 'text-emerald-500 font-bold'
                      : isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      {currentStep.comparisons !== undefined && (
        <div className={`rounded-xl p-4 backdrop-blur-sm ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
        } border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} shadow-lg`}>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {currentStep.comparisons}
              </div>
              <div className={`text-xs uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Operations
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {countArray ? countArray.length : 0}
              </div>
              <div className={`text-xs uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Key Range (k)
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                {array.length}
              </div>
              <div className={`text-xs uppercase tracking-wide ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Array Size (n)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

