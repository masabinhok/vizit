'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface BTreeNode {
  id: string;
  keys: number[];
  children: BTreeNode[];
  leaf: boolean;
  x?: number;
  y?: number;
  isHighlighted?: boolean;
  highlightType?: 'search' | 'insert' | 'delete' | 'split';
}

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

interface AnimationStep {
  node: BTreeNode | null;
  description: string;
  highlightType: 'search' | 'insert' | 'delete' | 'split';
}

export default function BTreeVisualization() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [minDegree, setMinDegree] = useState(2); // User-configurable minimum degree
  const [root, setRoot] = useState<BTreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [activeTab, setActiveTab] = useState<'controls' | 'pseudocode' | 'explanation' | 'stats'>('controls');
  const [stats, setStats] = useState({
    totalNodes: 0,
    totalKeys: 0,
    height: 0,
    lastOperation: '',
  });

  // Show message with auto-hide
  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Create a new node
  const createNode = (leaf: boolean = true): BTreeNode => {
    return {
      id: `node-${Date.now()}-${Math.random()}`,
      keys: [],
      children: [],
      leaf,
    };
  };

  // Search for a key in the B-Tree
  const searchKey = async (value: number) => {
    if (!root) {
      showMessage('Tree is empty', 'error');
      return;
    }

    setIsAnimating(true);
    let currentNode: BTreeNode | null = root;
    let found = false;

    const searchInNode = async (node: BTreeNode): Promise<boolean> => {
      // Highlight current node
      setRoot(prevRoot => highlightNode(prevRoot, node.id, 'search'));
      await sleep(animationSpeed);

      // Search in current node
      let i = 0;
      while (i < node.keys.length && value > node.keys[i]) {
        i++;
      }

      // Check if key found
      if (i < node.keys.length && value === node.keys[i]) {
        showMessage(`Key ${value} found!`, 'success');
        return true;
      }

      // If leaf, key not found
      if (node.leaf) {
        showMessage(`Key ${value} not found`, 'error');
        return false;
      }

      // Recurse to appropriate child
      setRoot(prevRoot => clearHighlights(prevRoot));
      return searchInNode(node.children[i]);
    };

    const result = await searchInNode(currentNode);
    setRoot(prevRoot => clearHighlights(prevRoot));
    setIsAnimating(false);
    return result;
  };

  // Helper function to check if key exists (without animation)
  const keyExists = (node: BTreeNode | null, value: number): boolean => {
    if (!node) return false;

    let i = 0;
    while (i < node.keys.length && value > node.keys[i]) {
      i++;
    }

    if (i < node.keys.length && value === node.keys[i]) {
      return true;
    }

    if (node.leaf) {
      return false;
    }

    return keyExists(node.children[i], value);
  };

  // Insert a key into the B-Tree
  const insertKey = async (value: number) => {
    if (isAnimating) return;
    
    // Check for duplicates
    if (keyExists(root, value)) {
      showMessage(`Key ${value} already exists in the tree`, 'error');
      return;
    }

    setIsAnimating(true);

    if (!root) {
      const newRoot = createNode(true);
      newRoot.keys.push(value);
      setRoot(newRoot);
      updateStats(newRoot);
      showMessage(`Inserted ${value} as root`, 'success');
      setIsAnimating(false);
      return;
    }

    // Make a deep copy of the root to avoid mutation issues
    let workingRoot = JSON.parse(JSON.stringify(root));

    // Check if root is full (maxKeys = 2*t - 1)
    if (workingRoot.keys.length === 2 * minDegree - 1) {
      const newRoot = createNode(false);
      newRoot.children.push(workingRoot);
      await splitChildSync(newRoot, 0);
      await insertNonFullSync(newRoot, value);
      setRoot(newRoot);
      updateStats(newRoot);
    } else {
      await insertNonFullSync(workingRoot, value);
      setRoot(workingRoot);
      updateStats(workingRoot);
    }

    showMessage(`Inserted ${value} successfully`, 'success');
    setIsAnimating(false);
  };

  // Synchronous version that works on the object directly
  const insertNonFullSync = async (node: BTreeNode, value: number): Promise<void> => {
    if (node.leaf) {
      // Insert key in sorted position
      let i = 0;
      while (i < node.keys.length && value > node.keys[i]) {
        i++;
      }
      node.keys.splice(i, 0, value);
    } else {
      // Find the correct child to insert into
      let i = 0;
      while (i < node.keys.length && value > node.keys[i]) {
        i++;
      }

      // Before inserting into child, check if it's full
      if (node.children[i].keys.length === 2 * minDegree - 1) {
        await splitChildSync(node, i);
        
        // After split, check which side of the split the value should go
        if (value > node.keys[i]) {
          i++;
        }
      }
      
      await insertNonFullSync(node.children[i], value);
    }
  };

  // Synchronous split that works on the object directly
  const splitChildSync = async (parent: BTreeNode, index: number): Promise<void> => {
    const t = minDegree;
    const y = parent.children[index];
    const z = createNode(y.leaf);

    // z gets the last (t-1) keys from y
    z.keys = y.keys.splice(t);
    
    // The median key
    const median = y.keys.pop()!;
    
    // If not leaf, split children too
    if (!y.leaf) {
      z.children = y.children.splice(t);
    }

    // Insert median into parent
    parent.keys.splice(index, 0, median);
    
    // Insert z as a child after y
    parent.children.splice(index + 1, 0, z);
  };

  // Split a full child
  const splitChild = async (parent: BTreeNode, index: number) => {
    const t = minDegree;
    const y = parent.children[index];
    const z = createNode(y.leaf);

    // Highlight splitting
    setRoot(prevRoot => highlightNode(prevRoot, y.id, 'split'));
    await sleep(animationSpeed);

    // z gets the last (t-1) keys from y
    // For t=2: keys at index 2 onwards go to z
    // For t=3: keys at index 3 onwards go to z
    const zKeys = y.keys.splice(t); // Remove and get keys from index t onwards
    z.keys = zKeys;
    
    // The median key at index (t-1)
    const median = y.keys.pop()!; // Remove the last key which is the median
    
    // If not leaf, split children too
    if (!y.leaf) {
      // z gets the last t children from y
      const zChildren = y.children.splice(t); // Remove and get children from index t onwards
      z.children = zChildren;
    }

    // Insert median into parent at position 'index'
    parent.keys.splice(index, 0, median);
    
    // Insert z as a child after y (at position index+1)
    parent.children.splice(index + 1, 0, z);

    // Force state update to ensure React sees the changes
    setRoot(prevRoot => ({ ...prevRoot! }));
    await sleep(50); // Small delay to ensure state updates
    setRoot(prevRoot => clearHighlights(prevRoot));
  };

  // Insert into a non-full node
  const insertNonFull = async (node: BTreeNode, value: number): Promise<void> => {
    if (node.leaf) {
      // Insert key in sorted position
      let i = node.keys.length - 1;
      while (i >= 0 && value < node.keys[i]) i--;
      node.keys.splice(i + 1, 0, value);
      setRoot(prevRoot => ({ ...prevRoot! }));
    } else {
      // Find the correct child to insert into
      let i = 0;
      while (i < node.keys.length && value > node.keys[i]) {
        i++;
      }
      
      // i is now the index of the child where value should go
      // node.keys[i-1] < value <= node.keys[i] (if i < node.keys.length)
      // OR value > all keys (if i == node.keys.length)

      // Safety check: ensure child exists
      if (!node.children[i]) {
        console.error('Child does not exist at index', i, 'node has', node.children.length, 'children', 'keys:', node.keys);
        showMessage('Error: Invalid tree structure', 'error');
        return;
      }

      // Before inserting into child, check if it's full
      if (node.children[i].keys.length === 2 * minDegree - 1) {
        await splitChild(node, i);
        
        // After split, the median key is now at parent.keys[i]
        // We need to check which side of the split the value should go
        if (value > node.keys[i]) {
          i++;
        }
        
        // After split, verify the child still exists
        if (!node.children[i]) {
          console.error('Child does not exist after split at index', i, 'node has', node.children.length, 'children');
          showMessage('Error: Invalid tree structure after split', 'error');
          return;
        }
      }
      
      await insertNonFull(node.children[i], value);
    }
  };

  // Delete a key from the B-Tree
  const deleteKey = async (value: number) => {
    if (!root) {
      showMessage('Tree is empty', 'error');
      return;
    }

    setIsAnimating(true);
    await deleteFromNode(root, value);
    
    // If root is empty after deletion, make its only child the new root
    if (root.keys.length === 0) {
      if (!root.leaf && root.children.length > 0) {
        setRoot(root.children[0]);
      } else {
        setRoot(null);
      }
    }

    updateStats(root);
    showMessage(`Deleted ${value} successfully`, 'success');
    setIsAnimating(false);
  };

  const deleteFromNode = async (node: BTreeNode, value: number): Promise<void> => {
    let i = 0;
    while (i < node.keys.length && value > node.keys[i]) {
      i++;
    }

    if (i < node.keys.length && value === node.keys[i]) {
      if (node.leaf) {
        node.keys.splice(i, 1);
        setRoot(prevRoot => ({ ...prevRoot! }));
      } else {
        await deleteInternalNode(node, i);
      }
    } else if (!node.leaf) {
      await deleteFromNode(node.children[i], value);
    }
  };

  const deleteInternalNode = async (node: BTreeNode, index: number) => {
    const key = node.keys[index];

    if (node.children[index].keys.length >= minDegree) {
      const predecessor = await getPredecessor(node, index);
      node.keys[index] = predecessor;
      await deleteFromNode(node.children[index], predecessor);
    } else if (node.children[index + 1].keys.length >= minDegree) {
      const successor = await getSuccessor(node, index);
      node.keys[index] = successor;
      await deleteFromNode(node.children[index + 1], successor);
    } else {
      await merge(node, index);
      await deleteFromNode(node.children[index], key);
    }
  };

  const getPredecessor = async (node: BTreeNode, index: number): Promise<number> => {
    let current = node.children[index];
    while (!current.leaf) {
      current = current.children[current.children.length - 1];
    }
    return current.keys[current.keys.length - 1];
  };

  const getSuccessor = async (node: BTreeNode, index: number): Promise<number> => {
    let current = node.children[index + 1];
    while (!current.leaf) {
      current = current.children[0];
    }
    return current.keys[0];
  };

  const merge = async (node: BTreeNode, index: number) => {
    const child = node.children[index];
    const sibling = node.children[index + 1];

    child.keys.push(node.keys[index]);
    child.keys.push(...sibling.keys);
    
    if (!child.leaf) {
      child.children.push(...sibling.children);
    }

    node.keys.splice(index, 1);
    node.children.splice(index + 1, 1);

    setRoot(prevRoot => ({ ...prevRoot! }));
  };

  // Insert random values
  const insertRandom = async () => {
    if (isAnimating) return;
    
    // Generate a unique random value
    let randomValue;
    let attempts = 0;
    const maxAttempts = 1000;
    
    do {
      randomValue = Math.floor(Math.random() * 100) + 1;
      attempts++;
      
      // If we've tried too many times, expand the range significantly
      if (attempts > 100 && attempts <= 200) {
        randomValue = Math.floor(Math.random() * 500) + 1;
      } else if (attempts > 200) {
        randomValue = Math.floor(Math.random() * 10000) + 1;
      }
      
      // Safety check to prevent infinite loop
      if (attempts >= maxAttempts) {
        showMessage('Could not find unique random value', 'error');
        return;
      }
    } while (keyExists(root, randomValue));
    
    // Use the regular insertKey function which now handles everything properly
    await insertKey(randomValue);
  };

  // Reset the tree
  const resetTree = () => {
    if (isAnimating) return;
    setRoot(null);
    setStats({
      totalNodes: 0,
      totalKeys: 0,
      height: 0,
      lastOperation: 'Reset',
    });
    showMessage('Tree reset successfully', 'info');
  };

  // Helper functions
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const highlightNode = (node: BTreeNode | null, nodeId: string, type: 'search' | 'insert' | 'delete' | 'split'): BTreeNode | null => {
    if (!node) return null;
    
    return {
      ...node,
      isHighlighted: node.id === nodeId,
      highlightType: node.id === nodeId ? type : undefined,
      children: node.children.map(child => highlightNode(child, nodeId, type)!),
    };
  };

  const clearHighlights = (node: BTreeNode | null): BTreeNode | null => {
    if (!node) return null;
    
    return {
      ...node,
      isHighlighted: false,
      highlightType: undefined,
      children: node.children.map(child => clearHighlights(child)!),
    };
  };

  const calculateHeight = (node: BTreeNode | null): number => {
    if (!node) return 0;
    if (node.leaf) return 1;
    return 1 + Math.max(...node.children.map(child => calculateHeight(child)));
  };

  const countNodes = (node: BTreeNode | null): number => {
    if (!node) return 0;
    return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);
  };

  const countKeys = (node: BTreeNode | null): number => {
    if (!node) return 0;
    return node.keys.length + node.children.reduce((sum, child) => sum + countKeys(child), 0);
  };

  const updateStats = (node: BTreeNode | null) => {
    setStats({
      totalNodes: countNodes(node),
      totalKeys: countKeys(node),
      height: calculateHeight(node),
      lastOperation: stats.lastOperation,
    });
  };

  // Calculate node positions for rendering
  const calculatePositions = (node: BTreeNode | null, x: number, y: number, horizontalSpacing: number): BTreeNode | null => {
    if (!node) return null;

    const newNode = { ...node, x, y };
    
    if (node.children.length > 0) {
      const childSpacing = horizontalSpacing / node.children.length;
      const startX = x - horizontalSpacing / 2;
      
      newNode.children = node.children.map((child, index) => {
        const childX = startX + (index + 0.5) * childSpacing;
        const childY = y + 100;
        return calculatePositions(child, childX, childY, childSpacing)!;
      });
    }

    return newNode;
  };

  // Render the tree on canvas
  const renderTree = () => {
    if (!root || !canvasRef.current) return null;

    const width = canvasRef.current.offsetWidth || 800;
    const positionedRoot = calculatePositions(root, width / 2, 50, width * 0.8);

    const renderNode = (node: BTreeNode, level: number = 0): React.ReactElement => {
      const nodeWidth = Math.max(node.keys.length * 40 + 20, 80);
      const nodeHeight = 50;

      return (
        <React.Fragment key={node.id}>
          {/* Render lines to children */}
          {node.children.map((child, index) => (
            <line
              key={`line-${node.id}-${child.id}`}
              x1={node.x}
              y1={node.y! + nodeHeight / 2}
              x2={child.x}
              y2={child.y!}
              className={`transition-all duration-300 ${
                isDarkMode ? 'stroke-slate-600' : 'stroke-gray-300'
              }`}
              strokeWidth="2"
            />
          ))}

          {/* Render node */}
          <g
            className={`transition-all duration-300 ${
              node.isHighlighted ? 'animate-pulse-subtle' : ''
            }`}
            transform={`translate(${node.x! - nodeWidth / 2}, ${node.y!})`}
          >
            <rect
              width={nodeWidth}
              height={nodeHeight}
              rx="8"
              className={`transition-all duration-300 ${
                node.isHighlighted && node.highlightType === 'search'
                  ? isDarkMode
                    ? 'fill-blue-600/80 stroke-blue-400'
                    : 'fill-blue-500/80 stroke-blue-400'
                  : node.isHighlighted && node.highlightType === 'insert'
                  ? isDarkMode
                    ? 'fill-green-600/80 stroke-green-400'
                    : 'fill-green-500/80 stroke-green-400'
                  : node.isHighlighted && node.highlightType === 'split'
                  ? isDarkMode
                    ? 'fill-orange-600/80 stroke-orange-400'
                    : 'fill-orange-500/80 stroke-orange-400'
                  : node.isHighlighted && node.highlightType === 'delete'
                  ? isDarkMode
                    ? 'fill-red-600/80 stroke-red-400'
                    : 'fill-red-500/80 stroke-red-400'
                  : isDarkMode
                  ? 'fill-slate-700/90 stroke-slate-500'
                  : 'fill-white/90 stroke-gray-300'
              }`}
              strokeWidth="2"
            />
            
            {/* Render keys */}
            {node.keys.map((key, index) => (
              <React.Fragment key={`key-${index}`}>
                {index > 0 && (
                  <line
                    x1={(index * nodeWidth) / node.keys.length}
                    y1={5}
                    x2={(index * nodeWidth) / node.keys.length}
                    y2={nodeHeight - 5}
                    className={isDarkMode ? 'stroke-slate-500' : 'stroke-gray-300'}
                    strokeWidth="1"
                  />
                )}
                <text
                  x={(index + 0.5) * (nodeWidth / node.keys.length)}
                  y={nodeHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-sm font-bold ${
                    node.isHighlighted
                      ? 'fill-white'
                      : isDarkMode
                      ? 'fill-slate-200'
                      : 'fill-gray-800'
                  }`}
                >
                  {key}
                </text>
              </React.Fragment>
            ))}
          </g>

          {/* Render children recursively */}
          {node.children.map(child => renderNode(child, level + 1))}
        </React.Fragment>
      );
    };

    return positionedRoot ? renderNode(positionedRoot) : null;
  };

  // Handle key press for inputs
  const handleInsertKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const value = parseInt(inputValue.trim());
      if (!isNaN(value)) {
        insertKey(value);
        setInputValue('');
      }
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      const value = parseInt(searchValue.trim());
      if (!isNaN(value)) {
        searchKey(value);
        setSearchValue('');
      }
    }
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* Main Canvas - Full Width */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        {/* Message Display */}
        {message && (
          <div
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg ${
              message.type === 'success'
                ? `${isDarkMode ? 'bg-green-900/90 text-green-300 border border-green-700/50' : 'bg-green-100/95 text-green-700 border border-green-300/50'}`
                : message.type === 'error'
                ? `${isDarkMode ? 'bg-red-900/90 text-red-300 border border-red-700/50' : 'bg-red-100/95 text-red-700 border border-red-300/50'}`
                : `${isDarkMode ? 'bg-blue-900/90 text-blue-300 border border-blue-700/50' : 'bg-blue-100/95 text-blue-700 border border-blue-300/50'}`
            } backdrop-blur-sm`}
          >
            {message.text}
          </div>
        )}

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className={`flex-1 overflow-auto rounded-2xl ${
            isDarkMode
              ? 'bg-slate-800/30 border border-slate-700/30'
              : 'bg-white/30 border border-gray-200/30'
          } backdrop-blur-sm`}
        >
          {!root ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div
                className={`w-24 h-24 rounded-2xl mb-4 flex items-center justify-center ${
                  isDarkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-gray-100/50 border border-gray-200/30'
                } backdrop-blur-sm`}
              >
                <svg
                  className={`w-12 h-12 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                B-Tree is Empty
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Insert keys to build the tree visualization
              </p>
            </div>
          ) : (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${canvasRef.current?.offsetWidth || 800} ${Math.max(stats.height * 120, 400)}`}
              className="min-h-full"
            >
              {renderTree()}
            </svg>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 flex flex-col min-h-0 overflow-hidden">
        {/* Tab Navigation */}
        <div
          className={`flex rounded-t-2xl flex-shrink-0 ${
            isDarkMode ? 'bg-slate-800/50 border-b border-slate-700/50' : 'bg-white/50 border-b border-gray-200/50'
          } backdrop-blur-sm`}
        >
          {[
            { id: 'controls', label: 'Controls', icon: '⚙️' },
            { id: 'pseudocode', label: 'Code', icon: '📝' },
            { id: 'explanation', label: 'Learn', icon: '📚' },
            { id: 'stats', label: 'Stats', icon: '📊' },
          ].map(tab => (
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

        {/* Tab Content */}
        <div
          className={`flex-1 overflow-y-auto rounded-b-2xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-l border-r border-b border-slate-600/30'
              : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-l border-r border-b border-gray-200/30'
          } backdrop-blur-sm shadow-lg`}
        >
          <div className="p-5">
            {activeTab === 'controls' && (
              <div className="space-y-5">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  B-Tree Operations
                </h3>

                {/* Minimum Degree Configuration */}
                <div className="space-y-3">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Minimum Degree (t): {minDegree}
                  </label>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/80'}`}>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="1"
                      value={minDegree}
                      onChange={e => {
                        const newDegree = parseInt(e.target.value);
                        setMinDegree(newDegree);
                        // Reset tree when changing degree
                        setRoot(null);
                        setStats({ totalNodes: 0, totalKeys: 0, height: 0, lastOperation: 'Changed degree' });
                        showMessage(`Changed to t=${newDegree} (max keys: ${2 * newDegree - 1})`, 'info');
                      }}
                      disabled={isAnimating}
                      className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
                      style={{
                        accentColor: isDarkMode ? '#3b82f6' : '#2563eb',
                      }}
                    />
                    <div className="flex justify-between text-xs mt-2">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>t=2 (3 keys)</span>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>t=10 (19 keys)</span>
                    </div>
                    <div className={`mt-3 p-3 rounded-lg ${
                      isDarkMode ? 'bg-blue-900/30 border border-blue-700/30' : 'bg-blue-100/80 border border-blue-300/30'
                    }`}>
                      <div className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Current: <strong>B-Tree of order {2 * minDegree}</strong>
                        <br />
                        Max keys per node: <strong>{2 * minDegree - 1}</strong>
                        <br />
                        Max children per node: <strong>{2 * minDegree}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insert Operation */}
                <div className="space-y-3">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Insert Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyPress={handleInsertKeyPress}
                      placeholder="Enter value"
                      disabled={isAnimating}
                      className={`flex-1 px-3 py-2 rounded-xl border transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400'
                          : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50`}
                    />
                    <button
                      onClick={() => {
                        const value = parseInt(inputValue.trim());
                        if (!isNaN(value)) {
                          insertKey(value);
                          setInputValue('');
                        } else {
                          showMessage('Please enter a valid number', 'error');
                        }
                      }}
                      disabled={isAnimating || !inputValue.trim()}
                      className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${
                        isAnimating || !inputValue.trim()
                          ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                          : `${
                              isDarkMode
                                ? 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500/90 hover:to-emerald-500/90 text-white'
                                : 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 hover:from-green-600/90 hover:to-emerald-600/90 text-white'
                            } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                      }`}
                    >
                      Insert
                    </button>
                  </div>
                </div>

                {/* Search Operation */}
                <div className="space-y-3">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Search Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={searchValue}
                      onChange={e => setSearchValue(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      placeholder="Enter value"
                      disabled={isAnimating}
                      className={`flex-1 px-3 py-2 rounded-xl border transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400'
                          : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50`}
                    />
                    <button
                      onClick={() => {
                        const value = parseInt(searchValue.trim());
                        if (!isNaN(value)) {
                          searchKey(value);
                          setSearchValue('');
                        } else {
                          showMessage('Please enter a valid number', 'error');
                        }
                      }}
                      disabled={isAnimating || !searchValue.trim() || !root}
                      className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${
                        isAnimating || !searchValue.trim() || !root
                          ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                          : `${
                              isDarkMode
                                ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-500/90 hover:to-indigo-500/90 text-white'
                                : 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 hover:from-blue-600/90 hover:to-indigo-600/90 text-white'
                            } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                      }`}
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Delete Operation */}
                <div className="space-y-3">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Delete Key
                  </label>
                  <button
                    onClick={() => {
                      const value = parseInt(inputValue.trim());
                      if (!isNaN(value)) {
                        deleteKey(value);
                        setInputValue('');
                      } else {
                        showMessage('Please enter a valid number', 'error');
                      }
                    }}
                    disabled={isAnimating || !root}
                    className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      isAnimating || !root
                        ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                        : `${
                            isDarkMode
                              ? 'bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-500/90 hover:to-pink-500/90 text-white'
                              : 'bg-gradient-to-r from-red-500/90 to-pink-500/90 hover:from-red-600/90 hover:to-pink-600/90 text-white'
                          } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                    }`}
                  >
                    Delete Key
                  </button>
                </div>

                {/* Bulk Operations */}
                <div className="space-y-2">
                  <button
                    onClick={insertRandom}
                    disabled={isAnimating}
                    className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      isAnimating
                        ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                        : `${
                            isDarkMode
                              ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500/90 hover:to-pink-500/90 text-white'
                              : 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600/90 hover:to-pink-600/90 text-white'
                          } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                    }`}
                  >
                    Insert Random
                  </button>

                  <button
                    onClick={resetTree}
                    disabled={isAnimating}
                    className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      isAnimating
                        ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                        : `${
                            isDarkMode
                              ? 'bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500/90 hover:to-red-500/90 text-white'
                              : 'bg-gradient-to-r from-orange-500/90 to-red-500/90 hover:from-orange-600/90 hover:to-red-600/90 text-white'
                          } hover:shadow-lg hover:scale-102 hover:-translate-y-0.5`
                    }`}
                  >
                    Reset Tree
                  </button>
                </div>

                {/* Animation Speed Slider */}
                <div className="space-y-3">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Animation Speed: {animationSpeed}ms
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={animationSpeed}
                    onChange={e => setAnimationSpeed(parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
                    style={{
                      accentColor: isDarkMode ? '#3b82f6' : '#2563eb',
                    }}
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
                  B-Tree Pseudocode
                </h3>

                <div
                  className={`p-4 rounded-xl font-mono text-xs ${
                    isDarkMode
                      ? 'bg-slate-900/50 text-slate-200 border border-slate-700/30'
                      : 'bg-gray-100/80 text-gray-800 border border-gray-200/30'
                  } overflow-x-auto`}
                >
                  <div className="space-y-3">
                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        INSERT Operation:
                      </div>
                      <div className="pl-2 space-y-1 text-[10px] leading-relaxed">
                        <div>function insert(key):</div>
                        <div className="pl-4">if root is full:</div>
                        <div className="pl-8">create new root</div>
                        <div className="pl-8">split old root</div>
                        <div className="pl-4">insertNonFull(root, key)</div>
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        SEARCH Operation:
                      </div>
                      <div className="pl-2 space-y-1 text-[10px] leading-relaxed">
                        <div>function search(node, key):</div>
                        <div className="pl-4">i = 0</div>
                        <div className="pl-4">while i &lt; n and key &gt; node.keys[i]:</div>
                        <div className="pl-8">i++</div>
                        <div className="pl-4">if key == node.keys[i]:</div>
                        <div className="pl-8">return found</div>
                        <div className="pl-4">if node is leaf:</div>
                        <div className="pl-8">return not found</div>
                        <div className="pl-4">return search(node.children[i], key)</div>
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        DELETE Operation:
                      </div>
                      <div className="pl-2 space-y-1 text-[10px] leading-relaxed">
                        <div>function delete(node, key):</div>
                        <div className="pl-4">if key in node:</div>
                        <div className="pl-8">if node is leaf:</div>
                        <div className="pl-12">remove key</div>
                        <div className="pl-8">else:</div>
                        <div className="pl-12">replace with predecessor/successor</div>
                        <div className="pl-4">else:</div>
                        <div className="pl-8">delete from appropriate child</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'explanation' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Understanding B-Trees
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      📚 What is a B-Tree?
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      A B-Tree is a self-balancing tree data structure that maintains sorted data and allows searches,
                      sequential access, insertions, and deletions in logarithmic time. Perfect for databases and file
                      systems.
                    </p>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      ⚡ Key Properties
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li>• Each node has multiple keys (not just one)</li>
                      <li>• All leaves are at the same level</li>
                      <li>• Minimum degree t: each node has t-1 to 2t-1 keys</li>
                      <li>• Internal nodes can have t to 2t children</li>
                      <li>• Self-balancing through splits and merges</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      🚀 Time Complexity
                    </h4>
                    <div className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div>
                        • Search: <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">O(log n)</span>
                      </div>
                      <div>
                        • Insert: <span className="font-mono bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">O(log n)</span>
                      </div>
                      <div>
                        • Delete: <span className="font-mono bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">O(log n)</span>
                      </div>
                      <div>
                        • Space: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">O(n)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      💡 Real-World Applications
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li>• <strong>Databases:</strong> MySQL, PostgreSQL indexing</li>
                      <li>• <strong>File Systems:</strong> NTFS, ext4, HFS+</li>
                      <li>• <strong>Key-Value Stores:</strong> MongoDB, CouchDB</li>
                      <li>• <strong>Large Datasets:</strong> Efficient disk access</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      🎯 Advantages
                    </h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <li>• Reduces disk I/O operations</li>
                      <li>• Always balanced (same height for all leaves)</li>
                      <li>• Efficient for large data blocks</li>
                      <li>• Cache-friendly due to multiple keys per node</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tree Statistics
                </h3>

                <div className="space-y-3">
                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-gray-100/80 border border-gray-200/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        Total Nodes
                      </span>
                      <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.totalNodes}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-gray-100/80 border border-gray-200/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        Total Keys
                      </span>
                      <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.totalKeys}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode
                        ? 'bg-blue-900/30 border border-blue-700/30'
                        : 'bg-blue-100/80 border border-blue-300/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? 'text-blue-300' : 'text-blue-700'
                        }`}
                      >
                        Tree Height
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          isDarkMode ? 'text-blue-200' : 'text-blue-800'
                        }`}
                      >
                        {stats.height}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode
                        ? 'bg-purple-900/30 border border-purple-700/30'
                        : 'bg-purple-100/80 border border-purple-300/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? 'text-purple-300' : 'text-purple-700'
                        }`}
                      >
                        Order (t)
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          isDarkMode ? 'text-purple-200' : 'text-purple-800'
                        }`}
                      >
                        {minDegree}
                      </span>
                    </div>
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      Max keys per node: {2 * minDegree - 1}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-gray-100/80 border border-gray-200/30'
                    }`}
                  >
                    <div className="text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}">
                      Performance Metrics
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                          Search Complexity:
                        </span>
                        <span className={`font-mono font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          O(log n)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                          Insert Complexity:
                        </span>
                        <span className={`font-mono font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          O(log n)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                          Delete Complexity:
                        </span>
                        <span className={`font-mono font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                          O(log n)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
