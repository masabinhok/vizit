'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface QueueElement {
  id: number;
  value: number;
  isAnimating?: boolean;
  operation?: 'enqueue' | 'dequeue' | 'peek';
}

interface OperationHistory {
  operation: string;
  value?: number;
  timestamp: number;
  queueSize: number;
}

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

export default function QueueVisualization() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const [queue, setQueue] = useState<QueueElement[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [operationHistory, setOperationHistory] = useState<OperationHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'controls' | 'pseudocode' | 'explanation' | 'history'>('controls');

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const addToHistory = (operation: string, value?: number, queueSize?: number) => {
    setOperationHistory(prev => [
      ...prev,
      {
        operation,
        value,
        timestamp: Date.now(),
        queueSize: queueSize ?? queue.length
      }
    ]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setQueue(prev => prev.map(element => ({
        ...element,
        operation: undefined,
        isAnimating: false
      })));
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [queue]);

  const enqueue = () => {
    const value = parseInt(inputValue.trim());
    if (isNaN(value) || inputValue.trim() === '') {
      showMessage('Please enter a valid number', 'error');
      return;
    }
    if (isAnimating) return;

    setIsAnimating(true);
    const newElement: QueueElement = {
      id: Date.now(),
      value,
      isAnimating: true,
      operation: 'enqueue'
    };
    setQueue(prev => [...prev, newElement]);
    setInputValue('');
    addToHistory('ENQUEUE', value, queue.length + 1);
    showMessage(`Enqueued ${value}`, 'success');
  };

  const dequeue = () => {
    if (isAnimating || queue.length === 0) {
      if (queue.length === 0) {
        showMessage('Cannot dequeue from empty queue', 'error');
      }
      return;
    }

    setIsAnimating(true);
    const frontElement = queue[0];

    setQueue(prev => prev.map((element, index) =>
      index === 0
        ? { ...element, isAnimating: true, operation: 'dequeue' }
        : element
    ));

    setTimeout(() => {
      setQueue(prev => prev.slice(1));
      addToHistory('DEQUEUE', frontElement.value, queue.length - 1);
      showMessage(`Dequeued ${frontElement.value}`, 'success');
    }, 500);
  };

  const peek = () => {
    if (queue.length === 0) {
      showMessage('Cannot peek empty queue', 'error');
      return;
    }

    const frontElement = queue[0];
    setQueue(prev => prev.map((element, index) =>
      index === 0
        ? { ...element, operation: 'peek' }
        : element
    ));

    addToHistory('PEEK', frontElement.value, queue.length);
    showMessage(`Front element is: ${frontElement.value}`, 'info');

    setTimeout(() => {
      setQueue(prev => prev.map(element => ({
        ...element,
        operation: element.operation === 'peek' ? undefined : element.operation
      })));
    }, 2000);
  };

  const clear = () => {
    if (isAnimating || queue.length === 0) {
      if (queue.length === 0) {
        showMessage('Queue is already empty', 'error');
      }
      return;
    }

    const clearedCount = queue.length;
    setQueue([]);
    addToHistory('CLEAR', undefined, 0);
    showMessage(`Cleared ${clearedCount} elements from queue`, 'success');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      enqueue();
    }
  };

  return (
    <div className="flex h-full gap-4">
      <div className="flex-1 flex flex-col items-center justify-start min-h-0 relative">
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

        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`w-24 h-24 rounded-2xl mb-4 flex items-center justify-center ${
              isDarkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-gray-100/50 border border-gray-200/30'
            } backdrop-blur-sm`}>
              <svg className={`w-12 h-12 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Queue is Empty
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Enqueue elements to see the FIFO visualization
            </p>
          </div>
        ) : (
          <div className="flex items-center h-full w-full overflow-x-auto py-8 px-4">
            <div className="flex gap-2 items-center min-w-full justify-center">
              {queue.map((element, index) => {
                const isFront = index === 0;
                const isRear = index === queue.length - 1;
                const isAnimatingEnqueue = element.isAnimating && element.operation === 'enqueue';
                const isAnimatingDequeue = element.isAnimating && element.operation === 'dequeue';
                const isPeeking = element.operation === 'peek';

                return (
                  <div
                    key={element.id}
                    className={`relative w-24 h-16 rounded-lg border-2 flex items-center justify-center text-base font-bold transition-all duration-500 flex-shrink-0 ${
                      isAnimatingEnqueue
                        ? 'scale-110 translate-y-2 animate-bounce shadow-xl'
                        : isAnimatingDequeue
                        ? 'scale-110 opacity-0 -translate-x-8 rotate-6'
                        : isPeeking
                        ? 'ring-2 ring-yellow-400/50 ring-offset-1 ring-offset-transparent scale-105 animate-pulse'
                        : isFront || isRear
                        ? 'scale-102 hover:scale-105 shadow-lg'
                        : 'hover:scale-101 shadow-md'
                    } ${
                      isFront
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-emerald-600/90 to-teal-600/90 border-emerald-400/60 text-white shadow-emerald-500/30'
                          : 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 border-emerald-400/70 text-white shadow-emerald-500/40'
                        : isRear
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-amber-600/90 to-orange-600/90 border-amber-400/60 text-white shadow-amber-500/30'
                          : 'bg-gradient-to-r from-amber-500/90 to-orange-500/90 border-amber-400/70 text-white shadow-amber-500/40'
                        : isDarkMode
                        ? 'bg-gradient-to-r from-slate-700/90 to-slate-600/90 border-slate-500/60 text-slate-200 shadow-slate-500/20'
                        : 'bg-gradient-to-r from-gray-200/90 to-gray-100/90 border-gray-400/70 text-gray-700 shadow-gray-400/30'
                    } backdrop-blur-sm`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="relative z-10">{element.value}</span>

                    {element.operation && (
                      <div className={`absolute -top-1 -right-1 px-1 py-0.5 rounded-full text-xs font-bold ${
                        element.operation === 'enqueue'
                          ? 'bg-green-500 text-white'
                          : element.operation === 'dequeue'
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-500 text-black'
                      } animate-pulse`}>
                        {element.operation === 'enqueue' ? '+' : element.operation === 'dequeue' ? '-' : '?'}
                      </div>
                    )}

                    {isFront && !isAnimatingDequeue && (
                      <div className={`absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-bold ${
                        isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        FRONT
                      </div>
                    )}

                    {isRear && (
                      <div className={`absolute -right-12 top-1/2 -translate-y-1/2 text-xs font-bold ${
                        isDarkMode ? 'text-amber-400' : 'text-amber-600'
                      }`}>
                        REAR
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-96 flex flex-col">
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

        <div className={`flex-1 overflow-y-auto rounded-b-2xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-l border-r border-b border-slate-600/30' 
            : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-l border-r border-b border-gray-200/30'
        } backdrop-blur-sm shadow-lg`}>
          <div className="p-5">
            {activeTab === 'controls' && (
              <div className="space-y-5">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Queue Operations
                </h3>
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
                      onClick={enqueue}
                      disabled={isAnimating || !inputValue.trim()}
                      className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${
                        isAnimating || !inputValue.trim()
                          ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode 
                              ? 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500/90 hover:to-emerald-500/90 text-white' 
                              : 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 hover:from-green-600/90 hover:to-emerald-600/90 text-white'
                            } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                      }`}
                    >
                      Enqueue
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={dequeue}
                      disabled={isAnimating || queue.length === 0}
                      className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        isAnimating || queue.length === 0
                          ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode 
                              ? 'bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-500/90 hover:to-pink-500/90 text-white' 
                              : 'bg-gradient-to-r from-red-500/90 to-pink-500/90 hover:from-red-600/90 hover:to-pink-600/90 text-white'
                            } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                      }`}
                    >
                      Dequeue
                    </button>

                    <button
                      onClick={peek}
                      disabled={queue.length === 0}
                      className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        queue.length === 0
                          ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode 
                              ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-500/90 hover:to-indigo-500/90 text-white' 
                              : 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 hover:from-blue-600/90 hover:to-indigo-600/90 text-white'
                            } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                      }`}
                    >
                      Peek Front Element
                    </button>

                    <button
                      onClick={clear}
                      disabled={isAnimating || queue.length === 0}
                      className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        isAnimating || queue.length === 0
                          ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode 
                              ? 'bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500/90 hover:to-red-500/90 text-white' 
                              : 'bg-gradient-to-r from-orange-500/90 to-red-500/90 hover:from-orange-600/90 hover:to-red-600/90 text-white'
                            } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                      }`}
                    >
                      Clear Queue
                    </button>
                  </div>
                </div>

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
                        <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{queue.length}</span>
                      </div>
                    </div>
                    {queue.length > 0 && (
                      <>
                        <div className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-emerald-900/30 border border-emerald-700/30' : 'bg-emerald-100/80 border border-emerald-300/30'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Front Element</span>
                            <span className={`font-bold text-lg ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>{queue[0]?.value}</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-amber-900/30 border border-amber-700/30' : 'bg-amber-100/80 border border-amber-300/30'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>Rear Element</span>
                            <span className={`font-bold text-lg ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>{queue[queue.length - 1]?.value}</span>
                          </div>
                        </div>
                      </>
                    )}
                    <div className={`p-3 rounded-lg ${
                      queue.length === 0
                        ? `${isDarkMode ? 'bg-green-900/30 border border-green-700/30' : 'bg-green-100/80 border border-green-300/30'}`
                        : `${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/80'}`
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${
                          queue.length === 0 
                            ? `${isDarkMode ? 'text-green-300' : 'text-green-700'}`
                            : `${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`
                        }`}>Status</span>
                        <span className={`font-bold ${
                          queue.length === 0 
                            ? `${isDarkMode ? 'text-green-200' : 'text-green-800'}`
                            : `${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`
                        }`}>
                          {queue.length === 0 ? 'Empty' : 'Not Empty'}
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
                  Queue Pseudocode
                </h3>
                <div className={`p-4 rounded-xl font-mono text-sm ${
                  isDarkMode ? 'bg-slate-900/50 text-slate-200 border border-slate-700/30' : 'bg-gray-100/80 text-gray-800 border border-gray-200/30'
                } overflow-x-auto`}>
                  <div className="space-y-3">
                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        ENQUEUE Operation:
                      </div>
                      <div className="pl-2 space-y-1">
                        <div>function enqueue(value):</div>
                        <div className="pl-4">if queue is full:</div>
                        <div className="pl-8">return &quot;Queue Overflow&quot;</div>
                        <div className="pl-4">rear = rear + 1</div>
                        <div className="pl-4">queue[rear] = value</div>
                        <div className="pl-4">return &quot;Success&quot;</div>
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        DEQUEUE Operation:
                      </div>
                      <div className="pl-2 space-y-1">
                        <div>function dequeue():</div>
                        <div className="pl-4">if queue is empty:</div>
                        <div className="pl-8">return &quot;Queue Underflow&quot;</div>
                        <div className="pl-4">value = queue[front]</div>
                        <div className="pl-4">front = front + 1</div>
                        <div className="pl-4">return value</div>
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        PEEK Operation:
                      </div>
                      <div className="pl-2 space-y-1">
                        <div>function peek():</div>
                        <div className="pl-4">if queue is empty:</div>
                        <div className="pl-8">return &quot;Queue is Empty&quot;</div>
                        <div className="pl-4">return queue[front]</div>
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                        CLEAR Operation:
                      </div>
                      <div className="pl-2 space-y-1">
                        <div>function clear():</div>
                        <div className="pl-4">front = 0</div>
                        <div className="pl-4">rear = -1</div>
                        <div className="pl-4">return &quot;Queue Cleared&quot;</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'explanation' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Understanding Queues
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      📚 What is a Queue?
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle.
                      Think of a line at a ticket counter: the first person in line is served first.
                    </p>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      ⚡ Key Operations
                    </h4>
                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li><strong className="text-green-500">Enqueue:</strong> Add an element to the rear of the queue</li>
                      <li><strong className="text-red-500">Dequeue:</strong> Remove and return the front element</li>
                      <li><strong className="text-blue-500">Peek:</strong> View the front element without removing it</li>
                      <li><strong className="text-orange-500">Clear:</strong> Remove all elements from the queue</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      🚀 Time Complexity
                    </h4>
                    <div className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div>• Enqueue: <span className="font-mono bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">O(1)</span></div>
                      <div>• Dequeue: <span className="font-mono bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">O(1)</span></div>
                      <div>• Peek: <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">O(1)</span></div>
                      <div>• Space: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">O(n)</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      💡 Real-World Applications
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li>• <strong>Task Scheduling:</strong> CPU job queues</li>
                      <li>• <strong>Breadth-First Search:</strong> Graph traversal</li>
                      <li>• <strong>Printer Queue:</strong> Print jobs in order</li>
                      <li>• <strong>Message Queues:</strong> System communication (e.g., RabbitMQ)</li>
                      <li>• <strong>Buffering:</strong> Streaming data, keyboard input</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      🎯 Key Properties
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li>• FIFO (First-In-First-Out) ordering</li>
                      <li>• Enqueue at rear, dequeue from front</li>
                      <li>• Constant time operations</li>
                      <li>• Used for orderly processing</li>
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
                      Start by enqueuing some elements!
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
                            op.operation === 'ENQUEUE' ? 'text-green-400' :
                            op.operation === 'DEQUEUE' ? 'text-red-400' :
                            op.operation === 'PEEK' ? 'text-blue-400' : 'text-orange-400'
                          }`}>
                            {op.operation}
                            {op.value !== undefined && ` (${op.value})`}
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                            Size: {op.queueSize}
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