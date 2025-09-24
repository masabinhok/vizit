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
          <div className="max-w-6xl mx-auto">
            {/* Main Hero */}
            <div className="text-center mb-16">
              {/* Floating badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md border mb-8 animate-in fade-in slide-in-from-top-4 duration-1000 delay-100 group hover:scale-105 transition-all">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-400/30 text-emerald-300' 
                    : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-400/30 text-emerald-600'
                }`}>
                  <span className="relative inline-flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  NEW
                </div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} group-hover:text-blue-500 transition-colors duration-300`}>
                  Real-time Algorithm Visualization Platform
                </span>
              </div>

              <h1 className={`text-7xl md:text-8xl font-bold mb-8 leading-tight ${
                isDarkMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-300' 
                  : 'text-transparent bg-clip-text bg-gradient-to-b from-gray-900 via-gray-800 to-gray-600'
              } animate-in slide-in-from-bottom-8 fade-in duration-1200 delay-200`}>
                Learn Algorithms
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 animate-gradient-x">
                  Visually
                </span>
              </h1>
              
              <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-gray-600'
              } animate-in slide-in-from-bottom-8 fade-in duration-1200 delay-400`}>
                Experience the beauty of algorithms through{' '}
                <span className="font-semibold text-blue-500">interactive visualizations</span>,{' '}
                <span className="font-semibold text-purple-500">step-by-step breakdowns</span>, and{' '}
                <span className="font-semibold text-emerald-500">real-time animations</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in slide-in-from-bottom-8 fade-in duration-1200 delay-600">
                <button
                  onClick={() => router.push('/algorithm/bubble-sort')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
                  <div className="relative flex items-center gap-3">
                    <span className="text-lg">Start Learning</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
                
                <button
                  onClick={() => router.push('/algorithm/quick-sort')}
                  className={`group px-8 py-4 rounded-2xl font-semibold border-2 transition-all duration-500 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm ${
                    isDarkMode 
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-400' 
                      : 'border-gray-300 text-gray-700 hover:bg-white/80 hover:border-gray-400 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg">Explore Algorithms</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bento Grid Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {/* Interactive Visualization Card */}
              <div className={`group col-span-1 lg:col-span-2 p-8 rounded-3xl backdrop-blur-xl border transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50 hover:border-blue-500/50' 
                  : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50 hover:border-blue-400/50'
              } shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 animate-in slide-in-from-left-8 fade-in duration-1000 delay-800`}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 group-hover:scale-110 transition-all duration-500">
                      <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors duration-300`}>
                      Real-time Interactive Visualization
                    </h3>
                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Watch algorithms come to life with smooth, GPU-accelerated animations. Control playback speed, step through each operation, and understand the logic behind every move.
                    </p>
                    <div className="flex gap-2 mt-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500/10 text-blue-600'}`}>
                        Step-by-step
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-500/10 text-purple-600'}`}>
                        Variable Speed
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Analysis Card */}
              <div className={`group p-8 rounded-3xl backdrop-blur-xl border transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50 hover:border-purple-500/50' 
                  : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50 hover:border-purple-400/50'
              } shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 animate-in slide-in-from-right-8 fade-in duration-1000 delay-1000`}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg mx-auto mb-6 group-hover:shadow-purple-500/25 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-purple-500 transition-colors duration-300`}>
                    Code Analysis
                  </h3>
                  <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Explore time and space complexity with detailed explanations and real-world performance insights.
                  </p>
                  <div className="mt-6">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/10 text-emerald-600'}`}>
                      Big O Analysis
                    </span>
                  </div>
                </div>
              </div>

              {/* Educational Content Card */}
              <div className={`group p-8 rounded-3xl backdrop-blur-xl border transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50 hover:border-emerald-500/50' 
                  : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50 hover:border-emerald-400/50'
              } shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 animate-in slide-in-from-left-8 fade-in duration-1000 delay-1200`}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mx-auto mb-6 group-hover:shadow-emerald-500/25 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-emerald-500 transition-colors duration-300`}>
                    Learn by Doing
                  </h3>
                  <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Interactive tutorials with custom input data, detailed explanations, and progressive difficulty levels.
                  </p>
                  <div className="mt-6">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500/10 text-blue-600'}`}>
                      Hands-on Learning
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Card */}
              <div className={`group col-span-1 lg:col-span-2 p-8 rounded-3xl backdrop-blur-xl border transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50 hover:border-amber-500/50' 
                  : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50 hover:border-amber-400/50'
              } shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 animate-in slide-in-from-right-8 fade-in duration-1000 delay-1400`}>
                <div className="flex items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/25 group-hover:scale-110 transition-all duration-500">
                      <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-amber-500 transition-colors duration-300`}>
                      Performance Analytics
                    </h3>
                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Compare algorithm efficiency with real-time performance metrics, memory usage tracking, and detailed complexity analysis.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>O(n²)</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Time</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>O(1)</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Space</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>60fps</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Smooth</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className={`backdrop-blur-xl border-t ${
          isDarkMode ? 'border-slate-700/50 bg-slate-900/20' : 'border-gray-200/50 bg-white/20'
        } p-8 animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-1600`}>
          <div className="max-w-6xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:shadow-blue-500/25 group-hover:scale-110 transition-all duration-500`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-2`}>
                  15+
                </div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Algorithms Available
                </div>
              </div>

              <div className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg group-hover:shadow-purple-500/25 group-hover:scale-110 transition-all duration-500`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mb-2`}>
                  60fps
                </div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Smooth Animations
                </div>
              </div>

              <div className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg group-hover:shadow-emerald-500/25 group-hover:scale-110 transition-all duration-500`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} mb-2`}>
                  100%
                </div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Interactive Learning
                </div>
              </div>

              <div className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg group-hover:shadow-amber-500/25 group-hover:scale-110 transition-all duration-500`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'} mb-2`}>
                  Real-time
                </div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Performance Insights
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center pt-8 border-t border-opacity-50">
              <p className={`text-lg mb-6 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                Ready to master algorithms through visualization?
              </p>
              <button
                onClick={() => router.push('/algorithm/bubble-sort')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1 animate-gradient-x"
              >
                <span className="text-lg">Get Started Now</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}