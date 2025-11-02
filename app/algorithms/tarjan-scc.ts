// Tarjan's Strongly Connected Components Algorithm Implementation
// Visualizes DFS with discovery times, low-link values, and SCC identification

export interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
  discoveryTime?: number;
  lowLink?: number;
  isOnStack?: boolean;
  isVisited?: boolean;
  isHighlighted?: boolean;
  sccId?: number;
  sccColor?: string;
}

export interface GraphEdge {
  from: number;
  to: number;
  isHighlighted?: boolean;
  isTreeEdge?: boolean;
  isBackEdge?: boolean;
}

export interface TarjanStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stack: number[];
  currentNode?: number;
  description: string;
  codeLineIndex: number;
  discoveryCounter: number;
  sccs: number[][];
  currentSCC?: number[];
  phase: 'initialization' | 'dfs' | 'scc-found' | 'complete';
  lowLinkUpdates?: { node: number; oldValue: number; newValue: number }[];
}

const tarjanCode = [
  "function tarjanSCC(graph) {",
  "  let index = 0;",
  "  let stack = [];", 
  "  let sccs = [];",
  "  let visited = new Set();",
  "",
  "  function dfs(node) {",
  "    // Initialize node",
  "    node.index = node.lowLink = index++;",
  "    stack.push(node);",
  "    node.onStack = true;",
  "    visited.add(node);",
  "",
  "    // Visit all neighbors",
  "    for (let neighbor of node.neighbors) {",
  "      if (!visited.has(neighbor)) {",
  "        dfs(neighbor);",
  "        node.lowLink = Math.min(node.lowLink, neighbor.lowLink);",
  "      } else if (neighbor.onStack) {",
  "        node.lowLink = Math.min(node.lowLink, neighbor.index);",
  "      }",
  "    }",
  "",
  "    // Root of SCC found",
  "    if (node.lowLink === node.index) {",
  "      let scc = [];",
  "      let current;",
  "      do {",
  "        current = stack.pop();",
  "        current.onStack = false;",
  "        scc.push(current);",
  "      } while (current !== node);",
  "      sccs.push(scc);",
  "    }",
  "  }",
  "",
  "  // Run DFS from all unvisited nodes",
  "  for (let node of graph.nodes) {",
  "    if (!visited.has(node)) {",
  "      dfs(node);",
  "    }",
  "  }",
  "  return sccs;",
  "}"
];

// Predefined graph layouts for demonstration
export const defaultGraphs = {
  simple: {
    nodes: [
      { id: 0, label: 'A', x: 100, y: 100 },
      { id: 1, label: 'B', x: 300, y: 100 },
      { id: 2, label: 'C', x: 200, y: 250 }
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 0 }
    ]
  },
  complex: {
    nodes: [
      { id: 0, label: 'A', x: 100, y: 100 },
      { id: 1, label: 'B', x: 300, y: 100 },
      { id: 2, label: 'C', x: 500, y: 100 },
      { id: 3, label: 'D', x: 200, y: 250 },
      { id: 4, label: 'E', x: 400, y: 250 },
      { id: 5, label: 'F', x: 300, y: 400 }
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 1 },
      { from: 1, to: 3 },
      { from: 3, to: 0 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 3 }
    ]
  },
  cyclic: {
    nodes: [
      { id: 0, label: 'A', x: 150, y: 100 },
      { id: 1, label: 'B', x: 350, y: 100 },
      { id: 2, label: 'C', x: 450, y: 250 },
      { id: 3, label: 'D', x: 350, y: 400 },
      { id: 4, label: 'E', x: 150, y: 400 },
      { id: 5, label: 'F', x: 50, y: 250 }
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 0 },
      { from: 2, to: 0 },
      { from: 4, to: 1 }
    ]
  }
};

// Generate color for SCC
const getSCCColor = (sccId: number): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#82E0AA', '#F8C471'
  ];
  return colors[sccId % colors.length];
};

// Build adjacency list from edges
const buildAdjacencyList = (nodes: GraphNode[], edges: GraphEdge[]): Map<number, number[]> => {
  const adjacencyList = new Map<number, number[]>();
  
  // Initialize empty lists
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });
  
  // Add edges
  edges.forEach(edge => {
    adjacencyList.get(edge.from)?.push(edge.to);
  });
  
  return adjacencyList;
};

export const generateTarjanSteps = (
  inputNodes: GraphNode[], 
  inputEdges: GraphEdge[]
): TarjanStep[] => {
  const steps: TarjanStep[] = [];
  
  // Initialize nodes
  const nodes: GraphNode[] = inputNodes.map(node => ({
    ...node,
    discoveryTime: undefined,
    lowLink: undefined,
    isOnStack: false,
    isVisited: false,
    isHighlighted: false,
    sccId: undefined,
    sccColor: undefined
  }));
  
  const edges: GraphEdge[] = inputEdges.map(edge => ({ ...edge }));
  const adjacencyList = buildAdjacencyList(nodes, edges);
  
  let discoveryCounter = 0;
  const stack: number[] = [];
  const visited = new Set<number>();
  const sccs: number[][] = [];
  let sccCounter = 0;

  // Initial state
  steps.push({
    nodes: nodes.map(n => ({ ...n })),
    edges: edges.map(e => ({ ...e })),
    stack: [...stack],
    description: "Starting Tarjan's SCC algorithm. We'll use DFS with discovery times and low-link values.",
    codeLineIndex: 0,
    discoveryCounter,
    sccs: [...sccs],
    phase: 'initialization'
  });

  // DFS function
  const dfs = (nodeId: number) => {
    const node = nodes[nodeId];
    
    // Initialize node
    node.discoveryTime = discoveryCounter;
    node.lowLink = discoveryCounter;
    node.isVisited = true;
    node.isOnStack = true;
    node.isHighlighted = true;
    discoveryCounter++;
    stack.push(nodeId);
    visited.add(nodeId);

    steps.push({
      nodes: nodes.map(n => ({ ...n })),
      edges: edges.map(e => ({ ...e })),
      stack: [...stack],
      currentNode: nodeId,
      description: `Visiting node ${node.label}. Discovery time: ${node.discoveryTime}, Low-link: ${node.lowLink}`,
      codeLineIndex: 8,
      discoveryCounter,
      sccs: [...sccs],
      phase: 'dfs'
    });

    // Visit all neighbors
    const neighbors = adjacencyList.get(nodeId) || [];
    
    for (const neighborId of neighbors) {
      const neighbor = nodes[neighborId];
      
      // Highlight current edge
      const currentEdge = edges.find(e => e.from === nodeId && e.to === neighborId);
      if (currentEdge) {
        currentEdge.isHighlighted = true;
      }

      if (!visited.has(neighborId)) {
        // Tree edge
        if (currentEdge) {
          currentEdge.isTreeEdge = true;
        }
        
        steps.push({
          nodes: nodes.map(n => ({ ...n })),
          edges: edges.map(e => ({ ...e })),
          stack: [...stack],
          currentNode: neighborId,
          description: `Exploring unvisited neighbor ${neighbor.label} from ${node.label}`,
          codeLineIndex: 15,
          discoveryCounter,
          sccs: [...sccs],
          phase: 'dfs'
        });

        // Recursive DFS
        dfs(neighborId);
        
        // Update low-link after return from recursion
        const oldLowLink: number = node.lowLink!;
        node.lowLink = Math.min(node.lowLink!, neighbor.lowLink!);
        
        if (oldLowLink !== node.lowLink) {
          steps.push({
            nodes: nodes.map(n => ({ ...n })),
            edges: edges.map(e => ({ ...e })),
            stack: [...stack],
            currentNode: nodeId,
            description: `Updated low-link of ${node.label} from ${oldLowLink} to ${node.lowLink} (min with ${neighbor.label}'s low-link: ${neighbor.lowLink})`,
            codeLineIndex: 17,
            discoveryCounter,
            sccs: [...sccs],
            phase: 'dfs',
            lowLinkUpdates: [{ node: nodeId, oldValue: oldLowLink, newValue: node.lowLink }]
          });
        }
        
      } else if (neighbor.isOnStack) {
        // Back edge
        if (currentEdge) {
          currentEdge.isBackEdge = true;
        }
        
        const oldLowLink: number = node.lowLink!;
        node.lowLink = Math.min(node.lowLink!, neighbor.discoveryTime!);
        
        steps.push({
          nodes: nodes.map(n => ({ ...n })),
          edges: edges.map(e => ({ ...e })),
          stack: [...stack],
          currentNode: nodeId,
          description: `Back edge to ${neighbor.label} (on stack). Updated low-link of ${node.label} from ${oldLowLink} to ${node.lowLink}`,
          codeLineIndex: 19,
          discoveryCounter,
          sccs: [...sccs],
          phase: 'dfs',
          lowLinkUpdates: [{ node: nodeId, oldValue: oldLowLink, newValue: node.lowLink }]
        });
      }

      // Reset edge highlighting
      if (currentEdge) {
        currentEdge.isHighlighted = false;
      }
    }

    // Check if node is root of SCC
    if (node.lowLink === node.discoveryTime) {
      const scc: number[] = [];
      let current: number;
      
      steps.push({
        nodes: nodes.map(n => ({ ...n })),
        edges: edges.map(e => ({ ...e })),
        stack: [...stack],
        currentNode: nodeId,
        description: `Node ${node.label} is root of SCC (low-link = discovery time = ${node.discoveryTime}). Popping SCC from stack...`,
        codeLineIndex: 23,
        discoveryCounter,
        sccs: [...sccs],
        phase: 'scc-found'
      });

      // Pop SCC from stack
      do {
        current = stack.pop()!;
        const currentNode = nodes[current];
        currentNode.isOnStack = false;
        currentNode.sccId = sccCounter;
        currentNode.sccColor = getSCCColor(sccCounter);
        scc.push(current);
        
        steps.push({
          nodes: nodes.map(n => ({ ...n })),
          edges: edges.map(e => ({ ...e })),
          stack: [...stack],
          currentNode: current,
          description: `Popped ${currentNode.label} from stack. ${current === nodeId ? 'SCC complete!' : 'Continuing to pop...'}`,
          codeLineIndex: 27,
          discoveryCounter,
          sccs: [...sccs],
          currentSCC: [...scc],
          phase: 'scc-found'
        });
        
      } while (current !== nodeId);

      sccs.push(scc);
      sccCounter++;
      
      steps.push({
        nodes: nodes.map(n => ({ ...n })),
        edges: edges.map(e => ({ ...e })),
        stack: [...stack],
        description: `SCC ${sccCounter} found: [${scc.map(id => nodes[id].label).join(', ')}]`,
        codeLineIndex: 31,
        discoveryCounter,
        sccs: [...sccs],
        phase: 'scc-found'
      });
    }

    // Reset highlighting
    node.isHighlighted = false;
  };

  // Run DFS from all unvisited nodes
  for (let i = 0; i < nodes.length; i++) {
    if (!visited.has(i)) {
      steps.push({
        nodes: nodes.map(n => ({ ...n })),
        edges: edges.map(e => ({ ...e })),
        stack: [...stack],
        currentNode: i,
        description: `Starting DFS from unvisited node ${nodes[i].label}`,
        codeLineIndex: 35,
        discoveryCounter,
        sccs: [...sccs],
        phase: 'dfs'
      });
      
      dfs(i);
    }
  }

  // Final state
  steps.push({
    nodes: nodes.map(n => ({ ...n })),
    edges: edges.map(e => ({ ...e })),
    stack: [],
    description: `Tarjan's SCC algorithm complete! Found ${sccs.length} strongly connected component(s).`,
    codeLineIndex: 39,
    discoveryCounter,
    sccs: [...sccs],
    phase: 'complete'
  });

  return steps;
};

export const tarjanSCCConfig = {
  id: 'tarjan-scc',
  name: "Tarjan's Strongly Connected Components",
  category: 'Graphs',
  description: 'Find strongly connected components using DFS with discovery times and low-link values',
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)'
  },
  spaceComplexity: 'O(V)',
  code: tarjanCode,
  defaultGraphs,
  generateSteps: generateTarjanSteps
};