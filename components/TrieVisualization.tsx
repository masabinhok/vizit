'use client';

import React, { useState, useRef, useEffect } from 'react';
// Assuming useTheme is in '@/contexts/ThemeContext' as per your code
// We will mock it for this self-contained example
// import { useTheme } from '@/contexts/ThemeContext';

// --- Mock useTheme for standalone example ---
// In the real project, you'd use the import above
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  return { resolvedTheme: theme };
};
// --- End of Mock ---

// --- Core Trie Data Structures ---

/**
 * Defines the state of a node for visualization.
 * - default: Normal state
 * - highlight: Currently being traversed
 * - found: Final node in a successful search/insert
 * - not-found: Node where a search path failed
 */
type NodeState = 'default' | 'highlight' | 'found' | 'not-found';

/**
 * Interface for a single node in the Trie.
 */
interface TrieNode {
  id: string; // Unique ID (e.g., "root-a-p")
  char: string;
  children: Record<string, TrieNode>;
  isEndOfWord: boolean;
  state: NodeState;
}

/**
 * Interface for a message displayed to the user.
 */
interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

/**
 * Interface for an entry in the operation history.
 */
interface OperationHistory {
  operation: string;
  value: string;
  timestamp: number;
}

type Tab = 'controls' | 'pseudocode' | 'explanation' | 'history';

// --- Helper Functions ---

/**
 * Creates a new, empty root node for the Trie.
 */
const createEmptyTrie = (): TrieNode => ({
  id: 'root',
  char: 'root',
  children: {},
  isEndOfWord: false,
  state: 'default',
});

/**
 * Recursively finds a node by its ID in the Trie.
 * @param node The node to start searching from.
 * @param id The ID to find.
 * @returns The found TrieNode or null.
 */
const findNodeInTrie = (node: TrieNode, id: string): TrieNode | null => {
  if (node.id === id) {
    return node;
  }
  for (const char in node.children) {
    const found = findNodeInTrie(node.children[char], id);
    if (found) {
      return found;
    }
  }
  return null;
};

/**
 * Recursively resets all node states to 'default'.
 * @param node The node to start from.
 * @returns A new TrieNode with all states reset.
 */
const resetAllNodeStates = (node: TrieNode): TrieNode => {
  const newChildren: Record<string, TrieNode> = {};
  for (const char in node.children) {
    newChildren[char] = resetAllNodeStates(node.children[char]);
  }
  return { ...node, state: 'default', children: newChildren };
};

/**
 * Recursively sets the state of a specific node by its ID.
 * @param node The node to start from.
 * @param id The ID of the node to update.
 * @param state The new state to set.
 * @returns A new TrieNode with the updated state.
 */
const setNodeState = (node: TrieNode, id: string, state: NodeState): TrieNode => {
  let newState = node.state;
  if (node.id === id) {
    newState = state;
  }

  const newChildren: Record<string, TrieNode> = {};
  for (const char in node.children) {
    newChildren[char] = setNodeState(node.children[char], id, state);
  }
  return { ...node, state: newState, children: newChildren };
};


// --- React Component ---

export default function TrieVisualization() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const [trie, setTrie] = useState<TrieNode>(createEmptyTrie());
  const [inputValue, setInputValue] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [message, setMessage] = useState<Message | null>(null);
  const [operationHistory, setOperationHistory] = useState<OperationHistory[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('controls');

  // --- Gemini API State ---
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [lastFoundWord, setLastFoundWord] = useState('');
  const [explanation, setExplanation] = useState('');
  // -------------------------

  // Refs for async functions
  const messageTimeout = useRef<NodeJS.Timeout | null>(null);
  const trieRef = useRef<TrieNode>(trie);

  // Keep ref in sync with state
  useEffect(() => {
    trieRef.current = trie;
  }, [trie]);

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const showMessage = (text: string, type: Message['type']) => {
    setMessage({ text, type });
    if (messageTimeout.current) clearTimeout(messageTimeout.current);
    messageTimeout.current = setTimeout(() => setMessage(null), 3000);
  };

  const addToHistory = (operation: string, value: string) => {
    setOperationHistory(prev => [
      { operation, value, timestamp: Date.now() },
      ...prev,
    ]);
  };

  /**
   * Clears the Trie and resets the visualization.
   */
  const clearTrie = () => {
    if (isRunning) return;
    setTrie(createEmptyTrie());
    setOperationHistory([]);
    setInputValue('');
    setLastFoundWord('');
    setExplanation('');
    showMessage('Trie cleared', 'info');
  };

  // --- Gemini API Call Helper ---

  /**
   * Generic function to call the Gemini API with error handling and retries.
   * @param prompt The text prompt to send to the model.
   * @param expectJson Whether to ask for a JSON response.
   * @returns The text or JSON string from the model.
   */
  const callGeminiApi = async (prompt: string, expectJson: boolean = false): Promise<string | null> => {
    const apiKey = ""; // Leave empty, will be handled by the environment
    const apiUrl = `https://generativethinking.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload: any = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    if (expectJson) {
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      };
    }

    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          return text;
        } else {
          throw new Error("Invalid API response structure.");
        }

      } catch (error) {
        retries--;
        if (retries === 0) {
          console.error("Gemini API call failed:", error);
          showMessage("Error connecting to Gemini API.", 'error');
          return null;
        }
        await sleep(delay);
        delay *= 2; // Exponential backoff
      }
    }
    return null;
  };

  // --- End of Gemini API ---


  /**
   * Inserts a word, but without the visualization steps. Used for bulk inserts.
   * @param word The word to insert.
   * @param currentTrie The trie state to update.
   * @returns The new TrieNode state.
   */
  const silentInsert = (word: string, currentTrie: TrieNode): TrieNode => {
    let newTrie = currentTrie; // Start with the provided trie
    let currentNodeId = 'root';
    let parentNode = findNodeInTrie(newTrie, currentNodeId);

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const isLastChar = i === word.length - 1;

      if (!parentNode) break; // Safety break

      let childNode = parentNode.children[char];

      if (!childNode) {
        // Node does not exist - create it
        // We must deep copy here to avoid mutation
        newTrie = JSON.parse(JSON.stringify(newTrie));
        parentNode = findNodeInTrie(newTrie, currentNodeId); // Re-find parent in new copy
        if (!parentNode) break;

        const newNodeId = `${currentNodeId}-${char}`;
        const newNode: TrieNode = {
          id: newNodeId,
          char: char,
          children: {},
          isEndOfWord: isLastChar,
          state: 'default'
        };
        parentNode.children[char] = newNode;
        currentNodeId = newNodeId;
        parentNode = newNode; // Move to the new node for next iteration
      } else {
        // Node exists - just traverse
        currentNodeId = childNode.id;
        
        // If it's the last char, we need to update isEndOfWord
        if (isLastChar && !childNode.isEndOfWord) {
          newTrie = JSON.parse(JSON.stringify(newTrie));
          let nodeToMark = findNodeInTrie(newTrie, currentNodeId);
          if (nodeToMark) nodeToMark.isEndOfWord = true;
        }
        
        parentNode = findNodeInTrie(newTrie, currentNodeId); // Find the child for the next iteration
      }
    }
    return newTrie;
  };


  /**
   * Visualizes the insertion of a word into the Trie.
   */
  const visualInsert = async (wordToInsert: string) => {
    const word = wordToInsert.trim().toLowerCase();
    if (!word.match(/^[a-z]+$/)) {
      showMessage('Please enter letters only (a-z)', 'error');
      return;
    }
    if (isRunning) {
      showMessage('Animation already running!', 'info');
      await sleep(speed); // Wait for other animation to finish
      if (isRunning) return; // Still running, just give up
    };

    setIsRunning(true);
    setTrie(prev => resetAllNodeStates(prev));
    await sleep(speed);

    let currentNodeId = 'root';

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const isLastChar = i === word.length - 1;

      // 1. Highlight current node
      setTrie(prev => setNodeState(prev, currentNodeId, 'highlight'));
      showMessage(`At node '${currentNodeId}'. Looking for char '${char}'...`, 'info');
      await sleep(speed);

      // 2. Find the *actual* node in the ref-Trie
      const parentNode = findNodeInTrie(trieRef.current, currentNodeId);
      if (!parentNode) break; // Should not happen

      const childNode = parentNode.children[char];

      if (!childNode) {
        // 3. Node does not exist - create it
        showMessage(`Char '${char}' not found. Creating new node.`, 'info');
        
        // Create a deep copy to safely mutate
        let newTrie = JSON.parse(JSON.stringify(trieRef.current));
        let newTrieParent = findNodeInTrie(newTrie, currentNodeId);
        
        if (newTrieParent) {
          const newNodeId = `${currentNodeId}-${char}`;
          const newNode: TrieNode = {
            id: newNodeId,
            char: char,
            children: {},
            isEndOfWord: isLastChar,
            state: 'highlight' // Highlight on creation
          };
          newTrieParent.children[char] = newNode;
          
          // Reset all other states
          newTrie = resetAllNodeStates(newTrie);
          // Re-highlight the new node
          let nodeToHighlight = findNodeInTrie(newTrie, newNodeId);
          if (nodeToHighlight) nodeToHighlight.state = 'highlight';

          setTrie(newTrie); // Set the new tree
          currentNodeId = newNodeId;
        }
        await sleep(speed);
      } else {
        // 4. Node exists - just traverse
        showMessage(`Char '${char}' found. Traversing...`, 'info');
        currentNodeId = childNode.id;

        // If it's the last char, we need to update isEndOfWord
        if (isLastChar && !childNode.isEndOfWord) {
          let newTrie = JSON.parse(JSON.stringify(trieRef.current));
          let nodeToMark = findNodeInTrie(newTrie, currentNodeId);
          if (nodeToMark) {
            nodeToMark.isEndOfWord = true;
          }
          setTrie(newTrie);
        }
      }
    }

    // 5. Mark final node as "found"
    setTrie(prev => setNodeState(prev, currentNodeId, 'found'));
    showMessage(`Word "${word}" inserted.`, 'success');
    addToHistory('INSERT', word);
    setIsRunning(false);
    setInputValue('');
  };

  /**
   * Visualizes searching for a word in the Trie.
   */
  const visualSearch = async () => {
    const word = inputValue.trim().toLowerCase();
    if (!word.match(/^[a-z]+$/)) {
      showMessage('Please enter letters only (a-z)', 'error');
      return;
    }
    if (isRunning) return;

    setIsRunning(true);
    setLastFoundWord(''); // Reset explanation
    setExplanation('');

    setTrie(prev => resetAllNodeStates(prev));
    await sleep(speed);

    let currentNodeId = 'root';

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      
      // 1. Highlight current node
      setTrie(prev => setNodeState(prev, currentNodeId, 'highlight'));
      showMessage(`At node '${currentNodeId}'. Looking for char '${char}'...`, 'info');
      await sleep(speed);

      // 2. Find node in ref-Trie
      const currentNode = findNodeInTrie(trieRef.current, currentNodeId);
      if (!currentNode) break;

      const childNode = currentNode.children[char];

      if (!childNode) {
        // 3. Node does not exist - Search failed
        setTrie(prev => setNodeState(prev, currentNodeId, 'not-found'));
        showMessage(`Char '${char}' not found. Word "${word}" does not exist.`, 'error');
        setIsRunning(false);
        addToHistory('SEARCH', word);
        return;
      } else {
        // 4. Node exists - traverse
        currentNodeId = childNode.id;
      }
    }

    // 5. Finished loop. Check if it's a word.
    const finalNode = findNodeInTrie(trieRef.current, currentNodeId);
    if (finalNode && finalNode.isEndOfWord) {
      setTrie(prev => setNodeState(prev, currentNodeId, 'found'));
      showMessage(`Word "${word}" found!`, 'success');
      setLastFoundWord(word); // <-- Set for explanation
    } else {
      setTrie(prev => setNodeState(prev, currentNodeId, 'not-found'));
      showMessage(`Prefix "${word}" found, but it's not a complete word.`, 'error');
    }
    
    addToHistory('SEARCH', word);
    setIsRunning(false);
    setInputValue('');
  };

  // --- Gemini Feature 1: Suggest Words ---
  const suggestWords = async () => {
    const prefix = inputValue.trim().toLowerCase();
    if (!prefix.match(/^[a-z]*$/)) {
      showMessage('Please enter letters only (a-z) for the prefix', 'error');
      return;
    }
    if (isRunning) return;

    setIsGeminiLoading(true);
    showMessage('✨ Asking Gemini for suggestions...', 'info');

    const prompt = `You are a helpful dictionary assistant. Give me 5 common English words that start with the prefix '${prefix}'. Respond ONLY with a valid JSON array of strings. Example: ["word1", "word2"]`;
    const response = await callGeminiApi(prompt, true);

    if (!response) {
      setIsGeminiLoading(false);
      showMessage('Gemini API call failed.', 'error');
      return;
    }

    let words: string[] = [];
    try {
      words = JSON.parse(response);
      if (!Array.isArray(words) || !words.every(w => typeof w === 'string')) {
        throw new Error("Invalid JSON format.");
      }
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      showMessage('Gemini returned an invalid response.', 'error');
      setIsGeminiLoading(false);
      return;
    }

    showMessage(`Found ${words.length} words! Inserting them now...`, 'success');
    
    // We will do a "silent" bulk insert first, then animate the last word
    let tempTrie = trieRef.current;
    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase().replace(/[^a-z]/g, '');
      if (word.length === 0) continue;
      
      addToHistory('INSERT', word);
      if (i < words.length - 1) {
        // Silently insert all but the last word
        tempTrie = silentInsert(word, tempTrie);
      }
    }
    
    // Set the state once with all intermediate words
    setTrie(tempTrie);
    
    // Now, visually insert the last word
    setIsGeminiLoading(false);
    await visualInsert(words[words.length - 1]);
  };
  
  // --- Gemini Feature 2: Get Explanation ---
  const getExplanation = async () => {
    if (isGeminiLoading || !lastFoundWord) return;
    
    setIsGeminiLoading(true);
    setExplanation('✨ Asking Gemini to explain...');
    
    const prompt = `You are a computer science tutor. Explain the word "${lastFoundWord}" in the context of data structures or computer science if applicable. Otherwise, give a general definition. Keep it concise (2-3 sentences).`;
    
    const response = await callGeminiApi(prompt, false);
    
    if (response) {
      setExplanation(response);
    } else {
      setExplanation('Sorry, I could not get an explanation.');
    }
    
    setIsGeminiLoading(false);
  };


  // Handle Enter key for inputs
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (inputValue.trim().length > 0) {
        visualInsert(inputValue);
      }
    }
  };

  // Cleanup message timer
  useEffect(() => {
    return () => {
      if (messageTimeout.current) clearTimeout(messageTimeout.current);
    };
  }, []);

  return (
    <div className="flex h-full gap-4">
      {/* Main Visualization Canvas */}
      <div className="flex-1 flex flex-col items-center justify-start min-h-0 relative">
        {/* Message Display */}
        {message && (
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg ${
            message.type === 'success'
              ? `${isDarkMode ? 'bg-green-900/90 text-green-300 border border-green-700/50' : 'bg-green-100/95 text-green-700 border border-green-300/50'}`
              : message.type === 'error'
              ? `${isDarkMode ? 'bg-red-900/90 text-red-300 border border-red-700/50' : 'bg-red-100/95 text-red-700 border border-red-300/50'}`
              : `${isDarkMode ? 'bg-blue-900/90 text-blue-300 border border-blue-700/50' : 'bg-blue-100/95 text-blue-700 border border-blue-300/50'}`
          } backdrop-blur-sm`}>
            {message.text}
          </div>
        )}
        
        {/* Visualization Area */}
        <div className={`flex-1 w-full h-full p-8 overflow-auto ${isDarkMode ? 'bg-slate-900/40' : 'bg-white/60'} rounded-lg border ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
          {Object.keys(trie.children).length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full">
              <RenderTrieNodeView node={trie} isDarkMode={isDarkMode} />
              <h3 className={`text-lg font-semibold mt-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Trie is Empty
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Insert words or use ✨ Suggest to build the visualization.
              </p>
            </div>
          ) : (
            <RenderTrieNodeView node={trie} isDarkMode={isDarkMode} />
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 flex flex-col">
        {/* Tab Navigation */}
        <div className={`flex rounded-t-2xl ${
          isDarkMode ? 'bg-slate-800/50 border-b border-slate-700/50' : 'bg-white/50 border-b border-gray-200/50'
        } backdrop-blur-sm`}>
          {[
            { id: 'controls', label: 'Controls', icon: '⚙️' },
            { id: 'pseudocode', label: 'Code', icon: '📝' },
            { id: 'explanation', label: 'Learn', icon: '📚' },
            { id: 'history', label: 'History', icon: '📜' }
          ].map((tab) => (
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
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={`flex-1 overflow-y-auto rounded-b-2xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-l border-r border-b border-slate-600/30' 
            : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-l border-r border-b border-gray-200/30'
        } backdrop-blur-sm shadow-lg`}>
          <div className="p-5">
            {activeTab === 'controls' && (
              <ControlsTab
                inputValue={inputValue}
                setInputValue={setInputValue}
                isAnimating={isRunning}
                isGeminiLoading={isGeminiLoading}
                speed={speed}
                setSpeed={setSpeed}
                onInsert={() => visualInsert(inputValue)}
                onSearch={visualSearch}
                onSuggest={suggestWords}
                onClear={clearTrie}
                onKeyPress={handleKeyPress}
                isDarkMode={isDarkMode}
              />
            )}
            {activeTab === 'pseudocode' && <PseudoCodeTab isDarkMode={isDarkMode} />}
            {activeTab === 'explanation' && (
              <ExplanationTab 
                isDarkMode={isDarkMode}
                lastFoundWord={lastFoundWord}
                explanation={explanation}
                onExplain={getExplanation}
                isGeminiLoading={isGeminiLoading}
              />
            )}
            {activeTab === 'history' && (
              <HistoryTab
                history={operationHistory}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Child Components for Tabs & Visualization ---

/**
 * Renders the Trie structure using nested flexbox.
 */
const RenderTrieNodeView = ({ node, isDarkMode }: { node: TrieNode, isDarkMode: boolean }) => {
  const stateClasses = {
    default: isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-gray-400 bg-gray-200 text-black',
    highlight: 'border-blue-500 ring-2 ring-blue-500/50 bg-blue-500/10 text-blue-300',
    found: 'border-green-500 ring-2 ring-green-500/50 bg-green-500/20 text-green-300',
    'not-found': 'border-red-500 ring-2 ring-red-500/50 bg-red-500/20 text-red-300',
  };

  // Sort children alphabetically
  const sortedChildren = Object.values(node.children).sort((a, b) => a.char.localeCompare(b.char));

  return (
    <div className="flex flex-col items-center p-2 relative">
      {/* The Node Itself */}
      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 flex-shrink-0
        ${stateClasses[node.state]}
        ${node.isEndOfWord ? (node.id === 'root' ? '' : 'ring-2 ring-offset-2 ring-emerald-500') : ''}
      `}>
        {node.id === 'root' ? 'R' : node.char}
        {node.isEndOfWord && node.id !== 'root' && (
           <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" title="End of word"></span>
        )}
      </div>

      {/* Children */}
      {sortedChildren.length > 0 && (
        <div className={`flex flex-row gap-2 pt-6 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-6 before:h-px before:w-full ${isDarkMode ? 'before:bg-slate-600' : 'before:bg-gray-300'}`}>
          {sortedChildren.map(child => (
            <div key={child.id} className={`flex flex-col items-center relative pt-6 before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2 before:top-0 before:h-6 before:w-px ${isDarkMode ? 'before:bg-slate-600' : 'before:bg-gray-300'}`}>
              <RenderTrieNodeView node={child} isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Renders the Controls Tab content.
 */
const ControlsTab = ({
  inputValue, setInputValue, isAnimating, isGeminiLoading, speed, setSpeed,
  onInsert, onSearch, onSuggest, onClear, onKeyPress, isDarkMode
}: any) => {
  const isLoading = isAnimating || isGeminiLoading;
  
  return (
    <div className="space-y-5">
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Trie Operations
      </h3>
      
      <div className="space-y-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
          onKeyPress={onKeyPress}
          placeholder="Enter a word (a-z)"
          disabled={isLoading}
          className={`w-full px-3 py-2 rounded-xl border transition-all duration-200 ${
            isDarkMode
              ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400'
              : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50`}
        />
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onInsert}
            disabled={isLoading || !inputValue.trim()}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              isLoading || !inputValue.trim()
                ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                : `${isDarkMode ? 'bg-green-600/80 hover:bg-green-500/90' : 'bg-green-500/90 hover:bg-green-600/90'} text-white hover:shadow-lg`
            }`}
          >
            Insert
          </button>
          <button
            onClick={onSearch}
            disabled={isLoading || !inputValue.trim()}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              isLoading || !inputValue.trim()
                ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
                : `${isDarkMode ? 'bg-blue-600/80 hover:bg-blue-500/90' : 'bg-blue-500/90 hover:bg-blue-600/90'} text-white hover:shadow-lg`
            }`}
          >
            Search
          </button>
        </div>
        
        {/* --- Gemini Suggest Button --- */}
        <button
          onClick={onSuggest}
          disabled={isLoading || !inputValue.trim()}
          className={`w-full px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isLoading || !inputValue.trim()
              ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
              : `${isDarkMode ? 'bg-purple-600/80 hover:bg-purple-500/90' : 'bg-purple-500/90 hover:bg-purple-600/90'} text-white hover:shadow-lg`
          }`}
        >
          {isGeminiLoading && !isAnimating ? (
            <>
              <Spinner /> Asking Gemini...
            </>
          ) : (
            '✨ Suggest Words'
          )}
        </button>
        
        <button
          onClick={onClear}
          disabled={isAnimating || isGeminiLoading}
          className={`w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            isAnimating || isGeminiLoading
              ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
              : `${isDarkMode ? 'bg-red-600/80 hover:bg-red-500/90' : 'bg-red-500/90 hover:bg-red-600/90'} text-white hover:shadow-lg`
          }`}
        >
          Clear Trie
        </button>
      </div>

      <div className="space-y-3">
        <h4 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
          Animation Speed
        </h4>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Slow</span>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={1100 - speed} // Invert slider for intuitive feel
            onChange={(e) => setSpeed(1100 - Number(e.target.value))}
            disabled={isAnimating || isGeminiLoading}
            className="w-full"
          />
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Fast</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the PseudoCode Tab content.
 */
const PseudoCodeTab = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className={`space-y-4 p-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Trie Pseudocode
    </h3>
    <pre className={`text-sm p-4 rounded-xl overflow-x-auto shadow-inner ${isDarkMode ? 'bg-slate-900/50 text-slate-200' : 'bg-gray-100 text-gray-800'}`}>
{`class TrieNode:
  children = {}
  isEndOfWord = false

class Trie:
  root = TrieNode()

  function insert(word):
    node = root
    for char in word:
      if char not in node.children:
        node.children[char] = TrieNode()
      node = node.children[char]
    node.isEndOfWord = true

  function search(word):
    node = root
    for char in word:
      if char not in node.children:
        return false (Not found)
      node = node.children[char]
    
    return node.isEndOfWord`}
    </pre>
  </div>
);

/**
 * Renders the Explanation Tab content.
 */
const ExplanationTab = ({ isDarkMode, lastFoundWord, explanation, onExplain, isGeminiLoading }: any) => (
  <div className={`space-y-4 p-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
    {/* --- Gemini Explanation Section --- */}
    {lastFoundWord && (
      <div className="space-y-3">
        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Dynamic Explanation
        </h4>
        <button
          onClick={onExplain}
          disabled={isGeminiLoading}
          className={`w-full px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isGeminiLoading
              ? `${isDarkMode ? 'bg-slate-700/50 text-slate-500' : 'bg-gray-200/50 text-gray-400'} cursor-not-allowed`
              : `${isDarkMode ? 'bg-purple-600/80 hover:bg-purple-500/90' : 'bg-purple-500/90 hover:bg-purple-600/90'} text-white hover:shadow-lg`
          }`}
        >
          {isGeminiLoading ? (
            <>
              <Spinner /> Asking Gemini...
            </>
          ) : (
            `✨ Explain "${lastFoundWord}"`
          )}
        </button>
        {explanation && (
          <p className={`text-sm p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/60' : 'bg-gray-100/80'}`}>
            {explanation}
          </p>
        )}
      </div>
    )}
    
    {/* --- Static Explanation Section --- */}
    <div className="space-y-4 pt-4 border-t border-slate-700/50">
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        What is a Trie (Prefix Tree)?
      </h3>
      <p className="text-sm">
        A **Trie** (also known as a prefix tree or digital tree) is a tree-like data structure used to efficiently store and retrieve keys in a dataset of strings.
      </p>
      <p className="text-sm">
        Unlike a binary search tree, nodes in the Trie do not store their associated keys. Instead, a node's position in the tree defines the key it's associated with.
      </p>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>The `root` node represents an empty string.</li>
        <li>Each node stores a map of `children` (e.g., 'a', 'b', 'c', ...).</li>
        <li>Each path from the root to a node represents a prefix.</li>
        <li>A special marker (`isEndOfWord`) indicates if a node represents the end of a complete word.</li>
      </ul>
      <h4 className={`font-semibold pt-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
        Time Complexity
      </h4>
      <p className="text-sm">
        Let **L** be the length of the word.
      </p>
      <ul className={`list-none text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
        <li>• Insert: <span className="font-mono bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">O(L)</span></li>
        <li>• Search: <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">O(L)</span></li>
        <li>• Prefix Search: <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">O(L)</span></li>
      </ul>
       <h4 className={`font-semibold pt-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
        Common Uses
      </h4>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>Autocomplete and predictive text.</li>
        <li>Spell checkers.</li>
        <li>Storing a dictionary for fast lookups.</li>
      </ul>
    </div>
  </div>
);

/**
 * Renders the History Tab content.
 */
const HistoryTab = ({ history, isDarkMode }: { history: OperationHistory[], isDarkMode: boolean }) => (
  <div className="space-y-3">
    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Operation History
    </h3>
    {history.length === 0 ? (
      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
        No operations performed yet.
      </p>
    ) : (
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((entry) => (
          <li key={entry.timestamp} className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800/60' : 'bg-gray-100/80'}`}>
            <div className="flex justify-between items-center text-sm">
              <span className={`font-semibold ${
                entry.operation === 'INSERT' ? (isDarkMode ? 'text-green-400' : 'text-green-600') :
                (isDarkMode ? 'text-blue-400' : 'text-blue-600')
              }`}>
                {entry.operation} ("{entry.value}")
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

/**
 * A simple loading spinner component.
 */
const Spinner = () => (
  <svg
    className={`animate-spin h-4 w-4 ${'text-white'}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);