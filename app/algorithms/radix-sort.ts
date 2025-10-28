import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const radixSortCode = [
  "function radixSort(arr) {",
  "  let max = Math.max(...arr);",
  "  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {",
  "    countingSortByDigit(arr, exp);",
  "  }",
  "  return arr;",
  "}",
  "",
  "function countingSortByDigit(arr, exp) {",
  "  let n = arr.length;",
  "  let output = new Array(n).fill(0);",
  "  let count = new Array(10).fill(0);",
  "  for (let i = 0; i < n; i++) {",
  "    let digit = Math.floor(arr[i] / exp) % 10;",
  "    count[digit]++;",
  "  }",
  "  for (let i = 1; i < 10; i++) {",
  "    count[i] += count[i - 1];",
  "  }",
  "  for (let i = n - 1; i >= 0; i--) {",
  "    let digit = Math.floor(arr[i] / exp) % 10;",
  "    output[count[digit] - 1] = arr[i];",
  "    count[digit]--;",
  "  }",
  "  for (let i = 0; i < n; i++) {",
  "    arr[i] = output[i];",
  "  }",
  "}"
];

const getMax = (arr: ArrayElement[]): number => {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].value > max) {
      max = arr[i].value;
    }
  }
  return max;
};

const generateRadixSortSteps = (inputArr: number[]): AlgorithmStep[] => {
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
  if (n === 0) return steps;

  const max = getMax(arr);

  steps.push({
    array: [...arr.map(el => ({ ...el }))],
    description: "Starting Radix Sort algorithm",
    codeLineIndex: 0,
    i: -1,
    j: -1,
    comparisons,
    swaps
  });

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    steps.push({
      array: [...arr.map(el => ({ ...el, isComparing: false, isSwapping: false }))],
      description: `Starting pass for digit ${exp} (10^${Math.log10(exp)})`,
      codeLineIndex: 6,
      i: -1,
      j: -1,
      comparisons,
      swaps
    });

    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i].value / exp) % 10;
      buckets[digit].push(arr[i].value);
      comparisons++;

      const placingArr = arr.map((el, idx) => ({
        ...el,
        isComparing: idx === i,
        isSwapping: false
      }));

      steps.push({
        array: [...placingArr],
        description: `Placing ${arr[i].value} into bucket ${digit}`,
        codeLineIndex: 18,
        i,
        j: -1,
        comparisons,
        swaps
      });
    }

    let arrIndex = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        const value = buckets[i][j];
        const oldArrIndex = arr.findIndex((el, idx) => el.value === value && !el.isSorted);
        
        arr[arrIndex].value = value;
        swaps++;
        
        if (oldArrIndex !== -1) {
          arr[oldArrIndex].isSorted = true;
        }

        const collectingArr = arr.map((el, idx) => ({
          ...el,
          isComparing: idx === arrIndex,
          isSwapping: false
        }));

        if (oldArrIndex !== -1) {
          arr[oldArrIndex].isSorted = false;
        }

        steps.push({
          array: [...collectingArr],
          description: `Collecting ${value} from bucket ${i} and placing at index ${arrIndex}`,
          codeLineIndex: 29,
          i,
          j,
          comparisons,
          swaps
        });

        arrIndex++;
      }
    }

    if (Math.floor(max / (exp * 10)) === 0) {
      arr.forEach(el => el.isSorted = true);
    }

    steps.push({
      array: [...arr.map(el => ({ ...el, isComparing: false, isSwapping: false }))],
      description: `Completed pass for digit ${exp}. Array is now sorted by this digit.`,
      codeLineIndex: 35,
      i: -1,
      j: -1,
      comparisons,
      swaps
    });
  }

  steps.push({
    array: [...arr.map(el => ({ ...el, isComparing: false, isSwapping: false, isSorted: true }))],
    description: "Radix Sort completed! Array is now sorted.",
    codeLineIndex: 8,
    i: -1,
    j: -1,
    comparisons,
    swaps
  });

  return steps;
};

export const radixSortConfig: AlgorithmConfig = {
  id: 'radix-sort',
  name: 'Radix Sort',
  category: 'Algorithms',
  description: 'A non-comparative sorting algorithm that sorts integers by processing individual digits.',
  timeComplexity: {
    best: 'O(d(n+k))',
    average: 'O(d(n+k))',
    worst: 'O(d(n+k))'
  },
  spaceComplexity: 'O(n+k)',
  code: radixSortCode,
  defaultInput: '170,45,75,90,802,24,2,66',
  generateSteps: generateRadixSortSteps
};