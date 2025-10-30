import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const countingSortCode = [
  "function countingSort(arr) {",
  "  const max = Math.max(...arr);",
  "  const count = new Array(max + 1).fill(0);",
  "  const output = new Array(arr.length);",
  "  ",
  "  // Count occurrences",
  "  for (let i = 0; i < arr.length; i++) {",
  "    count[arr[i]]++;",
  "  }",
  "  ",
  "  // Convert to cumulative count",
  "  for (let i = 1; i < count.length; i++) {",
  "    count[i] += count[i - 1];",
  "  }",
  "  ",
  "  // Build output array (stable)",
  "  for (let i = arr.length - 1; i >= 0; i--) {",
  "    output[count[arr[i]] - 1] = arr[i];",
  "    count[arr[i]]--;",
  "  }",
  "  ",
  "  return output;",
  "}"
];

const generateCountingSortSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  
  // Validate input
  if (inputArr.some(n => n < 0)) {
    throw new Error("Counting sort requires non-negative integers");
  }
  
  const arr: ArrayElement[] = inputArr.map(val => ({
    value: val,
    isComparing: false,
    isSwapping: false,
    isSorted: false
  }));

  // Track original indices to demonstrate stability
  const originalIndices = inputArr.map((_, idx) => idx);
  
  const n = arr.length;
  const max = Math.max(...inputArr);
  const countArray: number[] = new Array(max + 1).fill(0);
  const outputArray: ArrayElement[] = new Array(n).fill(null).map(() => ({
    value: -1,
    isComparing: false,
    isSwapping: false,
    isSorted: false
  }));
  
  let comparisons = 0;

  // Initial state
  steps.push({
    array: [...arr],
    countArray: [...countArray],
    outputArray: [...outputArray],
    originalIndices: [...originalIndices],
    description: `Starting Counting Sort. Input size: ${n}, Max value: ${max}. Key range: [0, ${max}]`,
    codeLineIndex: 0,
    phase: 'init',
    comparisons: 0
  });

  // Phase 1: Count occurrences
  steps.push({
    array: [...arr],
    countArray: [...countArray],
    outputArray: [...outputArray],
    originalIndices: [...originalIndices],
    description: "Phase 1: Counting occurrences of each element",
    codeLineIndex: 5,
    phase: 'counting',
    comparisons
  });

  for (let i = 0; i < n; i++) {
    const val = arr[i].value;
    
    // Highlight current element being counted
    const highlightedArr = arr.map((el, idx) => ({
      ...el,
      isComparing: idx === i,
      isSwapping: false
    }));
    
    steps.push({
      array: highlightedArr,
      countArray: [...countArray],
      outputArray: [...outputArray],
      originalIndices: [...originalIndices],
      currentIndex: i,
      currentValue: val,
      highlightCountIndex: val,
      description: `Counting element at index ${i}: value = ${val}. Incrementing count[${val}]`,
      codeLineIndex: 6,
      phase: 'counting',
      comparisons: ++comparisons
    });

    // Increment count
    countArray[val]++;
    
    steps.push({
      array: highlightedArr,
      countArray: [...countArray],
      outputArray: [...outputArray],
      originalIndices: [...originalIndices],
      currentIndex: i,
      currentValue: val,
      highlightCountIndex: val,
      description: `count[${val}] is now ${countArray[val]} (element ${val} appears ${countArray[val]} time${countArray[val] > 1 ? 's' : ''})`,
      codeLineIndex: 7,
      phase: 'counting',
      comparisons
    });
  }

  // Show completed counting array
  steps.push({
    array: arr.map(el => ({ ...el, isComparing: false })),
    countArray: [...countArray],
    outputArray: [...outputArray],
    originalIndices: [...originalIndices],
    description: `Phase 1 complete! Count array shows frequency of each value.`,
    codeLineIndex: 8,
    phase: 'counting',
    comparisons
  });

  // Phase 2: Convert to cumulative count
  steps.push({
    array: arr.map(el => ({ ...el, isComparing: false })),
    countArray: [...countArray],
    outputArray: [...outputArray],
    originalIndices: [...originalIndices],
    description: "Phase 2: Converting to cumulative counts (determines final positions)",
    codeLineIndex: 10,
    phase: 'cumulative',
    comparisons
  });

  for (let i = 1; i <= max; i++) {
    const oldValue = countArray[i];
    countArray[i] += countArray[i - 1];
    
    steps.push({
      array: arr.map(el => ({ ...el, isComparing: false })),
      countArray: [...countArray],
      outputArray: [...outputArray],
      originalIndices: [...originalIndices],
      highlightCountIndex: i,
      description: `count[${i}] = ${oldValue} + count[${i-1}] (${countArray[i-1] - oldValue}) = ${countArray[i]}. Elements ≤ ${i} will end at index ${countArray[i] - 1}`,
      codeLineIndex: 11,
      phase: 'cumulative',
      comparisons
    });
  }

  steps.push({
    array: arr.map(el => ({ ...el, isComparing: false })),
    countArray: [...countArray],
    outputArray: [...outputArray],
    originalIndices: [...originalIndices],
    description: "Phase 2 complete! Cumulative counts show final positions.",
    codeLineIndex: 13,
    phase: 'cumulative',
    comparisons
  });

  // Phase 3: Build output array (backward to maintain stability)
  steps.push({
    array: arr.map(el => ({ ...el, isComparing: false })),
    countArray: [...countArray],
    outputArray: [...outputArray],
    originalIndices: [...originalIndices],
    description: "Phase 3: Placing elements in output array (backward scan for stability)",
    codeLineIndex: 15,
    phase: 'placing',
    comparisons
  });

  const tempCountArray = [...countArray];
  
  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i].value;
    const outputPos = tempCountArray[val] - 1;
    
    // Highlight current element being placed
    const highlightedArr = arr.map((el, idx) => ({
      ...el,
      isComparing: idx === i,
      isSwapping: false
    }));
    
    steps.push({
      array: highlightedArr,
      countArray: [...tempCountArray],
      outputArray: [...outputArray],
      originalIndices: [...originalIndices],
      currentIndex: i,
      currentValue: val,
      highlightCountIndex: val,
      description: `Processing arr[${i}] = ${val}. count[${val}] = ${tempCountArray[val]}, so place at output[${outputPos}]`,
      codeLineIndex: 16,
      phase: 'placing',
      comparisons
    });

    // Place in output
    outputArray[outputPos] = {
      value: val,
      isComparing: false,
      isSwapping: true,
      isSorted: false
    };
    
    steps.push({
      array: highlightedArr,
      countArray: [...tempCountArray],
      outputArray: [...outputArray],
      originalIndices: [...originalIndices],
      currentIndex: i,
      currentValue: val,
      highlightCountIndex: val,
      description: `Placed ${val} at output[${outputPos}]. Original index: ${i}`,
      codeLineIndex: 17,
      phase: 'placing',
      comparisons
    });

    // Decrement count
    tempCountArray[val]--;
    
    steps.push({
      array: highlightedArr,
      countArray: [...tempCountArray],
      outputArray: [...outputArray],
      originalIndices: [...originalIndices],
      currentIndex: i,
      currentValue: val,
      highlightCountIndex: val,
      description: `Decremented count[${val}] to ${tempCountArray[val]} (for next occurrence of ${val})`,
      codeLineIndex: 18,
      phase: 'placing',
      comparisons
    });
  }

  // Mark all as sorted
  const sortedOutput = outputArray.map(el => ({
    ...el,
    isSwapping: false,
    isSorted: true
  }));

  steps.push({
    array: arr.map(el => ({ ...el, isComparing: false })),
    countArray: [...tempCountArray],
    outputArray: sortedOutput,
    originalIndices: [...originalIndices],
    description: "Counting Sort complete! Array is sorted stably in O(n + k) time.",
    codeLineIndex: 21,
    phase: 'complete',
    comparisons
  });

  return steps;
};

export const countingSortConfig: AlgorithmConfig = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: 'Non-Comparison Sorting',
  description: 'Stable integer sorting using counting array. Efficient when key range k is small relative to n.',
  timeComplexity: {
    best: 'O(n + k)',
    average: 'O(n + k)',
    worst: 'O(n + k)'
  },
  spaceComplexity: 'O(k)',
  code: countingSortCode,
  defaultInput: '4,2,2,8,3,3,1',
  generateSteps: generateCountingSortSteps
};

