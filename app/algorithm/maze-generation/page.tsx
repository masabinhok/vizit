'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import MazeGrid from '../../../components/MazeGrid';
import MazeControlBar from '../../../components/MazeControlBar';
import InfoPanel from '../../../components/InfoPanel';
import { mazeGenerationConfig } from '../../algorithms/maze-generation';
import { AlgorithmStep } from '../../../types';
import toast, { Toaster } from 'react-hot-toast';

export default function MazeGenerationPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const algorithmConfig = mazeGenerationConfig;

  const [dimensions, setDimensions] = useState('15x15');
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on load
  useEffect(() => {
    regenerateMaze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const regenerateMaze = () => {
    try {
      const input = dimensions.trim() || algorithmConfig.defaultInput;
      const parts = input.split('x').map(s => s.trim());
      if (parts.length !== 2) throw new Error('Invalid format');
      
      const w = Number(parts[0]);
      const h = Number(parts[1]);

      if (isNaN(w) || isNaN(h) || w < 5 || h < 5 || w > 31 || h > 31) {
        toast.error('Please enter valid odd dimensions like "15x15" (5–31)');
        return;
      }

      const newSteps = algorithmConfig.generateSteps([w, h]);
      setSteps(newSteps);
      setIsInitialized(true);
    } catch (error) {
      console.error('Maze error:', error);
      toast.error('Invalid input. Use format like "15x15".');
    }
  };

  const currentStepData = steps[0]; // only one step

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'} transition-all duration-500 relative overflow-hidden`}>
      <main className="flex-1 flex flex-col min-h-0 relative">
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
                  isDarkMode
                    ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
                }`}
              >
                {algorithmConfig.name}
              </h2>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}
              >
                {algorithmConfig.description}
              </p>
            </div>
            <div className="flex items-center gap-6 animate-in slide-in-from-right-4 fade-in duration-600 delay-300">
              <div
                className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border border-slate-600/30'
                    : 'bg-white/50 border border-gray-200/30'
                } shadow-sm hover:shadow-md hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 ease-out`}
              >
                <span
                  className={`text-xs font-semibold tracking-wide uppercase ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}
                >
                  Time:
                </span>
                <span
                  className={`ml-2 font-mono font-bold ${
                    isDarkMode ? 'text-amber-400' : 'text-amber-600'
                  }`}
                >
                  {algorithmConfig.timeComplexity.average}
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/50 border border-slate-600/30'
                    : 'bg-white/50 border border-gray-200/30'
                } shadow-sm hover:shadow-md hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 ease-out`}
              >
                <span
                  className={`text-xs font-semibold tracking-wide uppercase ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}
                >
                  Space:
                </span>
                <span
                  className={`ml-2 font-mono font-bold ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}
                >
                  {algorithmConfig.spaceComplexity}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <div className={`flex-1 overflow-hidden p-6 min-h-0 relative ${isDarkMode ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30' : 'bg-gradient-to-br from-white/30 to-gray-50/30'} backdrop-blur-sm`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
              <div className="relative h-full">
                <MazeGrid
                  currentStep={currentStepData}
                  isInitialized={isInitialized}
                />
              </div>
            </div>
            
            <MazeControlBar
              dimensions={dimensions}
              setDimensions={setDimensions}
              onRegenerate={regenerateMaze}
            />
          </div>

          <InfoPanel
            algorithmConfig={algorithmConfig}
            currentStep={currentStepData}
            steps={steps}
            currentStepIndex={0}
          />
        </section>
        <Toaster position="top-right" reverseOrder={false} />
      </main>
    </div>
  );
}