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
      <main className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'} transition-all duration-500 relative`}>
        {/* Ambient background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          
          {/* Floating Algorithm Icons */}
          {/* Top Left Area */}
          <div className={`absolute top-20 left-16 w-8 h-8 ${isDarkMode ? 'text-blue-400/60' : 'text-blue-500/50'} animate-float-slow`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M9,7V9H7V7H9M11,11H9V9H11V11M13,13H11V11H13V13M15,15H13V13H15V15M17,17H15V15H17V17M17,7V9H15V7H17M7,11H5V9H7V11M7,17H5V15H7V17M19,17V19H17V17H19M19,7H21V9H19V7M5,19V17H7V19H5M5,7V5H7V7H5Z"/>
            </svg>
          </div>
          
          <div className={`absolute top-32 left-64 w-6 h-6 ${isDarkMode ? 'text-purple-400/55' : 'text-purple-500/45'} animate-float-medium`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15Z"/>
            </svg>
          </div>

          {/* Top Right Area */}
          <div className={`absolute top-24 right-20 w-7 h-7 ${isDarkMode ? 'text-emerald-400/60' : 'text-emerald-500/50'} animate-float-slow`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7.29C13,7.29 13,7.29 13,7.29L18.42,9.09C18.72,8.43 19.46,8 20.3,8A2.3,2.3 0 0,1 22.6,10.3C22.6,11.13 22.17,11.86 21.5,12.17V14.83C22.17,15.14 22.6,15.87 22.6,16.7A2.3,2.3 0 0,1 20.3,19A2.3,2.3 0 0,1 18,16.7C18,16.32 18.12,15.97 18.31,15.68L13,13.91V15.5C13.6,15.84 14,16.49 14,17.22A2.22,2.22 0 0,1 11.78,19.44A2.22,2.22 0 0,1 9.56,17.22A2.22,2.22 0 0,1 11.78,15C11.78,15 11.78,15 11.78,15L11,13.91L5.69,15.68C5.88,15.97 6,16.32 6,16.7A2.3,2.3 0 0,1 3.7,19A2.3,2.3 0 0,1 1.4,16.7A2.3,2.3 0 0,1 3.7,14.4C4.54,14.4 5.28,14.83 5.58,15.49L11,13.69V7.29C10.4,6.95 10,6.3 10,5.57A2,2 0 0,1 12,3.57A2,2 0 0,1 14,5.57C14,5.57 14,5.57 14,5.57L12,2Z"/>
            </svg>
          </div>

          <div className={`absolute top-40 right-32 w-5 h-5 ${isDarkMode ? 'text-amber-400/55' : 'text-amber-500/45'} animate-float-fast`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1Z"/>
            </svg>
          </div>

          {/* Middle Left */}
          <div className={`absolute top-1/2 left-8 w-6 h-6 ${isDarkMode ? 'text-pink-400/55' : 'text-pink-500/45'} animate-float-medium`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
          </div>

          {/* Middle Right */}
          <div className={`absolute top-1/2 right-12 w-8 h-8 ${isDarkMode ? 'text-cyan-400/60' : 'text-cyan-500/50'} animate-float-slow`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L8,18L2,12L8,6L9.4,7.4L4.8,12L9.4,16.6Z"/>
            </svg>
          </div>

          {/* Bottom Area */}
          <div className={`absolute bottom-32 left-24 w-7 h-7 ${isDarkMode ? 'text-indigo-400/55' : 'text-indigo-500/45'} animate-float-medium`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5C3,4.1 3.1,3.27 5,3M19,3C20.9,3.27 21,4.1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19C21,20.1 20.9,20.73 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19Z"/>
            </svg>
          </div>

          <div className={`absolute bottom-24 right-16 w-6 h-6 ${isDarkMode ? 'text-teal-400/55' : 'text-teal-500/45'} animate-float-fast`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
            </svg>
          </div>

          <div className={`absolute bottom-40 left-1/2 w-5 h-5 ${isDarkMode ? 'text-violet-400/55' : 'text-violet-500/45'} animate-float-medium`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,13.5C15.58,14.75 16.81,15.5 18.5,15.5V17.5C15.85,17.5 13.59,15.85 13.05,13.53L10.5,16.36C11.92,16.93 13,18.3 13,20C13,22.21 11.21,24 9,24C6.79,24 5,22.21 5,20C5,17.79 6.79,16 9,16C9.67,16 10.31,16.2 10.86,16.53L11.37,15.97L6,8.5C5.4,8.15 5,7.45 5,6.5C5,5.12 6.12,4 7.5,4S10,5.12 10,6.5L10,6.5L12.5,10.5V10.5C13.1,10.15 13.8,10 14.5,10C16.43,10 18.13,11.13 18.67,12.70L21,9Z"/>
            </svg>
          </div>
        </div>

        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center relative p-12">
          <div className="max-w-6xl mx-auto">
            {/* Main Hero */}
            <div className="text-center mb-16">
              {/* Floating badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md border mb-8 animate-in fade-in slide-in-from-top-4 duration-1000 delay-100 group hover:scale-102 hover:-translate-y-0.5 transition-all duration-200 ease-out">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold group cursor-pointer transition-all duration-200 ease-out ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-400/30 text-emerald-300 hover:from-emerald-500/30 hover:to-blue-500/30' 
                    : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-400/30 text-emerald-600 hover:from-emerald-500/20 hover:to-blue-500/20'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 group-hover:rotate-6 transition-transform duration-200 ease-out" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>Open Source</span>
                  </div>
                  
                  {/* Tooltip */}
                  <div className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out pointer-events-none z-10 ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <div className={`px-3 py-2 rounded-lg backdrop-blur-xl border shadow-lg whitespace-nowrap text-xs ${
                      isDarkMode 
                        ? 'bg-slate-800/95 border-slate-600/50' 
                        : 'bg-white/95 border-gray-200/50'
                    }`}>
                      <span className="text-emerald-500 font-medium">Contribute</span> - even small changes matter ✨
                      <div className={`w-1.5 h-1.5 ${
                        isDarkMode ? 'bg-slate-800' : 'bg-white'
                      } rotate-45 absolute -top-0.5 left-1/2 transform -translate-x-1/2 border-l border-t ${
                        isDarkMode ? 'border-slate-600/50' : 'border-gray-200/50'
                      }`}></div>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} group-hover:text-blue-500 transition-colors duration-200`}>
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
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-200 ease-out hover:scale-102 hover:-translate-y-0.5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out animate-gradient-x"></div>
                  <div className="relative flex items-center gap-3">
                    <span className="text-lg">Start Learning</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
                
                <button
                  onClick={() => router.push('/algorithm/quick-sort')}
                  className={`group px-8 py-4 rounded-2xl font-semibold border-2 transition-all duration-200 ease-out hover:scale-102 hover:-translate-y-0.5 backdrop-blur-sm ${
                    isDarkMode 
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-500/20' 
                      : 'border-gray-300 text-gray-700 hover:bg-white/80 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 group-hover:rotate-6 transition-transform duration-200 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className={`group col-span-1 lg:col-span-2 p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 ease-out hover:-translate-y-1 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50 hover:border-blue-500/70 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60' 
                  : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50 hover:border-blue-400/70 hover:bg-gradient-to-br hover:from-white/80 hover:to-gray-50/80'
              } shadow-xl hover:shadow-2xl hover:shadow-blue-500/15 animate-in slide-in-from-left-4 fade-in duration-600 delay-100`}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all duration-200 ease-out">
                      <svg className="w-8 h-8 text-white group-hover:rotate-6 transition-transform duration-200 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors duration-200`}>
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
              <div className={`group p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 ease-out hover:-translate-y-1 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50 hover:border-purple-500/70 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60' 
                  : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50 hover:border-purple-400/70 hover:bg-gradient-to-br hover:from-white/80 hover:to-gray-50/80'
              } shadow-xl hover:shadow-2xl hover:shadow-purple-500/15 animate-in slide-in-from-right-4 fade-in duration-600 delay-150`}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg mx-auto mb-6 group-hover:shadow-purple-500/30 group-hover:scale-105 transition-all duration-200 ease-out">
                    <svg className="w-8 h-8 text-white group-hover:rotate-6 transition-transform duration-200 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-purple-500 transition-colors duration-200`}>
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
              <div className={`group p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 ease-out hover:-translate-y-1 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50 hover:border-emerald-500/70 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60' 
                  : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50 hover:border-emerald-400/70 hover:bg-gradient-to-br hover:from-white/80 hover:to-gray-50/80'
              } shadow-xl hover:shadow-2xl hover:shadow-emerald-500/15 animate-in slide-in-from-left-4 fade-in duration-600 delay-200`}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mx-auto mb-6 group-hover:shadow-emerald-500/30 group-hover:scale-105 transition-all duration-200 ease-out">
                    <svg className="w-8 h-8 text-white group-hover:rotate-6 transition-transform duration-200 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-emerald-500 transition-colors duration-200`}>
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
              <div className={`group col-span-1 lg:col-span-2 p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 ease-out hover:-translate-y-1 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50 hover:border-amber-500/70 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60' 
                  : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50 hover:border-amber-400/70 hover:bg-gradient-to-br hover:from-white/80 hover:to-gray-50/80'
              } shadow-xl hover:shadow-2xl hover:shadow-amber-500/15 animate-in slide-in-from-right-4 fade-in duration-600 delay-250`}>
                <div className="flex items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/30 group-hover:scale-105 transition-all duration-200 ease-out">
                      <svg className="w-8 h-8 text-white group-hover:rotate-6 transition-transform duration-200 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-amber-500 transition-colors duration-200`}>
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