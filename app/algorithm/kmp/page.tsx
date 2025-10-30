'use client';

import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import KMPVisualization from '../../../components/KMPVisualization';

export default function KMPPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const [text, setText] = useState("AABAACAADAABAABA");
  const [pattern, setPattern] = useState("AABA");
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualization' | 'algorithm' | 'pseudocode' | 'complexity'>('visualization');

  const handleComplete = () => {
    setIsPlaying(false);
  };

  const generateRandomText = () => {
    const length = Math.floor(Math.random() * 10) + 15;
    const chars = 'ABCD';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setText(result);
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'
      } transition-all duration-500 relative overflow-hidden`}>

      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/10 rounded-full blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400/10 rounded-full blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400/10 rounded-full blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        <header className={`relative p-6 flex-shrink-0 backdrop-blur-sm ${
          isDarkMode
            ? 'bg-gradient-to-r from-slate-800/70 to-slate-700/70 border-b border-slate-700/50'
            : 'bg-gradient-to-r from-white/70 to-gray-50/70 border-b border-gray-200/50'
        } animate-in slide-in-from-top-4 fade-in duration-600 delay-100`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1 animate-in slide-in-from-left-4 fade-in duration-600 delay-200">
              <h2 className={`text-2xl font-bold tracking-tight ${
                isDarkMode
                  ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
              }`}>
                Knuth-Morris-Pratt Algorithm
              </h2>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Efficient pattern matching in strings • O(n + m)
              </p>
            </div>
            <div className="flex items-center gap-6 animate-in slide-in-from-right-4 fade-in duration-600 delay-300">
              <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-slate-800/50 border border-slate-600/30'
                  : 'bg-white/50 border border-gray-200/30'
              }`}>
                <span className={`text-xs font-semibold tracking-wide uppercase ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>Time: </span>
                <span className={`ml-2 font-mono font-bold ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-600'
                }`}>O(n+m)</span>
              </div>
              <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-slate-800/50 border border-slate-600/30'
                  : 'bg-white/50 border border-gray-200/30'
              }`}>
                <span className={`text-xs font-semibold tracking-wide uppercase ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>Space: </span>
                <span className={`ml-2 font-mono font-bold ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>O(m)</span>
              </div>
              <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-slate-800/50 border border-slate-600/30'
                  : 'bg-white/50 border border-gray-200/30'
              }`}>
                <span className={`text-xs font-semibold tracking-wide uppercase ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>Pattern Matching</span>
                <span className="ml-2 font-mono font-bold text-blue-500">�</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className={`flex gap-2 px-6 py-3 border-b ${
          isDarkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white/30 border-gray-200/50'
        } backdrop-blur-sm`}>
          {(['visualization', 'algorithm', 'pseudocode', 'complexity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-700/50'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <section className="flex-1 flex min-h-0 overflow-hidden">
          <div className={`flex-1 overflow-auto ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30'
              : 'bg-gradient-to-br from-white/30 to-gray-50/30'
          } backdrop-blur-sm`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
            
            {/* Visualization Tab */}
            {activeTab === 'visualization' && (
              <div className="relative p-6 h-full">
                <div className={`mb-6 p-4 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-gray-200'
                } shadow-lg`}>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        Text to Search
                      </label>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        Pattern
                      </label>
                      <input
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        Speed
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.5"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-32"
                      />
                    </div>
                    <div className="flex gap-2 items-end">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                      >
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                      <button
                        onClick={generateRandomText}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                      >
                        Random
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-[calc(100%-140px)]">
                  <KMPVisualization 
                    text={text}
                    pattern={pattern}
                    speed={speed}
                    isPlaying={isPlaying}
                    onComplete={handleComplete}
                  />
                </div>
              </div>
            )}

            {/* Algorithm Tab */}
            {activeTab === 'algorithm' && (
              <div className="relative p-6 max-w-4xl mx-auto">
                <div className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-gray-200'
                } shadow-lg space-y-6`}>
                  <h3 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    How KMP Algorithm Works
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        1. LPS Array Construction
                      </h4>
                      <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        The algorithm first builds a <strong>Longest Proper Prefix which is also Suffix (LPS)</strong> array. 
                        This array stores the length of the longest proper prefix of the pattern that is also a suffix.
                      </p>
                      <div className={`mt-3 p-4 rounded-lg ${
                        isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50'
                      }`}>
                        <p className={`font-mono text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          Example: For pattern "AABAAA"<br/>
                          LPS array = [0, 1, 0, 1, 2, 2]
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        2. Pattern Matching
                      </h4>
                      <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        Using the LPS array, the algorithm efficiently searches for the pattern in the text. 
                        When a mismatch occurs, instead of starting from the beginning, it uses the LPS array 
                        to skip characters that we know will match.
                      </p>
                    </div>

                    <div>
                      <h4 className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        Key Advantages
                      </h4>
                      <ul className={`list-disc list-inside space-y-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        <li>Never backtracks in the text (no re-scanning)</li>
                        <li>Linear time complexity O(n + m)</li>
                        <li>Efficient for patterns with repeating substrings</li>
                        <li>Only requires O(m) extra space for LPS array</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pseudocode Tab */}
            {activeTab === 'pseudocode' && (
              <div className="relative p-6 max-w-4xl mx-auto space-y-6">
                <div className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-gray-200'
                } shadow-lg`}>
                  <h3 className={`text-xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    LPS Array Construction
                  </h3>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50'
                  } overflow-x-auto`}>
                    <pre className={`font-mono text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
{`function computeLPS(pattern):
    m = length of pattern
    lps = array of size m
    lps[0] = 0
    len = 0  // length of previous longest prefix suffix
    i = 1
    
    while i < m:
        if pattern[i] == pattern[len]:
            len = len + 1
            lps[i] = len
            i = i + 1
        else:
            if len != 0:
                len = lps[len - 1]
            else:
                lps[i] = 0
                i = i + 1
    
    return lps`}
                    </pre>
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-gray-200'
                } shadow-lg`}>
                  <h3 className={`text-xl font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    KMP Pattern Search
                  </h3>
                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50'
                  } overflow-x-auto`}>
                    <pre className={`font-mono text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
{`function KMPSearch(text, pattern):
    n = length of text
    m = length of pattern
    lps = computeLPS(pattern)
    
    i = 0  // index for text
    j = 0  // index for pattern
    
    while i < n:
        if pattern[j] == text[i]:
            i = i + 1
            j = j + 1
        
        if j == m:
            print "Pattern found at index", i - j
            j = lps[j - 1]
        
        else if i < n and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i = i + 1`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Complexity Tab */}
            {activeTab === 'complexity' && (
              <div className="relative p-6 max-w-4xl mx-auto">
                <div className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-gray-200'
                } shadow-lg space-y-6`}>
                  <h3 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Complexity Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'
                    }`}>
                      <h4 className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-amber-400' : 'text-amber-600'
                      }`}>
                        Time Complexity
                      </h4>
                      <div className="space-y-2">
                        <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          <strong>Preprocessing:</strong> O(m)
                        </p>
                        <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          <strong>Searching:</strong> O(n)
                        </p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                          Total: O(n + m)
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'
                    }`}>
                      <h4 className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        Space Complexity
                      </h4>
                      <div className="space-y-2">
                        <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          <strong>LPS Array:</strong> O(m)
                        </p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          Total: O(m)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-3 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      Where n = length of text, m = length of pattern
                    </h4>
                    <ul className={`space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>More efficient than naive pattern matching O(n×m)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>No backtracking in the text - each character examined once</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>Best for patterns with repeating substrings</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`text-lg font-semibold mb-3 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Comparison with Other Algorithms
                    </h4>
                    <div className="overflow-x-auto">
                      <table className={`w-full ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        <thead className={`${
                          isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                        }`}>
                          <tr>
                            <th className="px-4 py-2 text-left">Algorithm</th>
                            <th className="px-4 py-2 text-left">Time Complexity</th>
                            <th className="px-4 py-2 text-left">Space Complexity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                          <tr className={isDarkMode ? 'bg-slate-800/30' : 'bg-white'}>
                            <td className="px-4 py-2 font-semibold">KMP</td>
                            <td className="px-4 py-2">O(n + m)</td>
                            <td className="px-4 py-2">O(m)</td>
                          </tr>
                          <tr className={isDarkMode ? 'bg-slate-800/20' : 'bg-gray-50'}>
                            <td className="px-4 py-2">Naive</td>
                            <td className="px-4 py-2">O(n × m)</td>
                            <td className="px-4 py-2">O(1)</td>
                          </tr>
                          <tr className={isDarkMode ? 'bg-slate-800/30' : 'bg-white'}>
                            <td className="px-4 py-2">Boyer-Moore</td>
                            <td className="px-4 py-2">O(n + m)</td>
                            <td className="px-4 py-2">O(m + σ)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
