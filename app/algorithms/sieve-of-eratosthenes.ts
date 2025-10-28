// app/algorithms/sieve-of-eratosthenes.ts
import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const sieveCode = [
  "function sieveOfEratosthenes(n) {",
  "  const isPrime = new Array(n + 1).fill(true);",
  "  isPrime[0] = isPrime[1] = false;",
  "  for (let p = 2; p * p <= n; p++) {",
  "    if (isPrime[p]) {",
  "      for (let i = p * p; i <= n; i += p) {",
  "        isPrime[i] = false;",
  "      }",
  "    }",
  "  }",
  "  return isPrime;",
  "}"
];

/**
 * generateSieveSteps
 * - Accepts inputArr: number[] where inputArr[0] = n (upper bound)
 * - Returns AlgorithmStep[] using the same step shape Bubble Sort uses
 */
export const generateSieveSteps = (inputArr: number[]): AlgorithmStep[] => {
  // sanitize input
  const raw = inputArr && inputArr.length > 0 ? inputArr[0] : NaN;
  const n = (typeof raw === 'number' && isFinite(raw) && raw >= 2) ? Math.floor(raw) : 30;

  const steps: AlgorithmStep[] = [];

  // create elements for values 2..n
  const arr: ArrayElement[] = Array.from({ length: n - 1 }, (_, idx) => ({
    value: idx + 2,
    isComparing: false,
    isSwapping: false,
    isSorted: false,
    // optional semantic flag (doesn't break VisualizationCanvas if it ignores it)
    isPrime: true as unknown as boolean
  } as ArrayElement));

  const isPrime: boolean[] = new Array(n + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  // initial step
  steps.push({
    array: [...arr],
    i: -1,
    j: -1,
    description: `Initialize numbers 2 → ${n}.`,
    codeLineIndex: 0,
    comparisons: 0,
    swaps: 0
  });

  let comparisons = 0;
  let swaps = 0;

  for (let p = 2; p * p <= n; p++) {
    comparisons++;
    const pIdx = p - 2;

    // highlight candidate p
    steps.push({
      array: arr.map((el, idx) => ({ ...el, isComparing: idx === pIdx, isSwapping: false })),
      i: pIdx,
      j: -1,
      description: `Consider ${p} as candidate prime.`,
      codeLineIndex: 3,
      comparisons,
      swaps
    });

    if (!isPrime[p]) {
      // already composite: mark presentation state and continue
      arr[pIdx] = { ...arr[pIdx], isPrime: false as any, isSorted: true, isComparing: false, isSwapping: false };
      steps.push({
        array: [...arr],
        i: pIdx,
        j: -1,
        description: `${p} already marked composite; skipping.`,
        codeLineIndex: 3,
        comparisons,
        swaps
      });
      continue;
    }

    // mark multiples of p
    for (let multiple = p * p; multiple <= n; multiple += p) {
      comparisons++;
      const multIdx = multiple - 2;

      // transient marking step (use isSwapping for action emphasis)
      steps.push({
        array: arr.map((el, idx) => ({ ...el, isComparing: idx === pIdx, isSwapping: idx === multIdx })),
        i: pIdx,
        j: multIdx,
        description: `Mark ${multiple} as composite (multiple of ${p}).`,
        codeLineIndex: 6,
        comparisons,
        swaps
      });

      // mark model
      isPrime[multiple] = false;
      arr[multIdx] = { ...arr[multIdx], isPrime: false as any, isSorted: true, isComparing: false, isSwapping: false };

      // snapshot after marking
      steps.push({
        array: [...arr],
        i: pIdx,
        j: -1,
        description: `${multiple} is marked composite.`,
        codeLineIndex: 6,
        comparisons,
        swaps
      });
    }

    // confirm p as prime visually
    arr[pIdx] = { ...arr[pIdx], isPrime: true as any, isSorted: true, isComparing: false, isSwapping: false };
    steps.push({
      array: [...arr],
      i: pIdx,
      j: -1,
      description: `${p} confirmed prime.`,
      codeLineIndex: 8,
      comparisons,
      swaps
    });
  }

  // finalize final visual flags (so canvas draws final state)
  for (let idx = 0; idx < arr.length; idx++) {
    arr[idx] = { ...arr[idx], isComparing: false, isSwapping: false, isSorted: arr[idx].isSorted || (arr[idx] as any).isPrime };
  }

  steps.push({
    array: [...arr],
    i: -1,
    j: -1,
    description: `Sieve complete up to ${n}.`,
    codeLineIndex: 10,
    comparisons,
    swaps
  });

  // final informational step listing primes (optional)
  const primes = arr.filter(a => (a as any).isPrime).map(a => a.value);
  steps.push({
    array: [...arr],
    i: -1,
    j: -1,
    description: `Primes: ${primes.join(', ')}`,
    codeLineIndex: 11,
    comparisons,
    swaps
  });

  return steps;
};

export const sieveConfig: AlgorithmConfig = {
  id: 'sieve-of-eratosthenes',
  name: 'Sieve of Eratosthenes',
  category: 'Math',
  description: 'Finds all prime numbers up to n by marking multiples.',
  timeComplexity: {
    best: 'O(n log log n)',
    average: 'O(n log log n)',
    worst: 'O(n log log n)'
  },
  spaceComplexity: 'O(n)',
  code: sieveCode,
  defaultInput: '30',
  generateSteps: generateSieveSteps
};
