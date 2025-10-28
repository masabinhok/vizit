import { AlgorithmConfig, AlgorithmStep, ArrayElement } from '../../types';

const modularCode = [
  'function mod(a, m) {',
  '  return ((a % m) + m) % m;',
  '}',
  '',
  'function modPow(base, exp, mod) {',
  '  let result = 1;',
  '  base = mod(base, mod);',
  '  while (exp > 0) {',
  '    if (exp % 2 === 1) result = (result * base) % mod;',
  '    base = (base * base) % mod;',
  '    exp = Math.floor(exp / 2);',
  '  }',
  '  return result;',
  '}'
];

const makeState = (values: number[], opts: { comparing?: boolean; swapping?: boolean; sorted?: boolean } = {}): ArrayElement[] => {
  return values.map(v => ({ value: v, isComparing: !!opts.comparing, isSwapping: !!opts.swapping, isSorted: !!opts.sorted }));
};

const generateModularSteps = (inputArr: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];

  // Validate input length: expect 2 (a, m) or 3 (a, e, m)
  if (!Array.isArray(inputArr) || inputArr.length === 0) {
    steps.push({ array: [], i: -1, j: -1, description: 'No input provided', codeLineIndex: 0, comparisons: 0, swaps: 0 });
    return steps;
  }

  if (inputArr.length > 3) {
    steps.push({ array: [], i: -1, j: -1, description: `Please enter two or three integers. Received ${inputArr.length} values (${inputArr.join(', ')})`, codeLineIndex: 0, comparisons: 0, swaps: 0 });
    return steps;
  }

  const aRaw = inputArr[0] ?? 0;
  const bRaw = inputArr[1] ?? 0; // exponent or modulus depending on length
  const cRaw = inputArr[2] ?? 1; // modulus if present

  const a = Math.floor(Number.isFinite(aRaw) ? aRaw : 0);
  const b = Math.floor(Number.isFinite(bRaw) ? bRaw : 0);
  const c = Math.floor(Number.isFinite(cRaw) ? cRaw : 1);

  // If only two numbers provided, treat as (a mod m)
  if (inputArr.length === 2) {
    const m = Math.abs(b) || 1;
    const val = ((a % m) + m) % m;

    steps.push({ array: makeState([a, m]), i: a, j: m, description: `Compute ${a} mod ${m}`, codeLineIndex: 0, comparisons: 0, swaps: 0 });
    steps.push({ array: makeState([val, m], { sorted: true }), i: -1, j: -1, description: `Result: ${val}`, codeLineIndex: 1, comparisons: 0, swaps: 0 });
    return steps;
  }

  // Three numbers: compute (a^b) mod c using binary exponentiation
  const baseInit = ((a % c) + c) % c;
  let base = baseInit;
  let exp = Math.max(0, b);
  const mod = Math.max(1, Math.abs(c));

  steps.push({ array: makeState([a, b, c]), i: a, j: b, description: `Compute (${a}^${b}) mod ${c}`, codeLineIndex: 4, comparisons: 0, swaps: 0 });
  let result = 1;
  let comparisons = 0;
  let swaps = 0;

  steps.push({ array: makeState([result, base, exp]), i: result, j: exp, description: `Initial: result=${result}, base=${base}, exp=${exp}`, codeLineIndex: 5, comparisons, swaps });

  while (exp > 0) {
    if (exp % 2 === 1) {
      const newResult = (result * base) % mod;
      steps.push({ array: makeState([result, base, exp], { comparing: true }), i: result, j: base, description: `exp is odd -> result = (result * base) % ${mod} => ${newResult}`, codeLineIndex: 6, comparisons: ++comparisons, swaps });
      result = newResult;
      steps.push({ array: makeState([result, base, exp], { swapping: true }), i: result, j: base, description: `Updated result = ${result}`, codeLineIndex: 6, comparisons, swaps: ++swaps });
    }

    // base = (base * base) % mod;
    const newBase = (base * base) % mod;
    steps.push({ array: makeState([result, base, exp], { comparing: true }), i: base, j: newBase, description: `Square base: base = (base * base) % ${mod} => ${newBase}`, codeLineIndex: 8, comparisons: ++comparisons, swaps });
    base = newBase;
    exp = Math.floor(exp / 2);
    steps.push({ array: makeState([result, base, exp], { swapping: true }), i: result, j: exp, description: `After shift: base=${base}, exp=${exp}`, codeLineIndex: 9, comparisons, swaps: ++swaps });
  }

  steps.push({ array: makeState([result, 0, 0], { sorted: true }), i: -1, j: -1, description: `Final result: ${result}`, codeLineIndex: 12, comparisons, swaps });
  return steps;
};

export const modularArithmeticConfig: AlgorithmConfig = {
  id: 'modular-arithmetic',
  name: 'Modular Arithmetic',
  category: 'Math',
  description: 'Compute modular reduction or modular exponentiation (a^b mod m) using efficient algorithms',
  timeComplexity: {
    best: 'O(log b)',
    average: 'O(log b)',
    worst: 'O(log b)'
  },
  spaceComplexity: 'O(1)',
  code: modularCode,
  defaultInput: '5,3,13',
  generateSteps: generateModularSteps
};
