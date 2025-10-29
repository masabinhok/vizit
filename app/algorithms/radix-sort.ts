

import { AlgorithmConfig, ArrayElement, AlgorithmStep } from '../../types';


const radixSortCode = [
  "function radixSortLSD(arr) {",
  "  const maxDigits = getMaxDigits(arr);",
  "",
  "  for (let pass = 0; pass < maxDigits; pass++) {",
  "    // Initialize 10 empty buckets (0-9)",
  "    let buckets = Array.from({ length: 10 }, () => []);",
  "",
  "    // Distribution Pass: Place elements into buckets",
  "    for (let i = 0; i < arr.length; i++) {",
  "      let digit = getDigit(arr[i].value, pass);",
  "      buckets[digit].push(arr[i]);",
  "    }",
  "",
  "    // Collection Pass: Reassemble array from buckets",
  "    let arrayIndex = 0;",
  "    for (let b = 0; b < 10; b++) {",
  "      while (buckets[b].length > 0) {",
  "        arr[arrayIndex++] = buckets[b].shift();",
  "      }",
  "    }",
  "  }",
  "  return arr;",
  "}"
];


const getMaxDigits = (arr: ArrayElement[]): number => {
  if (arr.length === 0) return 0;
  const maxVal = Math.max(...arr.map(el => el.value));
  return maxVal === 0 ? 1 : Math.floor(Math.log10(Math.abs(maxVal))) + 1;
};

const getDigit = (num: number, place: number): number => {
  return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
};


const createStep = (
  array: ArrayElement[],
  buckets: ArrayElement[][],
  description: string,
  codeLineIndex: number,
  passCompleted: number,
  totalPasses: number
): AlgorithmStep => ({
  array: array.map(el => ({ ...el })),
  buckets: buckets.map(bucket => bucket.map(el => ({ ...el }))),
  description,
  codeLineIndex,
  passCompleted,
  totalPasses,
});


const generateRadixSortSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr: ArrayElement[] = inputArr.map(value => ({
    value,
    isComparing: false,
    isSwapping: false,
    isSorted: false,
  }));

  const totalPasses = getMaxDigits(arr);
  if (totalPasses === 0) {
    return steps;
  }
  
  const passNames = ['Ones', 'Tens', 'Hundreds', 'Thousands']; // Add more if needed

  // Initial step
  steps.push(
    createStep(arr, [], 'Starting Radix Sort (LSD)', 0, 0, totalPasses)
  );

  for (let pass = 0; pass < totalPasses; pass++) {
    const passName = passNames[pass] || `10^${pass}`;
    const messagePrefix = `Pass ${pass + 1}/${totalPasses} (${passName} place)`;
    const buckets: ArrayElement[][] = Array.from({ length: 10 }, () => []);

   
    steps.push(
      createStep(arr, buckets, `${messagePrefix}: Distributing elements to buckets...`, 8,pass, totalPasses)
    );
    
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      const digit = getDigit(el.value, pass);

      
      arr[i].isComparing = true;
      steps.push(
        createStep(arr, buckets, `${messagePrefix}: Moving ${el.value} to bucket ${digit}`, 9,pass, totalPasses)
      );

      
      buckets[digit].push(el);
      arr[i].isComparing = false;
      steps.push(
        createStep(arr, buckets, `${messagePrefix}: Placed ${el.value} in bucket ${digit}`, 10 , pass, totalPasses)
      );
    }

    // --- Collection Pass ---
    let arrayIndex = 0;
    steps.push(
      createStep(arr, buckets, `${messagePrefix}: Collecting elements from buckets...`, 14,pass, totalPasses)
    );

    for (let b = 0; b < 10; b++) {
      while (buckets[b].length > 0) {
        const el = buckets[b].shift()!;

        el.isSwapping = true;
        steps.push(
          createStep(
            arr,
            buckets,
            `${messagePrefix}: Collecting ${el.value} from bucket ${b}`,
            16,
            pass,
            totalPasses
          )
        );

       
        arr[arrayIndex] = { ...el, isSwapping: false };
        steps.push(
          createStep(
            arr,
            buckets,
            `${messagePrefix}: Placing ${el.value} at index ${arrayIndex}`,
            17,
            pass,
            totalPasses
          )
        );
        arrayIndex++;
      }
    }
    
    
    steps.push(
      createStep(arr, buckets, `${messagePrefix}: Pass complete!`, 3 , pass + 1, totalPasses)
    );
  }

 
  arr.forEach(el => (el.isSorted = true));
  steps.push(
    createStep(arr, [], 'Radix Sort Complete!', 20, totalPasses, totalPasses)
  );

  return steps;
};


export const radixSortConfig: AlgorithmConfig = {
  id: 'radix-sort',
  name: 'Radix Sort (LSD)',
  category: 'Algorithms',
  description: 'A non-comparative sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position.',
  timeComplexity: {
    best: 'O(d(n + k))',
    average: 'O(d(n + k))',
    worst: 'O(d(n + k))'
  },
  spaceComplexity: 'O(n + k)',
  code: radixSortCode,
  defaultInput: '170, 45, 75, 90, 802, 24, 2, 66',
  generateSteps: generateRadixSortSteps
};