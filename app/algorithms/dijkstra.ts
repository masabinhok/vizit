
import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const dijkstraCode = [
  "function dijkstra(graph, src) {",
  "  let dist = new Array(graph.length).fill(Infinity);",
  "  let sptSet = new Array(graph.length).fill(false);",
  "  dist[src] = 0;",
  "  for (let count = 0; count < graph.length - 1; count++) {",
  "    let u = minDistance(dist, sptSet);",
  "    sptSet[u] = true;",
  "    for (let v = 0; v < graph.length; v++) {",
  "      if (!sptSet[v] && graph[u][v] !== 0 && ",
  "          dist[u] !== Infinity && dist[u] + graph[u][v] < dist[v]) {",
  "        dist[v] = dist[u] + graph[u][v];",
  "      }",
  "    }",
  "  }",
  "  return dist;",
  "}",
  "",
  "function minDistance(dist, sptSet) {",
  "  let min = Infinity, min_index = -1;",
  "  for (let v = 0; v < dist.length; v++) {",
  "    if (sptSet[v] === false && dist[v] <= min) {",
  "      min = dist[v];",
  "      min_index = v;",
  "    }",
  "  }",
  "  return min_index;",
  "}"
];

const generateDijkstraSteps = (graph: number[][], startNode: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const numNodes = graph.length;
  const distances: ArrayElement[] = Array.from({ length: numNodes }, (_, i) => ({
    value: Infinity,
    isComparing: false,
    isSwapping: false,
    isSorted: false,
    isSelected: i === startNode,
  }));
  distances[startNode].value = 0;

  steps.push({
    array: JSON.parse(JSON.stringify(distances)),
    i: -1,
    j: -1,
    description: `Starting Dijkstra\'s algorithm from node ${startNode}`,
    codeLineIndex: 0,
    comparisons: 0,
    swaps: 0,
    additionalInfo: { graph }
  });

  for (let count = 0; count < numNodes; count++) {
    let u = -1;
    let minDistance = Infinity;

    for (let i = 0; i < numNodes; i++) {
      if (!distances[i].isSorted && distances[i].value < minDistance) {
        minDistance = distances[i].value;
        u = i;
      }
    }

    if (u === -1) break;

    distances[u].isSorted = true; // Mark as visited
    distances[u].isSelected = true;

    steps.push({
      array: JSON.parse(JSON.stringify(distances)),
      i: u,
      j: -1,
      description: `Visiting node ${u}`,
      codeLineIndex: 6,
      comparisons: 0,
      swaps: 0,
      additionalInfo: { graph }
    });

    for (let v = 0; v < numNodes; v++) {
      if (
        !distances[v].isSorted &&
        graph[u][v] > 0 &&
        distances[u].value !== Infinity &&
        distances[u].value + graph[u][v] < distances[v].value
      ) {
        distances[v].isComparing = true;
        steps.push({
          array: JSON.parse(JSON.stringify(distances)),
          i: u,
          j: v,
          description: `Comparing distance to node ${v} through ${u}`,
          codeLineIndex: 9,
          comparisons: 0,
          swaps: 0,
          additionalInfo: { graph }
        });
        distances[v].value = distances[u].value + graph[u][v];
        steps.push({
          array: JSON.parse(JSON.stringify(distances)),
          i: u,
          j: v,
          description: `Updating distance to node ${v} to ${distances[v].value}`,
          codeLineIndex: 10,
          comparisons: 0,
          swaps: 0,
          additionalInfo: { graph }
        });
        distances[v].isComparing = false;
      }
    }
     distances[u].isSelected = false;
  }
  
  steps.push({
    array: JSON.parse(JSON.stringify(distances)),
    i: -1,
    j: -1,
    description: "Dijkstra\'s algorithm finished",
    codeLineIndex: 13,
    comparisons: 0,
    swaps: 0,
    additionalInfo: { graph }
  });


  return steps;
};

export const dijkstraConfig: AlgorithmConfig = {
  id: 'dijkstra',
  name: 'Dijkstra',
  category: 'Algorithms',
  description: 'Finds the shortest paths between nodes in a graph.',
  timeComplexity: {
    best: 'O(V^2)',
    average: 'O(V^2)',
    worst: 'O(V^2)',
  },
  spaceComplexity: 'O(V)',
  code: dijkstraCode,
  defaultInput: '[[0, 4, 0, 0, 0, 0, 0, 8, 0], [4, 0, 8, 0, 0, 0, 0, 11, 0], [0, 8, 0, 7, 0, 4, 0, 0, 2], [0, 0, 7, 0, 9, 14, 0, 0, 0], [0, 0, 0, 9, 0, 10, 0, 0, 0], [0, 0, 4, 14, 10, 0, 2, 0, 0], [0, 0, 0, 0, 0, 2, 0, 1, 6], [8, 11, 0, 0, 0, 0, 1, 0, 7], [0, 0, 2, 0, 0, 0, 6, 7, 0]]',
  generateSteps: (input: any) => {
    try {
      const graph = JSON.parse(input);
      if (!Array.isArray(graph) || !graph.every(row => Array.isArray(row))) {
        throw new Error("Invalid graph format");
      }
      return generateDijkstraSteps(graph, 0);
    } catch (e) {
      console.error("Failed to parse graph input:", e);
      return [];
    }
  },
};
