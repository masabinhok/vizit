'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import VisualizationCanvas from '../../../components/VisualizationCanvas';
import ControlBar from '../../../components/ControlBar';
import InfoPanel from '../../../components/InfoPanel';
import { bubbleSortConfig } from '../../../app/algorithms/bubble-sort';
import { AlgorithmStep } from '../../../types';

export default function BubbleSortPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  const algorithmConfig = bubbleSortConfig;
  
  // Visualization state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputArray, setInputArray] = useState('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      
      if (numbers.length > 20) {
        alert("Please enter no more than 20 numbers for better visualization");
        return;
      }
      
      const newSteps = algorithmConfig.generateSteps(numbers);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsInitialized(true);
      setIsPlaying(false);
    } catch (error) {
      console.error("Algorithm initialization error:", error);
      alert("Invalid input format. Please use numbers separated by commas (e.g., 64,34,25,12).");
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

  const currentStepData = steps[currentStep];

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'} transition-all duration-500 relative overflow-hidden`}>
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Header */}
        <header className={`relative p-6 flex-shrink-0 backdrop-blur-sm ${
          isDarkMode 
            ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-b border-slate-700/50' 
            : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-b border-gray-200/50'
        } animate-in slide-in-from-top-4 fade-in duration-600 delay-100`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1 animate-in slide-in-from-left-4 fade-in duration-600 delay-200">
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
            <div className="flex items-center gap-6 animate-in slide-in-from-right-4 fade-in duration-600 delay-300">
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
        <section className="flex-1 flex min-h-0">
          {/* Main Visualization Canvas */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Canvas - Takes remaining space with glassmorphism */}
            <div className={`flex-1 overflow-hidden p-6 min-h-0 relative ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30' 
                : 'bg-gradient-to-br from-white/30 to-gray-50/30'
            } backdrop-blur-sm animate-in fade-in duration-800 delay-400`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
              <div className="relative h-full">
                <VisualizationCanvas
                  currentStep={currentStepData}
                  steps={steps}
                  isInitialized={isInitialized}
                />
              </div>
            </div>

            {/* Control Bar - Fixed height with premium styling */}
            <div className="flex-shrink-0 animate-in slide-in-from-bottom-4 fade-in duration-600 delay-500">
              <ControlBar
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                speed={speed}
                setSpeed={setSpeed}
                inputArray={inputArray}
                setInputArray={setInputArray}
                currentStep={currentStep}
                totalSteps={steps.length}
                isInitialized={isInitialized}
                onInitialize={initializeAlgorithm}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                onReset={reset}
              />
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
