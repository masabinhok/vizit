'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { AlgorithmStep, ArrayElement } from '../../../types';
import { gameOfLifeConfig, nextGeneration } from '../../algorithms/game-of-life';
import GameOfLifeGrid from '../../../components/GameOfLifeGrid';
import GameOfLifeControlBar from '../../../components/GameOfLifeControlBar';
import InfoPanel from '../../../components/InfoPanel';
import toast from 'react-hot-toast';


export default function BubbleSortPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const algorithmConfig = gameOfLifeConfig;

  const [dimensions, setDimensions] = useState('25x25');
  const [density, setDensity] = useState(0.3);
  const [speed, setSpeed] = useState(60); // 1-100
  const [isPlaying, setIsPlaying] = useState(false);

  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const gridRef = useRef<number[][] | null>(null);
  const generationRef = useRef(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const parseDims = (input: string) => {
    const parts = input.toLowerCase().split('x').map(s => s.trim());
    if (parts.length !== 2) throw new Error('Invalid dimensions');
    const w = Number(parts[0]);
    const h = Number(parts[1]);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 5 || h < 5 || w > 80 || h > 80) {
      throw new Error('Enter sizes between 5 and 80');
    }
    return { w, h };
  };

  const buildArrayFromGrid = (grid: number[][]): ArrayElement[] => {
    const arr: ArrayElement[] = [];
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        const v = grid[r][c];
        arr.push({ value: v, isComparing: false, isSwapping: false, isSorted: false });
      }
    }
    return arr;
  };

  const initialize = useCallback(() => {
    try {
      const { w, h } = parseDims(dimensions.trim() || algorithmConfig.defaultInput.split('@')[0]);
      const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(0));
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          grid[r][c] = Math.random() < density ? 1 : 0;
        }
      }
      gridRef.current = grid;
      generationRef.current = 0;
      const arr = buildArrayFromGrid(grid);
      setSteps([{
        array: arr,
        description: 'Initial random configuration',
        codeLineIndex: 0,
        additionalInfo: { isGrid: true, width: w, height: h, generation: 0 }
      }]);
      setIsInitialized(true);
    } catch (e) {
      console.log(e);
      toast.error('Invalid input. Use format like "25x25" (5–80).', { id: 'input-error', duration: 4000 });
    }
  }, [dimensions, density, algorithmConfig]);

  // auto-run loop
  useEffect(() => {
    if (!isInitialized || !isPlaying) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }
    const delayMs = 100 + Math.round((100 - speed) * 18); // faster when speed higher
    intervalRef.current = setInterval(() => {
      if (!gridRef.current) return;
      const { next, births, deaths, survivals } = nextGeneration(gridRef.current);
      gridRef.current = next;
      generationRef.current += 1;
      const w = next[0].length, h = next.length;
      const arr = buildArrayFromGrid(next);
      const desc = `Gen ${generationRef.current}: ${births} born, ${deaths} died, ${survivals} survived.`;
      setSteps([{ array: arr, description: desc, codeLineIndex: 1, additionalInfo: { isGrid: true, width: w, height: h, generation: generationRef.current, births, deaths, survivals } }]);
    }, delayMs);
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [isInitialized, isPlaying, speed]);

  // start on mount
  useEffect(() => { initialize(); }, [initialize]);

  const onRandomize = () => {
    initialize();
  };

  const onReset = () => {
    setIsPlaying(false);
    initialize();
  };

  const currentStepData = steps[0];

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
              <GameOfLifeGrid currentStep={currentStepData} isInitialized={isInitialized} />
              </div>
            </div>

            {/* Control Bar - Fixed height with premium styling */}
            <div className="flex-shrink-0 animate-in slide-in-from-bottom-4 fade-in duration-600 delay-500">
             <GameOfLifeControlBar
                           isPlaying={isPlaying}
                           setIsPlaying={setIsPlaying}
                           speed={speed}
                           setSpeed={setSpeed}
                           dimensions={dimensions}
                           setDimensions={setDimensions}
                           density={density}
                           setDensity={setDensity}
                           onApply={initialize}
                           onRandomize={onRandomize}
                           onReset={onReset}
                         />
            </div>
          </div>

          {/* Info Panel */}
         <InfoPanel
                     algorithmConfig={algorithmConfig}
                     currentStep={currentStepData}
                     steps={steps}
                     currentStepIndex={0}
                   />
        </section>
      </main>
    </div>
  );
}
