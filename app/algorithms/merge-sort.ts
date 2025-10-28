// app/algorithms/merge-sort.ts
import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const mergeSortCode = [
  "function mergeSort(arr) {",
  "  if (arr.length <= 1) return arr;",
  "  const mid = Math.floor(arr.length / 2);",
  "  const left = mergeSort(arr.slice(0, mid));",
  "  const right = mergeSort(arr.slice(mid));",
  "  return merge(left, right);",
  "}",
  "",
  "function merge(left, right) {",
  "  const result = [];",
  "  let i = 0, j = 0;",
  "  while (i < left.length && j < right.length) {",
  "    if (left[i] <= right[j]) {",
  "      result.push(left[i++]);",
  "    } else {",
  "      result.push(right[j++]);",
  "    }",
  "  }",
  "  return result.concat(left.slice(i), right.slice(j));",
  "}"
];

// (Removed unused helper and global metadata variables to satisfy linter)

const generateMergeSortSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  // Start with initial state
  const initialArray: ArrayElement[] = inputArr.map(val => ({
    value: val,
    isComparing: false,
    isSwapping: false,
    isSorted: false
  }));

  steps.push({
    array: [...initialArray],
    i: -1,
    j: -1,
    description: "Starting Merge Sort algorithm",
    codeLineIndex: 0,
    comparisons,
    swaps
  });

  // We'll simulate merge sort recursively, but build steps immutably
  const recursiveMergeSort = (
    arr: ArrayElement[],
    startIndex: number
  ): ArrayElement[] => {
    if (arr.length <= 1) {
      if (arr.length === 1) {
        const stepArray = [...initialArray]; // base copy
        stepArray[startIndex] = { ...arr[0] };
        steps.push({
          array: stepArray,
          i: startIndex,
          j: startIndex,
          description: `Base case: [${arr[0].value}]`,
          codeLineIndex: 1,
          comparisons,
          swaps
        });
      }
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    // Record split
    const splitArray = [...initialArray];
    for (let i = 0; i < arr.length; i++) {
      splitArray[startIndex + i] = {
        ...arr[i],
        isSwapping: true // highlight as being processed
      };
    }
    steps.push({
      array: splitArray,
      i: startIndex,
      j: startIndex + arr.length - 1,
      description: `Splitting [${arr.map(e => e.value).join(', ')}]`,
      codeLineIndex: 2,
      comparisons,
      swaps
    });

    const sortedLeft = recursiveMergeSort(left, startIndex);
    const sortedRight = recursiveMergeSort(right, startIndex + mid);

    // Merge phase
    const merged: ArrayElement[] = [];
    let i = 0, j = 0;

    // Prepare base state for merge visualization
    const baseState = [...initialArray];
    // Copy current known sorted parts
    for (let k = 0; k < sortedLeft.length; k++) {
      baseState[startIndex + k] = { ...sortedLeft[k] };
    }
    for (let k = 0; k < sortedRight.length; k++) {
      baseState[startIndex + mid + k] = { ...sortedRight[k] };
    }

    while (i < sortedLeft.length && j < sortedRight.length) {
      // Highlight comparing elements
      const compareState = baseState.map((el, idx) => {
        if (
          idx === startIndex + i ||
          idx === startIndex + mid + j
        ) {
          return { ...el, isComparing: true, isSwapping: true };
        }
        return { ...el, isComparing: false };
      });

      steps.push({
        array: compareState,
        i: startIndex + i,
        j: startIndex + mid + j,
        description: `Comparing ${sortedLeft[i].value} and ${sortedRight[j].value}`,
        codeLineIndex: 11,
        comparisons: ++comparisons,
        swaps
      });

      if (sortedLeft[i].value <= sortedRight[j].value) {
        merged.push({ ...sortedLeft[i], isComparing: false, isSwapping: true });
        i++;
      } else {
        merged.push({ ...sortedRight[j], isComparing: false, isSwapping: true });
        j++;
      }

      // Show partial merge result
      const partialResult = [...initialArray];
      // Fill already merged part
      for (let k = 0; k < merged.length; k++) {
        partialResult[startIndex + k] = { ...merged[k], isSwapping: true };
      }
      // Fill remaining left/right
      for (let k = i; k < sortedLeft.length; k++) {
        partialResult[startIndex + merged.length + (k - i)] = { ...sortedLeft[k] };
      }
      for (let k = j; k < sortedRight.length; k++) {
        partialResult[startIndex + merged.length + (sortedLeft.length - i) + (k - j)] = { ...sortedRight[k] };
      }
      steps.push({
        array: partialResult,
        i: startIndex,
        j: startIndex + arr.length - 1,
        description: `Merging... current result: [${merged.map(e => e.value).join(', ')}]`,
        codeLineIndex: 13,
        comparisons,
        swaps: ++swaps
      });
    }

    // Add remaining
    while (i < sortedLeft.length) {
      merged.push({ ...sortedLeft[i] });
      i++;
    }
    while (j < sortedRight.length) {
      merged.push({ ...sortedRight[j] });
      j++;
    }

    // Final merged state — mark as sorted
    const finalMerged = merged.map(el => ({ ...el, isSorted: true, isSwapping: false, isComparing: false }));
    const finalState = [...initialArray];
    for (let k = 0; k < finalMerged.length; k++) {
      finalState[startIndex + k] = finalMerged[k];
    }

    steps.push({
      array: finalState,
      i: startIndex,
      j: startIndex + arr.length - 1,
      description: `Merged into [${finalMerged.map(e => e.value).join(', ')}]`,
      codeLineIndex: 18,
      comparisons,
      swaps: (swaps += merged.length)
    });

    return finalMerged;
  };

  if (inputArr.length > 0) {
    recursiveMergeSort(initialArray, 0);
  }

  // Final completion step — use the ACTUAL sorted result
  const lastStepArray = steps[steps.length - 1].array;
  const finalSortedArray = lastStepArray.map(el => ({
    ...el,
    isComparing: false,
    isSwapping: false,
    isSorted: true
    }));

    steps.push({
    array: finalSortedArray,
    i: -1,
    j: -1,
    description: "Merge Sort completed! Array is now sorted.",
    codeLineIndex: 19,
    comparisons,
    swaps
  });

  return steps;
};

export const mergeSortConfig: AlgorithmConfig = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'Divide and Conquer',
  description: 'Recursively divides the array in half, sorts each half, and merges them back together.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)'
  },
  spaceComplexity: 'O(n)',
  code: mergeSortCode,
  defaultInput: '38,27,43,3,9,82,10',
  generateSteps: generateMergeSortSteps
};