'use client';

import { AlgorithmStep } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface VisualizationCanvasProps {
  currentStep?: AlgorithmStep;
  steps: AlgorithmStep[];
  isInitialized: boolean;
}

export default function VisualizationCanvas({ 
  currentStep, 
  steps, 
  isInitialized 
}: VisualizationCanvasProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  if (!isInitialized || !currentStep) {
    return (
      <div className="h-full flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl" />
        <div className={`text-center relative z-10 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          <div className={`w-32 h-32 mx-auto mb-6 rounded-2xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-700/50 to-slate-800/50' 
              : 'bg-gradient-to-br from-white/80 to-gray-50/80'
          } backdrop-blur-sm border ${
            isDarkMode ? 'border-slate-600/30' : 'border-gray-200/30'
          } flex items-center justify-center shadow-xl`}>
            <svg className="w-16 h-16 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Visualization Canvas
          </h3>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Enter an array and click Apply to begin your algorithmic journey
          </p>
        </div>
      </div>
    );
  }

  const maxValue = steps.length > 0 ? Math.max(...steps[0].array.map(el => el.value)) : 100;

  return (
    <div className="h-full flex flex-col justify-center p-8 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-purple-500/3 rounded-2xl" />
      
      {/* Array Visualization */}
      <div className="flex items-end justify-center gap-1 sm:gap-2 flex-1 max-h-96 relative z-10">
        {currentStep.array.map((element, index) => (
          <div key={index} className="flex flex-col items-center group">
            {/* Bar with premium styling */}
            <div
              className={`relative w-6 sm:w-8 md:w-10 lg:w-12 rounded-t-xl transition-all duration-500 flex items-end justify-center text-white text-xs sm:text-sm font-bold shadow-lg transform hover:scale-105 ${
                element.isSorted
                  ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-emerald-500/30'
                  : element.isSwapping
                  ? 'bg-gradient-to-t from-red-500 to-red-400 animate-pulse shadow-red-500/40'
                  : element.isComparing
                  ? 'bg-gradient-to-t from-amber-500 to-amber-400 shadow-amber-500/40'
                  : element.isPivot
                  ? 'bg-gradient-to-t from-purple-500 to-purple-400 shadow-purple-500/30'
                  : element.isSelected
                  ? 'bg-gradient-to-t from-orange-500 to-orange-400 shadow-orange-500/30'
                  : isDarkMode
                  ? 'bg-gradient-to-t from-blue-500 to-blue-400 shadow-blue-500/30'
                  : 'bg-gradient-to-t from-blue-600 to-blue-500 shadow-blue-600/30'
              }`}
              style={{
                height: `${Math.max(40, (element.value / maxValue) * 280)}px`,
                minHeight: '40px'
              }}
            >
              {/* Glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 rounded-t-xl" />
              <span className="relative z-10 mb-2 px-1 drop-shadow-sm">{element.value}</span>
            </div>
            
            {/* Index with premium styling */}
            <div className={`text-xs mt-2 font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-700'
            }`}>
              {index}
            </div>
          </div>
        ))}
      </div>
      
      {/* Step Info with glassmorphism */}
      <div className="mt-8 text-center flex-shrink-0 relative z-10">
        <div className={`inline-block px-6 py-4 rounded-2xl backdrop-blur-sm ${
          isDarkMode 
            ? 'bg-slate-800/30 border border-slate-700/30' 
            : 'bg-white/50 border border-gray-200/30'
        } shadow-xl`}>
          <p className={`text-sm sm:text-base lg:text-lg font-medium ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          } leading-relaxed`}>
            {currentStep.description}
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs sm:text-sm">
            <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Step {steps.findIndex(step => step === currentStep) + 1} of {steps.length}
            </span>
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <span className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {currentStep.comparisons} comparisons
            </span>
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <span className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {currentStep.swaps} swaps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}