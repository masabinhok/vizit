import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const gcdCode = [
  'function gcd(a, b) {',
  '  while (b !== 0) {',
  '    const r = a % b;',
  '    a = b;',
  '    b = r;',
  '  }',
  '  return Math.abs(a);',
  '}'
];

const makeState = (a: number, b: number, opts: { comparing?: boolean; swapping?: boolean; sorted?: boolean } = {}): ArrayElement[] => {
  return [
    { value: a, isComparing: !!opts.comparing, isSwapping: !!opts.swapping, isSorted: !!opts.sorted },
    { value: b, isComparing: !!opts.comparing, isSwapping: !!opts.swapping, isSorted: !!opts.sorted }
  ];
};

const generateGcdSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];

  // Validate input length: GCD visualization expects exactly two numbers
  if (Array.isArray(inputArr) && inputArr.length > 2) {
    steps.push({
      array: [],
      i: -1,
      j: -1,
      description: `Invalid input: expected exactly two integers but received ${inputArr.length} values (${inputArr.join(', ')})`,
      codeLineIndex: 0,
      comparisons: 0,
      swaps: 0
    });
    return steps;
  }

  const aRaw = inputArr?.[0] ?? 48;
  const bRaw = inputArr?.[1] ?? 18;

  let a = Math.floor(aRaw);
  let b = Math.floor(bRaw);

  // Normalize to integers
  a = Number.isFinite(a) ? a : 48;
  b = Number.isFinite(b) ? b : 18;

  // Initial state
  steps.push({
    array: makeState(a, b),
    i: 0,
    j: 1,
    description: `Starting GCD of ${a} and ${b}`,
    codeLineIndex: 0,
    comparisons: 0,
    swaps: 0
  });

  if (a === 0 && b === 0) {
    steps.push({
      array: makeState(0, 0, { sorted: true }),
      i: -1,
      j: -1,
      description: 'GCD undefined for 0 and 0 — returning 0',
      codeLineIndex: 6,
      comparisons: 0,
      swaps: 0
    });
    return steps;
  }

  // Use absolute values for GCD
  a = Math.abs(a);
  b = Math.abs(b);

  let comparisons = 0;
  let swaps = 0;

  while (b !== 0) {
    // show comparison / modulus step
    const r = a % b;
    steps.push({
      array: makeState(a, b, { comparing: true }),
      i: a,
      j: b,
      description: `Compute r = ${a} % ${b} = ${r}`,
      codeLineIndex: 2,
      comparisons: ++comparisons,
      swaps
    });

    // show swap/assignment
    const nextA = b;
    const nextB = r;
    steps.push({
      array: makeState(nextA, nextB, { swapping: true }),
      i: nextA,
      j: nextB,
      description: `Set a = ${b}, b = ${r}`,
      codeLineIndex: 4,
      comparisons,
      swaps: ++swaps
    });

    a = nextA;
    b = nextB;
  }

  // Final state
  steps.push({
    array: makeState(a, 0, { sorted: true }),
    i: -1,
    j: -1,
    description: `GCD is ${a}`,
    codeLineIndex: 6,
    comparisons,
    swaps
  });

  return steps;
};

export const gcdConfig: AlgorithmConfig = {
  id: 'gcd',
  name: 'GCD',
  category: 'Math',
  description: 'Compute the greatest common divisor (GCD) of two integers using the Euclidean algorithm',
  timeComplexity: {
    best: 'O(log min(a, b))',
    average: 'O(log min(a, b))',
    worst: 'O(log min(a, b))'
  },
  spaceComplexity: 'O(1)',
  code: gcdCode,
  defaultInput: '48,18',
  generateSteps: generateGcdSteps
};
