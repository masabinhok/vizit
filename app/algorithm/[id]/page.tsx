'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '../../../contexts/ThemeContext';
import { ALGORITHM_NAME_MAP } from '../../../constants/algorithms';

export default function AlgorithmNotImplementedPage() {
  const params = useParams();
  const router = useRouter();
  const algorithmId = params.id as string;
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  const algorithmName = ALGORITHM_NAME_MAP[algorithmId] || algorithmId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'} transition-all duration-500 relative overflow-hidden`}>
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        
        {/* Floating Algorithm Icons - Playful */}
        <div className={`absolute top-32 left-24 w-12 h-12 ${isDarkMode ? 'text-blue-400/40' : 'text-blue-500/30'} animate-float-slow`}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7.29C13,7.29 13,7.29 13,7.29L18.42,9.09C18.72,8.43 19.46,8 20.3,8A2.3,2.3 0 0,1 22.6,10.3C22.6,11.13 22.17,11.86 21.5,12.17V14.83C22.17,15.14 22.6,15.87 22.6,16.7A2.3,2.3 0 0,1 20.3,19A2.3,2.3 0 0,1 18,16.7C18,16.32 18.12,15.97 18.31,15.68L13,13.91V15.5C13.6,15.84 14,16.49 14,17.22A2.22,2.22 0 0,1 11.78,19.44A2.22,2.22 0 0,1 9.56,17.22A2.22,2.22 0 0,1 11.78,15C11.78,15 11.78,15 11.78,15L11,13.91L5.69,15.68C5.88,15.97 6,16.32 6,16.7A2.3,2.3 0 0,1 3.7,19A2.3,2.3 0 0,1 1.4,16.7A2.3,2.3 0 0,1 3.7,14.4C4.54,14.4 5.28,14.83 5.58,15.49L11,13.69V7.29C10.4,6.95 10,6.3 10,5.57A2,2 0 0,1 12,3.57A2,2 0 0,1 14,5.57C14,5.57 14,5.57 14,5.57L12,2Z"/>
          </svg>
        </div>
        
        <div className={`absolute top-1/3 right-32 w-16 h-16 ${isDarkMode ? 'text-purple-400/40' : 'text-purple-500/30'} animate-float-medium`}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L8,18L2,12L8,6L9.4,7.4L4.8,12L9.4,16.6Z"/>
          </svg>
        </div>

        <div className={`absolute bottom-1/4 left-1/3 w-10 h-10 ${isDarkMode ? 'text-emerald-400/40' : 'text-emerald-500/30'} animate-float-fast`}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M9,7V9H7V7H9M11,11H9V9H11V11M13,13H11V11H13V13M15,15H13V13H15V15M17,17H15V15H17V17M17,7V9H15V7H17M7,11H5V9H7V11M7,17H5V15H7V17M19,17V19H17V17H19M19,7H21V9H19V7M5,19V17H7V19H5M5,7V5H7V7H5Z"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative p-8">
        <div className="max-w-xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Animated Icon */}
          <div className="relative mb-6 inline-block">
            <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-xl border-2 shadow-xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800/60 to-slate-700/60 border-slate-600/50 shadow-blue-500/20' 
                : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50 shadow-blue-500/30'
            } animate-bounce-slow`}>
              <svg 
                className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                />
              </svg>
            </div>
            
            {/* Pulsing rings */}
            <div className={`absolute inset-0 rounded-2xl ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
            } animate-ping-slow`} />
          </div>

          {/* Main Message */}
          <h1 className={`text-3xl md:text-4xl font-bold mb-3 leading-tight ${
            isDarkMode 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600'
          } animate-gradient-x`}>
            {algorithmName}
          </h1>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border mb-4 ${
            isDarkMode 
              ? 'bg-amber-500/10 border-amber-400/30 text-amber-300' 
              : 'bg-amber-500/10 border-amber-400/30 text-amber-600'
          }`}>
            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"/>
            </svg>
            <span className="font-semibold text-sm">Coming Soon</span>
          </div>

          <p className={`text-base md:text-lg mb-4 leading-relaxed ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            This algorithm hasn't been implemented yet, but{' '}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              you can help bring it to life!
            </span>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <a
              href="https://github.com/masabinhok/vizit/blob/main/docs/ADDING_ALGORITHMS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-0.5 animate-gradient-x"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
                <span>Learn How to Contribute</span>
              </div>
            </a>

            <button
              onClick={() => router.push('/')}
              className={`px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm ${
                isDarkMode 
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-400' 
                  : 'border-gray-300 text-gray-700 hover:bg-white/80 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </div>
            </button>
          </div>

          {/* Simple info footer */}
          <div className={`mt-8 p-4 rounded-xl backdrop-blur-xl border text-sm ${
            isDarkMode 
              ? 'bg-slate-800/30 border-slate-700/50 text-slate-400' 
              : 'bg-white/50 border-gray-200/50 text-gray-600'
          }`}>
            💡 Check our{' '}
            <a 
              href="https://github.com/masabinhok/vizit/blob/main/docs/ADDING_ALGORITHMS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 underline font-medium"
            >
              guide
            </a>
            {' '}for step-by-step instructions
          </div>
        </div>
      </main>
    </div>
  );
}
