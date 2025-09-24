'use client';

interface ControlBarProps {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  speed: number;
  setSpeed: (value: number) => void;
  inputArray: string;
  setInputArray: (value: string) => void;
  currentStep: number;
  totalSteps: number;
  isInitialized: boolean;
  onInitialize: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  isDarkMode: boolean;
}

export default function ControlBar({
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  inputArray,
  setInputArray,
  currentStep,
  totalSteps,
  isInitialized,
  onInitialize,
  onStepForward,
  onStepBackward,
  onReset,
  isDarkMode
}: ControlBarProps) {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-3`}>
      <div className="flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
        {/* Playback Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!isInitialized || currentStep >= totalSteps - 1}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              !isInitialized || currentStep >= totalSteps - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isPlaying 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button 
            onClick={onStepBackward}
            disabled={!isInitialized || currentStep <= 0}
            className={`p-1.5 rounded-lg transition-colors ${
              !isInitialized || currentStep <= 0
                ? 'text-gray-400 cursor-not-allowed'
                : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.333 4z" />
            </svg>
          </button>

          <button 
            onClick={onStepForward}
            disabled={!isInitialized || currentStep >= totalSteps - 1}
            className={`p-1.5 rounded-lg transition-colors ${
              !isInitialized || currentStep >= totalSteps - 1
                ? 'text-gray-400 cursor-not-allowed'
                : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>

          <button 
            onClick={onReset}
            disabled={!isInitialized}
            className={`p-1.5 rounded-lg transition-colors ${
              !isInitialized
                ? 'text-gray-400 cursor-not-allowed'
                : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="text-xs font-medium hidden sm:block">Speed:</label>
          <div className="flex items-center gap-1">
            <span className="text-xs">🐌</span>
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-16 sm:w-20"
            />
            <span className="text-xs">🚀</span>
          </div>
          <span className="text-xs text-gray-500 hidden sm:block">{speed}%</span>
        </div>

        {/* Algorithm Input */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            type="text"
            placeholder="e.g., 64,34,25,12,22"
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            className={`flex-1 px-2 py-1.5 text-sm rounded border min-w-0 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <button 
            onClick={onInitialize}
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap flex-shrink-0"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}