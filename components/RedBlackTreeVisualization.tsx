'use client';

import React, { useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// RB Tree node definition
interface RedBlackNode {
  id: string;
  value: number;
  color: 'red' | 'black';
  left?: RedBlackNode | null;
  right?: RedBlackNode | null;
  parent?: RedBlackNode | null;
  x?: number;
  y?: number;
  isHighlighted?: boolean;
  highlightType?: 'search' | 'insert' | 'delete' | 'rotate' | 'found' | 'double-black';
}

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

type Tab = 'controls' | 'pseudocode' | 'explanation' | 'stats';

function generateNodeId(val: number) {
  return `rbnode-${val}-${Math.random().toString(36).slice(2,8)}`;
}

// --- Utility deep-clone helper, now includes parent updates ---
function deepCloneRBTree(node: RedBlackNode | null, parent: RedBlackNode | null = null): RedBlackNode | null {
  if (!node) return null;
  const clone: RedBlackNode = {
    ...node,
    parent: parent ?? undefined // updated
  };
  clone.left = deepCloneRBTree(node.left || null, clone);
  clone.right = deepCloneRBTree(node.right || null, clone);
  return clone;
}

// Immutable Red-Black BST insert + fixup
function insertImmutable(root: RedBlackNode | null, value: number): [RedBlackNode, RedBlackNode] {
  // Returns newRoot, insertedNode (both fully linked, new objects)
  function insertRec(node: RedBlackNode | null, parent: RedBlackNode | null): [RedBlackNode, RedBlackNode] {
    if (!node) {
      const n: RedBlackNode = { id: generateNodeId(value), value, color: 'red', left: null, right: null, parent: parent ?? undefined };
      return [n, n];
    }
    if (value < node.value) {
      const [newLeft, inserted] = insertRec(node.left || null, node);
      return [{ ...node, left: newLeft, parent }, inserted];
    }
    if (value > node.value) {
      const [newRight, inserted] = insertRec(node.right || null, node);
      return [{ ...node, right: newRight, parent }, inserted];
    }
    // Duplicate (shouldn't happen)
    return [node, node]; // Should not reach
  }
  const [intermediate, inserted] = insertRec(root, null);
  return [fixUpInsert(intermediate, inserted), inserted];
}

// --- Fully functional, returns new tree root ---
function fixUpInsert(root: RedBlackNode, node: RedBlackNode): RedBlackNode {
  let curr = node;
  let updatedRoot = root;
  function getGrandparent(n: RedBlackNode): RedBlackNode | null {
    return n.parent && n.parent.parent ? n.parent.parent : null;
  }
  function getUncle(n: RedBlackNode): RedBlackNode | null {
    const gp = getGrandparent(n);
    if (!gp) return null;
    if (n.parent === gp.left) return gp.right || null;
    return gp.left || null;
  }
  // Climb up
  while (curr.parent && curr.parent.color === 'red') {
    const parent = curr.parent;
    const grandparent = getGrandparent(curr);
    const uncle = getUncle(curr);
    if (!grandparent) break;
    if (parent === grandparent.left) {
      if (uncle && uncle.color === 'red') {
        // Case 1: Uncle red
        parent.color = 'black';
        uncle.color = 'black';
        grandparent.color = 'red';
        curr = grandparent;
        continue;
      } else {
        // Uncle black
        if (curr === parent.right) {
          // Case 2: Curr is right child -> rotate left
          let newParent = leftRotate(grandparent, parent);
          if (grandparent === updatedRoot) updatedRoot = newParent;
          curr = parent;
        }
        // Case 3: Curr is left, rotate right on grandparent
        parent.color = 'black';
        grandparent.color = 'red';
        let newRoot = rightRotate(null, grandparent);
        if (!newRoot.parent) updatedRoot = newRoot;
      }
    } else {
      // Mirror
      if (uncle && uncle.color === 'red') {
        parent.color = 'black';
        uncle.color = 'black';
        grandparent.color = 'red';
        curr = grandparent;
        continue;
      } else {
        if (curr === parent.left) {
          let newParent = rightRotate(grandparent, parent);
          if (grandparent === updatedRoot) updatedRoot = newParent;
          curr = parent;
        }
        parent.color = 'black';
        grandparent.color = 'red';
        let newRoot = leftRotate(null, grandparent);
        if (!newRoot.parent) updatedRoot = newRoot;
      }
    }
  }
  updatedRoot.color = 'black';
  return updatedRoot;
}

// --- Rotations: returns new subtree root, updates parent pointers ---
function leftRotate(globalRoot: RedBlackNode | null, x: RedBlackNode): RedBlackNode {
  let y = x.right!;
  let beta = y.left || null;
  const xparent = x.parent;
  const yclone: RedBlackNode = { ...y };
  yclone.left = { ...x, right: beta, parent: undefined };
  if (beta) yclone.left.right = beta;
  yclone.parent = xparent;
  yclone.left.parent = yclone;
  if (xparent) {
    if (x === xparent.left) xparent.left = yclone;
    else xparent.right = yclone;
  }
  return yclone;
}
function rightRotate(globalRoot: RedBlackNode | null, y: RedBlackNode): RedBlackNode {
  let x = y.left!;
  let beta = x.right || null;
  const yparent = y.parent;
  const xclone: RedBlackNode = { ...x };
  xclone.right = { ...y, left: beta, parent: undefined };
  if (beta) xclone.right.left = beta;
  xclone.parent = yparent;
  xclone.right.parent = xclone;
  if (yparent) {
    if (yparent.left === y) yparent.left = xclone;
    else yparent.right = xclone;
  }
  return xclone;
}

// moved into component

export default function RedBlackTreeVisualization() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const canvasRef = useRef<HTMLDivElement>(null);

  const [treeRoot, setTreeRoot] = useState<RedBlackNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(550);
  const [activeTab, setActiveTab] = useState<Tab>('controls');
  const [stats, setStats] = useState({
    totalNodes: 0,
    height: 0,
    blackHeight: 0,
    lastOperation: '',
  });

  // --- Helper/Utils ---
  const showMessage = (text: string, type: Message['type']) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 2500);
  };
  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  // Count/measure helpers
  const countNodes = (node: RedBlackNode | null): number => node ? 1 + countNodes(node.left||null) + countNodes(node.right||null) : 0;
  const calcHeight = (node: RedBlackNode | null): number => node ? 1 + Math.max(calcHeight(node.left||null), calcHeight(node.right||null)) : 0;
  const calcBlackHeight = (node: RedBlackNode | null): number => {
    let h = 0;
    while (node) {
      if (node.color === 'black') h++;
      node = node.left || null;
    }
    return h;
  };

  // --- Main Insert/Search Logic ---
  async function insertValue(val: number) {
    if (isAnimating) return;
    setIsAnimating(true);
    let newRoot = deepCloneRBTree(treeRoot);
    let insertedPath: RedBlackNode[] = [];
    
    // insert just like BST, but always insert red
    function bstInsert(node: RedBlackNode | null, val: number, parent: RedBlackNode | null): RedBlackNode {
      if (!node) {
        const n: RedBlackNode = { id: generateNodeId(val), value: val, color: 'red', left: null, right: null, parent };
        insertedPath.push(n);
        return n;
      }
      if (val < node.value) {
        node.left = bstInsert(node.left||null, val, node);
      } else if (val > node.value) {
        node.right = bstInsert(node.right||null, val, node);
      }
      return node;
    }
    // root is special: always black
    if (!newRoot) {
      newRoot = { id: generateNodeId(val), value: val, color: 'black', left: null, right: null };
      setTreeRoot(deepCloneRBTree(newRoot));
      updateStats(newRoot, 'Insert');
      showMessage(`Inserted ${val} as root`, 'success');
      setIsAnimating(false);
      return;
    }
    // Check for duplicate
    let exists = false;
    (function checkDup(node: RedBlackNode | null) {
      if (!node) return;
      if (node.value === val) exists = true;
      else if (val < node.value) checkDup(node.left||null);
      else checkDup(node.right||null);
    })(newRoot);
    if (exists) {
      showMessage(`Value ${val} already exists!`, 'error');
      setIsAnimating(false);
      return;
    }
    newRoot = bstInsert(newRoot, val, null);

    setTreeRoot(deepCloneRBTree(newRoot));
    await sleep(animationSpeed);

    await fixRBTree(newRoot, insertedPath[0]);
    updateStats(newRoot, 'Insert');
    setIsAnimating(false);
    showMessage(`Inserted ${val} successfully`, 'success');
  }

  // Rebalance after insert
  async function fixRBTree(root: RedBlackNode, node: RedBlackNode) {
    let curr = node;
    const highlightAndRender = async (n: RedBlackNode, type: RedBlackNode['highlightType']) => {
      n.isHighlighted = true; n.highlightType = type;
      setTreeRoot(deepCloneRBTree(root));
      await sleep(animationSpeed);
      n.isHighlighted = false; n.highlightType = undefined;
    };

    // Main loop:
    while (curr.parent && curr.parent.color === 'red') {
      let parent = curr.parent;
      let grandparent = parent.parent;
      if (!grandparent) break;
      if (parent === grandparent.left) {
        let uncle = grandparent.right;
        if (uncle && uncle.color === 'red') {
          // color flip
          parent.color = 'black';
          uncle.color = 'black';
          grandparent.color = 'red';
          await highlightAndRender(parent, 'insert');
          await highlightAndRender(uncle, 'insert');
          await highlightAndRender(grandparent, 'insert');
          curr = grandparent;
        } else {
          // rotation
          if (curr === parent.right) {
            curr = parent;
            leftRotate(root, curr);
            await highlightAndRender(curr, 'rotate');
          }
          parent.color = 'black';
          grandparent.color = 'red';
          rightRotate(root, grandparent);
          await highlightAndRender(parent, 'rotate');
        }
      } else {
        // same as above, mirror
        let uncle = grandparent.left;
        if (uncle && uncle.color === 'red') {
          parent.color = 'black';
          uncle.color = 'black';
          grandparent.color = 'red';
          await highlightAndRender(parent, 'insert');
          await highlightAndRender(uncle, 'insert');
          await highlightAndRender(grandparent, 'insert');
          curr = grandparent;
        } else {
          if (curr === parent.left) {
            curr = parent;
            rightRotate(root, curr);
            await highlightAndRender(curr, 'rotate');
          }
          parent.color = 'black';
          grandparent.color = 'red';
          leftRotate(root, grandparent);
          await highlightAndRender(parent, 'rotate');
        }
      }
    }
    // final: root always black
    root.color = 'black';
    setTreeRoot(deepCloneRBTree(root));
  }

  async function searchRBValue(val: number) {
    setIsAnimating(true);
    let found = false;
    let curr = treeRoot;
    while (curr) {
      curr.isHighlighted = true;
      curr.highlightType = 'search';
      setTreeRoot(deepCloneRBTree(treeRoot));
      await sleep(animationSpeed);
      if (curr.value === val) {
        curr.highlightType = 'found';
        setTreeRoot(deepCloneRBTree(treeRoot));
        found = true;
        break;
      } else if (val < curr.value) curr = curr.left || null;
      else curr = curr.right || null;
    }
    setTimeout(() => {
      setTreeRoot(deepCloneRBTree(treeRoot));
    }, animationSpeed);
    setIsAnimating(false);
    if (found) showMessage(`Found value ${val}!`, 'success');
    else showMessage(`Value ${val} not in tree.`, 'error');
  }

  // --- Layout and render ---
  function computeRBLayout(
    node: RedBlackNode | null,
    x: number,
    y: number,
    depth: number,
    spread: number,
    parent: RedBlackNode | null = null,
  ): RedBlackNode | null {
    if (!node) return null;
    node.x = x;
    node.y = y;
    node.parent = parent || undefined;
    const levelGap = 80;
    const minSpread = 45;
    let nextSpread = Math.max(spread / 2, minSpread);
    if (node.left) computeRBLayout(node.left, x - nextSpread, y + levelGap, depth + 1, nextSpread, node);
    if (node.right) computeRBLayout(node.right, x + nextSpread, y + levelGap, depth + 1, nextSpread, node);
    return node;
  }
  function renderTree() {
    if (!treeRoot || !canvasRef.current) return null;
    const width = canvasRef.current.offsetWidth || 800;
    let rootCopy = deepCloneRBTree(treeRoot);
    computeRBLayout(rootCopy, width / 2, 60, 0, width * 0.35);
    function renderEdges(node: RedBlackNode | null): React.ReactNode[] {
      if (!node) return [];
      let lines: React.ReactNode[] = [];
      if (node.left)
        lines.push(<line key={node.id+':l'} x1={node.x ?? 0} y1={(node.y ?? 0)} x2={node.left.x ?? 0} y2={node.left.y ?? 0} stroke="#94a3b8" strokeWidth={2} />);
      if (node.right)
        lines.push(<line key={node.id+':r'} x1={node.x ?? 0} y1={(node.y ?? 0)} x2={node.right.x ?? 0} y2={node.right.y ?? 0} stroke="#94a3b8" strokeWidth={2} />);
      lines.push(...renderEdges(node.left || null));
      lines.push(...renderEdges(node.right || null));
      return lines;
    }
    function renderNodes(node: RedBlackNode | null): React.ReactNode[] {
      if (!node) return [];
      let color = node.color === 'red' ? (isDarkMode ? '#ef4444' : '#dc2626') : (isDarkMode ? '#1e293b' : '#fff');
      let strokeC = node.color === 'red' ? '#f87171' : (isDarkMode ? '#64748b' : '#64748b');
      let highlightClass = node.isHighlighted ? (node.highlightType === 'rotate' ? 'animate-spin-slow' : 'animate-pulse') : '';
      const hasRedRedViolation = node.color==='red' && ((node.left && node.left.color==='red') || (node.right && node.right.color==='red'));
      let children: React.ReactNode[] = [];
      if (node.left) {
        children = children.concat(renderNodes(node.left || null));
      } else {
        children.push(
          <g key={node.id+':nilL'}>
            <circle cx={(node.x ?? 0)-38} cy={(node.y ?? 0)+55} r={18} fill={isDarkMode?'#18181b':'#222'} stroke="#0f172a" strokeWidth={2} />
            <text x={(node.x ?? 0)-38} y={(node.y ?? 0)+60} fill="#fff" textAnchor="middle" fontSize="10">NIL</text>
          </g>
        );
      }
      if (node.right) {
        children = children.concat(renderNodes(node.right || null));
      } else {
        children.push(
          <g key={node.id+':nilR'}>
            <circle cx={(node.x ?? 0)+38} cy={(node.y ?? 0)+55} r={18} fill={isDarkMode?'#18181b':'#222'} stroke="#0f172a" strokeWidth={2} />
            <text x={(node.x ?? 0)+38} y={(node.y ?? 0)+60} fill="#fff" textAnchor="middle" fontSize="10">NIL</text>
          </g>
        );
      }
      return [
        <g key={node.id} className={highlightClass}>
          <circle cx={node.x ?? 0} cy={node.y ?? 0} r={24} fill={color} stroke={hasRedRedViolation ? '#f43f5e' : strokeC} strokeWidth={node.isHighlighted ? 6 : hasRedRedViolation ? 8 : 3} style={hasRedRedViolation ? {filter:'drop-shadow(0 0 12px #f87171)'} : undefined} />
          <text x={node.x ?? 0} y={(node.y ?? 0)+4} fill={node.isHighlighted ? '#fbbf24' : (node.color === 'red' ? '#fff' : '#334155')} textAnchor="middle" fontSize="16" fontWeight="bold">{node.value}</text>
          <circle cx={(node.x ?? 0)+14} cy={(node.y ?? 0)-16} r={7} fill={node.color==='red'? '#f43f5e':'#a3e635'} stroke="#334155" strokeWidth={2} />
          {node.isHighlighted && node.highlightType && <text x={node.x ?? 0} y={(node.y ?? 0)+32} textAnchor="middle" fontSize="11" fill="#059669">{node.highlightType}</text>}
          {hasRedRedViolation && <text x={node.x ?? 0} y={(node.y ?? 0)-32} textAnchor="middle" fontSize="11" fill="#f43f5e">Red-Red Violation</text>}
        </g>,
        ...children
      ];
    }
    return (
      <g>
        {renderEdges(rootCopy)}
        {renderNodes(rootCopy)}
      </g>
    );
  }

  // Stats
  function updateStats(root: RedBlackNode|null, op: string) {
    function allBlackHeights(node: RedBlackNode|null): number[] {
      if (!node) return [1];
      if (!node.left && !node.right) return [node.color==='black' ? 1 : 0];
      const leftB = allBlackHeights(node.left||null);
      const rightB = allBlackHeights(node.right||null);
      return [
        ...leftB.map(v=>v + (node.color==='black'?1:0)),
        ...rightB.map(v=>v + (node.color==='black'?1:0))
      ];
    }
    const allBH = allBlackHeights(root||null);
    const uniform = allBH.every((v) => v === allBH[0]);
    setStats({
      totalNodes: countNodes(root || null),
      height: calcHeight(root || null),
      blackHeight: uniform? allBH[0] : -1,
      lastOperation: op + (uniform ? '' : ' (Black Height Violation!)'),
    });
  }

  // ---- Controls handlers
  async function handleInsert() {
    const val = parseInt(inputValue);
    if (isNaN(val)) { showMessage('Please enter a valid number', 'error'); return; }
    if (treeRoot && (function find(n: RedBlackNode|null): boolean{if(!n)return false;if(n.value===val)return true; return find(n.left||null)||find(n.right||null);})(treeRoot)){
      showMessage(`Value ${val} already exists!`, 'error'); setInputValue(''); return;
    }
    setIsAnimating(true);
    await sleep(100);
    const [newRoot] = insertImmutable(treeRoot, val);
    setTreeRoot(newRoot);
    updateStats(newRoot,'Insert');
    setIsAnimating(false);
    setInputValue('');
  }
  async function handleSearch() {
    const val = parseInt(searchValue);
    if (isNaN(val)) { showMessage('Please enter a valid number', 'error'); return; }
    await searchRBValue(val);
    setSearchValue('');
  }
  function handleReset() {
    setTreeRoot(null);
    showMessage('Tree reset successfully', 'info');
    updateStats(null, 'Reset');
  }
  async function handleInsertRandom() {
    let r: number;
    let attempts = 0;
    function find(n: RedBlackNode | null): boolean {
      if (!n) return false;
      if (n.value === r) return true;
      return find(n.left || null) || find(n.right || null);
    }
    do {
      r = Math.floor(Math.random() * 99) + 1;
      attempts++;
      if (attempts > 30) break;
    } while (find(treeRoot || null));
    await insertValue(r);
  }

  // --- Main Render ---
  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* Canvas */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        {/* Message Display */}
        {message && (
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg '
          + (message.type === 'success' ? (isDarkMode ? 'bg-green-900/90 text-green-300' : 'bg-green-100/95 text-green-700')
              : message.type === 'error' ? (isDarkMode ? 'bg-red-900/90 text-red-300' : 'bg-red-100/95 text-red-700')
              : (isDarkMode ? 'bg-blue-900/90 text-blue-300' : 'bg-blue-100/95 text-blue-700')) + ' border backdrop-blur-sm'`}>
            {message.text}
          </div>
        )}
        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className={`flex-1 overflow-auto min-h-0 rounded-2xl ${isDarkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-white/30 border border-gray-200/30'} backdrop-blur-sm`}
        >
          {!treeRoot ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className={`w-24 h-24 rounded-2xl mb-4 flex items-center justify-center ${isDarkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-gray-100/50 border border-gray-200/30'} backdrop-blur-sm`}>
                <svg
                  className={`w-12 h-12 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Red-Black Tree is Empty</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Insert numbers to build the tree visualization</p>
            </div>
          ) : (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${canvasRef.current?.offsetWidth || 800} ${Math.max(stats.height * 100, 340)}`}
              className="min-h-full"
            >
              {renderTree()}
            </svg>
          )}
        </div>
      </div>

      {/* Sidebar (Tabs) */}
      <div className="w-96 flex flex-col min-h-0 overflow-hidden">
        {/* Tab Navigation */}
        <div className={`flex rounded-t-2xl flex-shrink-0 ${isDarkMode ? 'bg-slate-800/50 border-b border-slate-700/50' : 'bg-white/50 border-b border-gray-200/50'} backdrop-blur-sm`}>
          {[
            { id: 'controls', label: 'Controls', icon: '⚙️' },
            { id: 'pseudocode', label: 'Code', icon: '📝' },
            { id: 'explanation', label: 'Learn', icon: '📚' },
            { id: 'stats', label: 'Stats', icon: '📊' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
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
              <span className="mr-1">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
        {/* Tab Panels */}
        <div className={`flex-1 overflow-y-auto rounded-b-2xl ${isDarkMode ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-l border-r border-b border-slate-600/30' : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-l border-r border-b border-gray-200/30'} backdrop-blur-sm shadow-lg`}>
          <div className="p-5">
            {activeTab==='controls' && (
              <div className="space-y-6">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Red-Black Tree Operations</h3>
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Insert Value</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={e=>setInputValue(e.target.value)}
                      onKeyDown={e=>{if(e.key==='Enter') handleInsert();}}
                      disabled={isAnimating}
                      className={`flex-1 px-3 py-2 rounded-xl border transition-all duration-200 ${isDarkMode ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400' : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50`}
                      placeholder="Enter value"
                    />
                    <button className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${isAnimating||!inputValue.trim()? 'bg-slate-700/50 text-slate-500 cursor-not-allowed': isDarkMode?'bg-green-700/90 hover:bg-green-500':'bg-green-500/90 hover:bg-green-600/90 text-white hover:shadow-lg'}`}
                      onClick={handleInsert}
                      disabled={isAnimating || !inputValue.trim()}
                    >Insert</button>
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Search Value</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={searchValue}
                      onChange={e=>setSearchValue(e.target.value)}
                      onKeyDown={e=>{if(e.key==='Enter') handleSearch();}}
                      disabled={isAnimating}
                      className={`flex-1 px-3 py-2 rounded-xl border transition-all duration-200 ${isDarkMode ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400' : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50`}
                      placeholder="Enter value"
                    />
                    <button className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${isAnimating||!searchValue.trim()? 'bg-slate-700/50 text-slate-500 cursor-not-allowed': isDarkMode?'bg-blue-700/90 hover:bg-blue-500':'bg-blue-600/90 hover:bg-blue-800/90 text-white hover:shadow-lg'}`}
                      onClick={handleSearch}
                      disabled={isAnimating || !searchValue.trim()}
                    >Search</button>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className={`flex-1 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${isAnimating?'bg-slate-700/50 text-slate-500 cursor-not-allowed': isDarkMode?'bg-gradient-to-r from-purple-700/80 to-pink-700/80 hover:bg-purple-500/90':'bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:bg-purple-600/80 text-white hover:shadow-lg'}`}
                    onClick={handleInsertRandom}
                    disabled={isAnimating}
                  >Insert Random</button>
                  <button className={`flex-1 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${isAnimating?'bg-slate-700/50 text-slate-500 cursor-not-allowed': isDarkMode?'bg-red-700/80 hover:bg-red-500':'bg-red-600/80 hover:bg-red-700 text-white hover:shadow-lg'}`}
                    onClick={handleReset}
                    disabled={isAnimating}
                  >Reset</button>
                </div>
                <div className="space-y-2 mt-5">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Animation Speed: {animationSpeed}ms</label>
                  <input type="range" min={100} max={1700} step={50} value={animationSpeed}
                    onChange={e=>setAnimationSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
                    style={{accentColor: isDarkMode?'#3b82f6':'#2563eb'}}
                    disabled={isAnimating}
                  />
                  <div className="flex justify-between text-xs mt-1"><span>{'Fast'}</span><span>{'Slow'}</span></div>
                </div>
              </div>
            )}
            {activeTab==='pseudocode' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Red-Black Tree Pseudocode</h3>
                <div className={`p-4 rounded-xl font-mono text-xs ${isDarkMode ? 'bg-slate-900/50 text-slate-200 border border-slate-700/30' : 'bg-gray-100/80 text-gray-800 border border-gray-200/30'} overflow-x-auto`}>
                  <div className="space-y-3">
                    <div><span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} font-bold mb-2`}>INSERT:</span>
                      <pre className="pl-2">insert(value):{"\n"}  color new node red{"\n"}  BST insert{"\n"}  rebalance with rotations/color flips if parent is red{"\n"}  root always black</pre>
                    </div>
                    <div><span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-bold mb-2`}>SEARCH:</span>
                      <pre className="pl-2">search(value):{"\n"}  while current exists:{"\n"}    highlight current{"\n"}    if current.value == value: return FOUND{"\n"}    if value &lt; current.value: go left{"\n"}    else: go right{"\n"}  return NOT FOUND</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab==='explanation' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Red-Black Tree Properties</h3>
                <div className="space-y-3">
                  <ul className={`text-sm ml-5 ${isDarkMode?'text-slate-300':'text-gray-700'}`} style={{listStyle:'disc'}}>
                    <li>Every node is either <b>red</b> or <b>black</b>.</li>
                    <li>The <b>root is always black</b>.</li>
                    <li>All leaves (<b>NIL</b> nodes) are black. These are the visual external leaf placeholders.</li>
                    <li>If a node is red, both children must be black. (No red-red parent-child)</li>
                    <li>Every path from a node to its descendant NIL leaves has the <b>same number of black nodes</b> (“black-height”).</li>
                  </ul>
                  <p className="mt-2"><b>Additional Notes:</b> <ul className="ml-5" style={{listStyle:'circle'}}>
                    <li>The tree remains approximately balanced because of these rules.</li>
                    <li>During insert/delete, the tree may temporarily violate these rules. Rotations & recoloring fix it.</li>
                    <li>The height is always O(log n): all operations run in O(log n) time.</li>
                  </ul></p>
                </div>
              </div>
            )}
            {activeTab==='stats' && (
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tree Statistics</h3>
                <div className={`${isDarkMode ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-gray-100/80 border border-gray-200/30'} p-4 rounded-lg`}>
                  <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">Total Nodes</span> <span className="text-2xl font-bold">{stats.totalNodes}</span></div>
                </div>
                <div className={`${isDarkMode ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-gray-100/80 border border-gray-200/30'} p-4 rounded-lg`}>
                  <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">Tree Height</span> <span className="text-2xl font-bold">{stats.height}</span></div>
                </div>
                <div className={`${isDarkMode ? 'bg-green-900/30 border border-green-700/30' : 'bg-green-100/80 border border-green-300/30'} p-4 rounded-lg`}>
                  <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">Black Height</span> <span className="text-2xl font-bold">{stats.blackHeight}</span></div>
                </div>
                <div className={`${isDarkMode ? 'bg-blue-900/30 border border-blue-700/30' : 'bg-blue-100/80 border border-blue-300/30'} p-4 rounded-lg`}>
                  <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">Last Operation</span> <span className="text-lg font-bold">{stats.lastOperation}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}