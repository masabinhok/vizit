import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const bubbleSortCode = [
  "function bubbleSort(arr) {",
  "  let n = arr.length;",
  "  for (let i = 0; i < n - 1; i++) {",
  "    for (let j = 0; j < n - i - 1; j++) {",
  "      if (arr[j] > arr[j + 1]) {",
  "        // Swap elements",
  "        let temp = arr[j];",
  "        arr[j] = arr[j + 1];",
  "        arr[j + 1] = temp;",
  "      }",
  "    }",
  "  }",
  "  return arr;",
  "}"
];

const generateBubbleSortSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr: ArrayElement[] = inputArr.map(val => ({
    value: val,
    isComparing: false,
    isSwapping: false,
    isSorted: false
  }));

  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  // Initial state
  steps.push({
    array: [...arr],
    i: -1,
    j: -1,
    description: "Starting Bubble Sort algorithm",
    codeLineIndex: 0,
    comparisons,
    swaps
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing step
      const comparingArr = arr.map((el, idx) => ({
        ...el,
        isComparing: idx === j || idx === j + 1,
        isSwapping: false
      }));
      
      steps.push({
        array: [...comparingArr],
        i,
        j,
        description: `Comparing elements at positions ${j} and ${j + 1}: ${arr[j].value} vs ${arr[j + 1].value}`,
        codeLineIndex: 4,
        comparisons: ++comparisons,
        swaps
      });

      if (arr[j].value > arr[j + 1].value) {
        // Swapping step
        const swappingArr = arr.map((el, idx) => ({
          ...el,
          isComparing: false,
          isSwapping: idx === j || idx === j + 1
        }));

        steps.push({
          array: [...swappingArr],
          i,
          j,
          description: `Swapping ${arr[j].value} and ${arr[j + 1].value}`,
          codeLineIndex: 7,
          comparisons,
          swaps: ++swaps
        });

        // Perform swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
    
    // Mark element as sorted
    arr[n - 1 - i].isSorted = true;
    steps.push({
      array: [...arr.map(el => ({ ...el, isComparing: false, isSwapping: false }))],
      i,
      j: -1,
      description: `Element ${arr[n - 1 - i].value} is now in its correct position`,
      codeLineIndex: 3,
      comparisons,
      swaps
    });
  }

  // Mark first element as sorted
  arr[0].isSorted = true;
  steps.push({
    array: [...arr.map(el => ({ ...el, isComparing: false, isSwapping: false }))],
    i: -1,
    j: -1,
    description: "Bubble Sort completed! Array is now sorted.",
    codeLineIndex: 12,
    comparisons,
    swaps
  });

  return steps;
};

export const bubbleSortConfig: AlgorithmConfig = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Algorithms',
  description: 'Simple comparison-based sorting algorithm',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  code: bubbleSortCode,
  defaultInput: '64,34,25,12,22,11,90',
  generateSteps: generateBubbleSortSteps
};