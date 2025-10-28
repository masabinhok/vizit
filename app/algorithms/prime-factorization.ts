import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const primeFactorizationCode = [
  'function primeFactors(n) {',
  '  const factors = [];',
  '  let d = 2;',
  '  while (d * d <= n) {',
  '    while (n % d === 0) {',
  '      factors.push(d);',
  '      n = n / d;',
  '    }',
  '    d += (d === 2) ? 1 : 2; // skip even numbers after 2',
  '  }',
  '  if (n > 1) factors.push(n);',
  '  return factors;',
  '}'
];

const makeState = (remainder: number, factors: number[], highlight: { candidate?: number; matched?: boolean } = {}): ArrayElement[] => {
  const arr: ArrayElement[] = [];
  // First element: current remainder
  arr.push({ value: remainder, isComparing: false, isSwapping: false, isSorted: false });

  // Then one element per discovered factor
  for (let f of factors) {
    arr.push({ value: f, isComparing: false, isSwapping: false, isSorted: false });
  }

  // Optionally show candidate as a temporary element at index 1
  if (highlight.candidate !== undefined) {
    // insert or replace the candidate slot at index 1
    if (arr.length >= 2) {
      arr[1] = { value: highlight.candidate, isComparing: !!highlight.candidate, isSwapping: !!highlight.matched, isSorted: false };
    } else {
      arr.push({ value: highlight.candidate, isComparing: !!highlight.candidate, isSwapping: !!highlight.matched, isSorted: false });
    }
  }

  return arr;
};

const generatePrimeFactorizationSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const raw = inputArr?.[0] ?? 84;
  let n = Math.floor(raw);

  if (!isFinite(n) || n <= 0) {
    steps.push({ array: [], i: -1, j: -1, description: 'Invalid input for prime factorization', codeLineIndex: 0, comparisons: 0, swaps: 0 });
    return steps;
  }

  // Initial state
  steps.push({
    array: makeState(n, []),
    i: -1,
    j: -1,
    description: `Starting prime factorization for ${n}`,
    codeLineIndex: 0,
    comparisons: 0,
    swaps: 0
  });

  if (n === 1) {
    steps.push({ array: makeState(1, []), i: -1, j: -1, description: '1 has no prime factors', codeLineIndex: 0, comparisons: 0, swaps: 0 });
    return steps;
  }

  let comparisons = 0;
  let swaps = 0; // treat factor discoveries as "swaps" metric for visualization
  const factors: number[] = [];

  let d = 2;
  while (d * d <= n) {
    // show candidate test
    steps.push({
      array: makeState(n, factors, { candidate: d }),
      i: d,
      j: -1,
      description: `Testing divisor ${d} against ${n}`,
      codeLineIndex: 3,
      comparisons: ++comparisons,
      swaps
    });

    while (n % d === 0) {
      // matched — record factor
      factors.push(d);
      swaps++;
      steps.push({
        array: makeState(n, factors, { candidate: d, matched: true }),
        i: d,
        j: -1,
        description: `Found factor ${d}. Dividing ${n} by ${d}`,
        codeLineIndex: 5,
        comparisons,
        swaps
      });

      n = Math.floor(n / d);

      // show updated remainder after division
      steps.push({
        array: makeState(n, factors),
        i: d,
        j: -1,
        description: `Remainder is now ${n}`,
        codeLineIndex: 6,
        comparisons,
        swaps
      });
    }

    d = d === 2 ? 3 : d + 2; // increment: 2 -> 3 then skip evens
  }

  if (n > 1) {
    // n itself is prime
    factors.push(n);
    swaps++;
    steps.push({
      array: makeState(n, factors, { candidate: n, matched: true }),
      i: -1,
      j: -1,
      description: `Remaining prime factor ${n}`,
      codeLineIndex: 9,
      comparisons,
      swaps
    });
    // remainder becomes 1
    steps.push({ array: makeState(1, factors), i: -1, j: -1, description: `Remainder is now 1`, codeLineIndex: 10, comparisons, swaps });
  }

  // Final completion — mark factors as sorted/completed
  steps.push({
    array: makeState(1, factors).map(el => ({ ...el, isSorted: true, isComparing: false, isSwapping: false })),
    i: -1,
    j: -1,
    description: `Prime factorization completed: ${factors.join(' × ')}`,
    codeLineIndex: 11,
    comparisons,
    swaps,
    additionalInfo: { factors }
  });

  return steps;
};

export const primeFactorizationConfig: AlgorithmConfig = {
  id: 'prime-factorization',
  name: 'Prime Factorization',
  category: 'Math',
  description: 'Find prime factors of a positive integer',
  timeComplexity: {
    best: 'O(√n)',
    average: 'O(√n)',
    worst: 'O(√n)'
  },
  spaceComplexity: 'O(log n) (for factors)',
  code: primeFactorizationCode,
  defaultInput: '84',
  generateSteps: generatePrimeFactorizationSteps
};
