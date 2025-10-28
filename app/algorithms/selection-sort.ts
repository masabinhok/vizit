import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const selectionSortCode = [
  "function selectionSort(arr) {",
  "  let n = arr.length;",
  "  for (let i = 0; i < n - 1; i++) {",
  "    let minIndex = i;",
  "    for (let j = i + 1; j < n; j++) {",
  "      if (arr[j] < arr[minIndex]) {",
  "        minIndex = j;",
  "      }",
  "    }",
  "    // Swap the found minimum element with the first element",
  "    let temp = arr[i];",
  "    arr[i] = arr[minIndex];",
  "    arr[minIndex] = temp;",
  "  }",
  "  return arr;",
  "}"
];

const generateSelectionSortSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr: ArrayElement[] = inputArr.map(val => ({
    value: val,
    isComparing: false,
    isSwapping: false,
    isSorted: false,
  }));

  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  steps.push({
    array: [...arr.map(el => ({ ...el }))],
    i: -1,
    j: -1,
    description: "Starting Selection Sort algorithm",
    codeLineIndex: 0,
    comparisons,
    swaps
  });

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    steps.push({
      array: [...arr.map((el, idx) => ({ ...el, isComparing: idx === i, isSwapping: false }))],
      i,
      j: -1,
      description: `Start of pass ${i + 1}. Assuming min is at index ${i} (value: ${arr[i].value}).`,
      codeLineIndex: 3,
      comparisons,
      swaps
    });

    for (let j = i + 1; j < n; j++) {
      const comparingArr = arr.map((el, idx) => ({
        ...el,
        isComparing: idx === j || idx === minIndex,
        isSwapping: false,
      }));
      
      steps.push({
        array: [...comparingArr],
        i,
        j,
        description: `Comparing index ${j} (value: ${arr[j].value}) with min index ${minIndex} (value: ${arr[minIndex].value})`,
        codeLineIndex: 5,
        comparisons: ++comparisons,
        swaps
      });

      if (arr[j].value < arr[minIndex].value) {
        minIndex = j;

        steps.push({
          array: [...arr.map((el, idx) => ({ ...el, isComparing: idx === j }))],
          i,
          j,
          description: `Found new minimum at index ${j} (value: ${arr[j].value})`,
          codeLineIndex: 6,
          comparisons,
          swaps
        });
      }
    }
    
    const swappingArr = arr.map((el, idx) => ({
      ...el,
      isComparing: false,
      isSwapping: idx === i || idx === minIndex,
    }));

    steps.push({
      array: [...swappingArr],
      i,
      j: -1,
      description: `Swapping element at index ${i} (value: ${arr[i].value}) with new minimum at index ${minIndex} (value: ${arr[minIndex].value})`,
      codeLineIndex: 10,
      comparisons,
      swaps: (i !== minIndex) ? ++swaps : swaps
    });

    const temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;

    arr[i].isSorted = true;
    steps.push({
      array: [...arr.map(el => ({ ...el, isComparing: false, isSwapping: false }))],
      i,
      j: -1,
      description: `Element ${arr[i].value} is now sorted in its correct position.`,
      codeLineIndex: 2,
      comparisons,
      swaps
    });
  }

  if (n > 0) {
    arr[n - 1].isSorted = true;
  }
  
  steps.push({
    array: [...arr.map(el => ({ ...el, isComparing: false, isSwapping: false }))],
    i: -1,
    j: -1,
    description: "Selection Sort completed! Array is now sorted.",
    codeLineIndex: 14,
    comparisons,
    swaps
  });

  return steps;
};

export const selectionSortConfig: AlgorithmConfig = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'Algorithms',
  description: 'In-place comparison sorting algorithm that repeatedly selects the minimum element from the unsorted part and puts it at the beginning.',
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  code: selectionSortCode,
  defaultInput: '64,34,25,12,22,11,90',
  generateSteps: generateSelectionSortSteps
};

