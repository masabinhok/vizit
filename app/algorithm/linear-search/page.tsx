// app/algorithm/linear-search/page.tsx
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import LinearSearchVisualization from '../../../components/LinearSearchVisualization';
import ControlBar from '../../../components/ControlBar';
import InfoPanel from '../../../components/InfoPanel';
import { linearSearchConfig } from '../../../app/algorithms/linear-search';
import type { AlgorithmStep } from '../../../types';

function generateRandomPipeInput(count = 8, maxVal = 99, pickFromArray = true) {
  const arr: number[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(Math.floor(Math.random() * maxVal) + 1);
  }
  const target = pickFromArray
    ? arr[Math.floor(Math.random() * arr.length)]
    : Math.floor(Math.random() * maxVal) + 1;

  return `${arr.join(',')}|${target}`;
}

export default function LinearSearchPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const algorithmConfig = linearSearchConfig;

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [blockSize, setBlockSize] = useState<number>(56);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

   const initializeAlgorithm = useCallback((): void => {
    try {
      const raw = inputValue.trim() || algorithmConfig.defaultInput || '';
      const parsed = parsePipeInput(raw);
      if (!parsed) {
        alert('Invalid input. Use the format: array|target (e.g. 64,34,25|11).');
        return;
      }

      const { target, arr } = parsed;

      if (arr.length === 0) {
        alert('Enter at least one array element before the pipe.');
        return;
      }

      if (arr.length > 400) {
        if (!confirm('Rendering many items may be slow. Continue?')) return;
      }

      setBlockSize(Math.max(40, Math.min(76, Math.floor(700 / Math.max(8, Math.sqrt(arr.length))))));

      const newSteps = algorithmConfig.generateSteps([target, ...arr]);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsInitialized(true);
      setIsPlaying(false);

      const wrapper = document.getElementById('linear-canvas-wrapper');
      if (wrapper) wrapper.scrollTop = 0;
    } catch (err) {
      console.error('Failed to initialize Linear Search:', err);
      alert('Failed to initialize algorithm. Check console for details.');
    }
  }, [inputValue, algorithmConfig]);


  // Auto-initialize on mount with default input
  useEffect(() => {
    setInputValue(algorithmConfig.defaultInput || '');
    const timer = setTimeout(() => initializeAlgorithm(), 120);
    return () => clearTimeout(timer);
  }, [algorithmConfig.defaultInput, initializeAlgorithm]);

  // Playback interval effect
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const delay = Math.max(80, 1000 - speed * 9);
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
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length, algorithmConfig.defaultInput]);

  // Parse input in the required "array|target" format
  const parsePipeInput = (raw: string): { target: number; arr: number[] } | null => {
    const s = raw.trim();
    if (!s) return null;
    if (!s.includes('|')) return null;
    const [arrPartRaw, targetPartRaw] = s.split('|', 2);
    const arrPart = arrPartRaw?.trim() ?? '';
    const targetPart = targetPartRaw?.trim() ?? '';
    if (!arrPart || !targetPart) return null;

    const arrNums = arrPart
      .split(',')
      .map(x => x.trim())
      .filter(Boolean)
      .map(x => Number.parseInt(x, 10))
      .filter(n => !Number.isNaN(n) && Number.isFinite(n));

    const tnum = Number.parseInt(targetPart, 10);
    if (arrNums.length === 0 || Number.isNaN(tnum)) return null;

    return { target: tnum, arr: arrNums };
  };

 
  const stepForward = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = (): void => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentStepData = steps[currentStep];

  // CSS custom property safely
  const cssVars = {
    [('--block-size' as unknown) as string]: `${blockSize}px`
  } as React.CSSProperties;

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'} transition-all duration-500 relative overflow-hidden`}>
      {/* Ambient background elements (copied from Bubble Sort) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Header (styled to match Bubble Sort header) */}
        <header className={`relative p-6 flex-shrink-0 backdrop-blur-sm ${isDarkMode ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-b border-slate-700/50' : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-b border-gray-200/50'} animate-in slide-in-from-top-4 fade-in duration-600 delay-100`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1 animate-in slide-in-from-left-4 fade-in duration-600 delay-200">
              <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'}`}>
                {algorithmConfig.name} Visualization
              </h2>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {algorithmConfig.description}
              </p>
            </div>

            <div className="flex items-center gap-6 animate-in slide-in-from-right-4 fade-in duration-600 delay-300">
              <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${isDarkMode ? 'bg-slate-800/50 border border-slate-600/30' : 'bg-white/50 border border-gray-200/30'} shadow-sm hover:shadow-md hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 ease-out`}>
                <span className={`text-xs font-semibold tracking-wide uppercase ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  Time:
                </span>
                <span className={`ml-2 font-mono font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                  {algorithmConfig.timeComplexity.average}
                </span>
              </div>

              <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${isDarkMode ? 'bg-slate-800/50 border border-slate-600/30' : 'bg-white/50 border border-gray-200/30'} shadow-sm hover:shadow-md hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 ease-out`}>
                <span className={`text-xs font-semibold tracking-wide uppercase ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  Space:
                </span>
                <span className={`ml-2 font-mono font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
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
            {/* Canvas - glassmorphism background like Bubble Sort */}
            <div className={`flex-1 overflow-hidden p-6 min-h-0 relative ${isDarkMode ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30' : 'bg-gradient-to-br from-white/30 to-gray-50/30'} backdrop-blur-sm animate-in fade-in duration-800 delay-400`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
              <div className="relative h-full">
                <div id="linear-canvas-wrapper" className="relative h-full w-full overflow-auto p-4 rounded-md" style={cssVars}>
                  <div className="w-full flex justify-center">
                    <LinearSearchVisualization currentStep={currentStepData} steps={steps} isInitialized={isInitialized} />
                  </div>
                </div>
              </div>
            </div>

            {/* Random Input button (centered, above control bar) */}
            <div className="flex justify-center items-center gap-3 mt-3 mb-4">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition-colors"
                onClick={() => {
                  const randomInput = generateRandomPipeInput(8, 99, true);
                  setInputValue(randomInput);
                  if (typeof initializeAlgorithm === 'function') {
                    setTimeout(() => initializeAlgorithm(), 80);
                  }
                }}
              >
                🎲 Random Input
              </button>
              <div className="text-sm text-slate-500 select-none">(generates array|target)</div>
            </div>

            {/* Control Bar */}
            <div className="flex-shrink-0 animate-in slide-in-from-bottom-4 fade-in duration-600 delay-500">
              <ControlBar
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                speed={speed}
                setSpeed={setSpeed}
                inputArray={inputValue}
                setInputArray={setInputValue}
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
