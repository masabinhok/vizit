'use client';

import { useTheme } from '../contexts/ThemeContext';

interface GameOfLifeControlBarProps {
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
  dimensions: string;
  setDimensions: (v: string) => void;
  density: number;
  setDensity: (v: number) => void;
  onApply: () => void;
  onRandomize: () => void;
  onReset: () => void;
}

export default function GameOfLifeControlBar({
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  dimensions,
  setDimensions,
  density,
  setDensity,
  onApply,
  onRandomize,
  onReset
}: GameOfLifeControlBarProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <div className={`relative backdrop-blur-sm border-t ${isDarkMode
      ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-slate-700/50'
      : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-gray-200/50'
    } shadow-2xl`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      <div className="relative p-2">
        <div className="flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap text-xs">
          {/* Play/Pause and Reset */}
        
<div className='flex flex-col gap-3 items-center w-full justify-center'>
 {/* Speed */}
 <div className='flex flex-row items-center w-full justify-center gap-6'>
    <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-8 h-8 rounded-lg text-white shadow-sm transition-all ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '❚❚' : '►'}
            </button>
            <button
              onClick={onReset}
              className={`px-3 py-1 rounded-lg transition-all ${isDarkMode ? 'bg-slate-700/70 text-slate-200 hover:bg-slate-600/70' : 'bg-white/80 text-gray-800 hover:bg-gray-50'} border ${isDarkMode ? 'border-slate-600/30' : 'border-gray-300/30'} shadow-sm text-xs`}
            >
              Reset
            </button>
          </div>
  <div className="flex items-center gap-2">
            <label className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Speed</label>
            <div className={`flex items-center gap-2 px-2 py-1 rounded-lg backdrop-blur-sm border shadow-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600/30' : 'bg-white/50 border-gray-300/30'}`}>
              <span className="text-xs">🐌</span>
              <input type="range" min={1} max={100} value={speed} onChange={(e)=>setSpeed(parseInt(e.target.value))} className="w-20" />
              <span className="text-xs">🚀</span>
            </div>
            <span className={`text-xs font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{speed}%</span>
          </div>
 </div>
        

          {/* Dimensions and density */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input
              type="text"
              placeholder="e.g., 25x25"
              value={dimensions}
              onChange={(e)=>setDimensions(e.target.value)}
              className={`flex-1 max-w-[7.5rem] px-2 py-1 text-xs rounded-lg border min-w-0 transition-all ${isDarkMode ? 'bg-slate-700/50 border-slate-600/30 text-white' : 'bg-white/50 border-gray-300/30 text-gray-900'}`}
            />
            <label className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Density</label>
            <input type="range" min={0} max={100} value={Math.round(density*100)} onChange={(e)=>setDensity(parseInt(e.target.value)/100)} className="w-20" />
            <span className={`text-xs font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{Math.round(density*100)}%</span>

            <button onClick={onRandomize} className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">Randomize</button>
            <button onClick={onApply} className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm">Apply</button>
          </div>
</div>
         
        </div>
      </div>
    </div>
  );
}


