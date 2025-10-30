'use client';

import { useState, useEffect } from 'react';
import { KMPStep, LPSStep, computeLPSArray, kmpSearch } from '../app/algorithms/kmp';
import { useTheme } from '../contexts/ThemeContext';

interface KMPVisualizationProps {
    text: string;
    pattern: string;
    speed: number;
    isPlaying: boolean;
    onComplete?: () => void;
}

const KMPVisualization: React.FC<KMPVisualizationProps> = ({
    text,
    pattern,
    speed,
    isPlaying,
    onComplete
}) => {
    const { theme } = useTheme();
    const [currentStep, setCurrentStep] = useState(0);
    const [showLPSConstruction, setShowLPSConstruction] = useState(false);
    const [searchSteps, setSearchSteps] = useState<KMPStep[]>([]);
    const [lpsSteps, setLpsSteps] = useState<LPSStep[]>([]);

    useEffect(() => {
        const { steps: lps } = computeLPSArray(pattern);
        const { steps: search } = kmpSearch(text, pattern);
        setLpsSteps(lps);
        setSearchSteps(search);
        setCurrentStep(0);
    }, [text, pattern]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying) {
            timer = setInterval(() => {
                const steps = showLPSConstruction ? lpsSteps : searchSteps;
                if (currentStep >= steps.length - 1) {
                    if (onComplete) {
                        onComplete();
                    }
                    clearInterval(timer);
                } else {
                    setCurrentStep(currentStep + 1);
                }
            }, 1000 / speed);
        }
        return () => clearInterval(timer);
    }, [isPlaying, speed, showLPSConstruction, searchSteps, lpsSteps, currentStep, onComplete]);

    const renderLPSConstruction = () => {
        if (!lpsSteps.length || currentStep >= lpsSteps.length) return null;
        const step = lpsSteps[currentStep];

        return (
            <div className="flex flex-col gap-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">LPS Table Construction</h3>
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">Pattern:</span>
                            {step.pattern.split('').map((char, idx) => (
                                <div
                                    key={idx}
                                    className={`w-10 h-10 flex items-center justify-center text-lg font-medium rounded-md transition-all duration-200
                                        ${idx === step.index 
                                            ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700 dark:bg-indigo-900 dark:border-indigo-400 dark:text-indigo-300' 
                                            : 'bg-gray-50 border border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                                        }`}
                                >
                                    {char}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">LPS Values:</span>
                            {step.lpsArray.map((value, idx) => (
                                <div
                                    key={idx}
                                    className={`w-10 h-10 flex items-center justify-center text-lg font-medium rounded-md transition-all duration-200
                                        ${idx === step.index 
                                            ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700 dark:bg-indigo-900 dark:border-indigo-400 dark:text-indigo-300'
                                            : 'bg-gray-50 border border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                                        }`}
                                >
                                    {value}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPatternSearch = () => {
        if (!searchSteps.length || currentStep >= searchSteps.length) return null;
        const step = searchSteps[currentStep];

        return (
            <div className="flex flex-col gap-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Pattern Search</h3>
                <div className="grid grid-cols-1 gap-6">
                    {/* Text visualization */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">Text:</span>
                            <div className="flex flex-wrap gap-2">
                                {step.text.split('').map((char, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-10 h-10 flex items-center justify-center text-lg font-medium rounded-md transition-all duration-200 
                                            ${idx === step.textIndex
                                                ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-700 dark:bg-emerald-900 dark:border-emerald-400 dark:text-emerald-300'
                                                : 'bg-gray-50 border border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                                            }`}
                                    >
                                        {char}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Pattern visualization */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">Pattern:</span>
                            <div 
                                className="flex flex-wrap gap-2 transition-all duration-300 ease-in-out" 
                                style={{ marginLeft: `${(step.textIndex - step.patternIndex) * 2.75}rem` }}
                            >
                                {step.pattern.split('').map((char, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-10 h-10 flex items-center justify-center text-lg font-medium rounded-md transition-all duration-200
                                            ${idx === step.patternIndex
                                                ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700 dark:bg-indigo-900 dark:border-indigo-400 dark:text-indigo-300'
                                                : step.isMatch
                                                    ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-600 dark:bg-emerald-900/50 dark:border-emerald-500 dark:text-emerald-300'
                                                    : 'bg-gray-50 border border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                                            }`}
                                    >
                                        {char}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LPS Array visualization */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">LPS Array:</span>
                            <div className="flex flex-wrap gap-2">
                                {step.lpsArray.map((value, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-10 h-10 flex items-center justify-center text-lg font-medium rounded-md transition-all duration-200
                                            bg-gray-50 border border-gray-200 text-gray-700
                                            dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300`}
                                    >
                                        {value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 px-4">
                <button
                    className={`px-6 py-2.5 text-sm font-semibold transition-all duration-200 rounded-md shadow-sm
                        ${showLPSConstruction 
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 ring-2 ring-indigo-500 dark:ring-indigo-400' 
                            : 'bg-indigo-600 text-white dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600'}`}
                    onClick={() => setShowLPSConstruction(!showLPSConstruction)}
                >
                    {showLPSConstruction ? 'Show Pattern Search' : 'Show LPS Construction'}
                </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-lg p-6 transition-all duration-300 ease-in-out">
                <div className="backdrop-blur-sm">
                    {showLPSConstruction ? renderLPSConstruction() : renderPatternSearch()}
                </div>
            </div>
        </div>
    );
};

export default KMPVisualization;