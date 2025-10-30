'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import {
  TarjanStep,
  generateTarjanSteps,
  defaultGraphs,
  tarjanSCCConfig
} from '../app/algorithms/tarjan-scc';

interface TarjanSCCVisualizationProps {
  className?: string;
}

const ANIMATION_SPEEDS = {
  0.25: 2000,
  0.5: 1500,
  1: 1000,
  1.5: 750,
  2: 500,
  3: 300
};

export default function TarjanSCCVisualization({ className = '' }: TarjanSCCVisualizationProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  const [steps, setSteps] = useState<TarjanStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<keyof typeof ANIMATION_SPEEDS>(1);
  const [selectedGraph, setSelectedGraph] = useState<keyof typeof defaultGraphs>('simple');
  const [showSettings, setShowSettings] = useState(false);

  // Initialize with default graph
  useEffect(() => {
    const graph = defaultGraphs[selectedGraph];
    const newSteps = generateTarjanSteps(graph.nodes, graph.edges);
    setSteps(newSteps);
    setCurrentStep(0);
  }, [selectedGraph]);

  // Auto-play functionality
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

  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-lg">Loading visualization...</div>
      </div>
    );
  }

    return (
      <div className={`w-full min-h-screen pb-8 ${className}`}>
        {/* Control Panel */}
        <div className={`${isDarkMode ? 'bg-slate-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl shadow-lg border ${isDarkMode ? 'border-slate-600/30' : 'border-gray-200/30'} p-6 mb-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleStepBackward}
                disabled={currentStep === 0}
                className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105`}
              >
                <SkipBack size={20} />
              </button>
              
              <button
                onClick={handlePlay}
                className={`p-3 rounded-xl ${isDarkMode ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' : 'bg-green-100 text-green-600 hover:bg-green-200'} transition-all duration-200 hover:scale-105`}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button
                onClick={handleStepForward}
                disabled={currentStep >= steps.length - 1}
                className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105`}
              >
                <SkipForward size={20} />
              </button>
              
              <button
                onClick={handleReset}
                className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-600/20 text-slate-300 hover:bg-slate-600/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-all duration-200 hover:scale-105`}
              >
                <RotateCcw size={20} />
              </button>
            </div>
            
            {/* Speed Control */}
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Speed:</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value) as keyof typeof ANIMATION_SPEEDS)}
                className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-slate-600/50 bg-slate-700/50 text-gray-200' : 'border-gray-200/50 bg-white/50 text-gray-700'} backdrop-blur-sm transition-all`}
              >
                <option value={0.25}>Slow</option>
                <option value={1}>Normal</option>
                <option value={2}>Fast</option>
              </select>
            </div>

          {/* Progress */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Step {currentStep + 1} of {steps.length}</span>
              <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                {currentStepData.phase.toUpperCase()}
              </span>
            </div>
            <div className={`w-full ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-200/50'} rounded-full h-3 backdrop-blur-sm`}>
              <div
                className={`${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} h-3 rounded-full transition-all duration-300`}
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Graph Selection */}
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Graph:</span>
            <select
              value={selectedGraph}
              onChange={(e) => setSelectedGraph(e.target.value as keyof typeof defaultGraphs)}
              className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-slate-600/50 bg-slate-700/50 text-gray-200' : 'border-gray-200/50 bg-white/50 text-gray-700'} backdrop-blur-sm transition-all`}
            >
              <option value="simple">Simple Graph</option>
              <option value="complex">Complex Graph</option>
              <option value="cyclic">Cyclic Graph</option>
            </select>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-600/20 text-slate-300 hover:bg-slate-600/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-all duration-200 hover:scale-105`}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Speed Settings */}
        {showSettings && (
          <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-slate-600/30' : 'border-gray-200/30'}`}>
            <div className="flex items-center gap-4">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Animation Speed:</label>
              <div className="flex gap-2">
                {Object.keys(ANIMATION_SPEEDS).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(parseFloat(s) as keyof typeof ANIMATION_SPEEDS)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      speed === parseFloat(s)
                        ? isDarkMode ? 'bg-blue-500/30 text-blue-300 shadow-lg' : 'bg-blue-600 text-white shadow-lg'
                        : isDarkMode ? 'bg-slate-600/20 text-slate-300 hover:bg-slate-600/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Visualization */}
        <div className="lg:col-span-2">
          <div className={`${isDarkMode ? 'bg-slate-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl shadow-xl border ${isDarkMode ? 'border-slate-600/30' : 'border-gray-200/30'} p-6`}>
            <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Graph Visualization</h3>
            <svg
              viewBox="0 0 600 500"
              className={`w-full h-[400px] border rounded-xl transition-all ${isDarkMode ? 'border-slate-600/50 bg-slate-900/50' : 'border-gray-200/50 bg-gray-50/50'}`}
            >
              {/* Edges */}
              {currentStepData.edges.map((edge, index) => {
                const fromNode = currentStepData.nodes.find(n => n.id === edge.from);
                const toNode = currentStepData.nodes.find(n => n.id === edge.to);
                
                if (!fromNode || !toNode) return null;

                // Calculate arrow position
                const dx = toNode.x - fromNode.x;
                const dy = toNode.y - fromNode.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const unitX = dx / length;
                const unitY = dy / length;
                
                // Offset for node radius
                const offset = 25;
                const startX = fromNode.x + unitX * offset;
                const startY = fromNode.y + unitY * offset;
                const endX = toNode.x - unitX * offset;
                const endY = toNode.y - unitY * offset;

                return (
                  <g key={`edge-${index}`}>
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={
                        edge.isHighlighted
                          ? '#EF4444'
                          : edge.isTreeEdge
                          ? '#10B981'
                          : edge.isBackEdge
                          ? '#F59E0B'
                          : '#6B7280'
                      }
                      strokeWidth={edge.isHighlighted ? 3 : 2}
                      markerEnd="url(#arrowhead)"
                    />
                    
                    {/* Edge type indicator */}
                    {(edge.isTreeEdge || edge.isBackEdge) && (
                      <text
                        x={(startX + endX) / 2}
                        y={(startY + endY) / 2 - 10}
                        className="text-xs fill-current"
                        textAnchor="middle"
                      >
                        {edge.isTreeEdge ? 'T' : 'B'}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6B7280"
                  />
                </marker>
              </defs>

              {/* Nodes */}
              {currentStepData.nodes.map((node) => (
                <g key={`node-${node.id}`}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill={
                      node.sccColor || 
                      (node.isHighlighted ? '#EF4444' : 
                       node.isVisited ? '#93C5FD' : '#E5E7EB')
                    }
                    stroke={
                      node.isOnStack ? '#F59E0B' : 
                      node.isHighlighted ? '#EF4444' : '#6B7280'
                    }
                    strokeWidth={node.isOnStack ? 4 : 2}
                    className="transition-all duration-300"
                  />
                  
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="text-sm font-bold fill-current"
                  >
                    {node.label}
                  </text>
                  
                  {/* Discovery time and low-link */}
                  {node.discoveryTime !== undefined && (
                    <text
                      x={node.x}
                      y={node.y - 35}
                      textAnchor="middle"
                      className="text-xs fill-current"
                    >
                      d:{node.discoveryTime} l:{node.lowLink}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          {/* Current Step Info */}
          <div className={`${isDarkMode ? 'bg-slate-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl shadow-xl border ${isDarkMode ? 'border-slate-600/30' : 'border-gray-200/30'} p-6`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Current Step</h3>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentStepData.description}
            </p>
            
            {currentStepData.currentNode !== undefined && (
              <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-blue-50 border border-blue-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                  <span className="font-semibold">Current Node:</span> {
                    currentStepData.nodes.find(n => n.id === currentStepData.currentNode)?.label
                  }
                </p>
              </div>
            )}

            {currentStepData.lowLinkUpdates && currentStepData.lowLinkUpdates.length > 0 && (
              <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-yellow-500/20 border border-yellow-400/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>Low-link Updates:</p>
                {currentStepData.lowLinkUpdates.map((update, idx) => {
                  const node = currentStepData.nodes.find(n => n.id === update.node);
                  return (
                    <p key={idx} className={`text-xs ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      {node?.label}: {update.oldValue} → {update.newValue}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stack Visualization */}
          <div className={`${isDarkMode ? 'bg-slate-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl shadow-xl border ${isDarkMode ? 'border-slate-600/30' : 'border-gray-200/30'} p-6`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>DFS Stack</h3>
            <div className="space-y-3">
              {currentStepData.stack.length === 0 ? (
                <div className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stack is empty</div>
              ) : (
                currentStepData.stack.slice().reverse().map((nodeId, index) => {
                  const node = currentStepData.nodes.find(n => n.id === nodeId);
                  return (
                    <div
                      key={`stack-${nodeId}-${index}`}
                      className={`p-3 rounded-lg border-l-4 transition-all ${
                        index === 0
                          ? isDarkMode ? 'border-red-400 bg-red-500/20' : 'border-red-500 bg-red-50'
                          : isDarkMode ? 'border-blue-400 bg-blue-500/20' : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{node?.label}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        d:{node?.discoveryTime} l:{node?.lowLink}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SCCs Found */}
          <div className={`${isDarkMode ? 'bg-slate-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl shadow-xl border ${isDarkMode ? 'border-slate-600/30' : 'border-gray-200/30'} p-6`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Strongly Connected Components ({currentStepData.sccs.length})
            </h3>
            <div className="space-y-3">
              {currentStepData.sccs.length === 0 ? (
                <div className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No SCCs found yet</div>
              ) : (
                currentStepData.sccs.map((scc, index) => (
                  <div
                    key={`scc-${index}`}
                    className="p-4 rounded-lg border-2 transition-all"
                    style={{ 
                      backgroundColor: `${currentStepData.nodes.find(n => n.id === scc[0])?.sccColor}20`,
                      borderColor: currentStepData.nodes.find(n => n.id === scc[0])?.sccColor 
                    }}
                  >
                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>SCC {index + 1}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      [{scc.map(id => currentStepData.nodes.find(n => n.id === id)?.label).join(', ')}]
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Algorithm Stats */}
          <div className={`${isDarkMode ? 'bg-slate-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl shadow-xl border ${isDarkMode ? 'border-slate-600/30' : 'border-gray-200/30'} p-6`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Statistics</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Discovery Counter:</span>
                <span className={`font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-blue-300' : 'bg-gray-100 text-blue-600'}`}>{currentStepData.discoveryCounter}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Nodes on Stack:</span>
                <span className={`font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-green-300' : 'bg-gray-100 text-green-600'}`}>{currentStepData.stack.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>SCCs Found:</span>
                <span className={`font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-purple-300' : 'bg-gray-100 text-purple-600'}`}>{currentStepData.sccs.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Display */}
      <div className={`mt-8 ${isDarkMode ? 'bg-slate-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl shadow-xl border ${isDarkMode ? 'border-slate-600/30' : 'border-gray-200/30'} p-6`}>
        <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Algorithm Code</h3>
        <div className={`${isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50/50'} rounded-xl p-6 font-mono text-sm overflow-x-auto backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
          {tarjanSCCConfig.code.map((line, index) => (
            <div
              key={index}
              className={`transition-all duration-200 ${
                index === currentStepData.codeLineIndex
                  ? isDarkMode 
                    ? 'bg-yellow-500/20 border-l-4 border-yellow-400 -mx-3 px-3 py-1 rounded' 
                    : 'bg-yellow-100 border-l-4 border-yellow-500 -mx-3 px-3 py-1 rounded'
                  : ''
              } ${line.trim() === '' ? 'h-4' : ''}`}
            >
              <span className={`mr-4 select-none ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
                {line || ' '}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}