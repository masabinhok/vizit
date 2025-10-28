'use client';

import React, { useState } from 'react';
import { HeapType } from '@/app/algorithms/binary-heap';

interface BinaryHeapControlsProps {
  onInsert: (value: number) => void;
  onExtractRoot: () => void;
  onNextStep: () => void;
  onReset: () => void;
  isGeneratorRunning: boolean;
  heapSize: number;
  heapType: HeapType;
  onHeapTypeChange: (newType: HeapType) => void;
  rootValue?: number; // ADDED: Optional root value prop
}

export const BinaryHeapControls: React.FC<BinaryHeapControlsProps> = ({
  onInsert,
  onExtractRoot,
  onNextStep,
  onReset,
  isGeneratorRunning,
  heapSize,
  heapType,
  onHeapTypeChange,
  rootValue, // DESTRUCTURED: Add to props
}) => {
  const [inputValue, setInputValue] = useState<number>(() => Math.floor(Math.random() * 100));
  const isDarkMode = true; // Assuming dark mode

  const handleInsertClick = () => { if (isNaN(inputValue) || String(inputValue).trim() === '') return; onInsert(inputValue); setInputValue(Math.floor(Math.random() * 100)); };
  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') { handleInsertClick(); } };

  const extractLabel = heapType === 'max' ? 'Extract Max' : 'Extract Min';
  const rootElementLabel = heapType === 'max' ? 'Max Element (Root)' : 'Min Element (Root)';

  return (
    <div className={`w-full md:w-96 flex flex-col p-5 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/30' : 'bg-gradient-to-br from-white/50 to-gray-50/50 border border-gray-200/30'} backdrop-blur-sm`}>
        {/* Heap Type Toggle Section */}
        <div className="space-y-2 mb-5">
          <h4 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Heap Type</h4>
          <div className="flex items-center justify-center p-1 rounded-lg bg-gray-700 border border-gray-600 w-full">
             <button onClick={() => onHeapTypeChange('max')} disabled={isGeneratorRunning || heapSize > 0} className={`flex-1 py-2 px-4 rounded transition-all text-sm font-medium ${ heapType === 'max' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-600' } ${ (isGeneratorRunning || heapSize > 0) ? 'opacity-50 cursor-not-allowed' : '' }`}> Max Heap </button>
             <button onClick={() => onHeapTypeChange('min')} disabled={isGeneratorRunning || heapSize > 0} className={`flex-1 py-2 px-4 rounded transition-all text-sm font-medium ${ heapType === 'min' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-600' } ${ (isGeneratorRunning || heapSize > 0) ? 'opacity-50 cursor-not-allowed' : '' }`}> Min Heap </button>
          </div>
          {(isGeneratorRunning || heapSize > 0) && (<p className="text-xs text-center text-amber-400">Reset heap to change type.</p>)}
        </div>

        {/* Heap Operations Section */}
        <div className="space-y-5">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Heap Operations</h3>
          <div className="space-y-3">
            {/* Insert Input and Button */}
            <div className="flex gap-2">
               <input type="number" value={inputValue} onChange={(e) => setInputValue(parseInt(e.target.value) || 0)} onKeyPress={handleKeyPress} placeholder="Enter value" className={`flex-1 px-3 py-2 rounded-xl border transition-all duration-200 ${ isDarkMode ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400' : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-500' } focus:outline-none focus:ring-2 focus:ring-blue-500/30`} />
               <button onClick={handleInsertClick} disabled={isGeneratorRunning || String(inputValue).trim() === '' || isNaN(inputValue)} className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${ (isGeneratorRunning || String(inputValue).trim() === '' || isNaN(inputValue)) ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed` : `${isDarkMode ? 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500/90 hover:to-emerald-500/90 text-white' : 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 hover:from-green-600/90 hover:to-emerald-600/90 text-white' } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5` }`}> Insert </button>
             </div>
             {/* Action Buttons */}
             <div className="grid grid-cols-1 gap-2">
                <button onClick={onExtractRoot} disabled={isGeneratorRunning || heapSize === 0} className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${ (isGeneratorRunning || heapSize === 0) ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed` : `${isDarkMode ? 'bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-500/90 hover:to-pink-500/90 text-white' : 'bg-gradient-to-r from-red-500/90 to-pink-500/90 hover:from-red-600/90 hover:to-pink-600/90 text-white' } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5` }`}> {extractLabel} </button>
                <button onClick={onNextStep} disabled={!isGeneratorRunning} className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${ !isGeneratorRunning ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed` : `${isDarkMode ? 'bg-gradient-to-r from-gray-600/80 to-gray-700/80 hover:from-gray-500/90 hover:to-gray-600/90 text-white' : 'bg-gradient-to-r from-gray-500/90 to-gray-600/90 hover:from-gray-600/90 hover:to-gray-700/90 text-white' } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5` }`}> Next Step </button>
                <button onClick={onReset} disabled={isGeneratorRunning && heapSize > 0} className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${ (isGeneratorRunning && heapSize > 0) ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed` : `${isDarkMode ? 'bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500/90 hover:to-red-500/90 text-white' : 'bg-gradient-to-r from-orange-500/90 to-red-500/90 hover:from-orange-600/90 hover:to-red-600/90 text-white' } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5` }`}> Reset Heap </button>
             </div>
          </div>
          {/* Current Status Section */}
          <div className="space-y-3 mt-5 pt-5 border-t border-slate-700/50">
             <h4 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Current Status</h4>
             <div className="space-y-2">
                {/* Size Display */}
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/80'}`}>
                   <div className="flex justify-between items-center">
                     <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Size</span>
                     <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{heapSize}</span>
                   </div>
                 </div>
                 {/* Root Element Display (Conditional) */}
                 {heapSize > 0 && (
                   <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/30 border border-blue-700/30' : 'bg-blue-100/80 border border-blue-300/30'}`}>
                     <div className="flex justify-between items-center">
                       <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{rootElementLabel}</span>
                       {/* --- DISPLAY ACTUAL ROOT VALUE --- */}
                       <span className={`font-bold text-lg ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                         {/* Display value if defined, otherwise '-' */}
                         {rootValue !== undefined ? rootValue : '-'}
                       </span>
                     </div>
                   </div>
                  )}
                 {/* Status Display */}
                 <div className={`p-3 rounded-lg ${ heapSize === 0 ? `${isDarkMode ? 'bg-green-900/30 border border-green-700/30' : 'bg-green-100/80 border border-green-300/30'}` : `${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/80'}`}`}>
                   <div className="flex justify-between items-center">
                      <span className={`text-sm ${ heapSize === 0 ? `${isDarkMode ? 'text-green-300' : 'text-green-700'}` : `${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}`}>Status</span>
                     <span className={`font-bold ${ heapSize === 0 ? `${isDarkMode ? 'text-green-200' : 'text-green-800'}` : `${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}`}>
                       {heapSize === 0 ? 'Empty' : (isGeneratorRunning ? 'Processing...' : 'Idle')}
                     </span>
                   </div>
                 </div>
             </div>
           </div>
        </div>
    </div>
  );
};

export default BinaryHeapControls;