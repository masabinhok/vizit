'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

type NodeId = number;
interface GraphNode {
  id: NodeId;
  neighbors: NodeId[];
}

interface BFSNodeState {
  id: NodeId;
  status: 'unvisited' | 'queued' | 'visiting' | 'visited';
  distance: number | null;
}

interface QueueElement {
  id: number;
  value: NodeId;
  isAnimating?: boolean;
  operation?: 'enqueue' | 'dequeue';
}

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

// Fixed sample graph
const SAMPLE_GRAPH: Record<NodeId, GraphNode> = {
  0: { id: 0, neighbors: [1, 2] },
  1: { id: 1, neighbors: [0, 3, 4] },
  2: { id: 2, neighbors: [0, 5] },
  3: { id: 3, neighbors: [1] },
  4: { id: 4, neighbors: [1, 6] },
  5: { id: 5, neighbors: [2] },
  6: { id: 6, neighbors: [4] },
};

const NODE_POSITIONS: Record<NodeId, { x: number; y: number }> = {
  // Level 0
  0: { x: 50, y: 10 },

  // Level 1
  1: { x: 35, y: 25 },
  2: { x: 65, y: 25 },

  // Level 2
  3: { x: 25, y: 40 },
  4: { x: 45, y: 40 },
  5: { x: 65, y: 40 },

  // Level 3
  6: { x: 45, y: 55 },
};

export default function BFSVisualization() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const canvasRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<Record<NodeId, BFSNodeState>>(() => {
    const initial: Record<NodeId, BFSNodeState> = {};
    Object.keys(SAMPLE_GRAPH).forEach(id => {
      initial[Number(id)] = { id: Number(id), status: 'unvisited', distance: null };
    });
    return initial;
  });

  const [bfsQueue, setBfsQueue] = useState<QueueElement[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [parentMap, setParentMap] = useState<Record<NodeId, NodeId | null>>({});
  const [message, setMessage] = useState<Message | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'controls' | 'pseudocode' | 'explanation' | 'history' | 'result'>('controls');
  const [animationSpeed, setAnimationSpeed] = useState(800); // ms per step
  const [stats, setStats] = useState({
    visitedCount: 0,
    queueMaxLength: 0,
    steps: 0,
  });

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const addToHistory = (msg: string) => {
    setHistory(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
    setStats(prev => ({ ...prev, steps: prev.steps + 1 }));
  };

  const resetGraph = () => {
    const resetNodes: Record<NodeId, BFSNodeState> = {};
    Object.keys(SAMPLE_GRAPH).forEach(id => {
      resetNodes[Number(id)] = { id: Number(id), status: 'unvisited', distance: null };
    });
    setNodes(resetNodes);
    setBfsQueue([]);
    setIsRunning(false);
    setIsPaused(false);
    setParentMap({ 0: null });
    setHistory([]);
    setStats({ visitedCount: 0, queueMaxLength: 0, steps: 0 });
    showMessage('Graph reset', 'info');
  };

  const startBFS = () => {
    if (isRunning) {
      showMessage('BFS already running', 'error');
      return;
    }
    resetGraph();
    setIsRunning(true);
    setIsPaused(false);

    const startNode = 0;
    setParentMap({ [startNode]: null });
    setNodes(prev => ({
      ...prev,
      [startNode]: { ...prev[startNode], status: 'queued', distance: 0 }
    }));
    setBfsQueue([{ id: Date.now(), value: startNode, operation: 'enqueue' }]);
    addToHistory(`Started BFS from node ${startNode}`);
    setStats(prev => ({ ...prev, queueMaxLength: 1 }));
  };

  const stepBFS = useCallback(() => {
    if (bfsQueue.length === 0) {
      const queued = Object.values(nodes).find(n => n.status === 'queued');
      if (queued) {
        setBfsQueue([{ id: Date.now(), value: queued.id, operation: 'enqueue' }]);
        return;
      }
      if (isRunning) {
        showMessage('BFS completed!', 'success');
        setIsRunning(false);
        setIsPaused(false);
      }
      return;
    }

    const current = bfsQueue[0];
    const nodeId = current.value;

    setNodes(prev => ({ ...prev, [nodeId]: { ...prev[nodeId], status: 'visiting' } }));

    setTimeout(() => {
      // Dequeue
      const newQueue = bfsQueue.slice(1);
      setBfsQueue(newQueue);

      // Mark as visited
      setNodes(prev => {
        const updated = { ...prev };
        updated[nodeId] = { ...updated[nodeId], status: 'visited' };
        return updated;
      });

      setStats(prev => ({ ...prev, visitedCount: prev.visitedCount + 1 }));

      // Enqueue unvisited neighbors
      const currentNode = SAMPLE_GRAPH[nodeId];
      const updatedNodes = { ...nodes };
      updatedNodes[nodeId] = { ...updatedNodes[nodeId], status: 'visited' };

      const newEnqueues: QueueElement[] = [];
      currentNode.neighbors.forEach(neighborId => {
        if (updatedNodes[neighborId].status === 'unvisited') {
          updatedNodes[neighborId] = {
            ...updatedNodes[neighborId],
            status: 'queued',
            distance: (updatedNodes[nodeId].distance ?? 0) + 1
          };
          setParentMap(prev => ({ ...prev, [neighborId]: nodeId }));
          newEnqueues.push({
            id: Date.now() + newEnqueues.length,
            value: neighborId,
            operation: 'enqueue'
          });
          addToHistory(`Enqueued neighbor ${neighborId} from ${nodeId}`);
        }
      });

      setNodes(updatedNodes);
      if (newEnqueues.length > 0) {
        const nextQueue = [...bfsQueue.slice(1), ...newEnqueues];
        setBfsQueue(nextQueue);
        if (nextQueue.length > stats.queueMaxLength) {
          setStats(prev => ({ ...prev, queueMaxLength: nextQueue.length }));
        }
      }

      addToHistory(`Visited node ${nodeId} (distance: ${updatedNodes[nodeId].distance})`);
    }, 300);
  }, [bfsQueue, nodes, isRunning, stats.queueMaxLength]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        stepBFS();
      }, animationSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, animationSpeed, stepBFS]);

  // render graph
  const renderGraph = () => {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid meet"
        className="min-h-full"
      >
        {/* Edges: render all connections */}
        {Object.values(SAMPLE_GRAPH).flatMap(node =>
          node.neighbors.map(neighborId => {
            const p1 = NODE_POSITIONS[node.id];
            const p2 = NODE_POSITIONS[neighborId];
            // Optional: avoid duplicate lines by only drawing once
            if (node.id < neighborId) {
              return (
                <line
                  key={`${node.id}-${neighborId}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isDarkMode ? '#94a3b8' : '#9ca3af'}
                  strokeWidth="0.4"
                  strokeDasharray="0.8,0.8"
                />
              );
            }
            return null;
          })
        )}

        {/* Nodes */}
        {Object.values(nodes).map(node => {
          const pos = NODE_POSITIONS[node.id];
          const width = 10;
          const height = 6;
          const radius = 1.5;

          let fill = '';
          let stroke = '';
          let textColor = '';

          if (node.status === 'visited') {
            fill = isDarkMode ? '#059669' : '#10b981';
            stroke = isDarkMode ? '#065f46' : '#059669';
            textColor = '#ffffff';
          } else if (node.status === 'visiting') {
            fill = isDarkMode ? '#2563eb' : '#3b82f6';
            stroke = isDarkMode ? '#1d4ed8' : '#2563eb';
            textColor = '#ffffff';
          } else if (node.status === 'queued') {
            fill = isDarkMode ? '#d97706' : '#f59e0b';
            stroke = isDarkMode ? '#b45309' : '#d97706';
            textColor = '#ffffff';
          } else {
            fill = isDarkMode ? '#334155' : '#e5e7eb';
            stroke = isDarkMode ? '#475569' : '#d1d5db';
            textColor = isDarkMode ? '#cbd5e1' : '#374151';
          }

          const label = node.distance !== null && node.status !== 'unvisited'
            ? `${node.id}(${node.distance})`
            : String(node.id);

          return (
            <g key={node.id}>
              <rect
                x={pos.x - width / 2}
                y={pos.y - height / 2}
                width={width}
                height={height}
                rx={radius}
                ry={radius}
                fill={fill}
                stroke={stroke}
                strokeWidth="0.5"
                className={node.status === 'visiting' ? 'animate-pulse' : ''}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[2px] font-bold"
                fill={textColor}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        {message && (
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg backdrop-blur-sm ${message.type === 'success'
              ? `${isDarkMode ? 'bg-green-900/90 text-green-300 border border-green-700/50' : 'bg-green-100/95 text-green-700 border border-green-300/50'}`
              : message.type === 'error'
                ? `${isDarkMode ? 'bg-red-900/90 text-red-300 border border-red-700/50' : 'bg-red-100/95 text-red-700 border border-red-300/50'}`
                : `${isDarkMode ? 'bg-blue-900/90 text-blue-300 border border-blue-700/50' : 'bg-blue-100/95 text-blue-700 border border-blue-300/50'}`
            }`}>
            {message.text}
          </div>
        )}

        <div
          ref={canvasRef}
          className={`flex-1 overflow-auto rounded-2xl ${isDarkMode
              ? 'bg-slate-800/30 border border-slate-700/30'
              : 'bg-white/30 border border-gray-200/30'
            } backdrop-blur-sm flex items-center justify-center`}
        >
          {renderGraph()}
        </div>
      </div>

      <div className="w-[30rem] flex flex-col min-h-0 overflow-hidden">
        <div
          className={`flex rounded-t-2xl flex-shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-b border-slate-700/50' : 'bg-white/50 border-b border-gray-200/50'
            } backdrop-blur-sm`}
        >
          {[
            { id: 'controls', label: 'Controls', icon: '⚙️' },
            { id: 'pseudocode', label: 'Algorithm', icon: '📜' },
            { id: 'explanation', label: 'Concept', icon: '🧠' },
            { id: 'history', label: 'Trace', icon: '📊' },
            { id: 'result', label: 'Result', icon: '✅' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-3 py-3 text-sm font-medium rounded-t-xl transition-all duration-200 ${activeTab === tab.id
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

        {/* Tab Content */}
        <div
          className={`flex-1 overflow-y-auto rounded-b-2xl ${isDarkMode
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-l border-r border-b border-slate-600/30'
              : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-l border-r border-b border-gray-200/30'
            } backdrop-blur-sm shadow-lg`}
        >
          <div className="p-5">
            {activeTab === 'controls' && (
              <div className="space-y-5">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  BFS Controls
                </h3>

                <button
                  onClick={startBFS}
                  disabled={isRunning}
                  className={`w-full px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${isRunning
                      ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                      : `${isDarkMode
                        ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-500/90 hover:to-indigo-500/90 text-white'
                        : 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 hover:from-blue-600/90 hover:to-indigo-600/90 text-white'
                      } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                    }`}
                >
                  Start BFS (from Node 0)
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={stepBFS}
                    disabled={!isRunning || isPaused}
                    className={`flex-1 px-3 py-2 rounded-xl font-medium transition-all duration-200 ${!isRunning || isPaused
                        ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                        : `${isDarkMode
                          ? 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white'
                          : 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white'
                        } hover:scale-102`
                      }`}
                  >
                    Step
                  </button>

                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    disabled={!isRunning}
                    className={`flex-1 px-3 py-2 rounded-xl font-medium transition-all duration-200 ${!isRunning
                        ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                        : isPaused
                          ? `${isDarkMode ? 'bg-green-600/80 text-white' : 'bg-green-500/90 text-white'}`
                          : `${isDarkMode ? 'bg-amber-600/80 text-white' : 'bg-amber-500/90 text-white'}`
                      }`}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                </div>

                <button
                  onClick={resetGraph}
                  className={`w-full px-4 py-2.5 rounded-xl font-medium ${isDarkMode
                      ? 'bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500/90 hover:to-red-500/90 text-white'
                      : 'bg-gradient-to-r from-orange-500/90 to-red-500/90 hover:from-orange-600/90 hover:to-red-600/90 text-white'
                    } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5 transition-all duration-200`}
                >
                  Reset Graph
                </button>

                {/* Animation Speed */}
                <div className="space-y-3">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Animation Speed: {animationSpeed}ms
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="100"
                    value={animationSpeed}
                    onChange={e => setAnimationSpeed(parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: isDarkMode ? '#3b82f6' : '#2563eb' }}
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Fast</span>
                    <span>Slow</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pseudocode' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  BFS Algorithm
                </h3>
                <div
                  className={`p-4 rounded-xl font-mono text-xs ${isDarkMode
                      ? 'bg-slate-900/50 text-slate-200 border border-slate-700/30'
                      : 'bg-gray-100/80 text-gray-800 border border-gray-200/30'
                    } overflow-x-auto`}
                >
                  <div className="space-y-2 leading-relaxed">
                    <div>ALGORITHM Breadth-First Search (BFS)</div>
                    <div>INPUT: Graph G = (V, E), start vertex s</div>
                    <div>OUTPUT: Order of visited vertices</div>
                    <div className="pt-2">1: let Q ← empty queue</div>
                    <div>2: mark s as visited</div>
                    <div>3: enqueue s into Q</div>
                    <div>4: while Q is not empty do</div>
                    <div className="pl-4">5:   u ← dequeue(Q)</div>
                    <div className="pl-4">6:   visit(u)</div>
                    <div className="pl-4">7:   for each neighbor v of u do</div>
                    <div className="pl-8">8:     if v is unvisited then</div>
                    <div className="pl-12">9:       mark v as visited</div>
                    <div className="pl-12">10:      enqueue v into Q</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'explanation' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  BFS Concept
                </h3>
                <div className="space-y-4">
                  <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    <strong>Breadth-First Search (BFS)</strong> explores a graph layer by layer, starting from a source node.
                    It visits all neighbors at the current depth before moving to nodes at the next depth level.
                  </p>
                  <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    <li>• Guarantees shortest path in <strong>unweighted</strong> graphs</li>
                    <li>• Uses a <strong>queue</strong> to manage traversal order (FIFO)</li>
                    <li>• Time complexity: <code className="bg-gray-200 dark:bg-slate-700 px-1 rounded">O(V + E)</code></li>
                    <li>• Space complexity: <code className="bg-gray-200 dark:bg-slate-700 px-1 rounded">O(V)</code></li>
                  </ul>
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Common Applications</h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li>• Finding shortest path (e.g., in games or maps)</li>
                      <li>• Web crawlers (exploring links level-by-level)</li>
                      <li>• Social network "degrees of separation"</li>
                      <li>• Broadcasting in peer-to-peer networks</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Execution Trace
                </h3>
                <div className="space-y-3">
                  <div
                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-gray-100/80 border border-gray-200/30'
                      }`}
                  >
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Visited Nodes</span>
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.visitedCount}</span>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/30 border border-blue-700/30' : 'bg-blue-100/80 border border-blue-300/30'
                      }`}
                  >
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Max Queue Size</span>
                      <span className={`font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>{stats.queueMaxLength}</span>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-gray-100/80 border border-gray-200/30'
                      }`}
                  >
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Steps Executed</span>
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.steps}</span>
                    </div>
                  </div>
                </div>

                {history.length > 0 && (
                  <div className="mt-4">
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      Step-by-Step Log
                    </h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {[...history].reverse().map((msg, i) => (
                        <div
                          key={i}
                          className={`text-xs p-2 rounded ${isDarkMode ? 'bg-slate-800/40 text-slate-300' : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {msg}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'result' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Shortest Paths (from Node 0)
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  BFS guarantees the shortest path in unweighted graphs.
                </p>

                <div className="space-y-3">
                  {Object.keys(SAMPLE_GRAPH).map(nodeIdStr => {
                    const nodeId = Number(nodeIdStr);
                    const distance = nodes[nodeId]?.distance;
                    const isReachable = distance !== null && distance >= 0;

                    let path: NodeId[] = [];
                    if (isReachable) {
                      let current: NodeId | null = nodeId;
                      while (current !== null) {
                        path.unshift(current);
                        current = parentMap[current] ?? null;
                      }
                    }

                    return (
                      <div
                        key={nodeId}
                        className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/80'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                            To Node <span className="font-bold">{nodeId}</span>:
                          </span>
                          {isReachable ? (
                            <span className={`font-bold ${nodeId === 0 ? 'text-emerald-500' : 'text-blue-500'
                              }`}>
                              {distance === 0 ? 'Start' : `${distance} step${distance === 1 ? '' : 's'}`}
                            </span>
                          ) : (
                            <span className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                              Unreachable
                            </span>
                          )}
                        </div>

                        {isReachable && path.length > 0 && (
                          <div className="mt-2 flex flex-wrap items-center gap-1">
                            {path.map((id, idx) => (
                              <React.Fragment key={id}>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${isDarkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                  {id}
                                </span>
                                {idx < path.length - 1 && (
                                  <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                  </svg>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}