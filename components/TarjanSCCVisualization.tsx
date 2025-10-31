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
  const [activeTab, setActiveTab] = useState<'controls' | 'pseudocode' | 'info'>('controls');

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
    <div className="flex h-full gap-4 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        <div
          className={`flex-1 overflow-auto rounded-2xl m-4 ${
            isDarkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-white/30 border border-gray-200/30'
          } backdrop-blur-sm flex items-center justify-center`}
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

      <div className="w-[30rem] flex flex-col min-h-0 overflow-hidden">
        <div
          className={`flex rounded-t-2xl flex-shrink-0 ${
            isDarkMode
              ? 'bg-slate-800/50 border-b border-slate-700/50'
              : 'bg-white/50 border-b border-gray-200/50'
          } backdrop-blur-sm`}
        >
          {[
            { id: 'controls', label: 'Controls', icon: '⚙️' },
            { id: 'pseudocode', label: 'Algorithm', icon: '📜' },
            { id: 'info', label: 'Info', icon: '📊' },
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

        <div
          className={`flex-1 overflow-y-auto rounded-b-2xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-l border-r border-b border-slate-600/30'
              : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-l border-r border-b border-gray-200/30'
          } backdrop-blur-sm shadow-lg`}
        >
          <div className="p-5">
            {activeTab === 'controls' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Controls
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStepBackward}
                    disabled={currentStep === 0}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'
                    } disabled:opacity-50`}
                  >
                    <SkipBack size={18} />
                  </button>
                  <button
                    onClick={handlePlay}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    onClick={handleStepForward}
                    disabled={currentStep >= steps.length - 1}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'
                    } disabled:opacity-50`}
                  >
                    <SkipForward size={18} />
                  </button>
                  <button
                    onClick={handleReset}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-slate-600/20 text-slate-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>

                <div>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Step {currentStep + 1} / {steps.length}
                  </p>
                  <div className={`w-full ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-2`}>
                    <div
                      className={`${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} h-2 rounded-full`}
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`text-sm font-medium block mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Speed
                  </label>
                  <select
                    value={speed}
                    onChange={(e) =>
                      setSpeed(Number(e.target.value) as keyof typeof ANIMATION_SPEEDS)
                    }
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      isDarkMode
                        ? 'border-slate-600 bg-slate-700 text-gray-200'
                        : 'border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    <option value={0.25}>Slow (0.25x)</option>
                    <option value={1}>Normal (1x)</option>
                    <option value={2}>Fast (2x)</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`text-sm font-medium block mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Graph
                  </label>
                  <select
                    value={selectedGraph}
                    onChange={(e) =>
                      setSelectedGraph(e.target.value as keyof typeof defaultGraphs)
                    }
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${
                      isDarkMode
                        ? 'border-slate-600 bg-slate-700 text-gray-200'
                        : 'border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    <option value="simple">Simple</option>
                    <option value="complex">Complex</option>
                    <option value="cyclic">Cyclic</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'pseudocode' && (
              <div className="space-y-3">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Algorithm
                </h3>
                <div
                  className={`p-4 rounded-lg font-mono text-xs overflow-x-auto ${
                    isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50/50'
                  }`}
                >
                  {tarjanSCCConfig.code.map((line, idx) => (
                    <div
                      key={idx}
                      className={`py-1 ${
                        idx === currentStepData.codeLineIndex
                          ? isDarkMode
                            ? 'bg-yellow-500/20'
                            : 'bg-yellow-100'
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
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Current Step
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {currentStepData.description}
                </p>

                <div className="pt-4 border-t border-slate-600/30">
                  <h4
                    className={`text-sm font-semibold mb-3 ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-800'
                    }`}
                  >
                    Statistics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Discovery Counter:
                      </span>
                      <span className={`font-mono ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                        {currentStepData.discoveryCounter}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Stack Size:
                      </span>
                      <span className={`font-mono ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                        {currentStepData.stack.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        SCCs Found:
                      </span>
                      <span className={`font-mono ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                        {currentStepData.sccs.length}
                      </span>
                    </div>
                  </div>
                </div>

                {currentStepData.sccs.length > 0 && (
                  <div className="pt-4 border-t border-slate-600/30">
                    <h4
                      className={`text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-slate-200' : 'text-gray-800'
                      }`}
                    >
                      SCCs Found
                    </h4>
                    <div className="space-y-2">
                      {currentStepData.sccs.map((scc, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded text-sm ${
                            isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                          }`}
                        >
                          [
                          {scc
                            .map((id) => currentStepData.nodes.find((n) => n.id === id)?.label)
                            .join(', ')}
                          ]
                        </div>
                      ))}
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
