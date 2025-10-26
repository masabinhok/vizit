'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface StackElement {
  id: number;
  value: number;
  isAnimating?: boolean;
  operation?: 'push' | 'pop' | 'peek';
}

interface OperationHistory {
  operation: string;
  value?: number;
  timestamp: number;
  stackSize: number;
}

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

export default function StackVisualization() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const [stack, setStack] = useState<StackElement[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [operationHistory, setOperationHistory] = useState<OperationHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'controls' | 'pseudocode' | 'explanation' | 'history'>('controls');

  // Show message with auto-hide
  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Add operation to history
  const addToHistory = (operation: string, value?: number, stackSize?: number) => {
    setOperationHistory(prev => [
      ...prev,
      {
        operation,
        value,
        timestamp: Date.now(),
        stackSize: stackSize ?? stack.length
      }
    ]);
  };

  // Clear operation indicators after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setStack(prev => prev.map(element => ({
        ...element,
        operation: undefined,
        isAnimating: false
      })));
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [stack]);

  const push = () => {
    const value = parseInt(inputValue.trim());
    if (isNaN(value) || inputValue.trim() === '') {
      showMessage('Please enter a valid number', 'error');
      return;
    }

    if (isAnimating) return;

    setIsAnimating(true);
    const newElement: StackElement = {
      id: Date.now(),
      value,
      isAnimating: true,
      operation: 'push'
    };

    setStack(prev => [...prev, newElement]);
    setInputValue('');
    addToHistory('PUSH', value, stack.length + 1);
    showMessage(`Pushed ${value} to stack`, 'success');
  };

  const pop = () => {
    if (isAnimating || stack.length === 0) {
      if (stack.length === 0) {
        showMessage('Cannot pop from empty stack', 'error');
      }
      return;
    }

    setIsAnimating(true);
    const topElement = stack[stack.length - 1];
    
    // Mark top element for pop animation
    setStack(prev => prev.map((element, index) => 
      index === prev.length - 1 
        ? { ...element, isAnimating: true, operation: 'pop' }
        : element
    ));

    // Remove element after animation
    setTimeout(() => {
      setStack(prev => prev.slice(0, -1));
      addToHistory('POP', topElement.value, stack.length - 1);
      showMessage(`Popped ${topElement.value} from stack`, 'success');
    }, 500);
  };

  const peek = () => {
    if (stack.length === 0) {
      showMessage('Cannot peek empty stack', 'error');
      return;
    }

    const topElement = stack[stack.length - 1];
    
    // Highlight top element temporarily
    setStack(prev => prev.map((element, index) => 
      index === prev.length - 1 
        ? { ...element, operation: 'peek' }
        : element
    ));

    addToHistory('PEEK', topElement.value, stack.length);
    showMessage(`Top element is: ${topElement.value}`, 'info');

    // Remove peek indicator after a moment
    setTimeout(() => {
      setStack(prev => prev.map(element => ({
        ...element,
        operation: element.operation === 'peek' ? undefined : element.operation
      })));
    }, 2000);
  };

  const clear = () => {
    if (isAnimating || stack.length === 0) {
      if (stack.length === 0) {
        showMessage('Stack is already empty', 'error');
      }
      return;
    }

    const clearedCount = stack.length;
    setStack([]);
    addToHistory('CLEAR', undefined, 0);
    showMessage(`Cleared ${clearedCount} elements from stack`, 'success');
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      push();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      // Cleanup any pending timeouts
    };
  }, []);

  return (
    <div className="flex h-full gap-4">
      {/* Main Stack Canvas - Full Width */}
      <div className="flex-1 flex flex-col items-center justify-start min-h-0 relative">
        {/* Message Display on Canvas */}
        {message && (
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg ${
            message.type === 'success'
              ? `${isDarkMode ? 'bg-green-900/90 text-green-300 border border-green-700/50' : 'bg-green-100/95 text-green-700 border border-green-300/50'}`
              : message.type === 'error'
              ? `${isDarkMode ? 'bg-red-900/90 text-red-300 border border-red-700/50' : 'bg-red-100/95 text-red-700 border border-red-300/50'}`
              : `${isDarkMode ? 'bg-blue-900/90 text-blue-300 border border-blue-700/50' : 'bg-blue-100/95 text-blue-700 border border-blue-300/50'}`
          } backdrop-blur-sm`}>
            {message.text}
          </div>
        )}
        
        {stack.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`w-24 h-24 rounded-2xl mb-4 flex items-center justify-center ${
              isDarkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-gray-100/50 border border-gray-200/30'
            } backdrop-blur-sm`}>
              <svg className={`w-12 h-12 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Stack is Empty
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Push elements to see the LIFO visualization
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center h-full w-full overflow-y-auto py-8">
            {/* Stack elements (reversed to show top at the top) */}
            <div className="flex flex-col-reverse gap-2 items-center min-h-full justify-end">
              {stack.map((element, index) => {
                const isTop = index === stack.length - 1;
                const isAnimatingPush = element.isAnimating && element.operation === 'push';
                const isAnimatingPop = element.isAnimating && element.operation === 'pop';
                const isPeeking = element.operation === 'peek';
                
                return (
                  <div
                    key={element.id}
                    className={`relative w-48 h-12 rounded-lg border-2 flex items-center justify-center text-lg font-bold transition-all duration-500 flex-shrink-0 ${
                      isAnimatingPush
                        ? 'scale-110 -translate-y-2 animate-bounce shadow-xl'
                        : isAnimatingPop
                        ? 'scale-110 opacity-0 translate-x-8 rotate-6'
                        : isPeeking
                        ? 'ring-2 ring-yellow-400/50 ring-offset-1 ring-offset-transparent scale-105 animate-pulse'
                        : isTop
                        ? 'scale-102 hover:scale-105 shadow-lg'
                        : 'hover:scale-101 shadow-md'
                    } ${
                      isTop
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 border-blue-400/60 text-white shadow-blue-500/30'
                          : 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 border-blue-400/70 text-white shadow-blue-500/40'
                        : isDarkMode
                        ? 'bg-gradient-to-r from-slate-700/90 to-slate-600/90 border-slate-500/60 text-slate-200 shadow-slate-500/20'
                        : 'bg-gradient-to-r from-gray-200/90 to-gray-100/90 border-gray-400/70 text-gray-700 shadow-gray-400/30'
                    } backdrop-blur-sm`}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <span className="relative z-10">{element.value}</span>
                    
                    {/* Operation indicator */}
                    {element.operation && (
                      <div className={`absolute -top-1 -right-1 px-1 py-0.5 rounded-full text-xs font-bold ${
                        element.operation === 'push'
                          ? 'bg-green-500 text-white'
                          : element.operation === 'pop'
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-500 text-black'
                      } animate-pulse`}>
                        {element.operation === 'push' ? '+' : element.operation === 'pop' ? '-' : '?'}
                      </div>
                    )}
                    
                    {/* Simple top indicator for first element only */}
                    {isTop && !isAnimatingPop && stack.length > 1 && (
                      <div className={`absolute -right-12 top-1/2 -translate-y-1/2 text-xs font-bold ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        TOP
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Larger Width for Better UX */}
      <div className="w-96 flex flex-col">
        {/* Tab Navigation */}
        <div className={`flex rounded-t-2xl ${
          isDarkMode ? 'bg-slate-800/50 border-b border-slate-700/50' : 'bg-white/50 border-b border-gray-200/50'
        } backdrop-blur-sm`}>
          {[
            { id: 'controls', label: 'Controls', icon: '⚙️' },
            { id: 'pseudocode', label: 'Code', icon: '📝' },
            { id: 'explanation', label: 'Learn', icon: '📚' },
            { id: 'history', label: 'History', icon: '📜' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-3 py-3 text-sm font-medium rounded-t-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? isDarkMode
                    ? 'bg-slate-700/70 text-white border-b-2 border-blue-400'
                    : 'bg-gray-100/70 text-gray-900 border-b-2 border-blue-500'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/30'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content - Scrollable */}
        <div className={`flex-1 overflow-y-auto rounded-b-2xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-l border-r border-b border-slate-600/30' 
            : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-l border-r border-b border-gray-200/30'
        } backdrop-blur-sm shadow-lg`}>
          <div className="p-5">
            {activeTab === 'controls' && (
              <div className="space-y-5">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Stack Operations
                </h3>
                
                {/* Push Operation */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter value"
                      className={`flex-1 px-3 py-2 rounded-xl border transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400'
                          : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                    />
                    <button
                      onClick={push}
                      disabled={isAnimating || !inputValue.trim()}
                      className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${
                        isAnimating || !inputValue.trim()
                          ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode 
                              ? 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500/90 hover:to-emerald-500/90 text-white' 
                              : 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 hover:from-green-600/90 hover:to-emerald-600/90 text-white'
                            } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                      }`}
                      aria-label="Push value to stack"
                    >
                      Push
                    </button>
                  </div>

                  {/* Other Operations */}
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={pop}
                      disabled={isAnimating || stack.length === 0}
                      className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        isAnimating || stack.length === 0
                          ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode 
                              ? 'bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-500/90 hover:to-pink-500/90 text-white' 
                              : 'bg-gradient-to-r from-red-500/90 to-pink-500/90 hover:from-red-600/90 hover:to-pink-600/90 text-white'
                            } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                      }`}
                      aria-label="Pop value from stack"
                    >
                      Pop
                    </button>

                    <button
                      onClick={peek}
                      disabled={stack.length === 0}
                      className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        stack.length === 0
                          ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode 
                              ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-500/90 hover:to-indigo-500/90 text-white' 
                              : 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 hover:from-blue-600/90 hover:to-indigo-600/90 text-white'
                            } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                      }`}
                      aria-label="Peek at top element"
                    >
                      Peek Top Element
                    </button>

                    <button
                      onClick={clear}
                      disabled={isAnimating || stack.length === 0}
                      className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        isAnimating || stack.length === 0
                          ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode 
                              ? 'bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500/90 hover:to-red-500/90 text-white' 
                              : 'bg-gradient-to-r from-orange-500/90 to-red-500/90 hover:from-orange-600/90 hover:to-red-600/90 text-white'
                            } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                      }`}
                      aria-label="Clear all stack elements"
                    >
                      Clear Stack
                    </button>
                  </div>
                </div>

                {/* Stack Status */}
                <div className="space-y-3">
                  <h4 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Current Status
                  </h4>
                  
                  <div className="space-y-2">
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/80'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Size</span>
                        <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stack.length}</span>
                      </div>
                    </div>
                    
                    {stack.length > 0 && (
                      <div className={`p-3 rounded-lg ${
                        isDarkMode ? 'bg-blue-900/30 border border-blue-700/30' : 'bg-blue-100/80 border border-blue-300/30'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Top Element</span>
                          <span className={`font-bold text-lg ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>{stack[stack.length - 1]?.value}</span>
                        </div>
                      </div>
                    )}

                    <div className={`p-3 rounded-lg ${
                      stack.length === 0
                        ? `${isDarkMode ? 'bg-green-900/30 border border-green-700/30' : 'bg-green-100/80 border border-green-300/30'}`
                        : `${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/80'}`
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${
                          stack.length === 0 
                            ? `${isDarkMode ? 'text-green-300' : 'text-green-700'}`
                            : `${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`
                        }`}>Status</span>
                        <span className={`font-bold ${
                          stack.length === 0 
                            ? `${isDarkMode ? 'text-green-200' : 'text-green-800'}`
                            : `${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`
                        }`}>
                          {stack.length === 0 ? 'Empty' : 'Not Empty'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pseudocode' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Stack Pseudocode
                </h3>
                
                <div className={`p-4 rounded-xl font-mono text-sm ${
                  isDarkMode ? 'bg-slate-900/50 text-slate-200 border border-slate-700/30' : 'bg-gray-100/80 text-gray-800 border border-gray-200/30'
                } overflow-x-auto`}>
                  <div className="space-y-3">
                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        PUSH Operation:
                      </div>
                      <div className="pl-2 space-y-1">
                        <div>function push(value):</div>
                        <div className="pl-4">if stack is full:</div>
                        <div className="pl-8">return &quot;Stack Overflow&quot;</div>
                        <div className="pl-4">top = top + 1</div>
                        <div className="pl-4">stack[top] = value</div>
                        <div className="pl-4">return &quot;Success&quot;</div>
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        POP Operation:
                      </div>
                      <div className="pl-2 space-y-1">
                        <div>function pop():</div>
                        <div className="pl-4">if stack is empty:</div>
                        <div className="pl-8">return &quot;Stack Underflow&quot;</div>
                        <div className="pl-4">value = stack[top]</div>
                        <div className="pl-4">top = top - 1</div>
                        <div className="pl-4">return value</div>
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        PEEK Operation:
                      </div>
                      <div className="pl-2 space-y-1">
                        <div>function peek():</div>
                        <div className="pl-4">if stack is empty:</div>
                        <div className="pl-8">return &quot;Stack is Empty&quot;</div>
                        <div className="pl-4">return stack[top]</div>
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                        CLEAR Operation:
                      </div>
                      <div className="pl-2 space-y-1">
                        <div>function clear():</div>
                        <div className="pl-4">top = -1</div>
                        <div className="pl-4">return &quot;Stack Cleared&quot;</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'explanation' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Understanding Stacks
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      📚 What is a Stack?
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. 
                      Think of it like a stack of plates - you can only add or remove plates from the top.
                    </p>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      ⚡ Key Operations
                    </h4>
                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li><strong className="text-green-500">Push:</strong> Add an element to the top of the stack</li>
                      <li><strong className="text-red-500">Pop:</strong> Remove and return the top element</li>
                      <li><strong className="text-blue-500">Peek:</strong> View the top element without removing it</li>
                      <li><strong className="text-orange-500">Clear:</strong> Remove all elements from the stack</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      🚀 Time Complexity
                    </h4>
                    <div className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div>• Push: <span className="font-mono bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">O(1)</span></div>
                      <div>• Pop: <span className="font-mono bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">O(1)</span></div>
                      <div>• Peek: <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">O(1)</span></div>
                      <div>• Space: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">O(n)</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      💡 Real-World Applications
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li>• <strong>Function Calls:</strong> Managing function call hierarchy</li>
                      <li>• <strong>Undo Operations:</strong> Text editors, image editors</li>
                      <li>• <strong>Browser History:</strong> Back button functionality</li>
                      <li>• <strong>Expression Evaluation:</strong> Mathematical expressions</li>
                      <li>• <strong>Memory Management:</strong> Stack frame allocation</li>
                      <li>• <strong>Parsing:</strong> Syntax analysis in compilers</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      🎯 Key Properties
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li>• LIFO (Last-In-First-Out) ordering</li>
                      <li>• All operations occur at the top</li>
                      <li>• Constant time operations</li>
                      <li>• Dynamic size (in most implementations)</li>
                      <li>• Memory efficient for temporary storage</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Operation History
                </h3>
                
                <div className="space-y-2">
                  {operationHistory.length === 0 ? (
                    <p className={`text-sm text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      No operations performed yet.
                      <br />
                      Start by pushing some elements!
                    </p>
                  ) : (
                    operationHistory.slice().reverse().map((op, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-800/30 hover:bg-slate-700/30' : 'bg-gray-100/50 hover:bg-gray-200/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-semibold ${
                            op.operation === 'PUSH' ? 'text-green-400' :
                            op.operation === 'POP' ? 'text-red-400' :
                            op.operation === 'PEEK' ? 'text-blue-400' : 'text-orange-400'
                          }`}>
                            {op.operation}
                            {op.value !== undefined && ` (${op.value})`}
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                            Size: {op.stackSize}
                          </span>
                        </div>
                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {new Date(op.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {operationHistory.length > 0 && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    isDarkMode ? 'bg-slate-800/30' : 'bg-gray-100/50'
                  }`}>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Total Operations: {operationHistory.length}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}