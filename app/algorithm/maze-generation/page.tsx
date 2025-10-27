'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import MazeGrid from '../../../components/MazeGrid';
import MazeControlBar from '../../../components/MazeControlBar'; // ✅ new control bar
import InfoPanel from '../../../components/InfoPanel';
import { mazeGenerationConfig } from '../../algorithms/maze-generation';
import { AlgorithmStep } from '../../../types';

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
        alert('Please enter valid odd dimensions like "15x15" (5–31)');
        return;
      }

      const newSteps = algorithmConfig.generateSteps([w, h]);
      setSteps(newSteps);
      setIsInitialized(true);
    } catch (error) {
      console.error('Maze error:', error);
      alert('Invalid input. Use format like "15x15".');
    }
  };

  const currentStepData = steps[0]; // only one step

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'} transition-all duration-500 relative overflow-hidden`}>
      {/* ... background blobs ... */}

      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Header */}
        <header className={`relative p-6 flex-shrink-0 backdrop-blur-sm ${isDarkMode ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-b border-slate-700/50' : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-b border-gray-200/50'}`}>
          {/* ... same as before ... */}
        </header>

        {/* Canvas and Controls */}
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

            {/* ✅ Use simplified control bar */}
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
      </main>
    </div>
  );
}