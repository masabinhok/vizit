'use client';

import { useState } from 'react';
import { AlgorithmStep, AlgorithmConfig } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface InfoPanelProps {
  algorithmConfig?: AlgorithmConfig;
  currentStep?: AlgorithmStep;
  steps: AlgorithmStep[];
  currentStepIndex: number;
}

export default function InfoPanel({
  algorithmConfig,
  currentStep,
  steps,
  currentStepIndex
}: InfoPanelProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const [activeTab, setActiveTab] = useState<'Code' | 'Explanation' | 'Stats'>('Code');

  const tabs = ['Code', 'Explanation', 'Stats'] as const;
  return (
    <aside className={`w-80 h-full relative ${
      isDarkMode 
        ? 'bg-gradient-to-b from-slate-800/95 to-slate-700/95 text-white' 
        : 'bg-gradient-to-b from-white/95 to-gray-50/95 text-gray-900'
    } backdrop-blur-xl border-l ${
      isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
    } flex flex-col shadow-2xl animate-in slide-in-from-right-4 fade-in duration-600 delay-600`}>
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
      
      {/* Tabs - Fixed with premium styling */}
      <div className={`relative flex border-b ${isDarkMode ? 'border-slate-700/50' : 'border-gray-300/50'} flex-shrink-0 bg-gradient-to-r from-transparent to-transparent backdrop-blur-sm`}>
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ease-out ${
              activeTab === tab
                ? `border-blue-500 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} bg-gradient-to-t ${isDarkMode ? 'from-blue-500/10 to-transparent' : 'from-blue-500/5 to-transparent'}`
                : `border-transparent ${isDarkMode ? 'hover:text-slate-300 hover:bg-slate-700/30' : 'hover:text-gray-700 hover:bg-gray-100/50'}`
            } backdrop-blur-sm hover:scale-102 hover:-translate-y-0.5 animate-in slide-in-from-top-4 fade-in duration-400`}
            style={{ animationDelay: `${700 + index * 100}ms` }}
          >
            <span className="relative z-10">{tab}</span>
            {activeTab === tab && (
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent rounded-t-lg transition-all duration-200 ease-out" />
            )}
          </button>
        ))}
      </div>

      {/* Content Panel - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {activeTab === 'Code' && (
          <div>
            {algorithmConfig && (
              <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-4 font-mono text-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="space-y-1">
                  {algorithmConfig.code.map((line, index) => (
                    <div
                      key={index}
                      className={`px-2 py-1 rounded ${
                        currentStep?.codeLineIndex === index
                          ? `${isDarkMode ? 'bg-yellow-800' : 'bg-yellow-100'} ${isDarkMode ? 'text-yellow-100' : 'text-yellow-900'}`
                          : ''
                      }`}
                    >
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Current Step</h3>
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50 border border-blue-200'} p-3 rounded-lg`}>
                <p className="text-sm">
                  {currentStep?.description || "Enter numbers separated by commas and click Apply to start visualization"}
                </p>
              </div>
              
              {!currentStep && (
                <div className={`mt-3 ${isDarkMode ? 'bg-gray-700' : 'bg-green-50 border border-green-200'} p-3 rounded-lg`}>
                  <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    💡 <strong>Tip:</strong> Try these examples:<br/>
                    • Small: 3,1,4,1,5<br/>
                    • Medium: 64,34,25,12,22,11,90<br/>
                    • Reverse: 9,8,7,6,5,4,3,2,1
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Explanation' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Algorithm Overview</h3>
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-slate-50 border border-slate-200'} p-4 rounded-lg`}>
                <p className="text-sm leading-relaxed">
                  {algorithmConfig?.name === 'Bubble Sort' ? (
                    <>
                      <strong>Bubble Sort</strong> is one of the simplest sorting algorithms. It works by repeatedly stepping through the list, 
                      comparing adjacent elements and swapping them if they&apos;re in the wrong order. The pass through the list is repeated 
                      until the list is sorted.
                      <br/><br/>
                      The algorithm gets its name because smaller elements &quot;bubble&quot; to the beginning of the list, 
                      just like air bubbles rise to the surface in water.
                    </>
                  ) : (
                    `${algorithmConfig?.description || 'Algorithm explanation will appear here.'}`
                  )}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">How It Works</h3>
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'} p-4 rounded-lg`}>
                <div className="space-y-3 text-sm">
                  {algorithmConfig?.name === 'Bubble Sort' ? (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        <p><strong>Compare:</strong> Start with the first two elements and compare them.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        <p><strong>Swap:</strong> If they&apos;re in the wrong order, swap them.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        <p><strong>Move:</strong> Continue with the next pair of adjacent elements.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                        <p><strong>Repeat:</strong> After each pass, the largest element &quot;bubbles up&quot; to its correct position.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                        <p><strong>Continue:</strong> Repeat until no more swaps are needed.</p>
                      </div>
                    </>
                  ) : (
                    <p>Step-by-step explanation for {algorithmConfig?.name} will appear here.</p>
                  )}
                </div>
              </div>
            </div>

            {currentStep && (
              <div>
                <h3 className="font-semibold mb-3">Current Action</h3>
                <div className={`${isDarkMode ? 'bg-green-900' : 'bg-emerald-50 border border-emerald-200'} p-4 rounded-lg border-l-4 ${isDarkMode ? 'border-green-500' : 'border-emerald-500'}`}>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-green-200' : 'text-emerald-800'}`}>
                    {currentStep.description}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-emerald-600'} mt-2`}>
                    Step {currentStepIndex + 1} of {steps.length}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-3">Color Legend</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Unsorted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Swapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Sorted</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Stats' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Algorithm Performance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Comparisons:</span>
                  <span className={`font-mono font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    {currentStep?.comparisons || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Swaps:</span>
                  <span className={`font-mono font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                    {currentStep?.swaps || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Array Size:</span>
                  <span className={`font-mono font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    {currentStep?.array.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Step:</span>
                  <span className={`font-mono font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    {currentStepIndex + 1} / {steps.length || 1}
                  </span>
                </div>
                {steps.length > 0 && (
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span className={`font-mono font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                      {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Time Complexity</h3>
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'} p-4 rounded-lg`}>
                <div className="space-y-2 text-sm">
                  {algorithmConfig && (
                    <>
                      <div className="flex justify-between">
                        <span>Best Case:</span>
                        <span className={`font-mono ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                          {algorithmConfig.timeComplexity.best}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Case:</span>
                        <span className={`font-mono ${isDarkMode ? 'text-yellow-400' : 'text-amber-700'}`}>
                          {algorithmConfig.timeComplexity.average}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Worst Case:</span>
                        <span className={`font-mono ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                          {algorithmConfig.timeComplexity.worst}
                        </span>
                      </div>
                      <div className={`flex justify-between border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} pt-2 mt-2`}>
                        <span>Space Complexity:</span>
                        <span className={`font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                          {algorithmConfig.spaceComplexity}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {currentStep && (
              <div>
                <h3 className="font-semibold mb-3">Efficiency Analysis</h3>
                <div className={`${isDarkMode ? 'bg-blue-900' : 'bg-blue-50 border border-blue-200'} p-4 rounded-lg`}>
                  <div className="space-y-2 text-sm">
                    <p className={`font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                      Performance Metrics
                    </p>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Comparisons per element: </span>
                        <span className="font-mono">
                          {currentStep.array.length > 0 ? 
                            (currentStep.comparisons / currentStep.array.length).toFixed(1) : 0}
                        </span>
                      </div>
                      <div>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Swap ratio: </span>
                        <span className="font-mono">
                          {currentStep.comparisons > 0 ? 
                            ((currentStep.swaps / currentStep.comparisons) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Elements sorted: </span>
                        <span className="font-mono">
                          {currentStep.array.filter(el => el.isSorted).length} / {currentStep.array.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {algorithmConfig?.name === 'Bubble Sort' && (
              <div>
                <h3 className="font-semibold mb-3">Algorithm Properties</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-green-900' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <div className={`font-medium ${isDarkMode ? 'text-green-200' : 'text-emerald-800'}`}>✓ Stable</div>
                    <div className={isDarkMode ? 'text-green-400' : 'text-emerald-600'}>Preserves relative order</div>
                  </div>
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-green-900' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <div className={`font-medium ${isDarkMode ? 'text-green-200' : 'text-emerald-800'}`}>✓ In-place</div>
                    <div className={isDarkMode ? 'text-green-400' : 'text-emerald-600'}>O(1) extra memory</div>
                  </div>
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-red-900' : 'bg-red-50 border border-red-200'}`}>
                    <div className={`font-medium ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>✗ Efficient</div>
                    <div className={isDarkMode ? 'text-red-400' : 'text-red-600'}>O(n²) comparisons</div>
                  </div>
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-green-900' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <div className={`font-medium ${isDarkMode ? 'text-green-200' : 'text-emerald-800'}`}>✓ Simple</div>
                    <div className={isDarkMode ? 'text-green-400' : 'text-emerald-600'}>Easy to understand</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}