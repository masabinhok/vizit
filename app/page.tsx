'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';

export default function Home() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <div className="flex h-screen">
      {/* Persistent Sidebar */}
      <Sidebar />
      
      {/* Main Landing Content */}
      <main className={`flex-1 flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'} transition-all duration-500 relative overflow-hidden`}>
        {/* Ambient background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center relative p-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Hero */}
            <div className="mb-12">
              <h1 className={`text-6xl font-bold mb-6 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent'
              } animate-in slide-in-from-bottom-8 fade-in duration-1000`}>
                Welcome to Vizit
              </h1>
              <p className={`text-xl mb-8 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-600'
              } leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200`}>
                Visualize algorithms in real-time and understand how they work.<br />
                Interactive, beautiful, and educational algorithm visualizations.
              </p>
              
              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-400">
                <div className={`p-6 rounded-2xl backdrop-blur-sm border ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30' 
                    : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-gray-200/30'
                } shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Real-time Visualization
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Watch algorithms execute step by step with smooth animations and clear visual feedback.
                  </p>
                </div>

                <div className={`p-6 rounded-2xl backdrop-blur-sm border ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30' 
                    : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-gray-200/30'
                } shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Educational
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Learn algorithm concepts with detailed explanations, complexity analysis, and code examples.
                  </p>
                </div>

                <div className={`p-6 rounded-2xl backdrop-blur-sm border ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30' 
                    : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-gray-200/30'
                } shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Interactive Controls
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Control playback speed, step through algorithms, and customize input data for testing.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-600">
                <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  Ready to start learning? Choose an algorithm from the sidebar to begin your journey!
                </p>
                
                {/* Quick Start Suggestions */}
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => router.push('/algorithm/bubble-sort')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-blue-500/25'
                    } hover:scale-105 hover:shadow-xl`}
                  >
                    Start with Bubble Sort
                  </button>
                  <button
                    onClick={() => router.push('/algorithm/quick-sort')}
                    className={`px-6 py-3 rounded-xl font-medium border transition-all duration-300 ${
                      isDarkMode 
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    } hover:scale-105`}
                  >
                    Try Quick Sort
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className={`backdrop-blur-sm border-t ${
          isDarkMode ? 'border-slate-700/50 bg-slate-900/30' : 'border-gray-200/50 bg-white/30'
        } p-6`}>
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                10+
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Algorithms
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                Real-time
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Visualization
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Interactive
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Learning
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}