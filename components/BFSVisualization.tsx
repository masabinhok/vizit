'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';

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
}

const SAMPLE_GRAPH: Record<NodeId, GraphNode> = Object.freeze({
  0: { id: 0, neighbors: [1, 2] },
  1: { id: 1, neighbors: [0, 3, 4] },
  2: { id: 2, neighbors: [0, 5] },
  3: { id: 3, neighbors: [1] },
  4: { id: 4, neighbors: [1, 6] },
  5: { id: 5, neighbors: [2] },
  6: { id: 6, neighbors: [4] },
});

export default function BFSVisualization() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const canvasRef = useRef<HTMLDivElement>(null);

  const [historyStack, setHistoryStack] = useState<{
    nodes: Record<NodeId, BFSNodeState>;
    bfsQueue: QueueElement[];
    parentMap: Record<NodeId, NodeId | null>;
    stats: {
      visitedCount: number;
      queueMaxLength: number;
      steps: number;
    };
    hasBFSStarted: boolean;
  }[]>([]);

  const [nodes, setNodes] = useState<Record<NodeId, BFSNodeState>>(() => {
    const initial: Record<NodeId, BFSNodeState> = {};
    Object.keys(SAMPLE_GRAPH).forEach(id => {
      initial[Number(id)] = { id: Number(id), status: 'unvisited', distance: null };
    });
    return initial;
  });

  const [startNodeId, setStartNodeId] = useState<NodeId | null>(0);
  const [selectedNodeIds, setSelectedNodeIds] = useState<NodeId[]>([]);
  const nextNodeId = useRef(Math.max(...Object.keys(SAMPLE_GRAPH).map(Number)) + 1);
  const [draggingNodeId, setDraggingNodeId] = useState<NodeId | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bfsQueue, setBfsQueue] = useState<QueueElement[]>([]);
  const [hasBFSStarted, setHasBFSStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [parentMap, setParentMap] = useState<Record<NodeId, NodeId | null>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'controls' | 'pseudocode' | 'explanation' | 'history' | 'result'>('controls');
  const [animationSpeed, setAnimationSpeed] = useState(800);
  const [stats, setStats] = useState({
    visitedCount: 0,
    queueMaxLength: 0,
    steps: 0,
  });

  const [graph, setGraph] = useState<Record<NodeId, GraphNode>>(() => ({ ...SAMPLE_GRAPH }));
  const [nodePositions, setNodePositions] = useState<Record<NodeId, { x: number; y: number }>>(() => ({
    0: { x: 50, y: 10 },
    1: { x: 35, y: 25 },
    2: { x: 65, y: 25 },
    3: { x: 25, y: 40 },
    4: { x: 45, y: 40 },
    5: { x: 65, y: 40 },
    6: { x: 45, y: 55 }
  }));

  const addToHistory = (msg: string) => {
    setHistory(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
    setStats(prev => ({ ...prev, steps: prev.steps + 1 }));
  };

  const addNode = () => {
    if (Object.keys(graph).length >= 15) {
      toast.error('Max 15 nodes allowed');
      return;
    }

    const newId = nextNodeId.current;
    nextNodeId.current += 1;

    const newGraph = {
      ...graph,
      [newId]: { id: newId, neighbors: [] }
    };
    setGraph(newGraph);

    setNodePositions(prev => {
      const nodeCount = Object.keys(prev).length;
      let x, y;

      if (nodeCount === 0) {
        x = 50; y = 10;
      } else if (nodeCount <= 2) {
        x = nodeCount === 1 ? 35 : 65;
        y = 25;
      } else if (nodeCount <= 5) {
        const levelIndex = nodeCount - 2;
        x = levelIndex === 1 ? 25 : levelIndex === 2 ? 45 : 65;
        y = 40;
      } else if (nodeCount <= 6) {
        x = 45; y = 55;
      } else {
        const remaining = nodeCount - 6;
        const level = 4 + Math.floor(remaining / 3);
        const levelIndex = remaining % 3;
        
        y = Math.min(65, 10 + level * 12);
        
        if (levelIndex === 0) {
          x = 30;
        } else if (levelIndex === 1) {
          x = 50;
        } else {
          x = 70;
        }
      }

      x = Math.max(10, Math.min(90, x));
      y = Math.max(10, Math.min(65, y));

      return { ...prev, [newId]: { x, y } };
    });

    resetBFSState();
    toast.success(`Added node ${newId}`);
  };

  const deleteSelectedNodes = () => {
    if (selectedNodeIds.length === 0) {
      toast.error('Select a node to delete');
      return;
    }

    const newGraph = { ...graph };
    selectedNodeIds.forEach(id => {
      delete newGraph[id];
      Object.values(newGraph).forEach(node => {
        node.neighbors = node.neighbors.filter(n => n !== id);
      });
    });
    setGraph(newGraph);
    
    setNodePositions(prev => {
      const newPositions = { ...prev };
      selectedNodeIds.forEach(id => delete newPositions[id]);
      return newPositions;
    });

    setSelectedNodeIds([]);
    resetBFSState();
    toast.success(`Deleted ${selectedNodeIds.length} node(s)`);
  };

  const createOrDeleteEdge = () => {
    if (selectedNodeIds.length !== 2) {
      toast.error('Select exactly two nodes');
      return;
    }
    const [a, b] = selectedNodeIds;
    if (!graph[a] || !graph[b]) return;

    const newGraph = { ...graph };
    const hasEdge = newGraph[a].neighbors.includes(b);

    if (hasEdge) {
      newGraph[a].neighbors = newGraph[a].neighbors.filter(n => n !== b);
      newGraph[b].neighbors = newGraph[b].neighbors.filter(n => n !== a);
      toast.success(`Removed edge ${a}–${b}`);
    } else {
      newGraph[a].neighbors.push(b);
      newGraph[b].neighbors.push(a);
      toast.success(`Added edge ${a}–${b}`);
    }

    setGraph(newGraph);
    setSelectedNodeIds([]);
    resetBFSState();
  };

  const resetBFSState = () => {
    const resetNodes: Record<NodeId, BFSNodeState> = {};
    Object.keys(graph).forEach(id => {
      resetNodes[Number(id)] = { id: Number(id), status: 'unvisited', distance: null };
    });
    setNodes(resetNodes);
    setBfsQueue([]);
    setIsRunning(false);
    setIsPaused(false);
    setParentMap({});
    setHistory([]);
    setStats({ visitedCount: 0, queueMaxLength: 0, steps: 0 });
    setHasBFSStarted(false);
    setHistoryStack([]);
  };

  const resetGraph = () => {
    const newGraph: Record<NodeId, GraphNode> = {
      0: { id: 0, neighbors: [1, 2] },
      1: { id: 1, neighbors: [0, 3, 4] },
      2: { id: 2, neighbors: [0, 5] },
      3: { id: 3, neighbors: [1] },
      4: { id: 4, neighbors: [1, 6] },
      5: { id: 5, neighbors: [2] },
      6: { id: 6, neighbors: [4] },
    };
    setGraph(newGraph);
    
    setNodePositions({
      0: { x: 50, y: 10 },
      1: { x: 35, y: 25 },
      2: { x: 65, y: 25 },
      3: { x: 25, y: 40 },
      4: { x: 45, y: 40 },
      5: { x: 65, y: 40 },
      6: { x: 45, y: 55 }
    });

    const resetNodes: Record<NodeId, BFSNodeState> = {};
    Object.keys(newGraph).forEach(id => {
      resetNodes[Number(id)] = { id: Number(id), status: 'unvisited', distance: null };
    });
    setNodes(resetNodes);
    setBfsQueue([]);
    setIsRunning(false);
    setIsPaused(false);
    setParentMap({});
    setHistory([]);
    setStats({ visitedCount: 0, queueMaxLength: 0, steps: 0 });
    setHasBFSStarted(false);
    setStartNodeId(0);
    setHistoryStack([]);
    setSelectedNodeIds([]);
    setDraggingNodeId(null);
    toast.success('Graph reset');
  };

  const undoStep = useCallback(() => {
    if (historyStack.length === 0) {
      toast.success('No steps to undo');
      return;
    }

    const lastState = historyStack[historyStack.length - 1];
    setNodes(lastState.nodes);
    setBfsQueue(lastState.bfsQueue);
    setParentMap(lastState.parentMap);
    setStats(lastState.stats);
    setHasBFSStarted(lastState.hasBFSStarted);
    setHistoryStack(prev => prev.slice(0, -1));
    setIsRunning(false);
    setIsPaused(true);
  }, [historyStack]);

  const stepBFS = useCallback(() => {
    if (!hasBFSStarted) {
      if (startNodeId === null) {
        toast.error('Please select a start node first!');
        return;
      }

      setHasBFSStarted(true);
      setParentMap({ [startNodeId]: null });
      setNodes(prev => ({
        ...prev,
        [startNodeId]: { ...prev[startNodeId], status: 'queued', distance: 0 }
      }));
      setBfsQueue([{ id: Date.now(), value: startNodeId }]);
      addToHistory(`Initialized BFS from node ${startNodeId}`);
      setStats(prev => ({ ...prev, queueMaxLength: 1 }));
      return;
    }

    setHistoryStack(prev => [
      ...prev,
      { nodes, bfsQueue, parentMap, stats, hasBFSStarted }
    ]);

    if (bfsQueue.length === 0) {
      const queued = Object.values(nodes).find(n => n.status === 'queued');
      if (queued) {
        setBfsQueue([{ id: Date.now(), value: queued.id }]);
        return;
      }

      toast.success('BFS completed!');
      setIsRunning(false);
      setIsPaused(false);
      return;
    }

    const current = bfsQueue[0];
    const nodeId = current.value;

    setNodes(prev => ({ ...prev, [nodeId]: { ...prev[nodeId], status: 'visiting' } }));

    setTimeout(() => {
      const newQueue = bfsQueue.slice(1);
      setBfsQueue(newQueue);

      setNodes(prev => ({
        ...prev,
        [nodeId]: { ...prev[nodeId], status: 'visited' },
      }));

      setStats(prev => ({ ...prev, visitedCount: prev.visitedCount + 1 }));

      const currentNode = graph[nodeId];
      if (!currentNode) return;

      const updatedNodes = { ...nodes };
      updatedNodes[nodeId] = { ...updatedNodes[nodeId], status: 'visited' };

      const newEnqueues: QueueElement[] = [];
      currentNode.neighbors.forEach(neighborId => {
        if (updatedNodes[neighborId]?.status === 'unvisited') {
          updatedNodes[neighborId] = {
            ...updatedNodes[neighborId],
            status: 'queued',
            distance: (updatedNodes[nodeId].distance ?? 0) + 1,
          };
          setParentMap(prev => ({ ...prev, [neighborId]: nodeId }));
          newEnqueues.push({ id: Date.now() + newEnqueues.length, value: neighborId });
          addToHistory(`Enqueued neighbor ${neighborId} from ${nodeId}`);
        }
      });

      setNodes(updatedNodes);
      if (newEnqueues.length > 0) {
        const nextQueue = [...newQueue, ...newEnqueues];
        setBfsQueue(nextQueue);
        if (nextQueue.length > stats.queueMaxLength) {
          setStats(prev => ({ ...prev, queueMaxLength: nextQueue.length }));
        }
      }

      addToHistory(`Visited node ${nodeId} (distance: ${updatedNodes[nodeId].distance})`);

      if (newQueue.length === 0 && newEnqueues.length === 0) {
        toast.success('BFS completed!');
        setIsRunning(false);
        setIsPaused(false);
      }
    }, 300);
  }, [bfsQueue, nodes, hasBFSStarted, stats.queueMaxLength, startNodeId, graph]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => stepBFS(), animationSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, animationSpeed, stepBFS]);

  useEffect(() => {
    if (draggingNodeId === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const svg = canvasRef.current?.querySelector('svg');
      if (!svg) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const local = pt.matrixTransform(svg.getScreenCTM()?.inverse());

      const newX = local.x - dragOffset.x;
      const newY = local.y - dragOffset.y;
      const boundedX = Math.max(5, Math.min(95, newX));
      const boundedY = Math.max(5, Math.min(65, newY));

      setNodePositions(prev => ({ ...prev, [draggingNodeId]: { x: boundedX, y: boundedY } }));
    };

    const handleMouseUp = () => setDraggingNodeId(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingNodeId, dragOffset, canvasRef]);

  const renderGraph = () => {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 70"
        preserveAspectRatio="xMidYMid meet"
        className="min-h-full"
      >
        {Object.values(graph).flatMap(node =>
          node.neighbors.map(neighborId => {
            if (!graph[neighborId]) return null;
            const p1 = nodePositions[node.id];
            const p2 = nodePositions[neighborId];
            if (!p1 || !p2) return null;

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
                />
              );
            }
            return null;
          })
        )}

        {Object.values(graph).map(graphNode => {
          if (!graphNode) return null;

          const bfsNode = nodes[graphNode.id] || {
            id: graphNode.id,
            status: 'unvisited',
            distance: null,
          };

          const pos = nodePositions[graphNode.id];
          if (!pos) return null;

          const width = 10;
          const height = 6;
          const radius = 1.5;

          let fill = '';
          let stroke = '';
          let textColor = '';

          if (!hasBFSStarted && startNodeId === graphNode.id) {
            fill = isDarkMode ? '#4f46e5' : '#6366f1';
            stroke = isDarkMode ? '#4338ca' : '#4f46e5';
            textColor = '#ffffff';
          } else if (bfsNode.status === 'visited') {
            fill = isDarkMode ? '#059669' : '#10b981';
            stroke = isDarkMode ? '#065f46' : '#059669';
            textColor = '#ffffff';
          } else if (bfsNode.status === 'visiting') {
            fill = isDarkMode ? '#2563eb' : '#3b82f6';
            stroke = isDarkMode ? '#1d4ed8' : '#2563eb';
            textColor = '#ffffff';
          } else if (bfsNode.status === 'queued') {
            fill = isDarkMode ? '#d97706' : '#f59e0b';
            stroke = isDarkMode ? '#b45309' : '#d97706';
            textColor = '#ffffff';
          } else {
            fill = isDarkMode ? '#334155' : '#e5e7eb';
            stroke = isDarkMode ? '#475569' : '#d1d5db';
            textColor = isDarkMode ? '#cbd5e1' : '#374151';
          }

          if (selectedNodeIds.includes(graphNode.id) && !hasBFSStarted) {
            stroke = isDarkMode ? '#f43f5e' : '#f43f5e';
            fill = isDarkMode ? '#3f3f46' : '#f3f4f6';
          }

          const label = bfsNode.distance !== null && bfsNode.status !== 'unvisited'
            ? `${graphNode.id}(${bfsNode.distance})`
            : String(graphNode.id);

          return (
            <g key={graphNode.id}>
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
                className={bfsNode.status === 'visiting' ? 'animate-pulse' : ''}
                onMouseDown={(e) => {
                  if (isRunning || hasBFSStarted) return;
                  const svg = e.currentTarget.ownerSVGElement;
                  if (!svg) return;

                  const pt = svg.createSVGPoint();
                  pt.x = e.clientX;
                  pt.y = e.clientY;
                  const local = pt.matrixTransform(svg.getScreenCTM()?.inverse());

                  setDraggingNodeId(graphNode.id);
                  setDragOffset({ x: local.x - pos.x, y: local.y - pos.y });
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  if (draggingNodeId !== null || isRunning) return;
                  e.stopPropagation();
                  if (selectedNodeIds.includes(graphNode.id)) {
                    setSelectedNodeIds(prev => prev.filter(id => id !== graphNode.id));
                  } else {
                    setSelectedNodeIds(prev => prev.length < 2 ? [...prev, graphNode.id] : [graphNode.id]);
                  }
                }}
                style={{
                  cursor: isRunning || hasBFSStarted ? 'default' : 
                         draggingNodeId === graphNode.id ? 'grabbing' : 'move',
                  pointerEvents: 'all'
                }}
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

  const isBFSComplete = hasBFSStarted &&
    bfsQueue.length === 0 &&
    !Object.values(nodes).some(n => n.status === 'queued' || n.status === 'visiting');

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
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

                <div className="pt-4 border-t border-slate-700/20 dark:border-slate-600/30">
                  <h4 className={`text-md font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Graph Editor ({Object.keys(graph).length}/15 nodes)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={addNode}
                      disabled={Object.keys(graph).length >= 15}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${Object.keys(graph).length >= 15
                          ? `${isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`
                        }`}
                    >
                      ➕ Add Node
                    </button>
                    <button
                      onClick={deleteSelectedNodes}
                      disabled={selectedNodeIds.length === 0}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${selectedNodeIds.length === 0
                          ? `${isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode ? 'bg-red-700/80 hover:bg-red-600 text-white' : 'bg-red-500/90 hover:bg-red-600 text-white'}`
                        }`}
                    >
                      🗑️ Delete
                    </button>
                    <button
                      onClick={createOrDeleteEdge}
                      disabled={selectedNodeIds.length !== 2}
                      className={`col-span-2 px-3 py-2 rounded-lg text-sm font-medium ${selectedNodeIds.length !== 2
                          ? `${isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                          : `${isDarkMode ? 'bg-purple-700/80 hover:bg-purple-600 text-white' : 'bg-purple-500/90 hover:bg-purple-600 text-white'}`
                        }`}
                    >
                      {selectedNodeIds.length === 2
                        ? graph[selectedNodeIds[0]]?.neighbors.includes(selectedNodeIds[1])
                          ? '🔗 Remove Edge'
                          : '🔗 Connect Nodes'
                        : 'Select 2 Nodes'}
                    </button>
                  </div>

                  <div className={`mt-3 p-3 rounded-lg text-xs ${isDarkMode ? 'bg-slate-800/50 text-slate-400' : 'bg-gray-100/80 text-gray-600'}`}>
                    <p className="font-medium mb-1">💡 How to move nodes:</p>
                    <p>• Click and drag any node to reposition it</p>
                    <p>• Dragging is disabled during BFS execution</p>
                  </div>

                  {selectedNodeIds.length > 0 && (
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Selected: {selectedNodeIds.join(', ')}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label className={`block text-sm mb-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Select Start Node:
                  </label>
                  <select
                    value={startNodeId ?? ''}
                    onChange={(e) => setStartNodeId(e.target.value ? Number(e.target.value) : null)}
                    disabled={hasBFSStarted}
                    className={`w-full p-2 rounded-lg mb-2 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-gray-900 border'}`}
                  >
                    <option value="">-- Choose --</option>
                    {Object.keys(graph).map(id => (
                      <option key={id} value={id}>Node {id}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (isBFSComplete) return;
                    if (!hasBFSStarted) {
                      if (startNodeId === null) {
                        toast.error('Select a start node first!');
                        return;
                      }
                      stepBFS();
                    }
                    if (isRunning) {
                      setIsPaused(!isPaused);
                    } else {
                      setIsRunning(true);
                      setIsPaused(false);
                    }
                  }}
                  disabled={isBFSComplete}
                  className={`w-full px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${isBFSComplete
                    ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                    : isRunning && !isPaused
                      ? `${isDarkMode ? 'bg-amber-600/80 text-white' : 'bg-amber-500/90 text-white'}`
                      : `${isDarkMode ? 'bg-blue-600/80 text-white' : 'bg-blue-500/90 text-white'}`
                    }`}
                >
                  {isRunning && !isPaused ? 'Pause' : 'Play'}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={undoStep}
                    disabled={historyStack.length === 0}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${historyStack.length === 0
                      ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                      : `${isDarkMode
                        ? 'bg-gradient-to-r from-rose-600/80 to-red-600/80 text-white'
                        : 'bg-gradient-to-r from-rose-500/90 to-red-500/90 text-white'
                      } hover:shadow-lg hover:scale-102`
                      }`}
                  >
                    Previous Step
                  </button>

                  <button
                    onClick={stepBFS}
                    disabled={isBFSComplete}
                    className={`w-full px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${isBFSComplete
                      ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                      : `${isDarkMode
                        ? 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white'
                        : 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white'
                      } hover:shadow-lg hover:scale-102`
                      }`}
                  >
                    Next Step
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
                      <li>• Social network &quot;degrees of separation&quot;</li>
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
                  Shortest Paths {startNodeId !== null ? `(from Node ${startNodeId})` : ''}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  BFS guarantees the shortest path in unweighted graphs.
                </p>

                <div className="space-y-3">
                  {Object.keys(graph).map(nodeIdStr => {
                    const nodeId = Number(nodeIdStr);
                    const distance = nodes[nodeId]?.distance;
                    const isReachable = distance !== null && distance >= 0;

                    const path: NodeId[] = [];
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
                            <span className={`font-bold ${nodeId === startNodeId ? 'text-emerald-500' : 'text-blue-500'
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