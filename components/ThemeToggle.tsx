'use client';

import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`group relative p-3 rounded-xl backdrop-blur-xl border transition-all duration-500 ease-out overflow-hidden ${
        resolvedTheme === 'dark'
          ? 'bg-slate-800/90 border-slate-600/40 text-slate-400 hover:text-slate-100 hover:bg-slate-700/90'
          : 'bg-white/90 border-gray-200/40 text-gray-600 hover:text-gray-900 hover:bg-white/95'
      } hover:scale-110 hover:shadow-xl active:scale-95 transform-gpu`}
      aria-label="Toggle theme"
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-700 opacity-0 group-hover:opacity-100 ${
        resolvedTheme === 'dark'
          ? 'bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-amber-500/20'
          : 'bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20'
      }`} />
      
      {/* Icon container with smooth morphing */}
      <div className="relative w-4 h-4 transition-all duration-500 ease-out transform-gpu group-hover:rotate-[360deg]">
        {/* Sun icon */}
        <svg 
          className={`absolute inset-0 w-4 h-4 transition-all duration-500 ease-out transform-gpu ${
            theme === 'light' 
              ? 'opacity-100 scale-100 rotate-0' 
              : 'opacity-0 scale-75 rotate-180'
          }`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
        
        {/* Moon icon */}
        <svg 
          className={`absolute inset-0 w-4 h-4 transition-all duration-500 ease-out transform-gpu ${
            theme === 'dark' 
              ? 'opacity-100 scale-100 rotate-0' 
              : 'opacity-0 scale-75 rotate-[-180deg]'
          }`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 group-active:animate-ping bg-current" style={{ animationDuration: '0.6s' }} />
    </button>
  );
}