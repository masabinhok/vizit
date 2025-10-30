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
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';
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
        if (!lpsSteps.length) return (
            <div className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                No LPS construction steps available
            </div>
        );
        
        const actualStep = Math.min(currentStep, lpsSteps.length - 1);
        const step = lpsSteps[actualStep];

        return (
            <div className="flex flex-col gap-6">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    LPS Table Construction
                </h3>
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className={`text-sm font-medium w-24 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
                                Pattern:
                            </span>
                            {step.pattern.split('').map((char, idx) => (
                                <div
                                    key={idx}
                                    className={`w-10 h-10 flex items-center justify-center text-lg font-bold rounded-lg transition-all duration-200 shadow-sm
                                        ${idx === step.index 
                                            ? isDarkMode
                                                ? 'bg-indigo-600 border-2 border-indigo-400 text-white'
                                                : 'bg-indigo-500 border-2 border-indigo-600 text-white'
                                            : isDarkMode
                                                ? 'bg-slate-700 border-2 border-slate-600 text-slate-200'
                                                : 'bg-slate-600 border-2 border-slate-500 text-white'
                                        }`}
                                >
                                    {char}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className={`text-sm font-medium w-24 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
                                LPS Values:
                            </span>
                            {step.lpsArray.map((value, idx) => (
                                <div
                                    key={idx}
                                    className={`w-10 h-10 flex items-center justify-center text-lg font-bold rounded-lg transition-all duration-200 shadow-sm
                                        ${idx === step.index 
                                            ? isDarkMode
                                                ? 'bg-indigo-600 border-2 border-indigo-400 text-white'
                                                : 'bg-indigo-500 border-2 border-indigo-600 text-white'
                                            : isDarkMode
                                                ? 'bg-slate-700 border-2 border-slate-600 text-slate-200'
                                                : 'bg-slate-600 border-2 border-slate-500 text-white'
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
        if (!searchSteps.length) return (
            <div className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                No search steps available
            </div>
        );
        
        const actualStep = Math.min(currentStep, searchSteps.length - 1);
        const step = searchSteps[actualStep];

        return (
            <div className="flex flex-col gap-6">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Pattern Search
                </h3>
                <div className="grid grid-cols-1 gap-6">
                    {/* Text visualization */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className={`text-sm font-medium w-24 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
                                Text:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {step.text.split('').map((char, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-10 h-10 flex items-center justify-center text-lg font-bold rounded-lg transition-all duration-200 shadow-sm
                                            ${idx === step.textIndex
                                                ? isDarkMode
                                                    ? 'bg-emerald-600 border-2 border-emerald-400 text-white'
                                                    : 'bg-emerald-500 border-2 border-emerald-600 text-white'
                                                : isDarkMode
                                                    ? 'bg-slate-700 border-2 border-slate-600 text-slate-200'
                                                    : 'bg-slate-600 border-2 border-slate-500 text-white'
                                            }`}
                                    >
                                        {char}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Pattern visualization */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className={`text-sm font-medium w-24 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
                                Pattern:
                            </span>
                            <div 
                                className="flex flex-wrap gap-2 transition-all duration-300 ease-in-out" 
                                style={{ marginLeft: `${(step.textIndex - step.patternIndex) * 2.75}rem` }}
                            >
                                {step.pattern.split('').map((char, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-10 h-10 flex items-center justify-center text-lg font-bold rounded-lg transition-all duration-200 shadow-sm
                                            ${idx === step.patternIndex
                                                ? isDarkMode
                                                    ? 'bg-indigo-600 border-2 border-indigo-400 text-white'
                                                    : 'bg-indigo-500 border-2 border-indigo-600 text-white'
                                                : step.isMatch
                                                    ? isDarkMode
                                                        ? 'bg-emerald-700 border-2 border-emerald-500 text-white'
                                                        : 'bg-emerald-400 border-2 border-emerald-500 text-white'
                                                    : isDarkMode
                                                        ? 'bg-slate-700 border-2 border-slate-600 text-slate-200'
                                                        : 'bg-slate-600 border-2 border-slate-500 text-white'
                                            }`}
                                    >
                                        {char}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LPS Array visualization */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className={`text-sm font-medium w-24 ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}>
                                LPS Array:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {step.lpsArray.map((value, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-10 h-10 flex items-center justify-center text-lg font-bold rounded-lg transition-all duration-200 shadow-sm ${
                                            isDarkMode
                                                ? 'bg-slate-700 border-2 border-slate-600 text-slate-200'
                                                : 'bg-slate-600 border-2 border-slate-500 text-white'
                                        }`}
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
                    className={`px-6 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg shadow-md
                        ${showLPSConstruction 
                            ? isDarkMode
                                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' 
                                : 'bg-indigo-500 text-white ring-2 ring-indigo-600'
                            : isDarkMode
                                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                                : 'bg-slate-600 text-white hover:bg-slate-700'
                        }`}
                    onClick={() => {
                        setShowLPSConstruction(!showLPSConstruction);
                        setCurrentStep(0); // Reset to beginning when switching views
                    }}
                >
                    {showLPSConstruction ? 'Show Pattern Search' : 'Show LPS Construction'}
                </button>
            </div>
            <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
                isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white/90 border border-gray-200'
            }`}>
                <div className="backdrop-blur-sm">
                    {showLPSConstruction ? renderLPSConstruction() : renderPatternSearch()}
                </div>
            </div>
        </div>
    );
};

export default KMPVisualization;