import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const fibonacciCode = [
  'function fibonacci(n) {',
  '  if (n <= 0) return [];',
  '  if (n === 1) return [0];',
  '  const seq = [0, 1];',
  '  for (let i = 2; i < n; i++) {',
  '    seq[i] = seq[i - 1] + seq[i - 2];',
  '  }',
  '  return seq.slice(0, n);',
  '}'
];

const makeArrayState = (values: number[], highlight: { comparing?: number[]; newIndex?: number } = {}): ArrayElement[] => {
  const { comparing = [], newIndex = -1 } = highlight;
  return values.map((value, idx) => ({
    value,
    isComparing: comparing.includes(idx),
    isSwapping: idx === newIndex,
    isSorted: false
  }));
};

const generateFibonacciSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const raw = inputArr && inputArr.length > 0 ? inputArr[0] : 8;
  const n = Math.max(0, Math.floor(raw));

  // Initial state
  steps.push({
    array: [],
    i: -1,
    j: -1,
    description: 'Starting Fibonacci generation',
    codeLineIndex: 0,
    comparisons: 0,
    swaps: 0
  });

  if (n === 0) {
    steps.push({
      array: [],
      i: -1,
      j: -1,
      description: 'Requested 0 terms — nothing to generate',
      codeLineIndex: 1,
      comparisons: 0,
      swaps: 0
    });
    return steps;
  }

  // n >= 1
  const seq: number[] = [];

  // First term
  seq.push(0);
  steps.push({
    array: makeArrayState(seq, {}),
    i: 0,
    j: -1,
    description: 'First term: 0',
    codeLineIndex: 2,
    comparisons: 0,
    swaps: 0
  });

  if (n === 1) {
    // mark as final
    steps.push({
      array: seq.map(v => ({ value: v, isComparing: false, isSwapping: false, isSorted: true })),
      i: -1,
      j: -1,
      description: 'Fibonacci generation completed',
      codeLineIndex: 2,
      comparisons: 0,
      swaps: 0
    });
    return steps;
  }

  // Second term
  seq.push(1);
  steps.push({
    array: makeArrayState(seq, { comparing: [0], newIndex: 1 }),
    i: 1,
    j: 0,
    description: 'Second term: 1',
    codeLineIndex: 3,
    comparisons: 0,
    swaps: 0
  });

  // Generate remaining terms
  for (let i = 2; i < n; i++) {
    // show comparison of last two
    steps.push({
      array: makeArrayState(seq, { comparing: [i - 2, i - 1] }),
      i: i - 2,
      j: i - 1,
      description: `Computing term ${i}: adding ${seq[i - 2]} + ${seq[i - 1]}`,
      codeLineIndex: 5,
      comparisons: 0,
      swaps: 0
    });

    const next = seq[i - 1] + seq[i - 2];
    seq.push(next);

    // push state showing new element
    steps.push({
      array: makeArrayState(seq, { newIndex: i }),
      i,
      j: i - 1,
      description: `Appended ${next} as term ${i}`,
      codeLineIndex: 6,
      comparisons: 0,
      swaps: 0
    });
  }

  // Final completion — mark all as sorted/complete
  steps.push({
    array: seq.map(v => ({ value: v, isComparing: false, isSwapping: false, isSorted: true })),
    i: -1,
    j: -1,
    description: 'Fibonacci generation completed',
    codeLineIndex: 7,
    comparisons: 0,
    swaps: 0
  });

  return steps;
};

export const fibonacciConfig: AlgorithmConfig = {
  id: 'fibonacci',
  name: 'Fibonacci',
  category: 'Math',
  description: 'Generate the Fibonacci sequence up to n terms',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)'
  },
  spaceComplexity: 'O(n)',
  code: fibonacciCode,
  defaultInput: '8',
  generateSteps: generateFibonacciSteps
};
