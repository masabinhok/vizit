'use client';

import { useTheme } from '../contexts/ThemeContext';

interface MazeControlBarProps {
  dimensions: string;
  setDimensions: (value: string) => void;
  onRegenerate: () => void;
}

export default function MazeControlBar({
  dimensions,
  setDimensions,
  onRegenerate
}: MazeControlBarProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <div className={`relative backdrop-blur-sm border-t ${isDarkMode
        ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-slate-700/50'
        : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-gray-200/50'
      } shadow-2xl`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />

      <div className="relative p-4">
        <div className="flex items-center justify-between gap-6 flex-wrap lg:flex-nowrap">
          {/* Maze Dimensions Input */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <label className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
              Maze Size:
            </label>
            <input
              type="text"
              placeholder="e.g., 15x15"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className={`flex-1 max-w-32 px-4 py-3 text-sm rounded-xl border min-w-0 transition-all duration-200 ease-out backdrop-blur-sm shadow-md ${isDarkMode
                  ? 'bg-slate-700/50 border-slate-600/30 text-white placeholder-slate-400 focus:bg-slate-600/50 focus:border-slate-500/50 shadow-slate-700/30'
                  : 'bg-white/50 border-gray-300/30 text-gray-900 placeholder-gray-500 focus:bg-white/70 focus:border-gray-400/50 shadow-white/50'
                } focus:ring-2 focus:ring-blue-500/50 focus:border-transparent hover:shadow-lg font-medium text-center`}
            />
            <button
              onClick={onRegenerate}
              className="px-6 py-3 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all duration-200 ease-out whitespace-nowrap flex-shrink-0 shadow-lg hover:shadow-xl font-semibold transform hover:scale-102 hover:-translate-y-0.5 hover:shadow-emerald-500/30"
            >
              Regenerate
            </button>
          </div>

          {/* Optional: Info hint */}
          <div className={`text-sm hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
            Odd numbers (e.g., 15, 21) work best
          </div>
        </div>
      </div>
    </div>
  );
}