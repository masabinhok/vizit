'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import VisualizationCanvas from '../../../components/VisualizationCanvas';
import ControlBar from '../../../components/ControlBar';
import InfoPanel from '../../../components/InfoPanel';
import { getAlgorithmConfig } from '../../../constants/registry';
import { AlgorithmStep, AlgorithmConfig } from '../../../types';

export default function AlgorithmPage() {
  const params = useParams();
  const algorithmId = params.id as string;
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [algorithmConfig, setAlgorithmConfig] = useState<AlgorithmConfig | undefined>();
  
  // Visualization state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputArray, setInputArray] = useState('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load algorithm configuration
  useEffect(() => {
    const config = getAlgorithmConfig(algorithmId);
    if (config) {
      setAlgorithmConfig(config);
      setInputArray(config.defaultInput);
      // Auto-initialize for the first load
      setTimeout(() => initializeAlgorithm(config), 100);
    }
  }, [algorithmId]);

  // Animation control
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

  const initializeAlgorithm = (config?: AlgorithmConfig) => {
    const activeConfig = config || algorithmConfig;
    if (!activeConfig) return;

    try {
      // Use current inputArray or fallback to default
      const arrayToProcess = inputArray.trim() || activeConfig.defaultInput;
      const numbers = arrayToProcess.split(',')
        .map(n => n.trim())
        .filter(n => n.length > 0)
        .map(n => parseInt(n))
        .filter(n => !isNaN(n) && isFinite(n));
      
      if (numbers.length === 0) {
        alert("Please enter valid numbers separated by commas");
        return;
      }
      
      if (numbers.length > 20) {
        alert("Please enter no more than 20 numbers for better visualization");
        return;
      }
      
      const newSteps = activeConfig.generateSteps(numbers);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsInitialized(true);
      setIsPlaying(false);
    } catch (error) {
      console.error("Algorithm initialization error:", error);
      alert("Invalid input format. Please use numbers separated by commas (e.g., 64,34,25,12).");
    }
  };

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

  const currentStepData = steps[currentStep];

  if (!algorithmConfig) {
    return (
      <div className={`min-h-screen flex ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Sidebar 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode}
          currentAlgorithm={algorithmId}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <h1 className="text-2xl font-bold mb-2">Algorithm Not Found</h1>
            <p className="text-gray-500">The requested algorithm "{algorithmId}" is not yet implemented.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode}
        currentAlgorithm={algorithmId}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-sm border-b border-gray-200 dark:border-gray-700 p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{algorithmConfig.name} Visualization</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{algorithmConfig.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Time: {algorithmConfig.timeComplexity.average}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Space: {algorithmConfig.spaceComplexity}
              </span>
            </div>
          </div>
        </header>

        {/* Canvas Area */}
        <section className="flex-1 flex">
          {/* Main Visualization Canvas */}
          <div className="flex-1 flex flex-col">
            <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} relative overflow-hidden p-8`}>
              <VisualizationCanvas
                currentStep={currentStepData}
                steps={steps}
                isDarkMode={isDarkMode}
                isInitialized={isInitialized}
              />
            </div>

            <ControlBar
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              speed={speed}
              setSpeed={setSpeed}
              inputArray={inputArray}
              setInputArray={setInputArray}
              currentStep={currentStep}
              totalSteps={steps.length}
              isInitialized={isInitialized}
              onInitialize={() => initializeAlgorithm()}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onReset={reset}
              isDarkMode={isDarkMode}
            />
          </div>

          <InfoPanel
            algorithmConfig={algorithmConfig}
            currentStep={currentStepData}
            steps={steps}
            currentStepIndex={currentStep}
            isDarkMode={isDarkMode}
          />
        </section>
      </main>
    </div>
  );
}