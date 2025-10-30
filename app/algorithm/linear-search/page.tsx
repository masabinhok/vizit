// app/algorithm/linear-search/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import LinearSearchVisualization from '../../../components/LinearSearchVisualization';
import ControlBar from '../../../components/ControlBar';
import InfoPanel from '../../../components/InfoPanel';
import { linearSearchConfig } from '../../../app/algorithms/linear-search';
import { AlgorithmStep } from '../../../types';

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

  useEffect(() => {
    // set default input (array|target format)
    setInputValue(algorithmConfig.defaultInput || '');
    const t = setTimeout(() => initializeAlgorithm(), 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const parsePipeInput = (raw: string): { target: number; arr: number[] } | null => {
    // required format: "a,b,c|target"
    const s = raw.trim();
    if (!s) return null;
    if (!s.includes('|')) return null; // must include pipe
    const [arrPart, targetPart] = s.split('|', 2).map(p => p.trim());
    if (!arrPart || !targetPart) return null;
    const arrNums = arrPart.split(',').map(x => x.trim()).filter(Boolean).map(x => parseInt(x, 10)).filter(n => !isNaN(n) && isFinite(n));
    const tnum = parseInt(targetPart, 10);
    if (arrNums.length === 0 || isNaN(tnum)) return null;
    return { target: tnum, arr: arrNums };
  };

  const initializeAlgorithm = () => {
    try {
      const raw = inputValue.trim() || algorithmConfig.defaultInput || '';
      const parsed = parsePipeInput(raw);
      if (!parsed) {
        alert('Invalid input. Use the format: array|target (example: 64,34,25,12,22|11).');
        return;
      }
      const { target, arr } = parsed;

      if (arr.length === 0) {
        alert('Please provide at least one array element.');
        return;
      }

      if (arr.length > 400) {
        if (!confirm('Rendering many items may be slow. Continue?')) return;
      }

      setBlockSize(Math.max(40, Math.min(76, Math.floor(700 / Math.max(8, Math.sqrt(arr.length))))));

      // call generator with [target, ...arr]
      const newSteps = algorithmConfig.generateSteps([target, ...arr]);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsInitialized(true);
      setIsPlaying(false);

      const wrapper = document.getElementById('linear-canvas-wrapper');
      if (wrapper) wrapper.scrollTop = 0;
    } catch (err) {
      console.error(err);
      alert('Failed to initialize. Check input format.');
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
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'} relative overflow-hidden`}>
      <main className="flex-1 flex flex-col min-h-0 relative">
        <header className={`relative p-6 flex-shrink-0 backdrop-blur-sm ${isDarkMode ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-b border-slate-700/50' : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-b border-gray-200/50'}`}>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{algorithmConfig.name} Visualization</h2>
              <p className="text-sm text-gray-600">{algorithmConfig.description}</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="px-4 py-2 rounded-xl bg-white/60 border">
                <span className="text-xs uppercase font-semibold">Time</span>
                <div className="font-mono font-bold">{algorithmConfig.timeComplexity.average}</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/60 border">
                <span className="text-xs uppercase font-semibold">Space</span>
                <div className="font-mono font-bold">{algorithmConfig.spaceComplexity}</div>
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <div className={`flex-1 overflow-hidden p-6 min-h-0 relative ${isDarkMode ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30' : 'bg-gradient-to-br from-white/30 to-gray-50/30'} backdrop-blur-sm`}>
              {/* NOTE: top array input removed per your request; ControlBar contains editable input */}
              <div id="linear-canvas-wrapper" className="relative h-full w-full overflow-auto p-4 rounded-md" style={{ ['--block-size' as any]: `${blockSize}px` } as React.CSSProperties}>
                <div className="w-full flex justify-center">
                  <LinearSearchVisualization currentStep={currentStepData} steps={steps} isInitialized={isInitialized} />
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
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

          <InfoPanel algorithmConfig={algorithmConfig} currentStep={currentStepData} steps={steps} currentStepIndex={currentStep} />
        </section>
      </main>
    </div>
  );
}
