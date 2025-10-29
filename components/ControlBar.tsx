'use client';

import { useTheme } from '../contexts/ThemeContext';
// 1. Import a new icon for the randomize button
import { RefreshCw } from 'lucide-react';

interface ControlBarProps {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  speed: number;
  setSpeed: (value: number) => void;
  inputArray: string;
  setInputArray: (value: string) => void;
  currentStep: number;
  totalSteps: number;
  isInitialized: boolean;
  onInitialize: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onRandomize?: () => void;
  showRandomizeButton?: boolean;
}

export default function ControlBar({
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  inputArray,
  setInputArray,
  currentStep,
  totalSteps,
  isInitialized,
  onInitialize,
  onStepForward,
  onStepBackward,
  onReset,
  onRandomize,
  showRandomizeButton = false,
}: ControlBarProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  return (
    <div className={`relative backdrop-blur-sm border-t ${
      isDarkMode 
        ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-slate-700/50' 
        : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-gray-200/50'
    } shadow-2xl`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      
      <div className="relative p-4">
        <div className="flex items-center justify-between gap-6 flex-wrap lg:flex-nowrap">
          {/* Playback Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={!isInitialized || currentStep >= totalSteps - 1}
              className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 ease-out shadow-lg ${
                !isInitialized || currentStep >= totalSteps - 1
                  ? `${isDarkMode ? 'bg-slate-600/50 text-slate-400 shadow-slate-600/20' : 'bg-gray-200/80 text-gray-400 shadow-gray-200/40'} cursor-not-allowed`
                  : isPlaying 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30 hover:shadow-red-500/40 transform hover:scale-105 hover:-translate-y-0.5' 
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/30 hover:shadow-emerald-500/40 transform hover:scale-105 hover:-translate-y-0.5'
              }`}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <button 
              onClick={onStepBackward}
              disabled={!isInitialized || currentStep <= 0}
              className={`p-2 rounded-xl transition-all duration-200 ease-out border backdrop-blur-sm shadow-md ${
                !isInitialized || currentStep <= 0
                  ? `${isDarkMode ? 'bg-slate-700/50 border-slate-600/30 text-slate-500 shadow-slate-600/20' : 'bg-gray-100/80 border-gray-200/30 text-gray-400 shadow-gray-200/40'} cursor-not-allowed`
                  : isDarkMode 
                  ? 'bg-slate-700/70 border-slate-600/30 text-slate-300 hover:bg-slate-600/70 hover:border-slate-500/50 hover:text-white shadow-slate-700/30 hover:shadow-slate-600/40' 
                  : 'bg-white/80 border-gray-300/30 text-gray-700 hover:bg-gray-50/90 hover:border-gray-400/40 hover:text-gray-900 shadow-white/50 hover:shadow-gray-200/60'
              } transform hover:scale-102 hover:-translate-y-0.5`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.333 4z" />
              </svg>
            </button>

            <button 
              onClick={onStepForward}
              disabled={!isInitialized || currentStep >= totalSteps - 1}
              className={`p-2 rounded-xl transition-all duration-200 ease-out border backdrop-blur-sm shadow-md ${
                !isInitialized || currentStep >= totalSteps - 1
                  ? `${isDarkMode ? 'bg-slate-700/50 border-slate-600/30 text-slate-500 shadow-slate-600/20' : 'bg-gray-100/80 border-gray-200/30 text-gray-400 shadow-gray-200/40'} cursor-not-allowed`
                  : isDarkMode 
                  ? 'bg-slate-700/70 border-slate-600/30 text-slate-300 hover:bg-slate-600/70 hover:border-slate-500/50 hover:text-white shadow-slate-700/30 hover:shadow-slate-600/40' 
                  : 'bg-white/80 border-gray-300/30 text-gray-700 hover:bg-gray-50/90 hover:border-gray-400/40 hover:text-gray-900 shadow-white/50 hover:shadow-gray-200/60'
              } transform hover:scale-102 hover:-translate-y-0.5`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </button>

            <button 
              onClick={onReset}
              disabled={!isInitialized}
              className={`p-2 rounded-xl transition-all duration-200 ease-out border backdrop-blur-sm shadow-md ${
                !isInitialized
                  ? `${isDarkMode ? 'bg-slate-700/50 border-slate-600/30 text-slate-500 shadow-slate-600/20' : 'bg-gray-100/80 border-gray-200/30 text-gray-400 shadow-gray-200/40'} cursor-not-allowed`
                  : isDarkMode 
                  ? 'bg-slate-700/70 border-slate-600/30 text-slate-300 hover:bg-slate-600/70 hover:border-slate-500/50 hover:text-white shadow-slate-700/30 hover:shadow-slate-600/40' 
                  : 'bg-white/80 border-gray-300/30 text-gray-700 hover:bg-gray-50/90 hover:border-gray-400/40 hover:text-gray-900 shadow-white/50 hover:shadow-gray-200/60'
              } transform hover:scale-102 hover:-translate-y-0.5`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <label className={`text-sm font-semibold tracking-wide hidden sm:block ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Speed
            </label>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border shadow-md ${
              isDarkMode 
                ? 'bg-slate-700/50 border-slate-600/30 shadow-slate-700/30' 
                : 'bg-white/50 border-gray-300/30 shadow-white/50'
            }`}>
              <span className="text-sm">🐌</span>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className={`w-20 sm:w-24 h-2 rounded-full appearance-none cursor-pointer transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-600 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-blue-500 [&::-moz-range-thumb]:to-purple-500' 
                    : 'bg-gray-300 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-600 [&::-webkit-slider-thumb]:to-purple-600 [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-blue-600 [&::-moz-range-thumb]:to-purple-600'
                } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-300 [&::-webkit-slider-thumb]:hover:scale-110`}
              />
              <span className="text-sm">🚀</span>
            </div>
            <span className={`text-sm font-bold tabular-nums hidden sm:block ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {speed}%
            </span>
          </div>

          {/* Algorithm Input */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <input
              type="text"
              placeholder="e.g., 64,34,25,12,22"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              className={`flex-1 px-4 py-3 text-sm rounded-xl border min-w-0 transition-all duration-200 ease-out backdrop-blur-sm shadow-md ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600/30 text-white placeholder-slate-400 focus:bg-slate-600/50 focus:border-slate-500/50 shadow-slate-700/30' 
                  : 'bg-white/50 border-gray-300/30 text-gray-900 placeholder-gray-500 focus:bg-white/70 focus:border-gray-400/50 shadow-white/50'
              } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent hover:shadow-lg font-medium`}
            />

            {/* 2. Add the new Randomize button */}
            {showRandomizeButton && (
              <button
                onClick={onRandomize}
                title="Generate Random Array"
                className={`p-3 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 ease-out whitespace-nowrap flex-shrink-0 shadow-lg hover:shadow-xl font-semibold transform hover:scale-102 hover:-translate-y-0.5 hover:shadow-blue-500/30`}
              >
                <RefreshCw size={20} />
              </button>
            )}

            <button 
              onClick={onInitialize}
              className="px-6 py-3 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 ease-out whitespace-nowrap flex-shrink-0 shadow-lg hover:shadow-xl font-semibold transform hover:scale-102 hover:-translate-y-0.5 hover:shadow-blue-500/30"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}