'use client';

import { useState } from 'react';
import KMPVisualization from '../../../components/KMPVisualization';
import ControlBar from '../../../components/ControlBar';

export default function KMPPage() {
    const [text, setText] = useState("AABAACAADAABAABA");
    const [pattern, setPattern] = useState("AABA");
    const [speed, setSpeed] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const [activeTab, setActiveTab] = useState<'controls' | 'pseudocode' | 'explanation'>('controls');

    // Function to generate random text
    const generateRandomText = () => {
        const length = Math.floor(Math.random() * 10) + 15; // Generate length between 15-25
        const chars = 'ABCD'; // Using limited character set for better visualization
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setText(result);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsInitialized(true);
    };

    // Calculate total steps based on text and pattern length
    const totalSteps = text.length + pattern.length;

    const handleComplete = () => {
        setIsPlaying(false);
    };

    const handleStepForward = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleStepBackward = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
        setIsInitialized(true);
    };

    const handleInitialize = () => {
        setIsInitialized(true);
        setCurrentStep(0);
    };

    return (
        <div className="flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Algorithm Header */}
            <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Knuth-Morris-Pratt Algorithm</h1>
                    <p className="text-gray-300 text-lg mb-6">
                        Efficient pattern matching in strings • O(n + m)
                    </p>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 px-8">
                <button
                    onClick={() => setActiveTab('controls')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'controls'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    Controls
                </button>
                <button
                    onClick={() => setActiveTab('pseudocode')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'pseudocode'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    Pseudocode
                </button>
                <button
                    onClick={() => setActiveTab('explanation')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'explanation'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    Explanation
                </button>
            </div>

            {/* Tab Content */}
            <div className="px-8">
                {activeTab === 'controls' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-wrap gap-4 mb-6">
                                <button
                                    onClick={generateRandomText}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Generate Text
                                </button>
                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pattern:</span>
                                    <input
                                        type="text"
                                        value={pattern}
                                        onChange={(e) => setPattern(e.target.value)}
                                        className="bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setCurrentStep(0);
                                        setIsPlaying(true);
                                        setIsInitialized(true);
                                    }}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Start Search
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Speed:</span>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="3"
                                        step="0.1"
                                        value={speed}
                                        onChange={(e) => setSpeed(Number(e.target.value))}
                                        className="w-32"
                                    />
                                </div>
                            </div>

                            <ControlBar
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                                speed={speed}
                                setSpeed={setSpeed}
                                inputArray={text + '|' + pattern}
                                setInputArray={(value) => {
                                    const [newText, newPattern] = value.split('|');
                                    setText(newText || '');
                                    setPattern(newPattern || '');
                                }}
                                currentStep={currentStep}
                                totalSteps={totalSteps}
                                isInitialized={isInitialized}
                                onInitialize={handleInitialize}
                                onStepForward={handleStepForward}
                                onStepBackward={handleStepBackward}
                                onReset={handleReset}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'pseudocode' && (
                    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden max-h-[calc(100vh-20rem)]">
                        <div className="border-b border-gray-700 p-4 sticky top-0 bg-gray-900 z-10">
                            <h3 className="text-lg font-medium text-gray-100">KMP Algorithm Implementation</h3>
                        </div>
                        <div className="divide-y divide-gray-700 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 24rem)' }}>
                            {/* LPS Construction */}
                            <div className="p-4">
                                <div className="mb-2 text-sm font-medium text-gray-400">LPS Array Construction</div>
                                <div className="bg-gray-800/50 rounded-lg p-4 overflow-x-auto custom-scrollbar">
                                    <pre className="text-gray-300 whitespace-pre font-mono text-sm leading-relaxed">
                                        {`function computeLPS(pattern):
    lps = array of 0s of length pattern.length
    len = 0  // length of previous longest prefix suffix
    i = 1
    
    while i < pattern.length:
        if pattern[i] == pattern[len]:
            len++
            lps[i] = len
            i++
        else:
            if len != 0:
                len = lps[len - 1]
            else:
                lps[i] = 0
                i++
    return lps`}
                                    </pre>
                                </div>
                            </div>

                            {/* Pattern Search */}
                            <div className="p-4">
                                <div className="mb-2 text-sm font-medium text-gray-400">Pattern Search</div>
                                <div className="bg-gray-800/50 rounded-lg p-4 overflow-x-auto custom-scrollbar">
                                    <pre className="text-gray-300 whitespace-pre font-mono text-sm leading-relaxed">
                                        {`function KMPSearch(text, pattern):
    n = text.length
    m = pattern.length
    lps = computeLPS(pattern)
    
    i = 0  // index for text
    j = 0  // index for pattern
    
    while i < n:
        if pattern[j] == text[i]:
            i++
            j++
        
        if j == m:
            // Found pattern at index i-j
            j = lps[j - 1]
        else if i < n and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i++`}
                                    </pre>
                                </div>
                            </div>

                            {/* Complexity Analysis */}
                            <div className="p-4">
                                <div className="mb-2 text-sm font-medium text-gray-400">Complexity Analysis</div>
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                                        <li>Time Complexity: O(n + m)</li>
                                        <li>Space Complexity: O(m)</li>
                                        <li>Preprocessing Time: O(m)</li>
                                        <li>Search Time: O(n)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'explanation' && (
                    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-700 p-3">
                            <h3 className="text-base font-medium text-gray-100">Algorithm Overview</h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-4">
                                <p className="text-gray-200 text-base">
                                    The KMP algorithm optimizes pattern searching by using the pattern's own structure to minimize unnecessary comparisons:
                                </p>
                                <div className="bg-gray-800/50 rounded-md p-3">
                                    <ul className="space-y-2 text-gray-200 text-sm">
                                        <li className="flex items-center">
                                            <span className="text-blue-400 mr-2">•</span>
                                            It first builds a Longest Proper Prefix which is also Suffix (LPS) array
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-blue-400 mr-2">•</span>
                                            When a mismatch occurs, it uses the LPS array to skip redundant comparisons
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-blue-400 mr-2">•</span>
                                            The pattern itself tells us where the next possible match could begin
                                        </li>
                                        <li className="flex items-center">
                                            <span className="text-blue-400 mr-2">•</span>
                                            No backtracking in the main text is needed
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-base font-medium text-gray-100 mb-2">Key Features</h3>
                                    <div className="bg-gray-800/50 rounded-md p-3">
                                        <ul className="space-y-2 text-gray-200 text-sm">
                                            <li className="flex items-center">
                                                <span className="text-emerald-400 mr-2">•</span>
                                                Linear time complexity O(n + m)
                                            </li>
                                            <li className="flex items-center">
                                                <span className="text-emerald-400 mr-2">•</span>
                                                Preprocessing phase builds the LPS array
                                            </li>
                                            <li className="flex items-center">
                                                <span className="text-emerald-400 mr-2">•</span>
                                                Efficient for long patterns with repeating substrings
                                            </li>
                                            <li className="flex items-center">
                                                <span className="text-emerald-400 mr-2">•</span>
                                                Requires only O(m) extra space for the LPS array
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
                <KMPVisualization
                    text={text}
                    pattern={pattern}
                    speed={speed}
                    isPlaying={isPlaying}
                    onComplete={handleComplete}
                />
            </div>
        </div>
    );
}