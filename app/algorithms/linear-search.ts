// app/algorithms/linear-search.ts
import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const linearSearchCode = [
  'function linearSearch(arr, target) {',
  '  for (let i = 0; i < arr.length; i++) {',
  '    if (arr[i] === target) return i;',
  '  }',
  '  return -1;',
  '}'
];

export const generateLinearSearchSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];

  if (!inputArr || inputArr.length < 2) {
    steps.push({
      array: [],
      i: -1,
      j: -1,
      description: 'Invalid input. Provide at least array and target using the format: array|target',
      codeLineIndex: 0,
      comparisons: 0,
      swaps: 0
    });
    return steps;
  }

  const target = inputArr[0];
  const values = inputArr.slice(1);

  // create fresh ArrayElement objects (no shared refs)
  const arr: ArrayElement[] = values.map(v => ({
    value: v,
    isComparing: false,
    isSwapping: false,
    isSorted: false,
    isFound: false
  }));

  let comparisons = 0;

  // initial snapshot
  steps.push({
    array: arr.map(el => ({ ...el })),
    i: -1,
    j: -1,
    description: `Searching for ${target} using Linear Search.`,
    codeLineIndex: 0,
    comparisons,
    swaps: 0
  });

  for (let i = 0; i < arr.length; i++) {
    comparisons++;

    // snapshot: mark current comparing
    const snapshotCompare = arr.map((el, idx) => ({ ...el, isComparing: idx === i }));
    steps.push({
      array: snapshotCompare,
      i,
      j: -1,
      description: `Comparing target ${target} with element at index ${i} (${arr[i].value}).`,
      codeLineIndex: 1,
      comparisons,
      swaps: 0
    });

    if (arr[i].value === target) {
      // mark found on the real arr
      arr[i] = { ...arr[i], isComparing: false, isSorted: true, isFound: true };

      // push snapshot showing found state
      steps.push({
        array: arr.map(el => ({ ...el })),
        i,
        j: -1,
        description: `Found target ${target} at index ${i}.`,
        codeLineIndex: 2,
        comparisons,
        swaps: 0
      });

      // final snapshot
      steps.push({
        array: arr.map(el => ({ ...el })),
        i: -1,
        j: -1,
        description: `Search complete. Found at index ${i}.`,
        codeLineIndex: 3,
        comparisons,
        swaps: 0
      });

      return steps;
    } else {
      // mark as checked (not found)
      arr[i] = { ...arr[i], isComparing: false, isSorted: true, isFound: false };
      steps.push({
        array: arr.map(el => ({ ...el })),
        i,
        j: -1,
        description: `${arr[i].value} is not the target; continue searching.`,
        codeLineIndex: 1,
        comparisons,
        swaps: 0
      });
    }
  }

  // not found
  steps.push({
    array: arr.map(el => ({ ...el })),
    i: -1,
    j: -1,
    description: `Target ${target} not found in the array.`,
    codeLineIndex: 3,
    comparisons,
    swaps: 0
  });

  return steps;
};

export const linearSearchConfig: AlgorithmConfig = {
  id: 'linear-search',
  name: 'Linear Search',
  category: 'Algorithms',
  description: 'Search for a target value by checking each element sequentially.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)'
  },
  spaceComplexity: 'O(1)',
  code: linearSearchCode,
  defaultInput: '64,34,25,12,22|12', // **note**: array|target format (pipe required)
  generateSteps: generateLinearSearchSteps
};
