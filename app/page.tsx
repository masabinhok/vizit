
"use client";

import { useState, useEffect, useRef } from "react";

interface ArrayElement {
  value: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
}

interface AlgorithmStep {
  array: ArrayElement[];
  i: number;
  j: number;
  description: string;
  codeLineIndex: number;
  comparisons: number;
  swaps: number;
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Algorithms");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Bubble Sort");
  const [inputArray, setInputArray] = useState("64,34,25,12,22,11,90");
  
  // Animation state
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const categories = ["Algorithms", "Data Structures", "Math", "Graphs", "Fun"];
  
  const algorithms = {
    "Algorithms": ["Bubble Sort", "Quick Sort", "Merge Sort", "Binary Search", "Dijkstra's Algorithm"],
    "Data Structures": ["Binary Tree", "Hash Table", "Stack", "Queue", "Linked List"],
    "Math": ["Sieve of Eratosthenes", "Fibonacci", "Prime Factorization", "GCD", "Modular Arithmetic"],
    "Graphs": ["BFS", "DFS", "Kruskal's MST", "Prim's MST", "Topological Sort"],
    "Fun": ["Conway's Game of Life", "Mandelbrot Set", "Sorting Dance", "Maze Generation", "Fractals"]
  };

  const bubbleSortCode = [
    "function bubbleSort(arr) {",
    "  let n = arr.length;",
    "  for (let i = 0; i < n - 1; i++) {",
    "    for (let j = 0; j < n - i - 1; j++) {",
    "      if (arr[j] > arr[j + 1]) {",
    "        // Swap elements",
    "        let temp = arr[j];",
    "        arr[j] = arr[j + 1];",
    "        arr[j + 1] = temp;",
    "      }",
    "    }",
    "  }",
    "  return arr;",
    "}"
  ];

  // Generate bubble sort steps
  const generateBubbleSortSteps = (inputArr: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const arr: ArrayElement[] = inputArr.map(val => ({
      value: val,
      isComparing: false,
      isSwapping: false,
      isSorted: false
    }));

    let comparisons = 0;
    let swaps = 0;
    const n = arr.length;

    // Initial state
    steps.push({
      array: [...arr],
      i: -1,
      j: -1,
      description: "Starting Bubble Sort algorithm",
      codeLineIndex: 0,
      comparisons,
      swaps
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Comparing step
        const comparingArr = arr.map((el, idx) => ({
          ...el,
          isComparing: idx === j || idx === j + 1,
          isSwapping: false
        }));
        
        steps.push({
          array: [...comparingArr],
          i,
          j,
          description: `Comparing elements at positions ${j} and ${j + 1}: ${arr[j].value} vs ${arr[j + 1].value}`,
          codeLineIndex: 4,
          comparisons: ++comparisons,
          swaps
        });

        if (arr[j].value > arr[j + 1].value) {
          // Swapping step
          const swappingArr = arr.map((el, idx) => ({
            ...el,
            isComparing: false,
            isSwapping: idx === j || idx === j + 1
          }));

          steps.push({
            array: [...swappingArr],
            i,
            j,
            description: `Swapping ${arr[j].value} and ${arr[j + 1].value}`,
            codeLineIndex: 7,
            comparisons,
            swaps: ++swaps
          });

          // Perform swap
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
      
      // Mark element as sorted
      arr[n - 1 - i].isSorted = true;
      steps.push({
        array: [...arr.map(el => ({ ...el, isComparing: false, isSwapping: false }))],
        i,
        j: -1,
        description: `Element ${arr[n - 1 - i].value} is now in its correct position`,
        codeLineIndex: 3,
        comparisons,
        swaps
      });
    }

    // Mark first element as sorted
    arr[0].isSorted = true;
    steps.push({
      array: [...arr.map(el => ({ ...el, isComparing: false, isSwapping: false }))],
      i: -1,
      j: -1,
      description: "Bubble Sort completed! Array is now sorted.",
      codeLineIndex: 12,
      comparisons,
      swaps
    });

    return steps;
  };

  // Initialize algorithm
  const initializeAlgorithm = () => {
    try {
      const numbers = inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      if (numbers.length === 0) {
        alert("Please enter valid numbers separated by commas");
        return;
      }
      
      const newSteps = generateBubbleSortSteps(numbers);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsInitialized(true);
      setIsPlaying(false);
    } catch (error) {
      alert("Invalid input format. Please use numbers separated by commas.");
    }
  };

  // Animation controls
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const delay = Math.max(100, 1000 - (speed * 9));
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, steps.length]);

  // Initialize with default array
  useEffect(() => {
    if (selectedAlgorithm === "Bubble Sort" && !isInitialized) {
      initializeAlgorithm();
    }
  }, [selectedAlgorithm]);

  const currentStepData = steps[currentStep];
  const maxValue = steps.length > 0 ? Math.max(...steps[0].array.map(el => el.value)) : 100;

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar Navigation */}
      <aside className={`w-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-blue-600">Vizit</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Algorithm Visualizer</p>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search algorithms..."
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            <svg className="w-4 h-4 absolute right-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left font-semibold mb-3 px-2 py-1 rounded ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
              {selectedCategory === category && (
                <ul className="space-y-1 ml-2">
                  {algorithms[category as keyof typeof algorithms].map((algo: string) => (
                    <li key={algo}>
                      <button 
                        onClick={() => {
                          setSelectedAlgorithm(algo);
                          setIsInitialized(false);
                        }}
                        className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                          selectedAlgorithm === algo
                            ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {algo}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Dark/Light Mode Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {isDarkMode ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
                Light Mode
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                Dark Mode
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-sm border-b border-gray-200 dark:border-gray-700 p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{selectedAlgorithm} Visualization</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedAlgorithm === "Bubble Sort" ? "Simple comparison-based sorting algorithm" : "Interactive algorithm visualization"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Time Complexity: {selectedAlgorithm === "Bubble Sort" ? "O(n²)" : "Varies"}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Space: {selectedAlgorithm === "Bubble Sort" ? "O(1)" : "Varies"}
              </span>
            </div>
          </div>
        </header>

        {/* Canvas Area */}
        <section className="flex-1 flex">
          {/* Main Visualization Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Canvas */}
            <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} relative overflow-hidden p-8`}>
              {isInitialized && currentStepData ? (
                <div className="h-full flex flex-col justify-center">
                  {/* Array Visualization */}
                  <div className="flex items-end justify-center gap-2 h-80">
                    {currentStepData.array.map((element, index) => (
                      <div key={index} className="flex flex-col items-center">
                        {/* Bar */}
                        <div
                          className={`w-12 rounded-t transition-all duration-300 flex items-end justify-center text-white text-sm font-bold ${
                            element.isSorted
                              ? 'bg-green-500'
                              : element.isSwapping
                              ? 'bg-red-500 animate-pulse'
                              : element.isComparing
                              ? 'bg-yellow-500'
                              : isDarkMode
                              ? 'bg-blue-400'
                              : 'bg-blue-500'
                          }`}
                          style={{
                            height: `${(element.value / maxValue) * 250}px`,
                            minHeight: '30px'
                          }}
                        >
                          <span className="mb-1">{element.value}</span>
                        </div>
                        {/* Index */}
                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {index}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Step Info */}
                  <div className="mt-6 text-center">
                    <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {currentStepData.description}
                    </p>
                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Step {currentStep + 1} of {steps.length}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'} text-center`}>
                    <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-lg font-medium">Visualization Canvas</p>
                    <p className="text-sm">Enter an array and click Apply to begin</p>
                  </div>
                </div>
              )}
            </div>

            {/* Control Bar */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4`}>
              <div className="flex items-center justify-between">
                {/* Playback Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={!isInitialized || currentStep >= steps.length - 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                      !isInitialized || currentStep >= steps.length - 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : isPlaying 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <button 
                    onClick={stepBackward}
                    disabled={!isInitialized || currentStep <= 0}
                    className={`p-2 rounded-lg transition-colors ${
                      !isInitialized || currentStep <= 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.333 4z" />
                    </svg>
                  </button>

                  <button 
                    onClick={stepForward}
                    disabled={!isInitialized || currentStep >= steps.length - 1}
                    className={`p-2 rounded-lg transition-colors ${
                      !isInitialized || currentStep >= steps.length - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                    </svg>
                  </button>

                  <button 
                    onClick={reset}
                    disabled={!isInitialized}
                    className={`p-2 rounded-lg transition-colors ${
                      !isInitialized
                        ? 'text-gray-400 cursor-not-allowed'
                        : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Speed:</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">🐌</span>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-xs">🚀</span>
                  </div>
                  <span className="text-sm text-gray-500">{speed}%</span>
                </div>

                {/* Algorithm Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter array: 64,34,25,12,22,11,90"
                    value={inputArray}
                    onChange={(e) => setInputArray(e.target.value)}
                    className={`px-3 py-2 rounded border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <button 
                    onClick={initializeAlgorithm}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Panels */}
          <aside className={`w-80 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border-l border-gray-200 dark:border-gray-700 flex flex-col`}>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {["Code", "Explanation", "Stats"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    tab === "Code"
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Code Panel */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4 font-mono text-sm`}>
                <div className="space-y-1">
                  {bubbleSortCode.map((line, index) => (
                    <div
                      key={index}
                      className={`px-2 py-1 rounded ${
                        currentStepData?.codeLineIndex === index
                          ? 'bg-yellow-200 dark:bg-yellow-800'
                          : ''
                      }`}
                    >
                      <span className="text-gray-500 dark:text-gray-400 mr-2">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Current Step</h3>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} p-3 rounded-lg`}>
                  <p className="text-sm">
                    {currentStepData?.description || "Click Apply to start visualization"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Comparisons:</span>
                    <span className="font-mono">{currentStepData?.comparisons || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Swaps:</span>
                    <span className="font-mono">{currentStepData?.swaps || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Array Size:</span>
                    <span className="font-mono">{currentStepData?.array.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Step:</span>
                    <span className="font-mono">{currentStep + 1} / {steps.length || 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
