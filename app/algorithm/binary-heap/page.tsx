'use client';

import React, { useState, useMemo, useRef} from 'react';
import { useTheme } from '@/contexts/ThemeContext';
// Import HeapType and updated BinaryHeap class
import { BinaryHeap, HeapStep, HeapType } from '@/app/algorithms/binary-heap';
import BinaryHeapVisualization from '@/components/BinaryHeapVisualization';
import BinaryHeapControls from '@/components/BinaryHeapControls';

// Define Message and OperationHistory types locally
interface Message { text: string; type: 'success' | 'error' | 'info'; }

const initialStep: HeapStep = {
  heap: [],
  action: 'Heap is empty. Use "Insert" to add a value.',
  highlights: {},
};

// Define the animation delay globally for easy adjustments
const ANIMATION_DELAY_MS = 500; // 0.5 seconds

export default function BinaryHeapPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // --- State Management ---
  const [heapType, setHeapType] = useState<HeapType>('max');
  const heap = useMemo(() => new BinaryHeap(heapType), [heapType]);
  const [vizStep, setVizStep] = useState<HeapStep>(initialStep);
  const generatorRef = useRef<Generator<HeapStep> | null>(null);
  const [isAnimating, setIsAnimating] = useState(false); // Controls disabling during steps
  const [message, setMessage] = useState<Message | null>(null);
  const [operationComplete, setOperationComplete] = useState(false);

  // --- Helper Functions ---
  const showMessage = (text: string, type: 'success' | 'error' | 'info') => { setMessage({ text, type }); setTimeout(() => setMessage(null), 3000); };
  // Optional: const addToHistory = (...) => { ... };

  // --- CORE UX FIX: AUTOMATE THE STEPPING ---
  // This function automatically calls itself after a delay until the generator is done.
  const runNextStepAutomated = () => {
    const gen = generatorRef.current;
    if (!gen) {
        setIsAnimating(false);
        return;
    }

    const result = gen.next();

    if (!result.done) {
      setVizStep(result.value);
      // Schedule the next step after the delay
      setTimeout(runNextStepAutomated, ANIMATION_DELAY_MS);
    } else {
      // Generator finished
      setVizStep(prev => ({ 
        ...prev, 
        action: result.value?.action || `Operation complete. ${heapType === 'max' ? 'Max' : 'Min'} Heap is valid.`,
        highlights: {} // Clear highlights on finish
      }));
      generatorRef.current = null;
      setIsAnimating(false); // Re-enable controls
      setOperationComplete(true); // Set completion status
      showMessage('Operation complete!', 'success');
    }
  };

  // The handleNextStep button should now just trigger the automated run once.
  // We rename the old handleNextStep to avoid confusion and use a new handler name for the button action.
  const handleNextStepButton = () => {
    if (generatorRef.current) {
      // If a generator is paused, clicking the button should run the automation
      setIsAnimating(true);
      runNextStepAutomated();
    }
  };


  const handleInsert = (value: number) => {
    if (generatorRef.current || isAnimating) return;
    setOperationComplete(false);
    const gen = heap.insertStep(value);
    generatorRef.current = gen;
    // START THE AUTOMATED SEQUENCE ON INSERT CLICK
    showMessage(`Inserting ${value}. Click 'Next Step' to resume animation.`, 'info'); 
    setIsAnimating(true);
    runNextStepAutomated(); // Start the animation
  };

  const handleExtractRoot = () => {
    if (generatorRef.current || isAnimating || heap.heap.length === 0) return;
    setOperationComplete(false);
    const gen = heap.extractRootStep();
    generatorRef.current = gen;
    const rootLabel = heapType === 'max' ? 'Max' : 'Min';
    // START THE AUTOMATED SEQUENCE ON EXTRACT CLICK
    showMessage(`Extracting ${rootLabel}. Click 'Next Step' to resume animation.`, 'info'); 
    setIsAnimating(true);
    runNextStepAutomated(); // Start the animation
  };

  const handleReset = () => {
     heap.heap = [];
     setVizStep(initialStep);
     generatorRef.current = null;
     setIsAnimating(false);
     setOperationComplete(false);
     showMessage('Heap reset.', 'info');
  };

  const handleHeapTypeChange = (newType: HeapType) => {
    if (vizStep.heap.length > 0 || generatorRef.current || isAnimating) {
        showMessage('Reset the heap before changing type.', 'error');
        return;
    }
    setHeapType(newType);
    setVizStep({
        ...initialStep,
        action: `Switched to ${newType === 'max' ? 'Max' : 'Min'} Heap. Heap is empty.`
    });
    setOperationComplete(false);
    showMessage(`Switched to ${newType === 'max' ? 'Max' : 'Min'} Heap.`, 'success');
  };

  // --- RENDER ---
  return (
     <div className={`flex flex-col md:flex-row h-full gap-4 p-4 min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' : 'bg-gray-100 text-black'}`}>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Header/Info Panel - Dynamic Title */}
        <div className={`w-full p-4 rounded-lg shadow-lg border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
           <div className="flex justify-between items-center mb-2">
             <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Binary Heap ({heapType === 'max' ? 'Max' : 'Min'} Heap)
             </h1>
             <div className="flex gap-2">
               <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${isDarkMode ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' : 'bg-blue-100 text-blue-800 border border-blue-300/50'}`}> OPERATIONS: O(log n) </span>
               <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${isDarkMode ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' : 'bg-purple-100 text-purple-800 border border-purple-300/50'}`}> SPACE: O(n) </span>
             </div>
           </div>
           <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}> A tree-based data structure satisfying the heap property. Used for Priority Queues. </p>
           {/* Dynamic Status Message Styling */}
           <p className={`font-mono text-base min-h-[1.5em] p-2 rounded-md border transition-colors duration-300 ${
               operationComplete && !generatorRef.current && !isAnimating
                 ? `${isDarkMode ? 'text-green-300 bg-green-900/30 border-green-700/50' : 'text-green-700 bg-green-50 border-green-200'}`
                 : `${isDarkMode ? 'text-blue-300 bg-gray-800 border-gray-700' : 'text-blue-700 bg-blue-50 border-blue-200'}`
           }`}> Status: {vizStep.action} </p>
         </div>
        {/* Visualization Component */}
        <div className={`flex-1 w-full rounded-lg border overflow-hidden ${isDarkMode ? 'border-slate-700 bg-slate-800/20' : 'border-gray-300 bg-gray-100/30'}`}>
          <BinaryHeapVisualization
            heap={vizStep.heap}
            highlights={vizStep.highlights}
          />
        </div>
      </div>
      {/* Right Sidebar - Pass new props */}
      <div className="w-full md:w-96 flex-shrink-0">
        <BinaryHeapControls
          heapType={heapType}
          onHeapTypeChange={handleHeapTypeChange}
          onInsert={handleInsert}
          onExtractRoot={handleExtractRoot}
          // --- UPDATED HANDLER FOR NEXT STEP ---
          onNextStep={handleNextStepButton} // Pass the button handler function
          onReset={handleReset}
          isGeneratorRunning={generatorRef.current != null || isAnimating}
          heapSize={vizStep.heap.length}
          rootValue={vizStep.heap.length > 0 ? vizStep.heap[0] : undefined}
        />
      </div>
       {/* Message Banner */}
       {message && ( <div className={`fixed bottom-4 right-4 z-20 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg ${ message.type === 'success' ? `${isDarkMode ? 'bg-green-900/90 text-green-300 border border-green-700/50' : 'bg-green-100/95 text-green-700 border border-green-300/50'}` : message.type === 'error' ? `${isDarkMode ? 'bg-red-900/90 text-red-300 border border-red-700/50' : 'bg-red-100/95 text-red-700 border border-red-300/50'}` : `${isDarkMode ? 'bg-blue-900/90 text-blue-300 border border-blue-700/50' : 'bg-blue-100/95 text-blue-700 border border-blue-300/50'}` } backdrop-blur-sm`}> {message.text} </div> )}
    </div>
  );
}