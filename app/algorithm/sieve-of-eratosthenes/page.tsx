'use client';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import SieveVisualization from '../../../components/SieveVisualization';
import ControlBar from '../../../components/ControlBar';
import InfoPanel from '../../../components/InfoPanel';
import { sieveConfig } from '../../../app/algorithms/sieve-of-eratosthenes';
import { AlgorithmStep } from '../../../types';

export default function SievePage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const algorithmConfig = sieveConfig;

  // Visualization state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [barWidth, setBarWidth] = useState<number>(48); // px, CSS variable --bar-width

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Auto-init with default input
  useEffect(() => {
    setInputValue(algorithmConfig.defaultInput);
    const timer = setTimeout(() => initializeAlgorithm(), 120);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure CSS variable is set on the wrapper whenever barWidth changes
  useEffect(() => {
    const el = canvasRef.current;
    if (el) {
      // setProperty is well-typed; no casting needed
      el.style.setProperty('--bar-width', `${barWidth}px`);
      // Also ensure iOS-style smooth scrolling behavior
      // (No TypeScript cast required to set style properties)
      // For safety, explicitly set the vendor property via direct assignment
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore WebKit-specific CSS property — harmless and runtime-only
      el.style.WebkitOverflowScrolling = 'touch';
    }
  }, [barWidth]);

  // Playback interval
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
  }, [isPlaying, speed, steps.length]);

  const initializeAlgorithm = () => {
    try {
      const raw = inputValue.trim() || algorithmConfig.defaultInput;
      // Allow either a single number like "30" or "n=30" or comma list but prefer first token
      const firstToken = raw.split(',')[0].trim();
      const maybeNumber = firstToken.replace(/[^\d]/g, '');
      const n = parseInt(maybeNumber, 10);
      if (isNaN(n) || n < 2) {
        alert('Please enter an integer >= 2 (e.g., 30).');
        return;
      }
      // Soft limits for UX
      if (n > 600) {
        if (!confirm('Rendering more than 600 numbers may be slow. Continue?')) return;
      }
      // set the bar width based on n so bars wrap nicely
      // clamp between 24px and 64px
      const computed = Math.max(24, Math.min(64, Math.floor(700 / Math.max(8, Math.sqrt(n)))));
      setBarWidth(computed);

      const newSteps = algorithmConfig.generateSteps([n]);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsInitialized(true);
      setIsPlaying(false);

      // reset scroll to top (if canvas wrapper scrolled previously)
      if (canvasRef.current) canvasRef.current.scrollTop = 0;
    } catch (err) {
      console.error('Init error', err);
      alert('Invalid input. Use a number like "30".');
    }
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const stepBackward = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentStepData = steps[currentStep];

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'
      } transition-all duration-500 relative overflow-hidden`}
    >
      {/* Ambient background (same look as other algos) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Header (identical structure + classes as BubbleSort page) */}
        <header
          className={`relative p-6 flex-shrink-0 backdrop-blur-sm ${
            isDarkMode
              ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-b border-slate-700/50'
              : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-b border-gray-200/50'
          } animate-in slide-in-from-top-4 fade-in duration-600 delay-100`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1 animate-in slide-in-from-left-4 fade-in duration-600 delay-200">
              <h2
                className={`text-2xl font-bold tracking-tight ${
                  isDarkMode ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
                }`}
              >
                {algorithmConfig.name} Visualization
              </h2>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{algorithmConfig.description}</p>
            </div>

            <div className="flex items-center gap-6 animate-in slide-in-from-right-4 fade-in duration-600 delay-300">
              <div
                className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-600/30' : 'bg-white/50 border border-gray-200/30'
                } shadow-sm hover:shadow-md hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 ease-out`}
              >
                <span className={`text-xs font-semibold tracking-wide uppercase ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Time:</span>
                <span className={`ml-2 font-mono font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{algorithmConfig.timeComplexity.average}</span>
              </div>

              <div
                className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-600/30' : 'bg-white/50 border border-gray-200/30'
                } shadow-sm hover:shadow-md hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 ease-out`}
              >
                <span className={`text-xs font-semibold tracking-wide uppercase ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Space:</span>
                <span className={`ml-2 font-mono font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{algorithmConfig.spaceComplexity}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Canvas + Controls */}
        <section className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Canvas - scrollable & wrapping layout */}
            <div
              className={`flex-1 overflow-hidden p-6 min-h-0 relative ${isDarkMode ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30' : 'bg-gradient-to-br from-white/30 to-gray-50/30'} backdrop-blur-sm animate-in fade-in duration-800 delay-400`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
              {/* wrapper that controls bar width via CSS var and allows inner scrolling */}
              <div
                id="sieve-canvas-wrapper"
                ref={canvasRef}
                className="relative h-full w-full overflow-auto p-4 rounded-md"
                style={{ WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}
              >
                {/* inner container — makes bars wrap instead of stacking vertically */}
                <div className="w-full flex flex-wrap items-start gap-3" style={{ alignContent: 'flex-start' }}>
                  <SieveVisualization currentStep={currentStepData} steps={steps} isInitialized={isInitialized} />
                </div>
              </div>
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
          <InfoPanel algorithmConfig={algorithmConfig} currentStep={currentStepData} steps={steps} currentStepIndex={currentStep} />
        </section>
      </main>
    </div>
  );
}
