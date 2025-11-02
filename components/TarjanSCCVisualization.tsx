'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TarjanStep, generateTarjanSteps, defaultGraphs, tarjanSCCConfig } from '../app/algorithms/tarjan-scc';

interface TarjanSCCVisualizationProps {
  className?: string;
}

const ANIMATION_SPEEDS = {
  0.25: 2000,
  0.5: 1500,
  1: 1000,
  1.5: 750,
  2: 500,
  3: 300,
};

export default function TarjanSCCVisualization({ className = '' }: TarjanSCCVisualizationProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const [steps, setSteps] = useState<TarjanStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<keyof typeof ANIMATION_SPEEDS>(1);
  const [selectedGraph, setSelectedGraph] = useState<keyof typeof defaultGraphs>('simple');
  const [activeTab, setActiveTab] = useState<'pseudocode' | 'info'>('pseudocode');

  useEffect(() => {
    const graph = defaultGraphs[selectedGraph];
    const newSteps = generateTarjanSteps(graph.nodes, graph.edges);
    setSteps(newSteps);
    setCurrentStep(0);
  }, [selectedGraph]);

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, ANIMATION_SPEEDS[speed]);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlay = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentStep, steps.length]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    setIsPlaying(false);
  }, [steps.length]);

  const handleStepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setIsPlaying(false);
  }, []);

  const currentStepData = steps[currentStep] || steps[0];

  if (!currentStepData) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-lg">Loading visualization...</div>
      </div>
    );
  }

  return (
    <div className={`flex h-full flex-col overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="flex flex-1 gap-3 min-h-0 overflow-hidden px-3 pt-3">
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          <div
            className={`flex-1 overflow-auto rounded-2xl ${
              isDarkMode 
                ? 'bg-slate-800/10 border border-slate-600/20' 
                : 'bg-white/60 border border-gray-200/30'
            } backdrop-blur-sm flex items-center justify-center shadow-lg`}
          >
            <svg viewBox="0 0 600 500" className="w-full h-full" style={{ maxHeight: '500px' }}>
              {currentStepData.edges.map((edge, idx) => {
                const fromNode = currentStepData.nodes.find((n) => n.id === edge.from);
                const toNode = currentStepData.nodes.find((n) => n.id === edge.to);

                if (!fromNode || !toNode) return null;

                const dx = toNode.x - fromNode.x;
                const dy = toNode.y - fromNode.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const unitX = length > 0 ? dx / length : 0;
                const unitY = length > 0 ? dy / length : 0;

                const offset = 25;
                const startX = fromNode.x + unitX * offset;
                const startY = fromNode.y + unitY * offset;
                const endX = toNode.x - unitX * offset;
                const endY = toNode.y - unitY * offset;

                return (
                  <g key={`edge-${idx}`}>
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={edge.isHighlighted ? '#EF4444' : '#9CA3AF'}
                      strokeWidth={edge.isHighlighted ? 3 : 2}
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                );
              })}

              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
                </marker>
              </defs>

              {currentStepData.nodes.map((node) => (
                <g key={`node-${node.id}`}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill={node.isOnStack ? '#EF4444' : node.isVisited ? '#10B981' : '#60A5FA'}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dy="0.3em"
                    className="font-bold text-white text-sm"
                  >
                    {node.label}
                  </text>
                  {node.discoveryTime !== undefined && (
                    <text
                      x={node.x}
                      y={node.y - 35}
                      textAnchor="middle"
                      className={`text-xs ${isDarkMode ? 'fill-gray-300' : 'fill-gray-700'}`}
                    >
                      d:{node.discoveryTime} l:{node.lowLink}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="w-[32rem] flex flex-col min-h-0">
          <div
            className={`flex-1 rounded-2xl overflow-hidden flex flex-col ${
              isDarkMode
                ? 'bg-slate-800/10 border border-slate-600/20'
                : 'bg-white/60 border border-gray-200/30'
            } backdrop-blur-sm shadow-lg`}
          >
            <div
              className={`flex flex-shrink-0 ${
                isDarkMode
                  ? 'bg-slate-800/10 border-b border-slate-600/20'
                  : 'bg-white/40 border-b border-gray-200/30'
              } backdrop-blur-sm`}
            >
              {[
                { id: 'pseudocode', label: 'Algorithm', icon: '📜' },
                { id: 'info', label: 'Info', icon: '📊' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? isDarkMode
                        ? 'bg-slate-600/60 text-blue-300 border-b-2 border-blue-400 shadow-lg'
                        : 'bg-gray-100/80 text-blue-600 border-b-2 border-blue-500 shadow'
                      : isDarkMode
                        ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/30'
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'pseudocode' && (
                <div className="space-y-3">
                  <h4 className={`text-sm font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Algorithm
                  </h4>
                  <div
                    className={`font-mono text-xs overflow-x-auto ${
                      isDarkMode ? 'bg-slate-800/20' : 'bg-gray-100/60'
                    } p-3 rounded-lg border ${isDarkMode ? 'border-slate-600/20' : 'border-gray-200/40'}`}
                  >
                    {tarjanSCCConfig.code.map((line, idx) => (
                      <div
                        key={idx}
                        className={`py-1 px-2 rounded transition-colors ${
                          idx === currentStepData.codeLineIndex
                            ? isDarkMode
                              ? 'bg-yellow-500/30 text-yellow-200'
                              : 'bg-yellow-200/50 text-yellow-900'
                            : ''
                        }`}
                      >
                        <span
                          className={`mr-2 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}
                        >
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'info' && (
                <div className="space-y-2">
                  <h4 className={`text-sm font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                    Current Step
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentStepData.description}
                  </p>
                  <div className={`border-t ${isDarkMode ? 'border-slate-600/40' : 'border-gray-200/40'} pt-2 mt-2`}>
                    <div className="text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Discovery Counter:</span>
                        <span className={`font-mono font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                          {currentStepData.discoveryCounter}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Stack Size:</span>
                        <span className={`font-mono font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                          {currentStepData.stack.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>SCCs Found:</span>
                        <span className={`font-mono font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                          {currentStepData.sccs.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`flex-shrink-0 flex items-center justify-between gap-4 px-4 py-3 mx-3 mt-3 mb-3 rounded-2xl ${
          isDarkMode
            ? 'bg-slate-800/10 border border-slate-600/20'
            : 'bg-white/60 border border-gray-200/30'
        } backdrop-blur-sm shadow-lg`}
      >
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStepBackward}
            disabled={currentStep === 0}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'bg-blue-500/30 text-blue-300 hover:bg-blue-500/50 disabled:bg-blue-500/10 disabled:text-blue-500/50' 
                : 'bg-blue-200/50 text-blue-700 hover:bg-blue-200/70 disabled:bg-blue-200/20 disabled:text-blue-400'
            } disabled:cursor-not-allowed`}
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={handlePlay}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'bg-green-500/30 text-green-300 hover:bg-green-500/50' 
                : 'bg-green-200/50 text-green-700 hover:bg-green-200/70'
            }`}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={handleStepForward}
            disabled={currentStep >= steps.length - 1}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'bg-blue-500/30 text-blue-300 hover:bg-blue-500/50 disabled:bg-blue-500/10 disabled:text-blue-500/50' 
                : 'bg-blue-200/50 text-blue-700 hover:bg-blue-200/70 disabled:bg-blue-200/20 disabled:text-blue-400'
            } disabled:cursor-not-allowed`}
          >
            <SkipForward size={18} />
          </button>
          <button
            onClick={handleReset}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'bg-slate-600/30 text-slate-300 hover:bg-slate-600/50' 
                : 'bg-gray-200/50 text-gray-700 hover:bg-gray-200/70'
            }`}
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center gap-3 max-w-xs">
          <div className={`w-full ${isDarkMode ? 'bg-slate-700/20' : 'bg-gray-300/30'} rounded-full h-2.5`}>
            <div
              className={`${isDarkMode ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'} h-2.5 rounded-full transition-all duration-300`}
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className={`text-sm font-semibold font-mono ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            {currentStep + 1}/{steps.length}
          </span>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <label className={`text-sm font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Speed
          </label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value) as keyof typeof ANIMATION_SPEEDS)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              isDarkMode
                ? 'border-slate-600/40 bg-slate-700/30 text-gray-200 hover:bg-slate-700/50'
                : 'border-gray-300/40 bg-white/30 text-gray-700 hover:bg-white/50'
            }`}
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
            <option value={3}>3x</option>
          </select>
        </div>

        {/* Graph Selection */}
        <div className="flex items-center gap-2">
          <label className={`text-sm font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Graph
          </label>
          <select
            value={selectedGraph}
            onChange={(e) => setSelectedGraph(e.target.value as keyof typeof defaultGraphs)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              isDarkMode
                ? 'border-slate-600/40 bg-slate-700/30 text-gray-200 hover:bg-slate-700/50'
                : 'border-gray-300/40 bg-white/30 text-gray-700 hover:bg-white/50'
            }`}
          >
            <option value="simple">Simple</option>
            <option value="complex">Complex</option>
            <option value="cyclic">Cyclic</option>
          </select>
        </div>
      </div>
    </div>
  );
}
