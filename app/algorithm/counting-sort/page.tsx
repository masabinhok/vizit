'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import CountingSortVisualization from '../../../components/CountingSortVisualization';
import InfoPanel from '../../../components/InfoPanel';
import { countingSortConfig } from '../../../app/algorithms/counting-sort';
import { AlgorithmStep } from '../../../types';

export default function CountingSortPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  const algorithmConfig = countingSortConfig;
  
  // Visualization state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputArray, setInputArray] = useState('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Presets for different scenarios
  const presets = [
    { name: 'Small Range', value: '4,2,2,8,3,3,1', description: 'Optimal: k=8, n=7' },
    { name: 'Large Range', value: '100,5,200,3,150,50,180', description: 'Suboptimal: k=200, n=7' },
    { name: 'Stability Demo', value: '5,2,5,2,5,2', description: 'Shows stable sorting' },
    { name: 'Already Sorted', value: '1,2,3,4,5,6,7,8', description: 'Best case' },
    { name: 'Reverse Sorted', value: '9,8,7,6,5,4,3,2,1', description: 'Still O(n+k)' },
    { name: 'All Same', value: '5,5,5,5,5,5', description: 'Edge case' },
    { name: 'Random', value: '7,3,9,1,4,6,2,8,5', description: 'Typical case' }
  ];

  // Initialize with default input
  useEffect(() => {
    setInputArray(algorithmConfig.defaultInput);
    // Auto-initialize for the first load
    const timer = setTimeout(() => initializeAlgorithm(), 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animation control
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const delay = Math.max(100, 1000 - (speed * 9));
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, steps.length]);

  const initializeAlgorithm = () => {
    try {
      // Use current inputArray or fallback to default
      const arrayToProcess = inputArray.trim() || algorithmConfig.defaultInput;
      const numbers = arrayToProcess.split(',')
        .map(n => n.trim())
        .filter(n => n.length > 0)
        .map(n => parseInt(n))
        .filter(n => !isNaN(n) && isFinite(n));
      
      if (numbers.length === 0) {
        alert("Please enter valid numbers separated by commas");
        return;
      }
      
      if (numbers.some(n => n < 0)) {
        alert("Counting sort requires non-negative integers only");
        return;
      }
      
      if (numbers.length > 20) {
        alert("Please enter no more than 20 numbers for better visualization");
        return;
      }

      const maxValue = Math.max(...numbers);
      if (maxValue > 250) {
        alert("Maximum value should be ≤ 250 for optimal visualization");
        return;
      }
      
      const newSteps = algorithmConfig.generateSteps(numbers);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsInitialized(true);
      setIsPlaying(false);
    } catch (error) {
      console.error("Algorithm initialization error:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Invalid input format'}. Please use non-negative integers separated by commas.`);
    }
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const loadPreset = (presetValue: string) => {
    setInputArray(presetValue);
    setIsPlaying(false);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'} transition-all duration-500 relative overflow-hidden`}>
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="top-0 -left-4 absolute bg-blue-400/10 opacity-70 blur-xl rounded-full w-72 h-72 animate-blob mix-blend-multiply filter" />
        <div className="top-0 -right-4 absolute bg-purple-400/10 opacity-70 blur-xl rounded-full w-72 h-72 animate-blob animation-delay-2000 mix-blend-multiply filter" />
        <div className="-bottom-8 left-20 absolute bg-emerald-400/10 opacity-70 blur-xl rounded-full w-72 h-72 animate-blob animation-delay-4000 mix-blend-multiply filter" />
      </div>

      {/* Main Content */}
      <main className="relative flex flex-col flex-1 min-h-0">
        {/* Header */}
        <header className={`relative p-6 flex-shrink-0 backdrop-blur-sm ${
          isDarkMode 
            ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-b border-slate-700/50' 
            : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-b border-gray-200/50'
        } animate-in slide-in-from-top-4 fade-in duration-600 delay-100`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          <div className="relative flex justify-between items-center">
            <div className="space-y-1 slide-in-from-left-4 animate-in duration-600 delay-200 fade-in">
              <h2 className={`text-2xl font-bold tracking-tight ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
              }`}>
                {algorithmConfig.name} Visualization
              </h2>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                {algorithmConfig.description}
              </p>
            </div>
            <div className="slide-in-from-right-4 flex items-center gap-6 animate-in duration-600 delay-300 fade-in">
              <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-slate-800/50 border border-slate-600/30' 
                  : 'bg-white/50 border border-gray-200/30'
              } shadow-sm hover:shadow-md hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 ease-out`}>
                <span className={`text-xs font-semibold tracking-wide uppercase ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  Time: 
                </span>
                <span className={`ml-2 font-mono font-bold ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-600'
                }`}>
                  {algorithmConfig.timeComplexity.average}
                </span>
              </div>
              <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-slate-800/50 border border-slate-600/30' 
                  : 'bg-white/50 border border-gray-200/30'
              } shadow-sm hover:shadow-md hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 ease-out`}>
                <span className={`text-xs font-semibold tracking-wide uppercase ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  Space: 
                </span>
                <span className={`ml-2 font-mono font-bold ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  {algorithmConfig.spaceComplexity}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Canvas and Controls Area */}
        <section className="flex flex-1 min-h-0">
          {/* Main Visualization Canvas */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* Canvas - Takes remaining space with glassmorphism */}
            <div className={`flex-1 overflow-hidden p-6 min-h-0 relative ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30' 
                : 'bg-gradient-to-br from-white/30 to-gray-50/30'
            } backdrop-blur-sm animate-in fade-in duration-800 delay-400`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
              <div className="relative h-full">
                <CountingSortVisualization
                  currentStep={currentStepData}
                  isInitialized={isInitialized}
                />
              </div>
            </div>

            {/* Control Bar - Custom for Counting Sort with presets */}
            <div className={`flex-shrink-0 p-6 backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-t border-slate-700/50' 
                : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-t border-gray-200/50'
            } animate-in slide-in-from-bottom-4 fade-in duration-600 delay-500`}>
              <div className="space-y-4">
                {/* Presets Row */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  } min-w-[60px]`}>
                    Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {presets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => loadPreset(preset.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                        } hover:scale-105 hover:shadow-md`}
                        title={preset.description}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Row */}
                <div className="flex items-center gap-4">
                  <label className={`text-xs font-semibold uppercase tracking-wide ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  } min-w-[60px]`}>
                    Array:
                  </label>
                  <input
                    type="text"
                    value={inputArray}
                    onChange={(e) => setInputArray(e.target.value)}
                    placeholder="e.g., 4,2,2,8,3,3,1"
                    className={`flex-1 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-slate-700 text-slate-100 placeholder-slate-500 border border-slate-600 focus:border-blue-500'
                        : 'bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                  <button
                    onClick={initializeAlgorithm}
                    className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                    } text-white shadow-lg hover:shadow-xl hover:scale-105`}
                  >
                    Initialize
                  </button>
                </div>

                {/* Playback Controls Row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={reset}
                      disabled={!isInitialized}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isInitialized
                          ? isDarkMode
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                          : 'opacity-50 cursor-not-allowed bg-slate-700/50 text-slate-500'
                      } hover:scale-105`}
                      title="Reset"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={stepBackward}
                      disabled={!isInitialized || currentStep === 0}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isInitialized && currentStep > 0
                          ? isDarkMode
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                          : 'opacity-50 cursor-not-allowed bg-slate-700/50 text-slate-500'
                      } hover:scale-105`}
                      title="Step Backward"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={!isInitialized}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isInitialized
                          ? isDarkMode
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                          : 'opacity-50 cursor-not-allowed bg-slate-700/50 text-slate-500'
                      } hover:scale-105 shadow-lg`}
                      title={isPlaying ? 'Pause' : 'Play'}
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
                      onClick={stepForward}
                      disabled={!isInitialized || currentStep >= steps.length - 1}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isInitialized && currentStep < steps.length - 1
                          ? isDarkMode
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                          : 'opacity-50 cursor-not-allowed bg-slate-700/50 text-slate-500'
                      } hover:scale-105`}
                      title="Step Forward"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Speed Control */}
                  <div className="flex flex-1 items-center gap-3">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    } min-w-[50px]`}>
                      Speed:
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className={`text-sm font-mono font-bold ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    } min-w-[30px]`}>
                      {speed}
                    </span>
                  </div>

                  {/* Step Counter */}
                  <div className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-slate-700' : 'bg-white border border-gray-300'
                  }`}>
                    <span className={`text-sm font-mono font-bold ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-700'
                    }`}>
                      {isInitialized ? `${currentStep + 1} / ${steps.length}` : '- / -'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <InfoPanel
            algorithmConfig={algorithmConfig}
            currentStep={currentStepData}
            steps={steps}
            currentStepIndex={currentStep}
          />
        </section>
      </main>
    </div>
  );
}

